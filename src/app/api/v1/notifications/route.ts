import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import { getDailyNotificationTemplates, getScheduledTime, getTodayBatchKey } from '@/lib/notification-scheduler';
import type { MedicalConditionTag } from '@/lib/notification-content';

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

        // ── Fetch user profile data for personalized notification generation ──
        const [pregnancyProfile, motherHealth] = await Promise.all([
            prisma.pregnancyProfile.findUnique({
                where: { userId: payload.userId },
                select: {
                    phase: true,
                    currentPregnancyWeek: true,
                    postpartumWeek: true,
                },
            }).catch(() => null),
            prisma.motherHealthProfile.findUnique({
                where: { userId: payload.userId },
                select: {
                    anemia: true,
                    diabetes: true,
                    highBP: true,
                    lowBP: true,
                    thyroidDisorder: true,
                    pcos: true,
                    asthma: true,
                    heartDisease: true,
                    kidneyIssues: true,
                    epilepsy: true,
                    depressionAnxiety: true,
                },
            }).catch(() => null),
        ]);

        // ── Ensure today's personalized notifications exist in DB ──
        const today = new Date();
        const todayBatchKey = getTodayBatchKey(today);
        const todayStart = new Date(today);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);

        // Check if today's personalized tips already exist
        const existingTodayCount = await prisma.notification.count({
            where: {
                userId: payload.userId,
                scheduledFor: { gte: todayStart, lte: todayEnd },
                notificationType: { typeName: 'personalized_tip' },
            },
        });

        // If none exist and user has a pregnancy profile, generate today's batch
        // (motherHealth may be null for postpartum users)
        if (existingTodayCount === 0 && pregnancyProfile) {
            try {
                await generateAndPersistTodayNotifications(
                    payload.userId,
                    pregnancyProfile,
                    motherHealth,
                    today,
                );
            } catch (err) {
                // Non-fatal: if generation fails, just serve existing DB notifications
                logger.error('Failed to generate daily notifications', 'notifications', err instanceof Error ? err : undefined);
            }
        }

        // ── Fetch notifications from DB ──
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

        // Map DB notifications
        const mappedNotifications = notifications.map(n => ({
            id: n.id,
            type: n.notificationType.typeName,
            status: n.status.statusName,
            channel: n.channel.channelName,
            scheduledFor: n.scheduledFor,
            sentAt: n.sentAt,
            readAt: n.readAt,
            payload: n.payloadJson,
            createdAt: n.createdAt,
        }));

        return success({
            notifications: mappedNotifications,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        logger.error('Get notifications error', 'notifications', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch notifications');
    }
}

// ─── Helper: Generate and persist today's personalized notifications ───

async function generateAndPersistTodayNotifications(
    userId: string,
    pregnancyProfile: { phase: string; currentPregnancyWeek: number | null; postpartumWeek: number | null } | null,
    motherHealth: {
        anemia: boolean;
        diabetes: boolean;
        highBP: boolean;
        lowBP: boolean;
        thyroidDisorder: boolean;
        pcos: boolean;
        asthma: boolean;
        heartDisease: boolean;
        kidneyIssues: boolean;
        epilepsy: boolean;
        depressionAnxiety: boolean;
    } | null,
    date: Date,
) {
    // Determine pregnancy/postpartum week
    const isPregnancy = pregnancyProfile?.phase === 'pregnancy' || !pregnancyProfile?.phase;
    const pregnancyWeek = isPregnancy ? (pregnancyProfile?.currentPregnancyWeek ?? null) : null;
    const postpartumWeek = !isPregnancy ? (pregnancyProfile?.postpartumWeek ?? null) : null;

    // Build medical conditions array (safely handle null motherHealth)
    const medicalConditions: MedicalConditionTag[] = [];
    if (motherHealth) {
        if (motherHealth.anemia) medicalConditions.push('anemia');
        if (motherHealth.diabetes) medicalConditions.push('diabetes');
        if (motherHealth.highBP) medicalConditions.push('highBP');
        if (motherHealth.lowBP) medicalConditions.push('lowBP');
        if (motherHealth.thyroidDisorder) medicalConditions.push('thyroid');
        if (motherHealth.pcos) medicalConditions.push('pcos');
        if (motherHealth.asthma) medicalConditions.push('asthma');
        if (motherHealth.heartDisease) medicalConditions.push('heartDisease');
        if (motherHealth.kidneyIssues) medicalConditions.push('kidneyIssues');
        if (motherHealth.epilepsy) medicalConditions.push('epilepsy');
        if (motherHealth.depressionAnxiety) medicalConditions.push('depressionAnxiety');
    }

    // Get today's templates
    const templates = getDailyNotificationTemplates(
        userId,
        pregnancyWeek,
        postpartumWeek,
        medicalConditions,
        date,
        3, // 3 notifications per day
    );

    if (templates.length === 0) return;

    // Resolve reference IDs (or create if needed)
    const [notificationType, pendingStatus, inAppChannel] = await Promise.all([
        prisma.notificationType.upsert({
            where: { typeName: 'personalized_tip' },
            update: {},
            create: { typeName: 'personalized_tip' },
        }),
        prisma.notificationStatus.upsert({
            where: { statusName: 'pending' },
            update: {},
            create: { statusName: 'pending' },
        }),
        prisma.reminderChannel.upsert({
            where: { channelName: 'in_app' },
            update: {},
            create: { channelName: 'in_app' },
        }),
    ]);

    // Create notification records in a transaction
    const notifPromises = templates.map((template, index) => {
        const scheduledFor = getScheduledTime(date, index);

        return prisma.notification.create({
            data: {
                userId,
                notificationTypeId: notificationType.id,
                statusId: pendingStatus.id,
                channelId: inAppChannel.id,
                scheduledFor,
                payloadJson: {
                    title: `${template.emoji} ${template.title}`,
                    body: template.body,
                    message: template.body,
                    source: template.source,
                    actionUrl: template.actionUrl || null,
                    actionLabel: template.actionLabel || null,
                    category: template.category,
                    templateId: template.id,
                    batchDate: getTodayBatchKey(date),
                    personalized: true,
                },
            },
        });
    });

    await Promise.all(notifPromises);
    logger.info(`Generated ${templates.length} daily notifications for user ${userId}`, 'notifications');
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

// ─── DELETE: Remove today's personalized tips (for testing reset) ───
export async function DELETE(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const today = new Date();
        const todayStart = new Date(today);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);

        const deleted = await prisma.notification.deleteMany({
            where: {
                userId: payload.userId,
                scheduledFor: { gte: todayStart, lte: todayEnd },
                notificationType: { typeName: 'personalized_tip' },
            },
        });

        logger.info(`Reset ${deleted.count} today's tips for user ${payload.userId}`, 'notifications');
        return success({ deleted: deleted.count });
    } catch (err) {
        logger.error('Reset today tips error', 'notifications', err instanceof Error ? err : undefined);
        return badRequest('Failed to reset today\'s tips');
    }
}