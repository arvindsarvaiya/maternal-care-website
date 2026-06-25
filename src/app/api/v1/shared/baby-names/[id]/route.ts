import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import { buildSharedSpaceActorName, notifySharedSpaceUpdate } from '@/lib/shared-space-notifications';
import { findOrCreateFamilyId } from '@/lib/family-utils';

async function getBabyNameForFamily(nameId: string, familyId: string): Promise<{ id: string; name: string } | null> {
    const rows = await prisma.$queryRaw<Array<{ id: string; name: string }>>`
        SELECT id::text, name
        FROM shared_baby_names
        WHERE id = ${nameId} AND family_id = ${familyId}
        LIMIT 1
    `;
    return rows[0] ?? null;
}

type BabyNameRouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: BabyNameRouteContext) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await context.params;
        const familyId = await findOrCreateFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const babyName = await getBabyNameForFamily(id, familyId);
        if (!babyName) return notFound('Baby name');

        const existing = await prisma.$queryRaw<Array<{ user_id: string }>>`
            SELECT user_id::text
            FROM shared_baby_name_likes
            WHERE baby_name_id = ${id} AND user_id = ${payload.userId}
            LIMIT 1
        `;

        const liked = existing.length === 0;
        if (!liked) {
            await prisma.$executeRaw`
                DELETE FROM shared_baby_name_likes
                WHERE baby_name_id = ${id} AND user_id = ${payload.userId}
            `;
        } else {
            await prisma.$executeRaw`
                INSERT INTO shared_baby_name_likes (baby_name_id, user_id)
                VALUES (${id}, ${payload.userId})
                ON CONFLICT (baby_name_id, user_id) DO NOTHING
            `;
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

        const babyName = await getBabyNameForFamily(id, familyId);
        if (!babyName) return notFound('Baby name');

        await prisma.$executeRaw`
            DELETE FROM shared_baby_names
            WHERE id = ${id} AND family_id = ${familyId}
        `;

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
