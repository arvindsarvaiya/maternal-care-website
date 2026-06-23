import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import { buildSharedSpaceActorName, notifySharedSpaceUpdate } from '@/lib/shared-space-notifications';

async function findFamilyId(userId: string): Promise<string | null> {
    const familyAsMother = await prisma.family.findFirst({
        where: { motherUserId: userId },
        select: { id: true },
    });
    if (familyAsMother) return familyAsMother.id;

    const familyMember = await prisma.familyMember.findFirst({
        where: { userId, inviteStatus: 'accepted' },
        select: { familyId: true },
    });
    return familyMember?.familyId ?? null;
}

async function getWishlistItemForFamily(itemId: string, familyId: string): Promise<{ id: string; title: string; done: boolean } | null> {
    const rows = await prisma.$queryRaw<Array<{ id: string; title: string; done: boolean }>>`
        SELECT id::text, title, done
        FROM shared_baby_wishlist_items
        WHERE id = ${itemId} AND family_id = ${familyId}
        LIMIT 1
    `;
    return rows[0] ?? null;
}

type WishlistRouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: WishlistRouteContext) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await context.params;
        const familyId = await findFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const item = await getWishlistItemForFamily(id, familyId);
        if (!item) return notFound('Baby wishlist item');

        await prisma.$executeRaw`
            UPDATE shared_baby_wishlist_items
            SET done = NOT done,
                updated_at = NOW()
            WHERE id = ${id} AND family_id = ${familyId}
        `;

        const markedDone = !item.done;
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
        const familyId = await findFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const item = await getWishlistItemForFamily(id, familyId);
        if (!item) return notFound('Baby wishlist item');

        await prisma.$executeRaw`
            DELETE FROM shared_baby_wishlist_items
            WHERE id = ${id} AND family_id = ${familyId}
        `;

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
