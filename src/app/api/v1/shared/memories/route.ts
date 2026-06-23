import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, created, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';
import { buildSharedSpaceActorName, notifySharedSpaceUpdate } from '@/lib/shared-space-notifications';

const MAX_IMAGE_DATA_LENGTH = 900_000;

interface RawMemoryItem {
    id: string;
    title: string;
    caption: string | null;
    imageData: string | null;
    imageMimeType: string | null;
    createdAt: string;
    createdById: string;
    createdByFirstName: string | null;
    createdByLastName: string | null;
}

const memorySchema = z.object({
    title: z.string().trim().max(120).optional(),
    caption: z.string().trim().max(1000).optional(),
    imageData: z.string().max(MAX_IMAGE_DATA_LENGTH).nullable().optional(),
    imageMimeType: z.string().max(50).nullable().optional(),
}).refine(data => Boolean(data.title?.trim() || data.caption?.trim() || data.imageData), {
    message: 'Add text or an image to save this memory',
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

function mapMemoryItem(row: RawMemoryItem) {
    return {
        id: row.id,
        title: row.title,
        caption: row.caption || '',
        imageData: row.imageData,
        imageMimeType: row.imageMimeType,
        createdAt: row.createdAt,
        createdBy: {
            id: row.createdById,
            firstName: row.createdByFirstName || 'Family',
            lastName: row.createdByLastName || '',
        },
    };
}

async function listMemories(familyId: string) {
    const rows = await prisma.$queryRaw<RawMemoryItem[]>`
        SELECT
            m.id::text AS "id",
            m.title AS "title",
            m.caption AS "caption",
            m.image_data AS "imageData",
            m.image_mime_type AS "imageMimeType",
            m.created_at::text AS "createdAt",
            u.id::text AS "createdById",
            u.first_name AS "createdByFirstName",
            u.last_name AS "createdByLastName"
        FROM shared_memories m
        JOIN users u ON u.id = m.created_by_user_id
        WHERE m.family_id = ${familyId}
        ORDER BY m.created_at DESC
    `;

    return rows.map(mapMemoryItem);
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

export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        await ensureMemoriesTable();
        const familyId = await findFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        return success({ memories: await listMemories(familyId) });
    } catch (err) {
        logger.error('Get shared memories error', 'shared-memories', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch memories');
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        await ensureMemoriesTable();
        const familyId = await findFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const body = await req.json();
        const parsed = memorySchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues[0]?.message || 'Invalid memory');

        const title = stripHtml(parsed.data.title || '').trim();
        const caption = stripHtml(parsed.data.caption || '').trim();
        const { imageData, imageMimeType } = normalizeImage(parsed.data.imageData, parsed.data.imageMimeType);
        const memoryTitle = title || (caption ? caption.slice(0, 80) : 'Untitled memory');

        const memoryId = randomUUID();

        await prisma.$executeRaw`
            INSERT INTO shared_memories (id, family_id, created_by_user_id, title, caption, image_data, image_mime_type)
            VALUES (${memoryId}, ${familyId}, ${payload.userId}, ${memoryTitle}, ${caption || null}, ${imageData}, ${imageMimeType})
        `;

        const actorName = await buildSharedSpaceActorName(payload.userId);
        await notifySharedSpaceUpdate({
            familyId,
            actorUserId: payload.userId,
            resourceType: 'memory',
            resourceId: memoryId,
            action: 'created',
            message: imageData
                ? `${actorName} added memory "${memoryTitle}" with a photo.`
                : `${actorName} added memory "${memoryTitle}".`,
        });

        return created({ memories: await listMemories(familyId) });
    } catch (err) {
        logger.error('Create shared memory error', 'shared-memories', err instanceof Error ? err : undefined);
        return badRequest(err instanceof Error ? err.message : 'Failed to save memory');
    }
}
