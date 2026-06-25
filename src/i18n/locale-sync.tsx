'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocaleStore } from '@/i18n/locale-store';
import { routing } from '@/i18n/routing';

/**
 * Keeps the zustand locale store in sync with the active `[locale]`
 * URL segment. Mount this once near the root of the app.
 *
 * - On hard refresh / direct navigation, the URL is the source of truth.
 * - On client-side navigation, the store is the source of truth and
 *   `LocaleLink` re-prefixes hrefs so the URL stays correct.
 */
export function LocaleSync() {
    const params = useParams();
    const setLocale = useLocaleStore((s) => s.setLocale);
    const urlLocale = params?.locale as string | undefined;

    useEffect(() => {
        if (urlLocale && (routing.locales as readonly string[] as string[]).includes(urlLocale)) {
            setLocale(urlLocale as any);
        }
    }, [urlLocale, setLocale]);

    return null;
}
