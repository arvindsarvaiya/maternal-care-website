import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';
import { notifySharedSpaceUpdate } from '@/lib/shared-space-notifications';

// ─── PUT: Update shared note ───
const updateNoteSchema = z.object({
    title: z.string().min(1).optional(),
    body: z.string().min(1).optional(),
    visibility: z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await params;
        const body = await req.json();
        const parsed = updateNoteSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        // Verify note exists and user has access
        const existing = await prisma.sharedNote.findUnique({
            where: { id },
            include: {
                visibilitySetting: { select: { visibilityName: true } },
                family: { include: { members: { where: { userId: payload.userId, inviteStatus: 'accepted' } } } },
            },
        });

        if (!existing) return notFound('Note');
        if (existing.family.motherUserId !== payload.userId && existing.family.members.length === 0) {
            return notFound('Note');
        }
        if (existing.visibilitySetting.visibilityName === 'private' && existing.createdByUserId !== payload.userId) {
            return notFound('Note');
        }

        // Resolve visibility if provided
        let visibilitySettingId: string | undefined;
        if (parsed.data.visibility) {
            let visibilitySetting = await prisma.noteVisibilitySetting.findUnique({
                where: { visibilityName: parsed.data.visibility },
            });
            if (!visibilitySetting) {
                visibilitySetting = await prisma.noteVisibilitySetting.create({
                    data: { visibilityName: parsed.data.visibility },
                });
            }
            visibilitySettingId = visibilitySetting.id;
        }

        const note = await prisma.sharedNote.update({
            where: { id },
            data: {
                ...(parsed.data.title !== undefined && { title: stripHtml(parsed.data.title) }),
                ...(parsed.data.body !== undefined && { body: stripHtml(parsed.data.body) }),
                ...(visibilitySettingId && { visibilitySettingId }),
            },
            include: {
                visibilitySetting: { select: { visibilityName: true } },
                createdBy: { select: { id: true, firstName: true, lastName: true } },
            },
        });

        const previousVisibility = existing.visibilitySetting.visibilityName;
        const nextVisibility = note.visibilitySetting.visibilityName;
        if (previousVisibility === 'private' && nextVisibility !== 'private') {
            await notifySharedSpaceUpdate({
                familyId: existing.familyId,
                actorUserId: payload.userId,
                resourceType: 'note',
                resourceId: note.id,
                action: 'shared',
                title: 'A private note was shared',
                message: `${note.createdBy.firstName || 'Mother'} shared a note: ${note.title}`,
            });
        }

        return success({
            id: note.id,
            title: note.title,
            body: note.body,
            visibility: nextVisibility,
            createdBy: note.createdBy,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
        });
    } catch (err) {
        logger.error('Update shared note error', 'notes', err instanceof Error ? err : undefined);
        return badRequest('Failed to update shared note');
    }
}

// ─── DELETE: Delete shared note ───
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const { id } = await params;

        const existing = await prisma.sharedNote.findUnique({
            where: { id },
            include: {
                visibilitySetting: { select: { visibilityName: true } },
                family: { include: { members: { where: { userId: payload.userId, inviteStatus: 'accepted' } } } },
            },
        });

        if (!existing) return notFound('Note');
        if (existing.family.motherUserId !== payload.userId && existing.family.members.length === 0) {
            return notFound('Note');
        }
        if (existing.visibilitySetting.visibilityName === 'private' && existing.createdByUserId !== payload.userId) {
            return notFound('Note');
        }

        await prisma.sharedNote.delete({ where: { id } });

        return success({ deleted: true });
    } catch (err) {
        logger.error('Delete shared note error', 'notes', err instanceof Error ? err : undefined);
        return badRequest('Failed to delete shared note');
    }
}