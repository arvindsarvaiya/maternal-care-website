import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth-verify';

// Use Node.js runtime to bypass Edge Runtime 1MB size limit
export const runtime = 'nodejs';

// ─── Supported locales ───

const locales = ['en', 'hi'];
const defaultLocale = 'en';

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

// ─── Helper functions ───

function stripLocale(pathname: string): string {
    for (const locale of locales) {
        if (pathname.startsWith(`/${locale}/`)) return pathname.slice(`/${locale}`.length);
        if (pathname === `/${locale}`) return '/';
    }
    return pathname;
}

function getLocaleFromPathname(pathname: string): string | null {
    const seg = pathname.split('/')[1];
    if (locales.includes(seg as any)) return seg;
    return null;
}

function isProtected(pathname: string): boolean {
    return protectedPaths.some(p => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow static files, assets, and API routes to pass through unchanged
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // ─── Locale handling ───
    const pathLocale = getLocaleFromPathname(pathname);
    
    // If URL has no locale prefix, redirect to locale-prefixed version
    if (!pathLocale && pathname !== '/') {
        const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
        const locale = cookieLocale && locales.includes(cookieLocale as any)
            ? cookieLocale
            : defaultLocale;
        const targetPath = pathname === '/' ? `/${locale}/home` : `/${locale}${pathname}`;
        return NextResponse.redirect(new URL(targetPath, request.url));
    }

    // ─── Auth guard (with JWT validation) ───
    const pathWithoutLocale = stripLocale(pathname);
    const token = request.cookies.get('auth_token')?.value;

    if (isProtected(pathWithoutLocale)) {
        if (!token) {
            const locale = pathLocale || defaultLocale;
            const loginUrl = new URL(`/${locale}/login`, request.url);
            loginUrl.searchParams.set('redirect', pathWithoutLocale);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('auth_token');
            return response;
        }

        const payload = await verifyToken(token);
        if (!payload) {
            const locale = pathLocale || defaultLocale;
            const loginUrl = new URL(`/${locale}/login`, request.url);
            loginUrl.searchParams.set('redirect', pathWithoutLocale);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('auth_token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};