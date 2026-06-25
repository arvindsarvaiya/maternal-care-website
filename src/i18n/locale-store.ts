'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { routing } from '@/i18n/routing';

type Locale = (typeof routing.locales)[number];

interface LocaleState {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    /** Build a locale-prefixed path from an unprefixed href. */
    localize: (href: string) => string;
}

function isValidLocale(value: unknown): value is Locale {
    return typeof value === 'string' && (routing.locales as readonly string[] as string[]).includes(value);
}

function readInitialLocale(): Locale {
    if (typeof window === 'undefined') return routing.defaultLocale;

    // 1. Try the persisted zustand store (handled by persist middleware)
    // 2. Try the NEXT_LOCALE cookie set by the language selector
    const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith('NEXT_LOCALE='));
    const cookieLocale = match?.split('=')[1];
    if (isValidLocale(cookieLocale)) return cookieLocale;

    // 3. Try to read from the current URL (e.g. /hi/home)
    const firstSegment = window.location.pathname.split('/')[1];
    if (isValidLocale(firstSegment)) return firstSegment;

    return routing.defaultLocale;
}

/**
 * Global locale store backed by zustand + persist.
 *
 * Why a store instead of just `useParams()`?
 * - `useParams()` only reflects the URL segment, but client-side
 *   `next/link` navigation with unprefixed hrefs drops the segment.
 * - The store keeps the chosen locale sticky across navigations so
 *   `LocaleLink` and `useLocaleRouter` can always re-prefix hrefs.
 */
export const useLocaleStore = create<LocaleState>()(
    persist(
        (set, get) => ({
            locale: readInitialLocale(),
            setLocale: (locale) => {
                set({ locale });
                // Keep the cookie in sync so the server/middleware agrees.
                if (typeof document !== 'undefined') {
                    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
                }
            },
            localize: (href) => {
                const { locale } = get();
                // Already prefixed with a locale? Leave it alone.
                const firstSegment = href.split('/')[1];
                if (firstSegment && (routing.locales as readonly string[] as string[]).includes(firstSegment)) {
                    return href;
                }
                // External or anchor links stay untouched.
                if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
                // Normalize: ensure leading slash, then prepend /locale.
                const normalized = href.startsWith('/') ? href : `/${href}`;
                return `/${locale}${normalized === '/' ? '' : normalized}`;
            },
        }),
        {
            name: 'app-locale',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ locale: state.locale }),
        }
    )
);

/**
 * Hook to read the current locale from the store.
 * Re-syncs from the URL on mount so a hard refresh on /hi/home updates the store.
 */
export function useLocale(): Locale {
    const locale = useLocaleStore((s) => s.locale);
    return locale;
}
