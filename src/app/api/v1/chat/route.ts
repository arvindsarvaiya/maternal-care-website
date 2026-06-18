import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAuthPayload, success, created, badRequest, unauthorized } from '@/lib/api-utils';
import { handleChatbotMessage, getChatHistory } from '@/lib/chatbot';
import { logger } from '@/lib/logger';
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';
import { stripHtml } from '@/lib/sanitize';

// ─── GET: Get chat history for a session ───
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        const url = new URL(req.url);
        const sessionId = url.searchParams.get('sessionId');
        const mode = url.searchParams.get('mode') || 'mother';

        if (sessionId) {
            const messages = await getChatHistory(sessionId);
            return success({ sessionId, messages });
        }

        const sessions = await prisma.chatbotSession.findMany({
            where: { userId: payload.userId, mode },
            orderBy: { startedAt: 'desc' },
            take: 10,
            include: {
                _count: { select: { messages: true } },
            },
        });

        return success({
            sessions: sessions.map(s => ({
                id: s.id,
                mode: s.mode,
                startedAt: s.startedAt,
                endedAt: s.endedAt,
                messageCount: s._count.messages,
            })),
        });
    } catch (err) {
        logger.error('Get chat error', 'chat', err instanceof Error ? err : undefined);
        return badRequest('Failed to fetch chat data');
    }
}

// ─── POST: Send a message to the chatbot ───
const sendMessageSchema = z.object({
    message: z.string().min(1).max(2000, 'Message must be at most 2000 characters'),
    sessionId: z.string().nullable().optional(),
    mode: z.enum(['mother', 'partner', 'shared', 'admin_safe']).default('mother'),
});

export async function POST(req: NextRequest) {
    try {
        const payload = await getAuthPayload(req);
        if (!payload) return unauthorized();

        // Rate limiting: 20 messages per minute per IP
        const ip = getClientIP(req);
        const rl = rateLimit(ip, RATE_LIMITS.CHAT);
        if (!rl.allowed) {
            return NextResponse.json(
                { error: rl.message },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
                        'X-RateLimit-Remaining': '0',
                    },
                }
            );
        }

        const body = await req.json();
        const parsed = sendMessageSchema.safeParse(body);
        if (!parsed.success) return badRequest(parsed.error.issues.map(i => i.message).join('; '));

        const response = await handleChatbotMessage({
            userId: payload.userId,
            message: stripHtml(parsed.data.message),
            mode: parsed.data.mode,
            sessionId: parsed.data.sessionId ?? undefined,
        });

        return created(response);
    } catch (err) {
        logger.error('Chat send error', 'chat', err instanceof Error ? err : undefined);
        return badRequest('Failed to send message');
    }
}

export const config = { api: { bodyParser: { sizeLimit: '128kb' } } };