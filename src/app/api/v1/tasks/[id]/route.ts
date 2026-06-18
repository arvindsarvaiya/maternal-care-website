import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized, forbidden } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

// ─── PUT: Update shared task ───
const updateTaskSchema = z.object({
    type: z.string().min(1).optional(),
    status: z.string().optional(),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    dueAt: z.string().nullable().optional(),
    assignedToUserIds: z.array(z.string()).optional(),
    completeAssignment: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await params;
        const body = await req.json();
        const parsed = updateTaskSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        // Verify task exists and user has access (via family)
        const existing = await prisma.sharedTask.findUnique({
            where: { id },
            include: { family: { include: { members: { where: { userId: payload.userId, inviteStatus: 'accepted' } } } } },
        });

        if (!existing) return notFound('Task');
        if (existing.family.motherUserId !== payload.userId) {
            return forbidden();
        }

        // Resolve type if provided
        let taskTypeId: string | undefined;
        if (parsed.data.type) {
            let taskType = await prisma.taskType.findUnique({ where: { typeName: parsed.data.type } });
            if (!taskType) {
                taskType = await prisma.taskType.create({ data: { typeName: parsed.data.type } });
            }
            taskTypeId = taskType.id;
        }

        // Resolve status if provided
        let statusId: string | undefined;
        let previousStatusId: string | undefined;
        if (parsed.data.status) {
            // Get previous status to check if changing to 'done'
            previousStatusId = existing.statusId;
            let status = await prisma.taskStatus.findUnique({ where: { statusName: parsed.data.status } });
            if (!status) {
                status = await prisma.taskStatus.create({ data: { statusName: parsed.data.status } });
            }
            statusId = status.id;
        }

        // Handle assignment completion
        if (parsed.data.completeAssignment) {
            await prisma.taskAssignment.updateMany({
                where: { taskId: id, assignedToUserId: payload.userId },
                data: { completedAt: new Date() },
            });
        }

        // Auto-set completedAt when status changes to 'done'
        if (statusId && previousStatusId && statusId !== previousStatusId) {
            const newStatus = await prisma.taskStatus.findUnique({ where: { id: statusId } });
            if (newStatus?.statusName === 'done') {
                await prisma.taskAssignment.updateMany({
                    where: { taskId: id, assignedToUserId: payload.userId },
                    data: { completedAt: new Date() },
                });
            }
        }

        // Handle re-assigning users
        if (parsed.data.assignedToUserIds !== undefined) {
            // Delete existing assignments and recreate
            await prisma.taskAssignment.deleteMany({ where: { taskId: id } });
            if (parsed.data.assignedToUserIds.length > 0) {
                await prisma.taskAssignment.createMany({
                    data: parsed.data.assignedToUserIds.map(userId => ({
                        taskId: id,
                        assignedToUserId: userId,
                    })),
                });
            }
        }

        const task = await prisma.sharedTask.update({
            where: { id },
            data: {
                ...(taskTypeId && { taskTypeId }),
                ...(statusId && { statusId }),
                ...(parsed.data.title !== undefined && { title: stripHtml(parsed.data.title) }),
                ...(parsed.data.description !== undefined && { description: parsed.data.description ? stripHtml(parsed.data.description) : null }),
                ...(parsed.data.dueAt !== undefined && { dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null }),
            },
            include: {
                taskType: { select: { typeName: true } },
                status: { select: { statusName: true } },
                createdBy: { select: { id: true, firstName: true, lastName: true } },
                assignments: {
                    include: {
                        assignedTo: { select: { id: true, firstName: true, lastName: true } },
                    },
                },
                ratings: {
                    select: {
                        id: true,
                        score: true,
                        feedback: true,
                        ratedByUserId: true,
                        ratedForUserId: true,
                        createdAt: true,
                    },
                },
            },
        });

        return success({
            id: task.id,
            type: task.taskType.typeName,
            status: task.status.statusName,
            title: task.title,
            description: task.description,
            dueAt: task.dueAt?.toISOString(),
            createdBy: task.createdBy,
            assignments: task.assignments.map(a => ({
                id: a.id,
                assignedTo: a.assignedTo,
                completedAt: a.completedAt?.toISOString(),
            })),
            ratings: task.ratings.map(r => ({
                id: r.id,
                score: r.score,
                feedback: r.feedback,
                ratedByUserId: r.ratedByUserId,
                ratedForUserId: r.ratedForUserId,
                createdAt: r.createdAt,
            })),
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        });
    } catch (err) {
        logger.error('Update shared task error', 'tasks', err instanceof Error ? err : undefined);
        return badRequest('Failed to update shared task');
    }
}

// ─── DELETE: Delete shared task ───
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await params;

        // Verify task exists and user has access
        const existing = await prisma.sharedTask.findUnique({
            where: { id },
            include: { family: { include: { members: { where: { userId: payload.userId, inviteStatus: 'accepted' } } } } },
        });

        if (!existing) return notFound('Task');
        if (existing.family.motherUserId !== payload.userId) {
            return forbidden();
        }

        await prisma.sharedTask.delete({ where: { id } });

        return success({ deleted: true });
    } catch (err) {
        logger.error('Delete shared task error', 'tasks', err instanceof Error ? err : undefined);
        return badRequest('Failed to delete shared task');
    }
}