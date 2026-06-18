import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

// ─── PUT: Update symptom log ───
const updateSymptomSchema = z.object({
    symptomType: z.string().optional(),
    severity: z.string().optional(),
    loggedAt: z.string().optional(),
    notes: z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await params;
        const body = await req.json();
        const parsed = updateSymptomSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        const existing = await prisma.symptomLog.findUnique({ where: { id } });
        if (!existing || existing.userId !== payload.userId) return notFound('Symptom log');

        const updateData: any = {};
        if (parsed.data.loggedAt) updateData.loggedAt = new Date(parsed.data.loggedAt);
        if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes ? stripHtml(parsed.data.notes) : null;

        if (parsed.data.symptomType) {
            let st = await prisma.symptomType.findUnique({ where: { symptomName: parsed.data.symptomType } });
            if (!st) st = await prisma.symptomType.create({ data: { symptomName: parsed.data.symptomType } });
            updateData.symptomTypeId = st.id;
        }

        if (parsed.data.severity) {
            let sv = await prisma.symptomSeverityLevel.findUnique({ where: { severityName: parsed.data.severity } });
            if (!sv) {
                const rankMap: Record<string, number> = { Mild: 1, Moderate: 2, Severe: 3 };
                sv = await prisma.symptomSeverityLevel.create({ data: { severityName: parsed.data.severity, severityRank: rankMap[parsed.data.severity] || 2 } });
            }
            updateData.severityId = sv.id;
        }

        const log = await prisma.symptomLog.update({
            where: { id },
            data: updateData,
            include: {
                symptomType: { select: { symptomName: true } },
                severity: { select: { severityName: true, severityRank: true } },
            },
        });

        return success({
            id: log.id,
            symptomType: log.symptomType.symptomName,
            severity: log.severity.severityName,
            severityRank: log.severity.severityRank,
            loggedAt: log.loggedAt.toISOString(),
            notes: log.notes,
        });
    } catch (err) {
        logger.error('Update symptom log error', 'symptoms', err instanceof Error ? err : undefined);
        return badRequest('Failed to update symptom log');
    }
}

// ─── DELETE: Delete symptom log ───
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await params;

        const existing = await prisma.symptomLog.findUnique({ where: { id } });
        if (!existing || existing.userId !== payload.userId) return notFound('Symptom log');

        await prisma.symptomLog.delete({ where: { id } });

        return success({ deleted: true });
    } catch (err) {
        logger.error('Delete symptom log error', 'symptoms', err instanceof Error ? err : undefined);
        return badRequest('Failed to delete symptom log');
    }
}