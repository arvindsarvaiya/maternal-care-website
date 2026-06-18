import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

// ─── PUT: Update wellness log ───
const updateWellnessSchema = z.object({
    metricType: z.string().optional(),
    logDate: z.string().optional(),
    numericValue: z.number().optional(),
    booleanValue: z.boolean().optional(),
    textValue: z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await params;
        const body = await req.json();
        const parsed = updateWellnessSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        const existing = await prisma.wellnessLog.findUnique({ where: { id } });
        if (!existing || existing.userId !== payload.userId) return notFound('Wellness log');

        const updateData: any = {};
        if (parsed.data.numericValue !== undefined) updateData.numericValue = parsed.data.numericValue;
        if (parsed.data.booleanValue !== undefined) updateData.booleanValue = parsed.data.booleanValue;
        if (parsed.data.textValue !== undefined) updateData.textValue = parsed.data.textValue ? stripHtml(parsed.data.textValue) : null;
        if (parsed.data.logDate) updateData.logDate = new Date(parsed.data.logDate);

        if (parsed.data.metricType) {
            let mt = await prisma.wellnessMetricType.findUnique({ where: { metricName: parsed.data.metricType } });
            if (!mt) mt = await prisma.wellnessMetricType.create({ data: { metricName: parsed.data.metricType, valueType: 'numeric' } });
            updateData.metricTypeId = mt.id;
        }

        const log = await prisma.wellnessLog.update({
            where: { id },
            data: updateData,
            include: {
                metricType: { select: { metricName: true, unitLabel: true, valueType: true } },
            },
        });

        return success({
            id: log.id,
            metricType: log.metricType.metricName,
            unitLabel: log.metricType.unitLabel,
            valueType: log.metricType.valueType,
            logDate: log.logDate.toISOString().split('T')[0],
            numericValue: log.numericValue,
            booleanValue: log.booleanValue,
            textValue: log.textValue,
        });
    } catch (err) {
        logger.error('Update wellness log error', 'wellness', err instanceof Error ? err : undefined);
        return badRequest('Failed to update wellness log');
    }
}

// ─── DELETE: Delete wellness log ───
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await params;

        const existing = await prisma.wellnessLog.findUnique({ where: { id } });
        if (!existing || existing.userId !== payload.userId) return notFound('Wellness log');

        await prisma.wellnessLog.delete({ where: { id } });

        return success({ deleted: true });
    } catch (err) {
        logger.error('Delete wellness log error', 'wellness', err instanceof Error ? err : undefined);
        return badRequest('Failed to delete wellness log');
    }
}