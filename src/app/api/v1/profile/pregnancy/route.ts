import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, created, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

// ─── GET: Fetch pregnancy profile ───
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const profile = await prisma.pregnancyProfile.findUnique({
            where: { userId: payload.userId },
        });

        // Return a default response instead of 404 so the frontend
        // can gracefully fall back to mother-health profile for phase detection.
        if (!profile) {
            return success({ phase: null, exists: false });
        }

        // Always re-evaluate phase based on due date vs current date.
        // This ensures the phase dynamically changes as time passes
        // (the due date is auto-calculated from LMP and stored).
        if (profile.dueDate) {
            const now = new Date();
            const due = new Date(profile.dueDate);
            due.setHours(0, 0, 0, 0);
            now.setHours(0, 0, 0, 0);

            const correctPhase = due < now ? 'postpartum' : 'pregnancy';
            if (profile.phase !== correctPhase) {
                const updated = await prisma.pregnancyProfile.update({
                    where: { userId: payload.userId },
                    data: {
                        phase: correctPhase,
                        deliveryDate: correctPhase === 'postpartum'
                            ? (profile.deliveryDate || now)
                            : profile.deliveryDate,
                    },
                });
                return success(updated);
            }
        }

        return success(profile);
    } catch (err) {
        logger.error('Get pregnancy profile error:', 'pregnancy-profile', err instanceof Error ? err : undefined);
        // Return a graceful fallback so frontend doesn't break
        return success({ phase: null, exists: false, error: 'Failed to fetch profile' });
    }
}

// ─── POST: Create pregnancy profile ───
const createProfileSchema = z.object({
    profileStartBasis: z.enum(['lmp', 'due_date', 'ivf_transfer']),
    lmpDate: z.string().optional(),
    dueDate: z.string().optional(),
    gravida: z.number().int().min(0).optional(),
    parity: z.number().int().min(0).optional(),
    highRiskFlag: z.boolean().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = createProfileSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        // Check if profile already exists
        const existing = await prisma.pregnancyProfile.findUnique({
            where: { userId: payload.userId },
        });
        if (existing) return badRequest('Profile already exists. Use PUT to update.');

        const profile = await prisma.pregnancyProfile.create({
            data: {
                userId: payload.userId,
                profileStartBasis: parsed.data.profileStartBasis,
                lmpDate: parsed.data.lmpDate ? new Date(parsed.data.lmpDate) : null,
                dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
                gravida: parsed.data.gravida,
                parity: parsed.data.parity,
                highRiskFlag: parsed.data.highRiskFlag ?? false,
                emergencyContactName: parsed.data.emergencyContactName,
                emergencyContactPhone: parsed.data.emergencyContactPhone,
            },
        });

        return created(profile);
    } catch (err) {
        logger.error('Create pregnancy profile error:', 'pregnancy-profile', err instanceof Error ? err : undefined);
        return badRequest('Failed to create pregnancy profile');
    }
}

// ─── PUT: Update pregnancy profile ───
const updateProfileSchema = z.object({
    profileStartBasis: z.enum(['lmp', 'due_date', 'ivf_transfer']).optional(),
    lmpDate: z.string().optional(),
    dueDate: z.string().optional(),
    gravida: z.number().int().min(0).optional(),
    parity: z.number().int().min(0).optional(),
    highRiskFlag: z.boolean().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    // ── Postpartum phase fields ──
    deliveryDate: z.string().optional(),
    phase: z.enum(['pregnancy', 'postpartum']).optional(),
    postpartumWeek: z.number().int().min(1).max(52).optional(),
});

export async function PUT(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = updateProfileSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        const existing = await prisma.pregnancyProfile.findUnique({
            where: { userId: payload.userId },
        });
        if (!existing) return notFound('Pregnancy profile');

        const profile = await prisma.pregnancyProfile.update({
            where: { userId: payload.userId },
            data: {
                ...(parsed.data.profileStartBasis && { profileStartBasis: parsed.data.profileStartBasis }),
                ...(parsed.data.lmpDate !== undefined && { lmpDate: parsed.data.lmpDate ? new Date(parsed.data.lmpDate) : null }),
                ...(parsed.data.dueDate !== undefined && { dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null }),
                ...(parsed.data.gravida !== undefined && { gravida: parsed.data.gravida }),
                ...(parsed.data.parity !== undefined && { parity: parsed.data.parity }),
                ...(parsed.data.highRiskFlag !== undefined && { highRiskFlag: parsed.data.highRiskFlag }),
                ...(parsed.data.emergencyContactName !== undefined && { emergencyContactName: parsed.data.emergencyContactName }),
                ...(parsed.data.emergencyContactPhone !== undefined && { emergencyContactPhone: parsed.data.emergencyContactPhone }),
                ...(parsed.data.deliveryDate !== undefined && { deliveryDate: parsed.data.deliveryDate ? new Date(parsed.data.deliveryDate) : null }),
                ...(parsed.data.phase !== undefined && { phase: parsed.data.phase }),
                ...(parsed.data.postpartumWeek !== undefined && { postpartumWeek: parsed.data.postpartumWeek }),
            },
        });

        return success(profile);
    } catch (err) {
        logger.error('Update pregnancy profile error:', 'pregnancy-profile', err instanceof Error ? err : undefined);
        return badRequest('Failed to update pregnancy profile');
    }
}