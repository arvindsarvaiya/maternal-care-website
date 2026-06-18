/**
 * In-memory rate limiter for API routes.
 * Uses a sliding window approach per IP + endpoint combination.
 * 
 * NOTE: For production multi-instance deployments, replace this with
 * a Redis-based rate limiter (e.g., using @upstash/ratelimit or similar).
 * This in-memory implementation works well for single-instance deployments.
 */

interface RateLimitEntry {
    count: number;
    windowStart: number;
}

interface RateLimitStore {
    [key: string]: RateLimitEntry;
}

const store: RateLimitStore = {};

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries(windowMs: number): void {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    const keys = Object.keys(store);
    for (const key of keys) {
        if (now - store[key].windowStart > windowMs) {
            delete store[key];
        }
    }
}

export interface RateLimitOptions {
    /** Maximum number of requests allowed within the window */
    maxRequests: number;
    /** Window duration in milliseconds */
    windowMs: number;
    /** Custom key suffix (e.g., 'login', 'forgot-password') */
    keySuffix?: string;
}

export interface RateLimitResult {
    /** Whether the request is allowed */
    allowed: boolean;
    /** Number of remaining requests in the current window */
    remaining: number;
    /** Unix timestamp (ms) when the window resets */
    resetAt: number;
    /** Human-readable message if rate limited */
    message?: string;
}

/**
 * Checks if a request should be rate-limited.
 * 
 * @param ip - The client IP address (from x-forwarded-for or request.ip)
 * @param options - Rate limit configuration
 * @returns RateLimitResult with allowed/remaining/resetAt
 * 
 * @example
 * ```ts
 * const result = rateLimit(req.ip, { maxRequests: 5, windowMs: 60000, keySuffix: 'login' });
 * if (!result.allowed) {
 *     return NextResponse.json({ error: result.message }, { status: 429 });
 * }
 * ```
 */
export function rateLimit(ip: string, options: RateLimitOptions): RateLimitResult {
    const { maxRequests, windowMs, keySuffix = 'default' } = options;
    const key = `${ip}:${keySuffix}`;
    const now = Date.now();

    cleanupExpiredEntries(windowMs);

    const entry = store[key];

    if (!entry || now - entry.windowStart > windowMs) {
        // Start a new window
        store[key] = { count: 1, windowStart: now };
        return {
            allowed: true,
            remaining: maxRequests - 1,
            resetAt: now + windowMs,
        };
    }

    if (entry.count >= maxRequests) {
        const resetAt = entry.windowStart + windowMs;
        const retryAfterSec = Math.ceil((resetAt - now) / 1000);
        return {
            allowed: false,
            remaining: 0,
            resetAt,
            message: `Too many requests. Please try again in ${retryAfterSec} second${retryAfterSec > 1 ? 's' : ''}.`,
        };
    }

    entry.count++;
    return {
        allowed: true,
        remaining: maxRequests - entry.count,
        resetAt: entry.windowStart + windowMs,
    };
}

/**
 * Extracts the client IP from a NextRequest.
 * Checks x-forwarded-for header first (for proxied/Vercel deployments),
 * then falls back to other headers or a default.
 */
export function getClientIP(req: { headers: Headers }): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    const realIp = req.headers.get('x-real-ip');
    if (realIp) {
        return realIp.trim();
    }
    return '127.0.0.1';
}

/**
 * Common rate limit presets for auth endpoints.
 */
export const RATE_LIMITS = {
    /** Login: 5 attempts per minute per IP */
    LOGIN: { maxRequests: 5, windowMs: 60 * 1000, keySuffix: 'login' } as const,
    /** Forgot password / OTP send: 3 attempts per 5 minutes per IP */
    FORGOT_PASSWORD: { maxRequests: 3, windowMs: 5 * 60 * 1000, keySuffix: 'forgot-password' } as const,
    /** OTP verification: 5 attempts per minute per IP */
    VERIFY_OTP: { maxRequests: 5, windowMs: 60 * 1000, keySuffix: 'verify-otp' } as const,
    /** Signup: 3 attempts per 10 minutes per IP */
    SIGNUP: { maxRequests: 3, windowMs: 10 * 60 * 1000, keySuffix: 'signup' } as const,
    /** Chat: 20 messages per minute per IP */
    CHAT: { maxRequests: 20, windowMs: 60 * 1000, keySuffix: 'chat' } as const,
    /** 2FA verification: 5 attempts per minute per IP */
    VERIFY_2FA: { maxRequests: 5, windowMs: 60 * 1000, keySuffix: 'verify-2fa' } as const,
    /** General API: 100 requests per minute per IP */
    GENERAL: { maxRequests: 100, windowMs: 60 * 1000, keySuffix: 'general' } as const,
} as const;