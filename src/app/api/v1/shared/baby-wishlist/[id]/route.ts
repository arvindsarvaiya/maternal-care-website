import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import { buildSharedSpaceActorName, notifySharedSpaceUpdate } from '@/lib/shared-space-notifications';
import { findOrCreateFamilyId } from '@/lib/family-utils';

type WishlistRouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: WishlistRouteContext) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await context.params;
        const familyId = await findOrCreateFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const item = await prisma.sharedBabyWishlistItem.findFirst({
            where: { id, familyId },
            select: { id: true, title: true, done: true },
        });
        if (!item) return notFound('Baby wishlist item');

        const updated = await prisma.sharedBabyWishlistItem.update({
            where: { id },
            data: { done: !item.done },
        });

        const markedDone = updated.done;
        const actorName = await buildSharedSpaceActorName(payload.userId);
        await notifySharedSpaceUpdate({
            familyId,
            actorUserId: payload.userId,
            resourceType: 'wishlist_item',
            resourceId: id,
            action: markedDone ? 'completed' : 'reopened',
            message: markedDone
                ? `${actorName} marked "${item.title}" as ready in the baby wishlist.`
                : `${actorName} marked "${item.title}" as pending in the baby wishlist.`,
        });

        return success({ updated: true });
    } catch (err) {
        logger.error('Update shared baby wishlist item error', 'shared-baby-wishlist', err instanceof Error ? err : undefined);
        return badRequest('Failed to update baby wishlist item');
    }
}

export async function DELETE(req: NextRequest, context: WishlistRouteContext) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await context.params;
        const familyId = await findOrCreateFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const item = await prisma.sharedBabyWishlistItem.findFirst({
            where: { id, familyId },
            select: { id: true, title: true },
        });
        if (!item) return notFound('Baby wishlist item');

        await prisma.sharedBabyWishlistItem.delete({
            where: { id },
        });

        const actorName = await buildSharedSpaceActorName(payload.userId);
        await notifySharedSpaceUpdate({
            familyId,
            actorUserId: payload.userId,
            resourceType: 'wishlist_item',
            resourceId: id,
            action: 'deleted',
            message: `${actorName} removed "${item.title}" from the baby wishlist.`,
        });

        return success({ deleted: true });
    } catch (err) {
        logger.error('Delete shared baby wishlist item error', 'shared-baby-wishlist', err instanceof Error ? err : undefined);
        return badRequest('Failed to delete baby wishlist item');
    }
}
