import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, created, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';
import { buildSharedSpaceActorName, notifySharedSpaceUpdate } from '@/lib/shared-space-notifications';
import { findOrCreateFamilyId } from '@/lib/family-utils';

async function listNames(familyId: string, userId: string) {
    const names = await prisma.sharedBabyName.findMany({
        where: { familyId },
        include: {
            createdBy: { select: { id: true, firstName: true, lastName: true } },
            likes: { where: { userId } },
            _count: { select: { likes: true } },
        },
        orderBy: [{ likes: { _count: 'desc' } }, { createdAt: 'desc' }],
    });

    return names.map(n => ({
        id: n.id,
        name: n.name,
        meaning: n.meaning ?? '',
        votes: n._count.likes,
        liked: n.likes.length > 0,
        createdBy: {
            id: n.createdBy.id,
            firstName: n.createdBy.firstName,
            lastName: n.createdBy.lastName,
        },
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
    }));
}

const createBabyNameSchema = z.object({
    name: z.string().min(1).max(60),
    meaning: z.string().max(160).optional().default(''),
});

export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const familyId = await findOrCreateFamilyId(payload.userId);
        if (!familyId) return success({ names: [] });

        return success({ names: await listNames(familyId, payload.userId) });
    } catch (err) {
        logger.error('Get shared baby names error', 'shared-baby-names', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch baby names');
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = createBabyNameSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        const familyId = await findOrCreateFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const name = stripHtml(parsed.data.name).trim();
        const meaning = stripHtml(parsed.data.meaning).trim();

        const babyName = await prisma.sharedBabyName.create({
            data: {
                familyId,
                createdByUserId: payload.userId,
                name,
                meaning: meaning || null,
            },
        });

        const actorName = await buildSharedSpaceActorName(payload.userId);
        await notifySharedSpaceUpdate({
            familyId,
            actorUserId: payload.userId,
            resourceType: 'baby_name',
            resourceId: babyName.id,
            action: 'created',
            message: `${actorName} added baby name "${name}" to Shared Space.`,
        });

        return created({ names: await listNames(familyId, payload.userId) });
    } catch (err) {
        logger.error('Create shared baby name error', 'shared-baby-names', err instanceof Error ? err : undefined);
        return badRequest('Failed to add baby name');
    }
}
