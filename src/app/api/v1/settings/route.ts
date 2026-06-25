import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

// Prevent prerendering of API routes
export const dynamic = 'force-dynamic';

// ─── GET: Fetch user preferences ───
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const preferences = await prisma.userPreference.findUnique({
            where: { userId: payload.userId },
            include: {
                language: { select: { code: true, name: true } },
            },
        });

        if (!preferences) return notFound('Preferences');

        // Get reminder channel preferences
        const channelPrefs = await prisma.userReminderChannelPreference.findMany({
            where: { userId: payload.userId },
            include: { channel: { select: { channelName: true } } },
        });

        return success({
            id: preferences.id,
            language: preferences.language,
            timeZone: preferences.timeZone,
            theme: preferences.themePreference,
            consentDataProcessing: preferences.consentDataProcessing,
            consentNotifications: preferences.consentNotifications,
            reminderChannels: channelPrefs.map(cp => ({
                channel: cp.channel.channelName,
                enabled: cp.isEnabled,
            })),
            updatedAt: preferences.updatedAt,
        });
    } catch (err) {
        logger.error('Get settings error', 'settings', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch settings');
    }
}

// ─── PUT: Update user preferences ───
const updateSettingsSchema = z.object({
    languageCode: z.string().optional(),
    timeZone: z.string().optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
    consentDataProcessing: z.boolean().optional(),
    consentNotifications: z.boolean().optional(),
    reminderChannels: z.array(z.object({
        channel: z.string(),
        enabled: z.boolean(),
    })).optional(),
});

export async function PUT(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = updateSettingsSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        // Resolve language if provided
        let languageId: string | undefined;
        if (parsed.data.languageCode) {
            const language = await prisma.language.findUnique({
                where: { code: parsed.data.languageCode },
            });
            if (!language) return badRequest('Invalid language code');
            languageId = language.id;
        }

        // Upsert preferences
        const preferences = await prisma.userPreference.upsert({
            where: { userId: payload.userId },
            create: {
                userId: payload.userId,
                preferredLanguageId: languageId || (await prisma.language.findFirst({ where: { code: 'en' } }))!.id,
                timeZone: parsed.data.timeZone || 'UTC',
                themePreference: parsed.data.theme || 'light',
                consentDataProcessing: parsed.data.consentDataProcessing ?? false,
                consentNotifications: parsed.data.consentNotifications ?? false,
            },
            update: {
                ...(languageId && { preferredLanguageId: languageId }),
                ...(parsed.data.timeZone && { timeZone: parsed.data.timeZone }),
                ...(parsed.data.theme && { themePreference: parsed.data.theme }),
                ...(parsed.data.consentDataProcessing !== undefined && { consentDataProcessing: parsed.data.consentDataProcessing }),
                ...(parsed.data.consentNotifications !== undefined && { consentNotifications: parsed.data.consentNotifications }),
            },
            include: {
                language: { select: { code: true, name: true } },
            },
        });

        // Update reminder channel preferences if provided
        if (parsed.data.reminderChannels) {
            for (const rc of parsed.data.reminderChannels) {
                let channel = await prisma.reminderChannel.findUnique({
                    where: { channelName: rc.channel },
                });
                if (!channel) {
                    channel = await prisma.reminderChannel.create({
                        data: { channelName: rc.channel },
                    });
                }
                await prisma.userReminderChannelPreference.upsert({
                    where: {
                        userId_channelId: {
                            userId: payload.userId,
                            channelId: channel.id,
                        },
                    },
                    create: {
                        userId: payload.userId,
                        channelId: channel.id,
                        isEnabled: rc.enabled,
                    },
                    update: {
                        isEnabled: rc.enabled,
                    },
                });
            }
        }

        // Get updated channel preferences
        const channelPrefs = await prisma.userReminderChannelPreference.findMany({
            where: { userId: payload.userId },
            include: { channel: { select: { channelName: true } } },
        });

        return success({
            id: preferences.id,
            language: preferences.language,
            timeZone: preferences.timeZone,
            theme: preferences.themePreference,
            consentDataProcessing: preferences.consentDataProcessing,
            consentNotifications: preferences.consentNotifications,
            reminderChannels: channelPrefs.map(cp => ({
                channel: cp.channel.channelName,
                enabled: cp.isEnabled,
            })),
            updatedAt: preferences.updatedAt,
        });
    } catch (err) {
        logger.error('Update settings error', 'settings', err instanceof Error ? err : undefined);
        return badRequest('Failed to update settings');
    }
}