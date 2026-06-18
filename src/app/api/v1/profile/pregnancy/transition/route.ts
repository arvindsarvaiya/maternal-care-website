import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

// ─── POST: Transition from pregnancy to postpartum phase ───
const transitionSchema = z.object({
    deliveryDate: z.string().min(1, 'Delivery date is required'),
});

export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = transitionSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        const { deliveryDate } = parsed.data;

        // Calculate postpartum week
        const deliveryDt = new Date(deliveryDate);
        const msSinceDelivery = Date.now() - deliveryDt.getTime();
        const postpartumWeek = Math.min(52, Math.max(1, Math.ceil(msSinceDelivery / (7 * 24 * 60 * 60 * 1000))));

        // Find existing pregnancy profile or create one if missing
        // (user may have a mother-health profile but no pregnancy profile yet)
        let existing = await prisma.pregnancyProfile.findUnique({
            where: { userId: payload.userId },
        });

        let profile;
        if (existing) {
            // Update the existing profile to postpartum phase
            profile = await prisma.pregnancyProfile.update({
                where: { userId: payload.userId },
                data: {
                    deliveryDate: deliveryDt,
                    phase: 'postpartum',
                    postpartumWeek,
                },
            });
        } else {
            // Create a new pregnancy profile with postpartum phase
            profile = await prisma.pregnancyProfile.create({
                data: {
                    userId: payload.userId,
                    deliveryDate: deliveryDt,
                    phase: 'postpartum',
                    postpartumWeek,
                    profileStartBasis: 'due_date',
                },
            });
        }

        // Create a notification prompting the user to complete their postpartum profile
        try {
            // Find or create the 'profile_reminder' notification type
            let notificationType = await prisma.notificationType.findUnique({
                where: { typeName: 'profile_reminder' },
            });
            if (!notificationType) {
                notificationType = await prisma.notificationType.create({
                    data: { typeName: 'profile_reminder' },
                });
            }

            // Find or create the 'pending' and 'in_app' statuses/channel
            let pendingStatus = await prisma.notificationStatus.findUnique({
                where: { statusName: 'pending' },
            });
            if (!pendingStatus) {
                pendingStatus = await prisma.notificationStatus.create({
                    data: { statusName: 'pending' },
                });
            }

            let inAppChannel = await prisma.reminderChannel.findUnique({
                where: { channelName: 'in_app' },
            });
            if (!inAppChannel) {
                inAppChannel = await prisma.reminderChannel.create({
                    data: { channelName: 'in_app' },
                });
            }

            await prisma.notification.create({
                data: {
                    userId: payload.userId,
                    notificationTypeId: notificationType.id,
                    statusId: pendingStatus.id,
                    channelId: inAppChannel.id,
                    scheduledFor: new Date(),
                    payloadJson: {
                        title: 'Complete Your Postpartum Profile',
                        body: 'Congratulations on your delivery! Please complete your postpartum details — delivery type, baby weight, breastfeeding status, and more.',
                        actionLabel: 'Complete Profile',
                        actionUrl: '/profile',
                    },
                },
            });
        } catch (notifErr) {
            // Don't fail the transition if notification creation fails
            logger.error('Failed to create postpartum profile reminder notification:', 'pregnancy-transition', notifErr instanceof Error ? notifErr : undefined);
        }

        return success({
            message: 'Successfully transitioned to postpartum phase',
            profile,
            postpartumWeek,
        });
    } catch (err) {
        logger.error('Transition to postpartum error:', 'pregnancy-transition', err instanceof Error ? err : undefined);
        return badRequest('Failed to transition to postpartum phase');
    }
}