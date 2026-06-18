import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { success, badRequest } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

// ─── Cron Auth ───
const CRON_SECRET = process.env.CRON_SECRET;

/**
 * Validates that the incoming request is an authorized cron job call.
 * Requires a matching CRON_SECRET in the Authorization header.
 * This endpoint should be called by Vercel Cron Jobs or similar schedulers.
 */
function isAuthorizedCronRequest(req: NextRequest): boolean {
    if (!CRON_SECRET) {
        logger.error('CRON_SECRET environment variable is not set. Cron endpoint will reject all requests.', 'appointment-reminders');
        return false;
    }
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return false;
    // Support both "Bearer <secret>" and plain "<secret>"
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    return token === CRON_SECRET;
}

// ─── Helper: find linked partner's user ID ───
async function findLinkedPartnerId(userId: string): Promise<string | null> {
    const familyAsMother = await prisma.family.findFirst({
        where: { motherUserId: userId },
        include: {
            members: {
                where: { memberRole: 'partner', inviteStatus: 'accepted' },
                select: { userId: true },
            },
        },
    });
    if (familyAsMother?.members[0]) return familyAsMother.members[0].userId;

    const membership = await prisma.familyMember.findFirst({
        where: { userId, memberRole: 'partner', inviteStatus: 'accepted' },
        include: { family: { select: { motherUserId: true } } },
    });
    if (membership?.family.motherUserId) return membership.family.motherUserId;

    return null;
}

/**
 * POST /api/v1/appointments/reminders
 * Cron endpoint: checks and sends appointment reminders for appointments in the next hour.
 * Requires CRON_SECRET Authorization header.
 */
export async function POST(req: NextRequest) {
    // Auth check for cron invocation
    if (!isAuthorizedCronRequest(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

        // Find all appointments in the next hour (regardless of database status)
        const upcomingAppointments = await prisma.appointment.findMany({
            where: {
                scheduledAt: {
                    gte: now,
                    lte: oneHourFromNow,
                },
            },
            include: {
                appointmentType: { select: { typeName: true } },
                user: { select: { id: true, firstName: true, lastName: true } },
            },
        });

        // Find or create notification type (use 'appointment' to appear in appointment section)
        const notificationType = await prisma.notificationType.upsert({
            where: { typeName: 'appointment' },
            update: {},
            create: { typeName: 'appointment' },
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

        let remindersSent = 0;

        // Send reminders for each appointment
        for (const appointment of upcomingAppointments) {
            // Build recipient list: appointment creator + linked partner
            const recipientIds: string[] = [appointment.userId];
            const linkedPartnerId = await findLinkedPartnerId(appointment.userId);
            if (linkedPartnerId) {
                recipientIds.push(linkedPartnerId);
            }

            const scheduledDate = new Date(appointment.scheduledAt);
            const dateStr = scheduledDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            const timeStr = scheduledDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });

            const typeLabel = appointment.appointmentType.typeName.charAt(0).toUpperCase() + appointment.appointmentType.typeName.slice(1);

            for (const recipientId of recipientIds) {
                // Check if reminder already sent for this appointment to this recipient
                const existingReminder = await prisma.notification.findFirst({
                    where: {
                        userId: recipientId,
                        notificationTypeId: notificationType.id,
                        payloadJson: {
                            path: ['$'],
                            string_contains: appointment.id,
                        },
                    },
                });

                if (existingReminder) {
                    continue; // Skip if reminder already sent to this recipient
                }

                const isPartner = recipientId !== appointment.userId;
                const titlePrefix = isPartner ? '⏰ Reminder: Partner\'s' : '⏰ Reminder:';
                const messagePrefix = isPartner
                    ? `Your partner's ${appointment.appointmentType.typeName} appointment is scheduled for ${dateStr} at ${timeStr}.`
                    : `Your ${appointment.appointmentType.typeName} appointment is scheduled for ${dateStr} at ${timeStr}.`;

                await prisma.notification.create({
                    data: {
                        userId: recipientId,
                        notificationTypeId: notificationType.id,
                        statusId: statusPending.id,
                        channelId: channelApp.id,
                        scheduledFor: new Date(),
                        payloadJson: {
                            title: `${titlePrefix} ${typeLabel} in 1 hour`,
                            message: `${messagePrefix} ${appointment.providerName ? `Provider: ${appointment.providerName}.` : ''} ${appointment.locationText ? `Location: ${appointment.locationText}.` : ''}`,
                            appointmentId: appointment.id,
                            appointmentType: appointment.appointmentType.typeName,
                            scheduledAt: appointment.scheduledAt.toISOString(),
                            dateStr,
                            timeStr,
                            provider: appointment.providerName,
                            location: appointment.locationText,
                            notes: appointment.notes,
                        },
                    },
                });
                remindersSent++;
            }
        }

        return success({
            processed: upcomingAppointments.length,
            remindersSent,
            message: `Checked ${upcomingAppointments.length} appointments, sent ${remindersSent} reminders`,
        });
    } catch (err) {
        logger.error('Appointment reminders error:', 'appointment-reminders', err instanceof Error ? err : undefined);
        return badRequest('Failed to process appointment reminders');
    }
}
