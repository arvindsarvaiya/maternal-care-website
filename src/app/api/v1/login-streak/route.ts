import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

// ─── POST: Record login and return streak ───
export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const today = new Date();
        const todayDate = today.toISOString().split('T')[0];

        // Update user's last login time
        await prisma.user.update({
            where: { id: payload.userId },
            data: { lastLoginAt: today },
        });

        // Record login history (upsert to ensure one entry per day)
        await prisma.userLoginHistory.upsert({
            where: {
                userId_loginDate: {
                    userId: payload.userId,
                    loginDate: new Date(todayDate),
                },
            },
            update: {
                loginAt: today,
            },
            create: {
                userId: payload.userId,
                loginDate: new Date(todayDate),
                loginAt: today,
            },
        });

        // Calculate streak: consecutive days from today backwards
        const loginHistory = await prisma.userLoginHistory.findMany({
            where: { userId: payload.userId },
            orderBy: { loginDate: 'desc' },
            take: 365,
        });

        const loginDates = new Set(
            loginHistory.map(h => h.loginDate.toISOString().split('T')[0])
        );

        let streak = 0;
        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            if (loginDates.has(key)) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }

        return success({ streak });
    } catch (err) {
        logger.error('Record login error', 'login-streak', err instanceof Error ? err : undefined);
        return badRequest('Failed to record login');
    }
}

// ─── GET: Get current streak without recording login ───
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const today = new Date();

        // Get login history
        const loginHistory = await prisma.userLoginHistory.findMany({
            where: { userId: payload.userId },
            orderBy: { loginDate: 'desc' },
            take: 365,
        });

        const loginDates = new Set(
            loginHistory.map(h => h.loginDate.toISOString().split('T')[0])
        );

        let streak = 0;
        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            if (loginDates.has(key)) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }

        return success({ streak });
    } catch (err) {
        logger.error('Get login streak error', 'login-streak', err instanceof Error ? err : undefined);
        return badRequest('Failed to get login streak');
    }
}
