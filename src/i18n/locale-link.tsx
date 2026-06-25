'use client';

import React from 'react';
import Link from 'next/link';
import type { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocaleStore } from '@/i18n/locale-store';

type LocaleLinkProps = LinkProps &
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
        children?: React.ReactNode;
    };

/**
 * Drop-in replacement for `next/link` that automatically prefixes
 * the href with the current locale from the zustand store.
 *
 * This fixes the "locale resets to English on navigation" bug because
 * client-side `next/link` navigation bypasses middleware, so unprefixed
 * hrefs like `/home` would drop the `[locale]` segment.
 */
export const LocaleLink = React.forwardRef<HTMLAnchorElement, LocaleLinkProps>(
    function LocaleLink({ href, ...props }, ref) {
        const localize = useLocaleStore((s) => s.localize);
        const localizedHref = localize(typeof href === 'string' ? href : (href as any).pathname ?? '');
        return <Link ref={ref} href={localizedHref} {...props} />;
    }
);

/**
 * Hook that wraps `useRouter` from `next/navigation` and returns a
 * `push` that automatically prefixes paths with the current locale.
 *
 * Usage:
 *   const router = useLocaleRouter();
 *   router.push('/home'); // navigates to /hi/home if locale is hi
 */
export function useLocaleRouter() {
    const router = useRouter();
    const localize = useLocaleStore((s) => s.localize);

    return React.useMemo(
        () => ({
            ...router,
            push: (href: string, options?: Parameters<typeof router.push>[1]) => {
                router.push(localize(href), options);
            },
            replace: (href: string, options?: Parameters<typeof router.replace>[1]) => {
                router.replace(localize(href), options);
            },
        }),
        [router, localize]
    );
}
