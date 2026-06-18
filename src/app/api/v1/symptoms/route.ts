import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, created, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

// ─── GET: List symptom logs for current user ───
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const url = new URL(req.url);
        const symptomType = url.searchParams.get('symptomType');
        const severity = url.searchParams.get('severity');
        const fromDate = url.searchParams.get('from');
        const toDate = url.searchParams.get('to');
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '30');

        const where: any = { userId: payload.userId };
        if (symptomType) {
            where.symptomType = { symptomName: symptomType };
        }
        if (severity) {
            where.severity = { severityName: severity };
        }
        if (fromDate || toDate) {
            where.loggedAt = {};
            if (fromDate) where.loggedAt.gte = new Date(fromDate);
            if (toDate) where.loggedAt.lte = new Date(toDate);
        }

        const [logs, total] = await Promise.all([
            prisma.symptomLog.findMany({
                where,
                include: {
                    symptomType: { select: { symptomName: true } },
                    severity: { select: { severityName: true, severityRank: true } },
                },
                orderBy: { loggedAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.symptomLog.count({ where }),
        ]);

        return success({
            logs: logs.map(l => ({
                id: l.id,
                symptomType: l.symptomType.symptomName,
                severity: l.severity.severityName,
                severityRank: l.severity.severityRank,
                loggedAt: l.loggedAt.toISOString(),
                notes: l.notes,
                createdAt: l.createdAt,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        logger.error('Get symptom logs error', 'symptoms', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch symptom logs');
    }
}

// ─── POST: Create symptom log ───
const createSymptomSchema = z.object({
    symptomType: z.string().min(1),
    severity: z.string().min(1),
    loggedAt: z.string().optional(),
    notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = createSymptomSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        // Find or create symptom type
        let symptomType = await prisma.symptomType.findUnique({
            where: { symptomName: parsed.data.symptomType },
        });
        if (!symptomType) {
            symptomType = await prisma.symptomType.create({
                data: { symptomName: parsed.data.symptomType },
            });
        }

        // Find or create severity level
        let severity = await prisma.symptomSeverityLevel.findUnique({
            where: { severityName: parsed.data.severity },
        });
        if (!severity) {
            const rankMap: Record<string, number> = { Mild: 1, Moderate: 2, Severe: 3 };
            severity = await prisma.symptomSeverityLevel.create({
                data: {
                    severityName: parsed.data.severity,
                    severityRank: rankMap[parsed.data.severity] || 2,
                },
            });
        }

        const log = await prisma.symptomLog.create({
            data: {
                userId: payload.userId,
                symptomTypeId: symptomType.id,
                severityId: severity.id,
                loggedAt: parsed.data.loggedAt ? new Date(parsed.data.loggedAt) : new Date(),
                notes: parsed.data.notes ? stripHtml(parsed.data.notes) : null,
            },
            include: {
                symptomType: { select: { symptomName: true } },
                severity: { select: { severityName: true, severityRank: true } },
            },
        });

        // ─── Auto-notify partner if mother logs a symptom ───
        try {
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                include: { userRoles: { include: { role: true } } },
            });

            if (user && user.userRoles.some(ur => ur.role.roleName === 'mother')) {
                const family = await prisma.family.findFirst({
                    where: { motherUserId: payload.userId },
                    include: {
                        members: {
                            where: { memberRole: 'partner', inviteStatus: 'accepted' },
                            include: { user: { select: { id: true, firstName: true } } },
                        },
                    },
                });

                const partner = family?.members[0];
                if (partner) {
                    const symptomName = parsed.data.symptomType;
                    const severityName = parsed.data.severity;

                    const suggestions: string[] = [];
                    if (symptomName.toLowerCase().includes('nausea') || symptomName.toLowerCase().includes('morning sickness')) {
                        suggestions.push('🤢 Keep crackers or dry toast by the bedside, and encourage small frequent meals.');
                        suggestions.push('🍋 Ginger tea or lemon water can help soothe nausea.');
                    }
                    if (symptomName.toLowerCase().includes('back') || symptomName.toLowerCase().includes('backache')) {
                        suggestions.push('💆 Offer gentle back rubs and ensure she has comfortable pillows for support.');
                        suggestions.push('🛁 A warm (not hot) bath with Epsom salts can help relieve back discomfort.');
                    }
                    if (symptomName.toLowerCase().includes('fatigue') || symptomName.toLowerCase().includes('tired')) {
                        suggestions.push('😴 Take over some household chores so she can rest more.');
                        suggestions.push('☕ Encourage short naps during the day and ensure she stays hydrated.');
                    }
                    if (symptomName.toLowerCase().includes('headache')) {
                        suggestions.push('💧 Ensure she\'s drinking enough water. Dehydration can cause headaches.');
                        suggestions.push('🌑 Dim the lights and reduce screen time. A cool compress on the forehead can help.');
                    }
                    if (severityName === 'Severe') {
                        suggestions.push('⚠️ This symptom is marked as severe. Please check in with her and consider contacting your healthcare provider.');
                    }

                    if (suggestions.length === 0) {
                        suggestions.push('💕 Be there for her — sometimes just listening and being present makes all the difference.');
                        suggestions.push('🩺 If symptoms persist or worsen, encourage her to speak with her healthcare provider.');
                    }

                    const notificationType = await prisma.notificationType.upsert({
                        where: { typeName: 'partner_symptom_update' },
                        update: {},
                        create: { typeName: 'partner_symptom_update' },
                    });

                    const statusPending = await prisma.notificationStatus.upsert({
                        where: { statusName: 'pending' },
                        update: {},
                        create: { statusName: 'pending' },
                    });

                    const channelApp = await prisma.reminderChannel.upsert({
                        where: { channelName: 'app' },
                        update: {},
                        create: { channelName: 'app' },
                    });

                    await prisma.notification.create({
                        data: {
                            userId: partner.user.id,
                            notificationTypeId: notificationType.id,
                            statusId: statusPending.id,
                            channelId: channelApp.id,
                            scheduledFor: new Date(),
                            payloadJson: {
                                title: `${user.firstName} reported: ${symptomName} (${severityName})`,
                                message: `Your partner is experiencing ${symptomName.toLowerCase()} (${severityName.toLowerCase()} severity). ${suggestions[0] || ''}`,
                                symptomName,
                                severityName,
                                suggestions,
                                notes: parsed.data.notes || null,
                                motherName: `${user.firstName} ${user.lastName}`,
                                date: parsed.data.loggedAt || new Date().toISOString(),
                            },
                        },
                    });
                }
            }
        } catch (notifyErr) {
            logger.error('Failed to create partner symptom notification', 'symptoms', notifyErr instanceof Error ? notifyErr : undefined);
        }

        return created({
            id: log.id,
            symptomType: log.symptomType.symptomName,
            severity: log.severity.severityName,
            severityRank: log.severity.severityRank,
            loggedAt: log.loggedAt.toISOString(),
            notes: log.notes,
            createdAt: log.createdAt,
        });
    } catch (err) {
        logger.error('Create symptom log error', 'symptoms', err instanceof Error ? err : undefined);
        return badRequest('Failed to create symptom log');
    }
}