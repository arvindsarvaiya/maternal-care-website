import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { verifyPassword, createToken, createIntermediateToken, getTokenVersion } from '@/lib/auth';
import { validateBody, success, badRequest, unauthorized } from '@/lib/api-utils';
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { auditLogin, auditAccountLockout } from '@/lib/audit';

const loginSchema = z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    password: z.string().min(1),
});

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
    try {
        // ── Rate Limiting ──
        const ip = getClientIP(req);
        const rateLimitResult = rateLimit(ip, RATE_LIMITS.LOGIN);
        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { error: rateLimitResult.message },
                { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)) } }
            );
        }

        const body = await req.json();
        const { data, error } = validateBody(loginSchema, body);
        if (error) return badRequest(error);

        if (!data!.email && !data!.phone) {
            return badRequest('Either email or phone is required');
        }

        // Find user with TOTP fields, roles, and lockout info
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    ...(data!.email ? [{ email: data!.email }] : []),
                    ...(data!.phone ? [{ phone: data!.phone }] : []),
                ],
            },
            include: {
                userRoles: { include: { role: true } },
            },
        });

        if (!user || !user.isActive) {
            return unauthorized();
        }

        // ── Account Lockout Check ──
        if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
            const remainingMs = new Date(user.lockoutUntil).getTime() - Date.now();
            const remainingMin = Math.ceil(remainingMs / 60000);
            return NextResponse.json(
                { error: `Account locked due to too many failed attempts. Try again in ${remainingMin} minute${remainingMin > 1 ? 's' : ''}.` },
                { status: 429 }
            );
        }

        // Verify password
        const valid = await verifyPassword(data!.password, user.passwordHash);
        if (!valid) {
            // Increment failed attempts
            const newFailedAttempts = user.failedLoginAttempts + 1;
            const updateData: { failedLoginAttempts: number; lockoutUntil?: Date } = {
                failedLoginAttempts: newFailedAttempts,
            };

            if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
                updateData.lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
                auditAccountLockout(user.id);
            }

            await prisma.user.update({
                where: { id: user.id },
                data: updateData,
            });

            return unauthorized();
        }

        // ── Reset failed attempts on successful login ──
        await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: 0, lockoutUntil: null },
        });

        const roles = user.userRoles.map(ur => ur.role.roleName);
        const tokenVersion = await getTokenVersion(user.id);

        // If 2FA is enabled, return an intermediate token instead of the full JWT
        if (user.totpEnabled) {
            const intermediateToken = await createIntermediateToken({
                userId: user.id,
                email: user.email,
                roles,
                tokenVersion,
            });

            return success({
                requires2FA: true,
                intermediateToken,
                message: '2FA is enabled. Please provide your TOTP code.',
            });
        }

        // No 2FA — issue full JWT directly
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

            // Update user's last login time
            await prisma.user.update({
                where: { id: user.id },
                data: { lastLoginAt: today },
            });

            // Record login history (upsert to ensure one entry per day)
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
            // Don't fail login if streak tracking fails
            logger.error('Failed to record login for streak:', 'login', err instanceof Error ? err : undefined);
        }

        // Fire-and-forget audit log
        auditLogin(user.id, 'password');

        return success({
            token,
            requires2FA: false,
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                firstName: user.firstName,
                lastName: user.lastName,
                roles,
            },
        });
    } catch (err) {
        logger.error('Login error:', 'login', err instanceof Error ? err : undefined);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const config = { api: { bodyParser: { sizeLimit: '16kb' } } };