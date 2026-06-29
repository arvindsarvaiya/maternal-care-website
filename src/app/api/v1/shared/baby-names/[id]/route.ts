import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import { buildSharedSpaceActorName, notifySharedSpaceUpdate } from '@/lib/shared-space-notifications';
import { findOrCreateFamilyId } from '@/lib/family-utils';

type BabyNameRouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: BabyNameRouteContext) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await context.params;
        const familyId = await findOrCreateFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const babyName = await prisma.sharedBabyName.findFirst({
            where: { id, familyId },
            select: { id: true, name: true },
        });
        if (!babyName) return notFound('Baby name');

        const existing = await prisma.sharedBabyNameLike.findUnique({
            where: { babyNameId_userId: { babyNameId: id, userId: payload.userId } },
        });

        const liked = !existing;
        if (existing) {
            await prisma.sharedBabyNameLike.delete({
                where: { babyNameId_userId: { babyNameId: id, userId: payload.userId } },
            });
        } else {
            await prisma.sharedBabyNameLike.create({
                data: { babyNameId: id, userId: payload.userId },
            });
        }

        const actorName = await buildSharedSpaceActorName(payload.userId);
        await notifySharedSpaceUpdate({
            familyId,
            actorUserId: payload.userId,
            resourceType: 'baby_name',
            resourceId: id,
            action: liked ? 'liked' : 'unliked',
            message: liked
                ? `${actorName} liked baby name "${babyName.name}".`
                : `${actorName} removed their vote from baby name "${babyName.name}".`,
        });

        return success({ liked });
    } catch (err) {
        logger.error('Toggle shared baby name like error', 'shared-baby-names', err instanceof Error ? err : undefined);
        return badRequest('Failed to update baby name like');
    }
}

export async function DELETE(req: NextRequest, context: BabyNameRouteContext) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await context.params;
        const familyId = await findOrCreateFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const babyName = await prisma.sharedBabyName.findFirst({
            where: { id, familyId },
            select: { id: true, name: true },
        });
        if (!babyName) return notFound('Baby name');

        await prisma.sharedBabyName.delete({
            where: { id },
        });

        const actorName = await buildSharedSpaceActorName(payload.userId);
        await notifySharedSpaceUpdate({
            familyId,
            actorUserId: payload.userId,
            resourceType: 'baby_name',
            resourceId: id,
            action: 'deleted',
            message: `${actorName} deleted baby name "${babyName.name}" from Shared Space.`,
        });

        return success({ deleted: true });
    } catch (err) {
        logger.error('Delete shared baby name error', 'shared-baby-names', err instanceof Error ? err : undefined);
        return badRequest('Failed to delete baby name');
    }
}
