import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, created, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';
import { buildSharedSpaceActorName, notifySharedSpaceUpdate } from '@/lib/shared-space-notifications';

interface RawWishlistItem {
    id: string;
    title: string;
    category: string | null;
    priority: string;
    done: boolean;
    created_by_user_id: string;
    created_by_first_name: string;
    created_by_last_name: string;
    created_at: Date;
    updated_at: Date;
}

async function ensureWishlistTable() {
    await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS shared_baby_wishlist_items (
            id TEXT PRIMARY KEY,
            family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
            created_by_user_id TEXT NOT NULL REFERENCES users(id),
            title TEXT NOT NULL,
            category TEXT,
            priority TEXT NOT NULL DEFAULT 'medium',
            done BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);
}

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

function mapWishlistItem(row: RawWishlistItem) {
    return {
        id: row.id,
        title: row.title,
        category: row.category ?? '',
        priority: row.priority,
        done: row.done,
        createdBy: {
            id: row.created_by_user_id,
            firstName: row.created_by_first_name,
            lastName: row.created_by_last_name,
        },
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

async function listWishlistItems(familyId: string) {
    const rows = await prisma.$queryRaw<RawWishlistItem[]>`
        SELECT
            w.id::text,
            w.title,
            w.category,
            w.priority,
            w.done,
            w.created_by_user_id::text,
            u.first_name AS created_by_first_name,
            u.last_name AS created_by_last_name,
            w.created_at,
            w.updated_at
        FROM shared_baby_wishlist_items w
        JOIN users u ON u.id = w.created_by_user_id
        WHERE w.family_id = ${familyId}
        ORDER BY w.done ASC, w.created_at DESC
    `;

    return rows.map(mapWishlistItem);
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

        await ensureWishlistTable();
        const familyId = await findFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

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

        await ensureWishlistTable();
        const familyId = await findFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const itemId = randomUUID();
        const title = stripHtml(parsed.data.title).trim();
        const category = stripHtml(parsed.data.category).trim();

        await prisma.$executeRaw`
            INSERT INTO shared_baby_wishlist_items (id, family_id, created_by_user_id, title, category, priority)
            VALUES (
                ${itemId},
                ${familyId},
                ${payload.userId},
                ${title},
                ${category || null},
                ${parsed.data.priority}
            )
        `;

        const actorName = await buildSharedSpaceActorName(payload.userId);
        await notifySharedSpaceUpdate({
            familyId,
            actorUserId: payload.userId,
            resourceType: 'wishlist_item',
            resourceId: itemId,
            action: 'created',
            message: `${actorName} added "${title}" to the baby wishlist.`,
        });

        return created({ items: await listWishlistItems(familyId) });
    } catch (err) {
        logger.error('Create shared baby wishlist item error', 'shared-baby-wishlist', err instanceof Error ? err : undefined);
        return badRequest('Failed to add baby wishlist item');
    }
}
