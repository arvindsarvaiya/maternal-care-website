import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, created, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';
import { buildSharedSpaceActorName, notifySharedSpaceUpdate } from '@/lib/shared-space-notifications';
import { findOrCreateFamilyId } from '@/lib/family-utils';

async function listWishlistItems(familyId: string) {
    const items = await prisma.sharedBabyWishlistItem.findMany({
        where: { familyId },
        include: {
            createdBy: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: [{ done: 'asc' }, { createdAt: 'desc' }],
    });

    return items.map(w => ({
        id: w.id,
        title: w.title,
        category: w.category ?? '',
        priority: w.priority,
        done: w.done,
        createdBy: {
            id: w.createdBy.id,
            firstName: w.createdBy.firstName,
            lastName: w.createdBy.lastName,
        },
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
    }));
}

const createWishlistItemSchema = z.object({
    title: z.string().min(1).max(100),
    category: z.string().max(60).optional().default(''),
    priority: z.enum(['high', 'medium', 'low']).optional().default('medium'),
});

export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const familyId = await findOrCreateFamilyId(payload.userId);
        if (!familyId) return success({ items: [] });

        return success({ items: await listWishlistItems(familyId) });
    } catch (err) {
        logger.error('Get shared baby wishlist error', 'shared-baby-wishlist', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch baby wishlist');
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = createWishlistItemSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        const familyId = await findOrCreateFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const title = stripHtml(parsed.data.title).trim();
        const category = stripHtml(parsed.data.category).trim();

        const item = await prisma.sharedBabyWishlistItem.create({
            data: {
                familyId,
                createdByUserId: payload.userId,
                title,
                category: category || null,
                priority: parsed.data.priority,
            },
        });

        const actorName = await buildSharedSpaceActorName(payload.userId);
        await notifySharedSpaceUpdate({
            familyId,
            actorUserId: payload.userId,
            resourceType: 'wishlist_item',
            resourceId: item.id,
            action: 'created',
            message: `${actorName} added "${title}" to the baby wishlist.`,
        });

        return created({ items: await listWishlistItems(familyId) });
    } catch (err) {
        logger.error('Create shared baby wishlist item error', 'shared-baby-wishlist', err instanceof Error ? err : undefined);
        return badRequest('Failed to add baby wishlist item');
    }
}
