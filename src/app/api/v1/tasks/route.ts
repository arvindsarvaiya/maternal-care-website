import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, created, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

// ─── GET: List shared tasks for the user's family ───
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        // Find the user's family (either as mother or member)
        const familyAsMother = await prisma.family.findFirst({
            where: { motherUserId: payload.userId },
        });
        const familyMember = await prisma.familyMember.findFirst({
            where: { userId: payload.userId, inviteStatus: 'accepted' },
        });

        const familyId = familyAsMother?.id || familyMember?.familyId;
        if (!familyId) return notFound('Family');

        const url = new URL(req.url);
        const status = url.searchParams.get('status');
        const type = url.searchParams.get('type');
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '30');

        const where: any = { familyId };
        if (status) {
            where.status = { statusName: status };
        }
        if (type) {
            where.taskType = { typeName: type };
        }

        const [tasks, total] = await Promise.all([
            prisma.sharedTask.findMany({
                where,
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
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.sharedTask.count({ where }),
        ]);

        return success({
            tasks: tasks.map(t => ({
                id: t.id,
                type: t.taskType.typeName,
                status: t.status.statusName,
                title: t.title,
                description: t.description,
                dueAt: t.dueAt?.toISOString(),
                createdBy: t.createdBy,
                assignments: t.assignments.map(a => ({
                    id: a.id,
                    assignedTo: a.assignedTo,
                    completedAt: a.completedAt?.toISOString(),
                })),
                ratings: t.ratings.map(r => ({
                    id: r.id,
                    score: r.score,
                    feedback: r.feedback,
                    ratedByUserId: r.ratedByUserId,
                    ratedForUserId: r.ratedForUserId,
                    createdAt: r.createdAt,
                })),
                createdAt: t.createdAt,
                updatedAt: t.updatedAt,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        logger.error('Get shared tasks error', 'tasks', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch shared tasks');
    }
}

// ─── POST: Create shared task ───
const createTaskSchema = z.object({
    type: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    dueAt: z.string().optional(),
    assignedToUserIds: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = createTaskSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        // Find the user's family
        const familyAsMother = await prisma.family.findFirst({
            where: { motherUserId: payload.userId },
        });
        const familyMember = await prisma.familyMember.findFirst({
            where: { userId: payload.userId, inviteStatus: 'accepted' },
        });
        const familyId = familyAsMother?.id || familyMember?.familyId;
        if (!familyId) return notFound('Family');

        // Auto-assign to linked partner if no assignedToUserIds provided
        let assignedToUserIds = parsed.data.assignedToUserIds;
        if (!assignedToUserIds || assignedToUserIds.length === 0) {
            let partnerId: string | null = null;
            if (familyAsMother) {
                const partnerMember = await prisma.familyMember.findFirst({
                    where: { familyId: familyAsMother.id, memberRole: 'partner', inviteStatus: 'accepted' },
                    select: { userId: true },
                });
                partnerId = partnerMember?.userId || null;
            } else if (familyMember) {
                const family = await prisma.family.findUnique({
                    where: { id: familyMember.familyId },
                    select: { motherUserId: true },
                });
                partnerId = family?.motherUserId || null;
            }
            if (partnerId) {
                assignedToUserIds = [partnerId];
            }
        }

        // Find or create task type
        let taskType = await prisma.taskType.findUnique({
            where: { typeName: parsed.data.type },
        });
        if (!taskType) {
            taskType = await prisma.taskType.create({ data: { typeName: parsed.data.type } });
        }

        // Find or create "pending" status
        let status = await prisma.taskStatus.findUnique({
            where: { statusName: 'pending' },
        });
        if (!status) {
            status = await prisma.taskStatus.create({ data: { statusName: 'pending' } });
        }

        const task = await prisma.sharedTask.create({
            data: {
                familyId,
                taskTypeId: taskType.id,
                statusId: status.id,
                title: stripHtml(parsed.data.title),
                description: parsed.data.description ? stripHtml(parsed.data.description) : null,
                dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
                createdByUserId: payload.userId,
                assignments: assignedToUserIds?.length
                    ? {
                        create: assignedToUserIds.map(userId => ({
                            assignedToUserId: userId,
                        })),
                    }
                    : undefined,
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
            },
        });

        return created({
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
            createdAt: task.createdAt,
        });
    } catch (err) {
        logger.error('Create shared task error', 'tasks', err instanceof Error ? err : undefined);
        return badRequest('Failed to create shared task');
    }
}