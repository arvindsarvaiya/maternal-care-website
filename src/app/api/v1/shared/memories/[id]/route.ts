import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';
import { buildSharedSpaceActorName, notifySharedSpaceUpdate } from '@/lib/shared-space-notifications';
import { findOrCreateFamilyId } from '@/lib/family-utils';

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
        const familyId = await findOrCreateFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const memory = await prisma.sharedMemory.findFirst({
            where: { id, familyId },
            select: { id: true, title: true },
        });
        if (!memory) return notFound('Memory');

        const body = await req.json();
        const parsed = memoryUpdateSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues[0]?.message || 'Invalid memory');

        const title = parsed.data.title === undefined ? undefined : stripHtml(parsed.data.title).trim();
        const caption = parsed.data.caption === undefined ? undefined : stripHtml(parsed.data.caption).trim();
        const normalized = normalizeImage(parsed.data.imageData, parsed.data.imageMimeType);

        const updateData: Record<string, unknown> = {};

        if (title !== undefined) {
            updateData.title = title;
        }

        if (caption !== undefined) {
            updateData.caption = caption || null;
        }

        if (parsed.data.removeImage === true) {
            updateData.imageData = null;
            updateData.imageMimeType = null;
        } else if (parsed.data.imageData !== undefined) {
            updateData.imageData = normalized.imageData;
            updateData.imageMimeType = normalized.imageMimeType;
        }

        await prisma.sharedMemory.update({
            where: { id },
            data: updateData,
        });

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
        const familyId = await findOrCreateFamilyId(payload.userId);
        if (!familyId) return notFound('Family');

        const memory = await prisma.sharedMemory.findFirst({
            where: { id, familyId },
            select: { id: true, title: true },
        });
        if (!memory) return notFound('Memory');

        await prisma.sharedMemory.delete({
            where: { id },
        });

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
