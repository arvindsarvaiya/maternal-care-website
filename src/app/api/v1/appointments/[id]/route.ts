import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

// ─── PUT: Update appointment ───
const updateAppointmentSchema = z.object({
    type: z.string().optional(),
    providerName: z.string().optional(),
    locationText: z.string().optional(),
    scheduledAt: z.string().optional(),
    status: z.string().optional(),
    notes: z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await params;
        const body = await req.json();
        const parsed = updateAppointmentSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        const existing = await prisma.appointment.findUnique({ where: { id } });
        if (!existing || existing.userId !== payload.userId) return notFound('Appointment');

        const updateData: any = {};
        if (parsed.data.providerName !== undefined) updateData.providerName = parsed.data.providerName;
        if (parsed.data.locationText !== undefined) updateData.locationText = parsed.data.locationText;
        if (parsed.data.scheduledAt) updateData.scheduledAt = new Date(parsed.data.scheduledAt);
        if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes;

        if (parsed.data.type) {
            let at = await prisma.appointmentType.findUnique({ where: { typeName: parsed.data.type } });
            if (!at) at = await prisma.appointmentType.create({ data: { typeName: parsed.data.type } });
            updateData.appointmentTypeId = at.id;
        }

        if (parsed.data.status) {
            let s = await prisma.appointmentStatus.findUnique({ where: { statusName: parsed.data.status } });
            if (!s) s = await prisma.appointmentStatus.create({ data: { statusName: parsed.data.status } });
            updateData.statusId = s.id;
        }

        const appointment = await prisma.appointment.update({
            where: { id },
            data: updateData,
            include: {
                appointmentType: { select: { typeName: true } },
                status: { select: { statusName: true } },
            },
        });

        return success({
            id: appointment.id,
            type: appointment.appointmentType.typeName,
            provider: appointment.providerName,
            date: appointment.scheduledAt.toISOString().split('T')[0],
            time: appointment.scheduledAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            location: appointment.locationText,
            status: appointment.status.statusName,
            notes: appointment.notes,
        });
    } catch (err) {
        logger.error('Update appointment error:', 'appointments', err instanceof Error ? err : undefined);
        return badRequest('Failed to update appointment');
    }
}

// ─── DELETE: Delete appointment ───
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await params;

        const existing = await prisma.appointment.findUnique({ where: { id } });
        if (!existing || existing.userId !== payload.userId) return notFound('Appointment');

        await prisma.appointment.delete({ where: { id } });

        return success({ deleted: true });
    } catch (err) {
        logger.error('Delete appointment error:', 'appointments', err instanceof Error ? err : undefined);
        return badRequest('Failed to delete appointment');
    }
}