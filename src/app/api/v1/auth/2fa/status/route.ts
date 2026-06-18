import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPayload, unauthorized, success } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

/**
 * GET /api/v1/auth/2fa/status
 * Returns the current 2FA status for the authenticated user.
 */
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { totpEnabled: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return success({
            totpEnabled: user.totpEnabled,
        });
    } catch (err) {
        logger.error('2FA status error:', '2fa-status', err instanceof Error ? err : undefined);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}