import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, unauthorized, success, badRequest } from '@/lib/api-utils';
import { verifyTOTP } from '@/lib/auth';
import { encryptTotpSecret } from '@/lib/totp-encryption';
import { logger } from '@/lib/logger';

const verifySchema = z.object({
    secret: z.string().min(1, 'TOTP secret is required'),
    token: z.string().length(6, 'TOTP token must be 6 digits'),
});

/**
 * POST /api/v1/auth/2fa/verify
 * Verifies a TOTP token against the temporary secret and, if valid,
 * persists the secret and enables 2FA on the user's account.
 */
export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const { secret, token } = verifySchema.parse(body);

        // Verify the provided token against the secret
        const isValid = await verifyTOTP(token, secret);
        if (!isValid) {
            return badRequest('Invalid TOTP code. Please try again.');
        }

        // Encrypt the secret before persisting to DB
        const encryptedSecret = encryptTotpSecret(secret);

        // Persist the encrypted secret and enable 2FA
        await prisma.user.update({
            where: { id: payload.userId },
            data: {
                totpSecret: encryptedSecret,
                totpEnabled: true,
            },
        });

        return success({
            message: 'Two-factor authentication has been enabled successfully.',
            totpEnabled: true,
        });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return badRequest(err.errors.map(e => e.message).join('; '));
        }
        logger.error('2FA verify error:', '2fa-verify', err instanceof Error ? err : undefined);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}