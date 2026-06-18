import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, unauthorized, success, badRequest } from '@/lib/api-utils';
import { verifyPassword, verifyTOTP } from '@/lib/auth';
import { decryptTotpSecret } from '@/lib/totp-encryption';
import { logger } from '@/lib/logger';

const disableSchema = z.object({
    password: z.string().min(1, 'Current password is required'),
    token: z.string().length(6, 'TOTP token must be 6 digits').optional(),
});

/**
 * POST /api/v1/auth/2fa/disable
 * Disables TOTP 2FA on the authenticated user's account.
 * Requires the user's current password for security.
 * If a TOTP token is provided, it's verified against the stored secret as an additional check.
 */
export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const { password, token } = disableSchema.parse(body);

        // Fetch user with password hash and TOTP data
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                passwordHash: true,
                totpSecret: true,
                totpEnabled: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!user.totpEnabled) {
            return badRequest('Two-factor authentication is not currently enabled.');
        }

        // Verify password
        const passwordValid = await verifyPassword(password, user.passwordHash);
        if (!passwordValid) {
            return unauthorized();
        }

        // If a TOTP token is provided, decrypt the stored secret and verify it
        if (token && user.totpSecret) {
            const decryptedSecret = decryptTotpSecret(user.totpSecret);
            if (!decryptedSecret) {
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
            }
            const totpValid = await verifyTOTP(token, decryptedSecret);
            if (!totpValid) {
                return badRequest('Invalid TOTP code.');
            }
        }

        // Disable 2FA and clear the secret
        await prisma.user.update({
            where: { id: payload.userId },
            data: {
                totpSecret: null,
                totpEnabled: false,
            },
        });

        return success({
            message: 'Two-factor authentication has been disabled.',
            totpEnabled: false,
        });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return badRequest(err.errors.map(e => e.message).join('; '));
        }
        logger.error('2FA disable error:', '2fa-disable', err instanceof Error ? err : undefined);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}