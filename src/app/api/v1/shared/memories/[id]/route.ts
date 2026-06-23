import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';
import { buildSharedSpaceActorName, notifySharedSpaceUpdate } from '@/lib/shared-space-notifications';

const MAX_IMAGE_DATA_LENGTH = 900_000;

type MemoryRouteContext = { params: Promise<{ id: string }> };

const memoryUpdateSchema = z.object({
    title: z.string().trim().max(120).optional(),
    caption: z.string().trim().max(1000).optional(),
    imageData: z.string().max(MAX_IMAGE_DATA_LENGTH).nullable().optional(),
    imageMimeType: z.string().max(50).nullable().optional(),
    removeImage: z.boolean().optional(),
}).refine(data => Boolean(data.title?.trim() || data.caption?.trim() || data.imageData || data.removeImage), {
    message: 'Add text or an image to update this memory',
});

async function ensureMemoriesTable() {
    await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS shared_memories (
            id TEXT PRIMARY KEY,
            family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
            created_by_user_id TEXT NOT NULL REFERENCES users(id),
            title TEXT NOT NULL,
            caption TEXT,
            image_data TEXT,
            image_mime_type TEXT,
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

async function getMemoryForFamily(memoryId: string, familyId: string): Promise<{ id: string; title: string } | null> {
    await ensureMemoriesTable();
    const rows = await prisma.$queryRaw<Array<{ id: string; title: string }>>`
        SELECT id::text, title
        FROM shared_memories
        WHERE id = ${memoryId} AND family_id = ${familyId}
        LIMIT 1
    `;
    return rows[0] ?? null;
}

function normalizeImage(imageData?: string | null, imageMimeType?: string | null) {
    const cleanImageData = imageData?.trim() || null;
    if (!cleanImageData) return { imageData: null, imageMimeType: null };

    if (!cleanImageData.startsWith('data:image/')) {
        throw new Error('Only image uploads are supported');
    }

    return {
        imageData: cleanImageData,
        imageMimeType: imageMimeType?.trim() || cleanImageData.slice(5, cleanImageData.indexOf(';')) || 'image/jpeg',
    };
}

export async function PATCH(req: NextRequest, context: MemoryRouteContext) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await context.params;
        const familyId = await findFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const memory = await getMemoryForFamily(id, familyId);
        if (!memory) return notFound('Memory');

        const body = await req.json();
        const parsed = memoryUpdateSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues[0]?.message || 'Invalid memory');

        const title = parsed.data.title === undefined ? undefined : stripHtml(parsed.data.title).trim();
        const caption = parsed.data.caption === undefined ? undefined : stripHtml(parsed.data.caption).trim();
        const normalized = normalizeImage(parsed.data.imageData, parsed.data.imageMimeType);

        await prisma.$executeRaw`
            UPDATE shared_memories
            SET title = COALESCE(${title || null}, title),
                caption = CASE WHEN ${caption === undefined} THEN caption ELSE ${caption || null} END,
                image_data = CASE
                    WHEN ${parsed.data.removeImage === true} THEN NULL
                    WHEN ${parsed.data.imageData === undefined} THEN image_data
                    ELSE ${normalized.imageData}
                END,
                image_mime_type = CASE
                    WHEN ${parsed.data.removeImage === true} THEN NULL
                    WHEN ${parsed.data.imageData === undefined} THEN image_mime_type
                    ELSE ${normalized.imageMimeType}
                END,
                updated_at = NOW()
            WHERE id = ${id} AND family_id = ${familyId}
        `;

        const updatedTitle = title || memory.title;
        const actorName = await buildSharedSpaceActorName(payload.userId);
        await notifySharedSpaceUpdate({
            familyId,
            actorUserId: payload.userId,
            resourceType: 'memory',
            resourceId: id,
            action: 'updated',
            message: `${actorName} updated memory "${updatedTitle}".`,
        });

        return success({ updated: true });
    } catch (err) {
        logger.error('Update shared memory error', 'shared-memories', err instanceof Error ? err : undefined);
        return badRequest(err instanceof Error ? err.message : 'Failed to update memory');
    }
}

export async function DELETE(req: NextRequest, context: MemoryRouteContext) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await context.params;
        const familyId = await findFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const memory = await getMemoryForFamily(id, familyId);
        if (!memory) return notFound('Memory');

        await prisma.$executeRaw`
            DELETE FROM shared_memories
            WHERE id = ${id} AND family_id = ${familyId}
        `;

        const actorName = await buildSharedSpaceActorName(payload.userId);
        await notifySharedSpaceUpdate({
            familyId,
            actorUserId: payload.userId,
            resourceType: 'memory',
            resourceId: id,
            action: 'deleted',
            message: `${actorName} deleted memory "${memory.title}".`,
        });

        return success({ deleted: true });
    } catch (err) {
        logger.error('Delete shared memory error', 'shared-memories', err instanceof Error ? err : undefined);
        return badRequest('Failed to delete memory');
    }
}
