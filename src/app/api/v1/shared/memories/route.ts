import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, created, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';
import { buildSharedSpaceActorName, notifySharedSpaceUpdate } from '@/lib/shared-space-notifications';
import { findOrCreateFamilyId } from '@/lib/family-utils';

const MAX_IMAGE_DATA_LENGTH = 900_000;

const memorySchema = z.object({
    title: z.string().trim().max(120).optional(),
    caption: z.string().trim().max(1000).optional(),
    imageData: z.string().max(MAX_IMAGE_DATA_LENGTH).nullable().optional(),
    imageMimeType: z.string().max(50).nullable().optional(),
}).refine(data => Boolean(data.title?.trim() || data.caption?.trim() || data.imageData), {
    message: 'Add text or an image to save this memory',
});

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

async function listMemories(familyId: string) {
    const memories = await prisma.sharedMemory.findMany({
        where: { familyId },
        orderBy: { createdAt: 'desc' },
        include: {
            createdBy: {
                select: { id: true, firstName: true, lastName: true },
            },
        },
    });

    return memories.map(memory => ({
        id: memory.id,
        title: memory.title,
        caption: memory.caption || '',
        imageData: memory.imageData,
        imageMimeType: memory.imageMimeType,
        createdAt: memory.createdAt.toISOString(),
        createdBy: {
            id: memory.createdBy.id,
            firstName: memory.createdBy.firstName || 'Family',
            lastName: memory.createdBy.lastName || '',
        },
    }));
}

export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const familyId = await findOrCreateFamilyId(payload.userId);
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

        const familyId = await findOrCreateFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const body = await req.json();
        const parsed = memorySchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues[0]?.message || 'Invalid memory');

        const title = stripHtml(parsed.data.title || '').trim();
        const caption = stripHtml(parsed.data.caption || '').trim();
        const { imageData, imageMimeType } = normalizeImage(parsed.data.imageData, parsed.data.imageMimeType);
        const memoryTitle = title || (caption ? caption.slice(0, 80) : 'Untitled memory');

        await prisma.sharedMemory.create({
            data: {
                familyId,
                createdByUserId: payload.userId,
                title: memoryTitle,
                caption: caption || null,
                imageData,
                imageMimeType,
            },
        });

        const actorName = await buildSharedSpaceActorName(payload.userId);
        await notifySharedSpaceUpdate({
            familyId,
            actorUserId: payload.userId,
            resourceType: 'memory',
            resourceId: memoryTitle,
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
