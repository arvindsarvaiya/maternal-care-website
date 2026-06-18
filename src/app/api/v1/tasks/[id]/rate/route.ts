import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

// ─── POST: Rate a completed task (mother rates partner's performance) ───
const rateTaskSchema = z.object({
    score: z.number().int().min(0).max(50).refine(v => [0, 10, 30, 50].includes(v), {
        message: 'Score must be 0, 10, 30, or 50',
    }),
    feedback: z.string().max(500).optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await params;
        const body = await req.json();
        const parsed = rateTaskSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        // Verify task exists and user has access (must be mother/creator)
        const task = await prisma.sharedTask.findUnique({
            where: { id },
            include: {
                family: true,
                assignments: {
                    include: {
                        assignedTo: { select: { id: true, firstName: true, lastName: true } },
                    },
                },
            },
        });

        if (!task) return notFound('Task');
        if (task.family.motherUserId !== payload.userId) {
            return unauthorized();
        }

        // Find the partner assignment for this task
        const partnerAssignment = task.assignments.find(a => a.assignedToUserId !== payload.userId);
        if (!partnerAssignment) {
            return notFound('Partner assignment for this task');
        }

        // Check if already rated
        const existingRating = await prisma.taskRating.findUnique({
            where: {
                taskId_assignmentId: {
                    taskId: id,
                    assignmentId: partnerAssignment.id,
                },
            },
        });

        if (existingRating) {
            return badRequest('This task has already been rated');
        }

        const rating = await prisma.taskRating.create({
            data: {
                taskId: id,
                assignmentId: partnerAssignment.id,
                ratedByUserId: payload.userId,
                ratedForUserId: partnerAssignment.assignedToUserId,
                score: parsed.data.score,
                feedback: parsed.data.feedback || null,
            },
        });

        return success({
            id: rating.id,
            taskId: rating.taskId,
            score: rating.score,
            feedback: rating.feedback,
            ratedForUserId: rating.ratedForUserId,
            createdAt: rating.createdAt,
        }, 201);
    } catch (err) {
        logger.error('Rate task error', 'tasks', err instanceof Error ? err : undefined);
        return badRequest('Failed to rate task');
    }
}