import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { verifyToken, verifyTOTP, createToken, getTokenVersion } from '@/lib/auth';
import { validateBody, success, badRequest, unauthorized } from '@/lib/api-utils';
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';
import { decryptTotpSecret } from '@/lib/totp-encryption';
import { logger } from '@/lib/logger';
import { auditLogin } from '@/lib/audit';

const verify2FASchema = z.object({
    intermediateToken: z.string().min(1, 'Intermediate token is required'),
    totpCode: z.string().length(6, 'TOTP code must be 6 digits'),
});

/**
 * POST /api/v1/auth/login/verify-2fa
 * Second step of the login flow when 2FA is enabled.
 * Verifies the intermediate token (from step 1) and the TOTP code,
 * then returns the full JWT.
 */
export async function POST(req: NextRequest) {
    try {
        // Rate limiting: 5 attempts per minute per IP
        const ip = getClientIP(req);
        const rl = rateLimit(ip, RATE_LIMITS.VERIFY_2FA);
        if (!rl.allowed) {
            return NextResponse.json(
                { error: rl.message },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
                        'X-RateLimit-Remaining': '0',
                    },
                }
            );
        }

        const body = await req.json();
        const { data, error } = validateBody(verify2FASchema, body);
        if (error) return badRequest(error);

        // Verify the intermediate token (5-min expiry)
        const payload = await verifyToken(data!.intermediateToken);
        if (!payload) {
            return unauthorized();
        }

        // Fetch user's TOTP secret
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                totpSecret: true,
                totpEnabled: true,
                isActive: true,
                userRoles: { include: { role: true } },
            },
        });

        if (!user || !user.isActive || !user.totpEnabled || !user.totpSecret) {
            return unauthorized();
        }

        // Decrypt the stored TOTP secret and verify the code
        const decryptedSecret = decryptTotpSecret(user.totpSecret);
        if (!decryptedSecret) {
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
        const totpValid = await verifyTOTP(data!.totpCode, decryptedSecret);
        if (!totpValid) {
            return badRequest('Invalid TOTP code. Please try again.');
        }

        // Issue full JWT with current tokenVersion
        const roles = user.userRoles.map(ur => ur.role.roleName);
        const tokenVersion = await getTokenVersion(user.id);
        const token = await createToken({
            userId: user.id,
            email: user.email,
            roles,
            tokenVersion,
        });

        // Record login for streak tracking (fire and forget)
        try {
            const today = new Date();
            const todayDate = today.toISOString().split('T')[0];

            await prisma.user.update({
                where: { id: user.id },
                data: { lastLoginAt: today },
            });

            await prisma.userLoginHistory.upsert({
                where: {
                    userId_loginDate: {
                        userId: user.id,
                        loginDate: new Date(todayDate),
                    },
                },
                update: {
                    loginAt: today,
                },
                create: {
                    userId: user.id,
                    loginDate: new Date(todayDate),
                    loginAt: today,
                },
            });
        } catch (err) {
            logger.error('Failed to record login for streak:', 'verify-2fa', err instanceof Error ? err : undefined);
        }

        // Fire-and-forget audit log
        auditLogin(user.id, '2fa');

        return success({
            token,
            user: {
                id: user.id,
                email: user.email,
                roles,
            },
        });
    } catch (err) {
        logger.error('2FA login verify error:', 'verify-2fa', err instanceof Error ? err : undefined);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}