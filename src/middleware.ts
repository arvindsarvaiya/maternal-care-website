import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'hi'];
const defaultLocale = 'en';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip static files, API routes, and files with extensions
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Check if pathname already has a locale prefix
    const segments = pathname.split('/');
    const hasLocale = segments.length > 1 && locales.includes(segments[1]);

    // If no locale prefix, redirect to locale-prefixed version
    if (!hasLocale && pathname !== '/') {
        const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
        const locale = cookieLocale && locales.includes(cookieLocale as any)
            ? cookieLocale
            : defaultLocale;
        const targetPath = pathname === '/' ? `/${locale}/home` : `/${locale}${pathname}`;
        return NextResponse.redirect(new URL(targetPath, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
