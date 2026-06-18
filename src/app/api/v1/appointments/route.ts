import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, created, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

// ─── Helper: find linked partner's user ID ───
async function findLinkedPartnerId(userId: string): Promise<string | null> {
    // Check if user is mother → return partner
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

    // Check if user is partner → return mother
    const membership = await prisma.familyMember.findFirst({
        where: { userId, memberRole: 'partner', inviteStatus: 'accepted' },
        include: { family: { select: { motherUserId: true } } },
    });
    if (membership?.family.motherUserId) return membership.family.motherUserId;

    return null;
}

// ─── GET: List appointments for current user AND linked partner ───
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const url = new URL(req.url);
        const status = url.searchParams.get('status');
        const type = url.searchParams.get('type');
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');

        // Get linked partner's userId for shared appointments
        const partnerId = await findLinkedPartnerId(payload.userId);

        const where: any = partnerId
            ? { userId: { in: [payload.userId, partnerId] } }
            : { userId: payload.userId };

        if (status) {
            where.status = { statusName: status };
        }
        if (type) {
            where.appointmentType = { typeName: type };
        }

        const [appointments, total] = await Promise.all([
            prisma.appointment.findMany({
                where,
                include: {
                    appointmentType: { select: { typeName: true } },
                    status: { select: { statusName: true } },
                },
                orderBy: { scheduledAt: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.appointment.count({ where }),
        ]);

        const now = new Date();
        return success({
            appointments: appointments.map(a => {
                // Dynamically determine status based on current time
                const scheduledDate = new Date(a.scheduledAt);
                const isPast = scheduledDate < now;
                const dynamicStatus = isPast ? 'previous' : 'upcoming';

                return {
                    id: a.id,
                    type: a.appointmentType.typeName,
                    provider: a.providerName,
                    date: a.scheduledAt.toISOString().split('T')[0],
                    time: a.scheduledAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                    location: a.locationText,
                    status: dynamicStatus,
                    notes: a.notes,
                    scheduledAt: a.scheduledAt,
                };
            }),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        logger.error('Get appointments error:', 'appointments', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch appointments');
    }
}

// ─── POST: Create appointment ───
const createAppointmentSchema = z.object({
    type: z.string().min(1),
    providerName: z.string().optional(),
    locationText: z.string().optional(),
    scheduledAt: z.string().min(1),
    notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = createAppointmentSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        // Find or create appointment type
        let appointmentType = await prisma.appointmentType.findUnique({
            where: { typeName: parsed.data.type },
        });
        if (!appointmentType) {
            appointmentType = await prisma.appointmentType.create({
                data: { typeName: parsed.data.type },
            });
        }

        // Find or create "upcoming" status
        let status = await prisma.appointmentStatus.findUnique({
            where: { statusName: 'upcoming' },
        });
        if (!status) {
            status = await prisma.appointmentStatus.create({
                data: { statusName: 'upcoming' },
            });
        }

        const appointment = await prisma.appointment.create({
            data: {
                userId: payload.userId,
                appointmentTypeId: appointmentType.id,
                statusId: status.id,
                scheduledAt: new Date(parsed.data.scheduledAt),
                providerName: parsed.data.providerName,
                locationText: parsed.data.locationText,
                notes: parsed.data.notes,
            },
            include: {
                appointmentType: { select: { typeName: true } },
                status: { select: { statusName: true } },
            },
        });

        // ─── Notify both the creator and linked partner about the new appointment ───
        try {
            const scheduledDate = new Date(parsed.data.scheduledAt);
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

            const typeLabel = parsed.data.type.charAt(0).toUpperCase() + parsed.data.type.slice(1);

            const notificationType = await prisma.notificationType.upsert({
                where: { typeName: 'appointment_created' },
                update: {},
                create: { typeName: 'appointment_created' },
            });

            const partnerNotificationType = await prisma.notificationType.upsert({
                where: { typeName: 'partner_appointment_created' },
                update: {},
                create: { typeName: 'partner_appointment_created' },
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

            // Send creation confirmation to the appointment creator
            await prisma.notification.create({
                data: {
                    userId: payload.userId,
                    notificationTypeId: notificationType.id,
                    statusId: statusPending.id,
                    channelId: channelApp.id,
                    scheduledFor: new Date(),
                    payloadJson: {
                        title: `📅 Appointment Created: ${typeLabel}`,
                        message: `You have scheduled a ${parsed.data.type} appointment on ${dateStr} at ${timeStr}. ${parsed.data.providerName ? `Provider: ${parsed.data.providerName}.` : ''} ${parsed.data.locationText ? `Location: ${parsed.data.locationText}.` : ''}`,
                        appointmentId: appointment.id,
                        appointmentType: parsed.data.type,
                        scheduledAt: parsed.data.scheduledAt,
                        dateStr,
                        timeStr,
                        provider: parsed.data.providerName,
                        location: parsed.data.locationText,
                        notes: parsed.data.notes,
                    },
                },
            });

            // Send notification to linked partner
            const partnerId = await findLinkedPartnerId(payload.userId);
            if (partnerId) {
                const creator = await prisma.user.findUnique({
                    where: { id: payload.userId },
                    select: { firstName: true, lastName: true },
                });
                const creatorName = creator ? `${creator.firstName} ${creator.lastName || ''}`.trim() : 'Your partner';

                await prisma.notification.create({
                    data: {
                        userId: partnerId,
                        notificationTypeId: partnerNotificationType.id,
                        statusId: statusPending.id,
                        channelId: channelApp.id,
                        scheduledFor: new Date(),
                        payloadJson: {
                            title: `📅 New Appointment: ${typeLabel}`,
                            message: `${creatorName} has scheduled a ${parsed.data.type} appointment on ${dateStr} at ${timeStr}.`,
                            appointmentId: appointment.id,
                            appointmentType: parsed.data.type,
                            scheduledAt: parsed.data.scheduledAt,
                            dateStr,
                            timeStr,
                            provider: parsed.data.providerName,
                            location: parsed.data.locationText,
                            notes: parsed.data.notes,
                            createdBy: creatorName,
                            createdByUserId: payload.userId,
                        },
                    },
                });
            }
        } catch (notifyErr) {
            logger.error('Failed to create appointment notifications:', 'appointments', notifyErr instanceof Error ? notifyErr : undefined);
        }

        return created({
            id: appointment.id,
            type: appointment.appointmentType.typeName,
            provider: appointment.providerName,
            date: appointment.scheduledAt.toISOString().split('T')[0],
            time: appointment.scheduledAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            location: appointment.locationText,
            status: appointment.status.statusName,
            notes: appointment.notes,
            scheduledAt: appointment.scheduledAt,
        });
    } catch (err) {
        logger.error('Create appointment error:', 'appointments', err instanceof Error ? err : undefined);
        return badRequest('Failed to create appointment');
    }
}