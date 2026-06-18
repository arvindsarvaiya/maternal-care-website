import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, created, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { stripHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

// ─── GET: List shared notes for the user's family ───
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        // Find the user's family (either as mother or member)
        const familyAsMother = await prisma.family.findFirst({
            where: { motherUserId: payload.userId },
        });
        const familyMember = await prisma.familyMember.findFirst({
            where: { userId: payload.userId, inviteStatus: 'accepted' },
        });

        const familyId = familyAsMother?.id || familyMember?.familyId;
        if (!familyId) return notFound('Family');

        const url = new URL(req.url);
        const visibility = url.searchParams.get('visibility');
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '30');

        const where: any = { familyId };
        if (visibility) {
            where.visibilitySetting = { visibilityName: visibility };
        }

        const [notes, total] = await Promise.all([
            prisma.sharedNote.findMany({
                where,
                include: {
                    visibilitySetting: { select: { visibilityName: true } },
                    createdBy: { select: { id: true, firstName: true, lastName: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.sharedNote.count({ where }),
        ]);

        return success({
            notes: notes.map(n => ({
                id: n.id,
                title: n.title,
                body: n.body,
                visibility: n.visibilitySetting.visibilityName,
                createdBy: n.createdBy,
                createdAt: n.createdAt,
                updatedAt: n.updatedAt,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        logger.error('Get shared notes error', 'notes', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch shared notes');
    }
}

// ─── POST: Create shared note ───
const createNoteSchema = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    visibility: z.string().default('shared'),
});

export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const body = await req.json();
        const parsed = createNoteSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        // Find the user's family
        const familyAsMother = await prisma.family.findFirst({
            where: { motherUserId: payload.userId },
        });
        const familyMember = await prisma.familyMember.findFirst({
            where: { userId: payload.userId, inviteStatus: 'accepted' },
        });
        const familyId = familyAsMother?.id || familyMember?.familyId;
        if (!familyId) return notFound('Family');

        // Find or create visibility setting
        let visibilitySetting = await prisma.noteVisibilitySetting.findUnique({
            where: { visibilityName: parsed.data.visibility },
        });
        if (!visibilitySetting) {
            visibilitySetting = await prisma.noteVisibilitySetting.create({
                data: { visibilityName: parsed.data.visibility },
            });
        }

        const note = await prisma.sharedNote.create({
            data: {
                familyId,
                createdByUserId: payload.userId,
                visibilitySettingId: visibilitySetting.id,
                title: stripHtml(parsed.data.title),
                body: stripHtml(parsed.data.body),
            },
            include: {
                visibilitySetting: { select: { visibilityName: true } },
                createdBy: { select: { id: true, firstName: true, lastName: true } },
            },
        });

        return created({
            id: note.id,
            title: note.title,
            body: note.body,
            visibility: note.visibilitySetting.visibilityName,
            createdBy: note.createdBy,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
        });
    } catch (err) {
        logger.error('Create shared note error', 'notes', err instanceof Error ? err : undefined);
        return badRequest('Failed to create shared note');
    }
}