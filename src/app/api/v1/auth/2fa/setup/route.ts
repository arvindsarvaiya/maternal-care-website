import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPayload, unauthorized, success, badRequest } from '@/lib/api-utils';
import { generateTOTPSecret, generateTOTPUri, generateTOTPQRDataURL } from '@/lib/auth';
import { logger } from '@/lib/logger';

/**
 * GET /api/v1/auth/2fa/setup
 * Generates a new TOTP secret and QR code for the authenticated user.
 * Returns the secret (to store after verification) and a QR data URL.
 */
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        // Check if user already has 2FA enabled
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { totpEnabled: true, email: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.totpEnabled) {
            return badRequest('Two-factor authentication is already enabled. Disable it first to set up a new one.');
        }

        // Generate a fresh TOTP secret
        const secret = generateTOTPSecret();
        const email = user.email || payload.email || 'user@maternalcare.in';
        const uri = generateTOTPUri(email, secret);
        const qrDataUrl = await generateTOTPQRDataURL(uri);

        return success({
            secret, // Store this temporarily; only save to DB after verification
            uri,
            qrDataUrl,
        });
    } catch (err) {
        logger.error('2FA setup error:', '2fa-setup', err instanceof Error ? err : undefined);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}