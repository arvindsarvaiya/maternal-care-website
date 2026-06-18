import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, badRequest, notFound, unauthorized } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

// ─── GET: List week content for the user's language ───
// Supports contentType query param: 'pregnancy' (default) or 'postpartum'
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const url = new URL(req.url);
        const week = url.searchParams.get('week');
        const languageCode = url.searchParams.get('language') || 'en';
        const contentType = url.searchParams.get('contentType') || 'pregnancy'; // 'pregnancy' | 'postpartum'
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '42');

        const language = await prisma.language.findUnique({ where: { code: languageCode } });

        if (contentType === 'postpartum') {
            // ── Postpartum content ──
            const where: any = {};
            if (week) {
                where.weekNumber = parseInt(week);
            }
            if (language) {
                where.languageId = language.id;
            }

            const [content, total] = await Promise.all([
                prisma.postpartumWeekContent.findMany({
                    where,
                    orderBy: { weekNumber: 'asc' },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                prisma.postpartumWeekContent.count({ where }),
            ]);

            return success({
                contentType: 'postpartum',
                content: content.map(c => ({
                    id: c.id,
                    weekNumber: c.weekNumber,
                    title: c.title,
                    summary: c.summary,
                    bodyMarkdown: c.bodyMarkdown,
                    recoveryNotes: c.recoveryNotes,
                    babyCareNotes: c.babyCareNotes,
                    mentalHealthNotes: c.mentalHealthNotes,
                    activityNotes: c.activityNotes,
                    warningSigns: c.warningSigns,
                    createdAt: c.createdAt,
                    updatedAt: c.updatedAt,
                })),
                total,
                page,
                totalPages: Math.ceil(total / limit),
            });
        }

        // ── Pregnancy content (default) ──
        const where: any = {};
        if (week) {
            where.weekNumber = parseInt(week);
        }
        if (language) {
            where.languageId = language.id;
        }

        const [content, total] = await Promise.all([
            prisma.weekContent.findMany({
                where,
                orderBy: { weekNumber: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.weekContent.count({ where }),
        ]);

        return success({
            contentType: 'pregnancy',
            content: content.map(c => ({
                id: c.id,
                weekNumber: c.weekNumber,
                title: c.title,
                summary: c.summary,
                bodyMarkdown: c.bodyMarkdown,
                dietNotes: c.dietNotes,
                activityNotes: c.activityNotes,
                warningSigns: c.warningSigns,
                createdAt: c.createdAt,
                updatedAt: c.updatedAt,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        logger.error('Get week content error', 'weekly-journey', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch week content');
    }
}