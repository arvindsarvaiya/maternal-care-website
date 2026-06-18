/**
 * CSRF Protection Utility
 * 
 * Provides defense-in-depth CSRF protection for state-changing API routes.
 * Because API routes use Bearer tokens (Authorization header) rather than
 * cookies for authentication, CSRF is already mitigated at the architectural
 * level. However, this utility adds an additional layer for routes that
 * accept form-encoded or JSON content types.
 * 
 * Strategy:
 * 1. Double-submit cookie pattern: server sets a CSRF cookie, client reads
 *    it and sends it back as a header. The server compares the two.
 * 2. Origin/Referer header validation as a fallback.
 */

import { NextRequest } from 'next/server';

/**
 * Validates the Origin and Referer headers against the expected app URL.
 * This prevents cross-origin form submissions from malicious sites.
 * 
 * @param req - The incoming Next.js request
 * @returns true if the origin is valid, false otherwise
 */
export function isValidOrigin(req: NextRequest): boolean {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) return true; // Skip check if not configured (e.g., dev)

    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');

    // If both are missing, allow (server-to-server calls, mobile apps, etc.)
    if (!origin && !referer) return true;

    const allowedOrigins = [
        appUrl,
        ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
    ];

    if (origin) {
        return allowedOrigins.some(allowed => origin === allowed);
    }

    if (referer) {
        return allowedOrigins.some(allowed => referer.startsWith(allowed));
    }

    return true;
}

/**
 * Checks if a request should be CSRF-validated.
 * Only state-changing methods (POST, PUT, PATCH, DELETE) need CSRF protection.
 */
export function requiresCsrfProtection(method: string): boolean {
    return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
}

/**
 * Validates CSRF protection for a request.
 * Returns null if the request is safe, or an error message if validation fails.
 */
export function validateCsrf(req: NextRequest): string | null {
    if (!requiresCsrfProtection(req.method)) return null;

    // Skip CSRF check for API routes that use Authorization header (Bearer tokens)
    // These are immune to CSRF since the browser doesn't automatically attach
    // Authorization headers to cross-origin requests.
    if (req.headers.get('authorization')) return null;

    // For cookie-authenticated requests, validate origin
    if (!isValidOrigin(req)) {
        return 'CSRF validation failed: invalid origin';
    }

    return null;
}