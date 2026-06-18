import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, created, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

// ─── GET: List wellness logs for current user ───
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const url = new URL(req.url);
        const metricType = url.searchParams.get('metricType');
        const fromDate = url.searchParams.get('from');
        const toDate = url.searchParams.get('to');
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '30');

        const where: any = { userId: payload.userId };
        if (metricType) {
            where.metricType = { metricName: metricType };
        }
        if (fromDate || toDate) {
            where.logDate = {};
            if (fromDate) where.logDate.gte = new Date(fromDate);
            if (toDate) where.logDate.lte = new Date(toDate);
        }

        const [logs, total] = await Promise.all([
            prisma.wellnessLog.findMany({
                where,
                include: {
                    metricType: { select: { metricName: true, unitLabel: true, valueType: true } },
                },
                orderBy: { logDate: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.wellnessLog.count({ where }),
        ]);

        return success({
            logs: logs.map(l => ({
                id: l.id,
                metricType: l.metricType.metricName,
                unitLabel: l.metricType.unitLabel,
                valueType: l.metricType.valueType,
                logDate: l.logDate.toISOString().split('T')[0],
                numericValue: l.numericValue,
                booleanValue: l.booleanValue,
                textValue: l.textValue,
                createdAt: l.createdAt,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        logger.error('Get wellness logs error', 'wellness', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch wellness logs');
    }
}

// ─── POST: Create wellness log ───
const createWellnessSchema = z.object({
    metricType: z.string().min(1),
    logDate: z.string().min(1),
    numericValue: z.number().optional(),
    booleanValue: z.boolean().optional(),
    textValue: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = createWellnessSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        // Find or create metric type
        let metricType = await prisma.wellnessMetricType.findUnique({
            where: { metricName: parsed.data.metricType },
        });
        if (!metricType) {
            metricType = await prisma.wellnessMetricType.create({
                data: {
                    metricName: parsed.data.metricType,
                    unitLabel: parsed.data.metricType === 'sleep' ? 'hours' :
                        parsed.data.metricType === 'water' ? 'glasses' :
                            parsed.data.metricType === 'steps' ? 'steps' :
                                parsed.data.metricType === 'mood' ? 'scale 1-5' : null,
                    valueType: parsed.data.numericValue !== undefined ? 'numeric' :
                        parsed.data.booleanValue !== undefined ? 'boolean' : 'text',
                },
            });
        }

        // Check if a mood log already exists for this user on this date
        const existingLog = await prisma.wellnessLog.findFirst({
            where: {
                userId: payload.userId,
                metricTypeId: metricType.id,
                logDate: new Date(parsed.data.logDate),
            },
        });

        let log;
        let moodChanged = false;

        if (existingLog) {
            // Update existing log if value is different
            if (parsed.data.metricType === 'mood' && parsed.data.numericValue !== undefined) {
                moodChanged = existingLog.numericValue !== parsed.data.numericValue;
            }
            log = await prisma.wellnessLog.update({
                where: { id: existingLog.id },
                data: {
                    numericValue: parsed.data.numericValue,
                    booleanValue: parsed.data.booleanValue,
                    textValue: parsed.data.textValue ? stripHtml(parsed.data.textValue) : null,
                },
                include: {
                    metricType: { select: { metricName: true, unitLabel: true, valueType: true } },
                },
            });
        } else {
            // Create new log
            log = await prisma.wellnessLog.create({
                data: {
                    userId: payload.userId,
                    metricTypeId: metricType.id,
                    logDate: new Date(parsed.data.logDate),
                    numericValue: parsed.data.numericValue,
                    booleanValue: parsed.data.booleanValue,
                    textValue: parsed.data.textValue ? stripHtml(parsed.data.textValue) : null,
                },
                include: {
                    metricType: { select: { metricName: true, unitLabel: true, valueType: true } },
                },
            });
            moodChanged = true; // New log means mood is being logged for the first time today
        }

        // ─── Auto-notify partner if mother logs mood AND mood changed ───
        if (parsed.data.metricType === 'mood' && parsed.data.numericValue !== undefined && moodChanged) {
            try {
                // Check if user is a mother
                const user = await prisma.user.findUnique({
                    where: { id: payload.userId },
                    include: { userRoles: { include: { role: true } } },
                });

                if (user && user.userRoles.some(ur => ur.role.roleName === 'mother')) {
                    // Find linked partner via Family
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
                        const moodValue = parsed.data.numericValue!;
                        const moodLabel = moodValue === 1 ? 'Very Sad 😢' :
                            moodValue === 2 ? 'Sad 😟' :
                                moodValue === 3 ? 'Neutral 😐' :
                                    moodValue === 4 ? 'Happy 😊' : 'Very Happy 🤩';

                        // ─── Dynamic partner-focused messages ───
                        const wifeName = user.firstName || 'Your wife';

                        const sadMessages = [
                            `Your wife ${wifeName} is feeling very sad today 😢. She needs your extra love and support right now — a warm hug and your presence can make all the difference.`,
                            `${wifeName} is having a really tough day. You are her safe place — hold her close and remind her she's never alone.`,
                            `Your partner is feeling very low today 💔. Take some time off, be with her, and show her how much you care.`,
                            `${wifeName} is struggling today. You are her rock — a loving word from you could mean the world right now.`,
                        ];
                        const sadSuggestions: string[] = [
                            '💛 Plan a relaxing evening — watch her favorite movie or cook her a special meal.',
                            '🌿 Remind her she\'s doing an amazing job growing your baby.',
                            '🎵 Create a calming playlist — soothing music can help lift her spirits.',
                            '☕ Bring her a warm cup of tea and just sit with her in silence.',
                        ];

                        const mildlySadMessages = [
                            `Your wife ${wifeName} is feeling a bit down today 😟. A small gesture of love could brighten her whole day.`,
                            `${wifeName} seems a little sad today. Maybe cook her favorite meal or plan a cozy movie night together.`,
                            `Your partner is feeling low. Sometimes all she needs is for you to listen — your attention is the best gift.`,
                            `${wifeName} could use some cheering up. You know her best — do that one thing that always makes her smile!`,
                        ];
                        const mildlySadSuggestions: string[] = [
                            '🌷 Surprise her with flowers or her favorite snack.',
                            '👂 Give her your full attention — listen without trying to fix anything.',
                            '🛀 Run a warm bath for her — a little pampering goes a long way.',
                        ];

                        const neutralMessages = [
                            `Your wife ${wifeName} is feeling okay today 😐. A little surprise might turn an ordinary day into a special one!`,
                            `${wifeName} is in a neutral mood. Why not do something unexpected to make her smile? You're a great husband!`,
                            `Your partner is doing alright. Keep being present and supportive — your consistency means everything to her.`,
                            `${wifeName} is coasting along today. A heartfelt compliment from you could light up her entire day.`,
                        ];
                        const neutralSuggestions: string[] = [
                            '😊 A genuine compliment can go a long way — tell her something you love about her.',
                            '📝 Leave her a sweet note somewhere she\'ll find it unexpectedly.',
                            '🤝 Offer a foot rub or shoulder massage — pregnancy is hard work!',
                        ];

                        const happyMessages = [
                            `Your wife ${wifeName} is feeling happy today 😊! You're doing a wonderful job as a husband — she's glowing because of your love.`,
                            `${wifeName} is in great spirits! Keep up the amazing support — it clearly shows in her mood.`,
                            `Your partner is happy today! You are such a great husband — your love and care are making all the difference.`,
                            `${wifeName} is smiling today! You've created a loving, safe space for her and your baby. Keep shining!`,
                        ];
                        const happySuggestions: string[] = [
                            '💕 A small surprise — flowers, her favorite snack, or a heartfelt note — can make her day even brighter.',
                            '📸 Take a candid photo together — these are precious moments you\'ll cherish forever.',
                            '🎉 Celebrate the good days! Plan something fun you both enjoy.',
                        ];

                        const ecstaticMessages = [
                            `Your wife ${wifeName} is feeling absolutely amazing today 🤩! You are an incredible husband and she deeply appreciates everything you do.`,
                            `${wifeName} is on cloud nine! You have done such an outstanding job taking care of her — give yourself some credit too!`,
                            `Your partner is glowing with happiness! You are truly a great husband — she is so lucky to have you by her side.`,
                            `${wifeName} is radiating joy today! Your unwavering love and support have created this beautiful moment. You're a superstar husband!`,
                        ];
                        const ecstaticSuggestions: string[] = [
                            '🌟 Keep doing exactly what you\'re doing — you\'re a natural at this!',
                            '💝 Tell her how happy it makes you to see her this joyful.',
                            '📖 Take a moment to journal about this happy day — you\'ll love looking back on it.',
                        ];

                        let moodMessages: string[];
                        let suggestions: string[];
                        if (moodValue === 1) {
                            moodMessages = sadMessages;
                            suggestions = sadSuggestions;
                        } else if (moodValue === 2) {
                            moodMessages = mildlySadMessages;
                            suggestions = mildlySadSuggestions;
                        } else if (moodValue === 3) {
                            moodMessages = neutralMessages;
                            suggestions = neutralSuggestions;
                        } else if (moodValue === 4) {
                            moodMessages = happyMessages;
                            suggestions = happySuggestions;
                        } else {
                            moodMessages = ecstaticMessages;
                            suggestions = ecstaticSuggestions;
                        }

                        // Pick a random message
                        const randomMessage = moodMessages[Math.floor(Math.random() * moodMessages.length)];
                        // Shuffle and pick 2 suggestions
                        const shuffledSuggestions = suggestions.sort(() => Math.random() - 0.5).slice(0, 2);

                        const notificationType = await prisma.notificationType.upsert({
                            where: { typeName: 'partner_mood_update' },
                            update: {},
                            create: { typeName: 'partner_mood_update' },
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
                                    title: `${wifeName} is feeling ${moodLabel.split(' ')[0].toLowerCase()} today`,
                                    message: randomMessage,
                                    moodValue,
                                    moodLabel,
                                    suggestions: shuffledSuggestions,
                                    motherName: `${user.firstName} ${user.lastName}`,
                                    date: parsed.data.logDate,
                                },
                            },
                        });
                    }
                }
            } catch (notifyErr) {
                // Don't fail the log creation if notification fails
                logger.error('Failed to create partner mood notification', 'wellness', notifyErr instanceof Error ? notifyErr : undefined);
            }
        }

        return created({
            id: log.id,
            metricType: log.metricType.metricName,
            unitLabel: log.metricType.unitLabel,
            valueType: log.metricType.valueType,
            logDate: log.logDate.toISOString().split('T')[0],
            numericValue: log.numericValue,
            booleanValue: log.booleanValue,
            textValue: log.textValue,
            createdAt: log.createdAt,
        });
    } catch (err) {
        logger.error('Create wellness log error', 'wellness', err instanceof Error ? err : undefined);
        return badRequest('Failed to create wellness log');
    }
}