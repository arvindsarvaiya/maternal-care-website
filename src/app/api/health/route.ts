import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/health
 * 
 * Production health-check endpoint for monitoring and load balancers.
 * Verifies database connectivity and returns service status.
 * Rate-limited by the global middleware (100 req/min per IP).
 */
export async function GET() {
    const checks: Record<string, { status: 'ok' | 'fail'; latencyMs?: number; error?: string }> = {};

    // Database connectivity check
    const dbStart = Date.now();
    try {
        await prisma.$queryRaw`SELECT 1`;
        checks.database = { status: 'ok', latencyMs: Date.now() - dbStart };
    } catch (err) {
        checks.database = {
            status: 'fail',
            latencyMs: Date.now() - dbStart,
            error: process.env.NODE_ENV === 'production' ? 'unavailable' : String(err),
        };
    }

    // Determine overall health
    const allHealthy = Object.values(checks).every(c => c.status === 'ok');

    return NextResponse.json(
        {
            status: allHealthy ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            checks,
        },
        {
            status: allHealthy ? 200 : 503,
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        }
    );
}