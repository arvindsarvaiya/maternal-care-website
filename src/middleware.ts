import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import { verifyToken } from '@/lib/auth-verify';

// ─── Auth route classifications ───

const protectedPaths = [
    '/mother',
    '/partner',
    '/shared',
    '/chat',
    '/appointments',
    '/wellness',
    '/symptoms',
    '/weekly-journey',
    '/vaccinations',
    '/notifications',
    '/settings',
    '/admin',
    '/profile',
];

const publicPaths = [
    '/home',
    '/about',
    '/how-it-works',
    '/faq',
    '/login',
    '/signup',
    '/forgot-password',
    '/privacy',
    '/facts-and-myths',
    '/api',
];

// ─── Helper: strip locale prefix ───

function stripLocale(pathname: string): string {
    for (const locale of routing.locales) {
        if (pathname.startsWith(`/${locale}/`)) return pathname.slice(`/${locale}`.length);
        if (pathname === `/${locale}`) return '/';
    }
    return pathname;
}

function getLocaleFromPathname(pathname: string): string | null {
    const seg = pathname.split('/')[1];
    if (routing.locales.includes(seg as any)) return seg;
    return null;
}

function isProtected(pathname: string): boolean {
    return protectedPaths.some(p => pathname.startsWith(p));
}

// ─── Next-intl middleware ───

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow static files and assets to pass through unchanged
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // ─── Locale cookie persistence ───
    // If the URL has NO locale prefix (e.g. /home, /faq, /login),
    // check the NEXT_LOCALE cookie and redirect to the correct locale.
    const pathLocale = getLocaleFromPathname(pathname);
    if (!pathLocale && pathname !== '/') {
        const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
        const locale = cookieLocale && routing.locales.includes(cookieLocale as any)
            ? cookieLocale
            : routing.defaultLocale;
        const targetPath = pathname === '/' ? `/${locale}/home` : `/${locale}${pathname}`;
        return NextResponse.redirect(new URL(targetPath, request.url));
    }

    // ─── Auth guard (with JWT validation) ───
    const pathWithoutLocale = stripLocale(pathname);
    const token = request.cookies.get('auth_token')?.value;

    if (isProtected(pathWithoutLocale)) {
        if (!token) {
            const locale = pathLocale || routing.defaultLocale;
            const loginUrl = new URL(`/${locale}/login`, request.url);
            loginUrl.searchParams.set('redirect', pathWithoutLocale);
            const response = NextResponse.redirect(loginUrl);
            // Clear potentially tampered cookie
            response.cookies.delete('auth_token');
            return response;
        }

        // Validate the JWT is cryptographically valid (not just present)
        const payload = await verifyToken(token);
        if (!payload) {
            const locale = pathLocale || routing.defaultLocale;
            const loginUrl = new URL(`/${locale}/login`, request.url);
            loginUrl.searchParams.set('redirect', pathWithoutLocale);
            const response = NextResponse.redirect(loginUrl);
            // Clear invalid/expired token
            response.cookies.delete('auth_token');
            return response;
        }
    }

    // Let next-intl handle locale detection and routing
    return intlMiddleware(request);
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};