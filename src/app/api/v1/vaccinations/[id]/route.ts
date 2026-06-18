import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

// ─── PUT: Update user vaccination ───
const updateVaccinationSchema = z.object({
    vaccineName: z.string().optional(),
    status: z.string().optional(),
    dueDate: z.string().optional(),
    scheduledDate: z.string().optional(),
    completedDate: z.string().optional(),
    notes: z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await params;
        const body = await req.json();
        const parsed = updateVaccinationSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        const existing = await prisma.userVaccination.findUnique({ where: { id } });
        if (!existing || existing.userId !== payload.userId) return notFound('Vaccination');

        const updateData: any = {};
        if (parsed.data.dueDate !== undefined) updateData.dueDate = parsed.data.dueDate ? new Date(parsed.data.dueDate) : null;
        if (parsed.data.scheduledDate !== undefined) updateData.scheduledDate = parsed.data.scheduledDate ? new Date(parsed.data.scheduledDate) : null;
        if (parsed.data.completedDate !== undefined) updateData.completedDate = parsed.data.completedDate ? new Date(parsed.data.completedDate) : null;
        if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes;

        if (parsed.data.vaccineName) {
            let v = await prisma.vaccine.findUnique({ where: { vaccineName: parsed.data.vaccineName } });
            if (!v) v = await prisma.vaccine.create({ data: { vaccineName: parsed.data.vaccineName } });
            updateData.vaccineId = v.id;
        }

        if (parsed.data.status) {
            let s = await prisma.vaccinationStatus.findUnique({ where: { statusName: parsed.data.status } });
            if (!s) s = await prisma.vaccinationStatus.create({ data: { statusName: parsed.data.status } });
            updateData.statusId = s.id;
        }

        const vaccination = await prisma.userVaccination.update({
            where: { id },
            data: updateData,
            include: {
                vaccine: { select: { vaccineName: true, description: true } },
                status: { select: { statusName: true } },
                scheduleRule: { select: { ruleLabel: true, startWeek: true, endWeek: true } },
            },
        });

        return success({
            id: vaccination.id,
            vaccineName: vaccination.vaccine.vaccineName,
            description: vaccination.vaccine.description,
            status: vaccination.status.statusName,
            dueDate: vaccination.dueDate?.toISOString().split('T')[0],
            scheduledDate: vaccination.scheduledDate?.toISOString().split('T')[0],
            completedDate: vaccination.completedDate?.toISOString().split('T')[0],
            notes: vaccination.notes,
        });
    } catch (err) {
        logger.error('Update vaccination error', 'vaccinations', err instanceof Error ? err : undefined);
        return badRequest('Failed to update vaccination');
    }
}

// ─── DELETE: Delete user vaccination ───
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await params;

        const existing = await prisma.userVaccination.findUnique({ where: { id } });
        if (!existing || existing.userId !== payload.userId) return notFound('Vaccination');

        await prisma.userVaccination.delete({ where: { id } });

        return success({ deleted: true });
    } catch (err) {
        logger.error('Delete vaccination error', 'vaccinations', err instanceof Error ? err : undefined);
        return badRequest('Failed to delete vaccination');
    }
}