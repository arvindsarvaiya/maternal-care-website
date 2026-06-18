import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, created, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

// ─── Schemas ───

const createLogSchema = z.object({
    logType: z.enum(['recovery', 'breastfeeding', 'baby_weight', 'baby_diaper', 'pelvic_floor', 'mental_health']),
    // Recovery
    bleedingLevel: z.enum(['none', 'light', 'moderate', 'heavy']).optional(),
    painLevel: z.number().int().min(0).max(10).optional(),
    perineumHealing: z.enum(['healing_well', 'discomfort', 'pain', 'signs_of_infection']).optional(),
    cSectionHealing: z.enum(['healing_well', 'discomfort', 'pain', 'signs_of_infection']).optional(),
    // Breastfeeding
    feedingDuration: z.number().int().positive().optional(), // minutes
    feedingSide: z.enum(['left', 'right', 'both']).optional(),
    feedingNotes: z.string().optional(),
    // Baby weight
    babyWeight: z.number().positive().optional(), // kg
    // Baby diaper
    diaperCount: z.number().int().min(0).optional(),
    diaperType: z.enum(['wet', 'stool', 'both']).optional(),
    // Pelvic floor
    exercisesDone: z.array(z.string()).optional(),
    kegelCount: z.number().int().min(0).optional(),
    // Mental health
    moodScore: z.number().int().min(1).max(5).optional(),
    anxietyLevel: z.number().int().min(0).max(10).optional(),
    sleepHours: z.number().min(0).max(24).optional(),
    notes: z.string().optional(),
    logDate: z.string().optional(), // ISO date string, defaults to today
});

type CreateLogInput = z.infer<typeof createLogSchema>;

// ─── GET: Fetch postpartum health logs ───
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const url = new URL(req.url);
        const logType = url.searchParams.get('logType') || undefined;
        const days = parseInt(url.searchParams.get('days') || '30');
        const limit = parseInt(url.searchParams.get('limit') || '50');

        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - days);

        const where: any = {
            userId: payload.userId,
            logDate: { gte: sinceDate },
        };

        if (logType) {
            where.logType = logType;
        }

        const logs = await prisma.postpartumHealthLog.findMany({
            where,
            orderBy: { logDate: 'desc' },
            take: limit,
        });

        // Also fetch pregnancy profile for recovery context
        const pregnancyProfile = await prisma.pregnancyProfile.findUnique({
            where: { userId: payload.userId },
            select: {
                phase: true,
                postpartumWeek: true,
                deliveryDate: true,
            },
        });

        return success({
            logs,
            profile: pregnancyProfile,
            total: logs.length,
            days,
        });
    } catch (err) {
        logger.error('Get postpartum health logs error:', 'postpartum-health', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch postpartum health logs');
    }
}

// ─── POST: Create postpartum health log ───
export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = createLogSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        const data = parsed.data;
        const logDate = data.logDate ? new Date(data.logDate) : new Date();

        const log = await prisma.postpartumHealthLog.create({
            data: {
                userId: payload.userId,
                logType: data.logType,
                logDate,
                bleedingLevel: data.bleedingLevel ?? null,
                painLevel: data.painLevel ?? null,
                perineumHealing: data.perineumHealing ?? null,
                cSectionHealing: data.cSectionHealing ?? null,
                feedingDuration: data.feedingDuration ?? null,
                feedingSide: data.feedingSide ?? null,
                feedingNotes: data.feedingNotes ?? null,
                babyWeight: data.babyWeight ?? null,
                diaperCount: data.diaperCount ?? null,
                diaperType: data.diaperType ?? null,
                exercisesDone: data.exercisesDone ?? [],
                kegelCount: data.kegelCount ?? null,
                moodScore: data.moodScore ?? null,
                anxietyLevel: data.anxietyLevel ?? null,
                sleepHours: data.sleepHours ?? null,
                notes: data.notes ?? null,
            },
        });

        return created(log);
    } catch (err) {
        logger.error('Create postpartum health log error:', 'postpartum-health', err instanceof Error ? err : undefined);
        return badRequest('Failed to create postpartum health log');
    }
}