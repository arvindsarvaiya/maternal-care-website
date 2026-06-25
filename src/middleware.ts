import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

// Use Node.js runtime to bypass Edge Runtime 1MB size limit
export const runtime = 'nodejs';

export default createMiddleware(routing);

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
