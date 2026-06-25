import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

// Use Node.js runtime to bypass Edge Runtime 1MB size limit
export const runtime = 'nodejs';

const intlMiddleware = createMiddleware(routing);
const PUBLIC_FILE = /\.[^/]+$/;

function getPreferredLocale(request: NextRequest) {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

    if (cookieLocale && routing.locales.includes(cookieLocale as any)) {
        return cookieLocale;
    }

    return routing.defaultLocale;
}

export default function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const firstSegment = pathname.split('/')[1];
    const hasLocalePrefix = routing.locales.includes(firstSegment as any);
    const shouldSkip = pathname.startsWith('/api') || pathname.startsWith('/_next') || PUBLIC_FILE.test(pathname);

    if (!shouldSkip && !hasLocalePrefix) {
        const locale = getPreferredLocale(request);
        const targetPath = pathname === '/' ? '/home' : pathname;
        const url = request.nextUrl.clone();

        url.pathname = `/${locale}${targetPath}`;
        url.search = search;

        return NextResponse.redirect(url);
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
