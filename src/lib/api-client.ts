'use client';

// ─── API Client ───────────────────────────────────────────────────────────────
// A lightweight fetch wrapper that attaches the JWT Bearer token.
// Designed to be used inside React components that have access to useAuth().

let _getToken: (() => string | null) | null = null;

/**
 * Register a token getter function. Call this once from your app root
 * (or from the auth provider) so every apiFetch call can attach the token.
 */
export function setTokenGetter(getter: () => string | null) {
    _getToken = getter;
}

/**
 * Synchronous fallback that reads the token directly from localStorage.
 *
 * React fires child useEffects BEFORE parent useEffects, so a page's
 * data-fetching effect can run before AuthProvider's effect has called
 * setTokenGetter().  This fallback ensures the token is still attached
 * during that race-condition window, preventing spurious 401s that
 * surface as "could not load" errors on first render.
 */
function getTokenSync(): string | null {
    if (_getToken) {
        try {
            return _getToken();
        } catch { /* fall through to localStorage */ }
    }
    if (typeof window !== 'undefined') {
        try {
            return localStorage.getItem('auth_token');
        } catch { /* ignore */ }
    }
    return null;
}

/**
 * Minimal fetch wrapper that:
 * - Prepends /api/v1 to the path
 * - Attaches Authorization: Bearer <token> if available
 * - Throws an ApiError with { status, message, data } on non-ok responses
 */
export async function apiFetch<T = unknown>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const token = getTokenSync();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> | undefined),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`/api/v1${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        let message = res.statusText;
        let data: unknown = null;
        try {
            data = await res.json();
            message = (data as any)?.error || message;
        } catch { /* ignore */ }
        const err = new Error(message) as any;
        err.status = res.status;
        err.data = data;
        throw err;
    }

    // 204 No Content
    if (res.status === 204) return undefined as T;

    return res.json();
}

// ─── Convenience Methods ──────────────────────────────────────────────────────

export const api = {
    get: <T = unknown>(path: string) => apiFetch<T>(path),

    post: <T = unknown>(path: string, body?: unknown) =>
        apiFetch<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),

    put: <T = unknown>(path: string, body?: unknown) =>
        apiFetch<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),

    patch: <T = unknown>(path: string, body?: unknown) =>
        apiFetch<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),

    delete: <T = unknown>(path: string) =>
        apiFetch<T>(path, { method: 'DELETE' }),
};