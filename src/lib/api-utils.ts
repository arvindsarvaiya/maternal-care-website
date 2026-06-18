import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from './auth';
import { z } from 'zod';
import { rateLimit, getClientIP, RateLimitOptions } from './rate-limit';

// ─── Auth Helpers ───

export async function getAuthPayload(req: NextRequest): Promise<JWTPayload | null> {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    return verifyToken(token);
}

export function unauthorized() {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function forbidden() {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

export function notFound(entity: string = 'Resource') {
    return NextResponse.json({ error: `${entity} not found` }, { status: 404 });
}

export function badRequest(message: string) {
    return NextResponse.json({ error: message }, { status: 400 });
}

export function tooManyRequests(message: string = 'Too many requests', retryAfterSec?: number) {
    const headers: Record<string, string> = {};
    if (retryAfterSec !== undefined) {
        headers['Retry-After'] = String(retryAfterSec);
    }
    return NextResponse.json({ error: message }, { status: 429, headers });
}

/**
 * Checks rate limit for the current request. Returns a 429 response if exceeded,
 * or null if the request is allowed to proceed.
 *
 * @example
 * ```ts
 * const rateLimitResponse = checkRateLimit(req, RATE_LIMITS.GENERAL);
 * if (rateLimitResponse) return rateLimitResponse;
 * ```
 */
export function checkRateLimit(req: NextRequest, options: RateLimitOptions): NextResponse | null {
    const ip = getClientIP(req);
    const result = rateLimit(ip, options);
    if (!result.allowed) {
        const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
        return tooManyRequests(result.message || 'Too many requests', retryAfter);
    }
    return null;
}

export function success<T>(data: T, status: number = 200) {
    return NextResponse.json(data, { status });
}

export function created<T>(data: T) {
    return NextResponse.json(data, { status: 201 });
}

// ─── Validation ───

export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): { data?: T; error?: string } {
    const result = schema.safeParse(body);
    if (!result.success) {
        return { error: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ') };
    }
    return { data: result.data };
}

// ─── Pagination ───

export function parsePagination(req: NextRequest): { skip: number; take: number } {
    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    return { skip: (page - 1) * limit, take: limit };
}

export function paginatedResponse<T>(data: T[], total: number, skip: number, take: number) {
    return {
        data,
        pagination: {
            total,
            page: Math.floor(skip / take) + 1,
            limit: take,
            totalPages: Math.ceil(total / take),
        },
    };
}

// ─── CORS ───

const ALLOWED_ORIGINS = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

export function corsHeaders(origin?: string | null) {
    const requestOrigin = origin || '';
    const allowedOrigin = ALLOWED_ORIGINS.includes(requestOrigin) || ALLOWED_ORIGINS.includes('*')
        ? requestOrigin || ALLOWED_ORIGINS[0]
        : ALLOWED_ORIGINS[0];

    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
    };
}