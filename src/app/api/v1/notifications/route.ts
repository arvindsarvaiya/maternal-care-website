import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

// ─── GET: List notifications for the authenticated user ───
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const url = new URL(req.url);
        const status = url.searchParams.get('status'); // e.g., 'unread', 'read', 'sent'
        const type = url.searchParams.get('type'); // e.g., 'appointment_reminder', 'task_assigned'
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '30');

        const where: any = { userId: payload.userId };
        if (status === 'unread') {
            where.readAt = null;
        } else if (status) {
            where.status = { statusName: status };
        }
        if (type) {
            where.notificationType = { typeName: type };
        }

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                include: {
                    notificationType: { select: { typeName: true } },
                    status: { select: { statusName: true } },
                    channel: { select: { channelName: true } },
                },
                orderBy: { scheduledFor: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.notification.count({ where }),
        ]);

        return success({
            notifications: notifications.map(n => ({
                id: n.id,
                type: n.notificationType.typeName,
                status: n.status.statusName,
                channel: n.channel.channelName,
                scheduledFor: n.scheduledFor,
                sentAt: n.sentAt,
                readAt: n.readAt,
                payload: n.payloadJson,
                createdAt: n.createdAt,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        logger.error('Get notifications error', 'notifications', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch notifications');
    }
}

// ─── PATCH: Mark notification(s) as read ───
const markReadSchema = z.object({
    ids: z.array(z.string()).optional(), // specific IDs to mark read; if empty, mark all
});

export async function PATCH(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json().catch(() => ({}));
        const parsed = markReadSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        const now = new Date();

        if (parsed.data.ids && parsed.data.ids.length > 0) {
            // Mark specific notifications as read
            await prisma.notification.updateMany({
                where: {
                    id: { in: parsed.data.ids },
                    userId: payload.userId,
                    readAt: null,
                },
                data: { readAt: now },
            });
        } else {
            // Mark all unread notifications as read
            await prisma.notification.updateMany({
                where: {
                    userId: payload.userId,
                    readAt: null,
                },
                data: { readAt: now },
            });
        }

        return success({ marked: true });
    } catch (err) {
        logger.error('Mark notifications read error', 'notifications', err instanceof Error ? err : undefined);
        return badRequest('Failed to mark notifications as read');
    }
}