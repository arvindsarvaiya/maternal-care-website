'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { localeNames } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
    const t = useTranslations('language');
    const router = useRouter();
    const params = useParams();
    const currentLocale = (params?.locale as string) || 'en';
    const [selectedLocale, setSelectedLocale] = useState(currentLocale);

    useEffect(() => {
        setSelectedLocale(currentLocale);
    }, [currentLocale]);

    const handleSave = () => {
        document.cookie = `NEXT_LOCALE=${selectedLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
        const pathParts = window.location.pathname.split('/');
        pathParts[1] = selectedLocale;
        router.push(pathParts.join('/'));
    };

    return (
        <div className="flex items-center gap-2">
            <select
                value={selectedLocale}
                onChange={(e) => setSelectedLocale(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-lg border border-surface-300 bg-white dark:bg-velvet-800 dark:border-velvet-700 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent cursor-pointer"
            >
                {Object.entries(localeNames).map(([code, name]) => (
                    <option key={code} value={code}>
                        {name}
                    </option>
                ))}
            </select>
            {selectedLocale !== currentLocale && (
                <Button
                    onClick={handleSave}
                    variant="primary"
                    size="sm"
                >
                    {t('save')}
                </Button>
            )}
        </div>
    );
}

// ─── Compact language button for public navbars ───

export function LanguageButton() {
    const t = useTranslations('language');
    const router = useRouter();
    const params = useParams();
    const currentLocale = (params?.locale as string) || 'en';
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const switchLocale = (locale: string) => {
        document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
        setOpen(false);
        if (locale !== currentLocale) {
            const pathParts = window.location.pathname.split('/');
            pathParts[1] = locale;
            router.push(pathParts.join('/'));
        }
    };

    const currentName = localeNames[currentLocale] || currentLocale.toUpperCase();

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-lg border border-surface-300 bg-white dark:bg-velvet-800 dark:border-velvet-700 text-velvet-700 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-velvet-700/80 transition-colors cursor-pointer"
                aria-label={t('title')}
            >
                <Globe className="w-4 h-4 text-surface-500 dark:text-surface-400" />
                <span className="hidden sm:inline font-medium text-xs uppercase">{currentLocale}</span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-velvet-900 rounded-xl shadow-elevated border border-surface-200 dark:border-velvet-800 py-1 z-50 animate-slide-up origin-top-right max-h-64 overflow-y-auto">
                    <div className="px-3 py-2 border-b border-surface-100 dark:border-velvet-800">
                        <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                            {t('title')}
                        </p>
                    </div>
                    {Object.entries(localeNames).map(([code, name]) => (
                        <button
                            key={code}
                            onClick={() => switchLocale(code)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${code === currentLocale
                                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                                : 'text-velvet-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-velvet-800'
                                }`}
                        >
                            <span className="w-6 text-center text-xs font-bold uppercase opacity-60">{code}</span>
                            <span>{name}</span>
                            {code === currentLocale && (
                                <span className="ml-auto w-2 h-2 rounded-full bg-primary-500" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── First-visit popup ───

export function LanguagePopup() {
    const t = useTranslations('language');
    const router = useRouter();
    const params = useParams();
    const currentLocale = (params?.locale as string) || 'en';
    const [selectedLocale, setSelectedLocale] = useState(currentLocale);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Use a dedicated cookie so the popup shows even though middleware sets NEXT_LOCALE
        const hasSeenPopup = document.cookie.includes('LANG_POPUP_SEEN=');
        if (!hasSeenPopup) {
            const timer = setTimeout(() => setIsVisible(true), 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const dismissPopup = () => {
        document.cookie = 'LANG_POPUP_SEEN=1; path=/; max-age=' + (365 * 24 * 60 * 60) + '; SameSite=Lax';
        setIsVisible(false);
    };

    const handleSelect = (locale: string) => {
        setSelectedLocale(locale);
    };

    const handleSave = () => {
        document.cookie = 'LANG_POPUP_SEEN=1; path=/; max-age=' + (365 * 24 * 60 * 60) + '; SameSite=Lax';
        document.cookie = `NEXT_LOCALE=${selectedLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
        setIsVisible(false);
        if (selectedLocale !== currentLocale) {
            const pathParts = window.location.pathname.split('/');
            pathParts[1] = selectedLocale;
            router.push(pathParts.join('/'));
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={dismissPopup}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4 bg-white dark:bg-velvet-900 rounded-2xl shadow-elevated border border-surface-200 dark:border-velvet-800 p-8 animate-slide-up">
                {/* Mandala ornament */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 relative flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-2 border-primary-200 dark:border-primary-800 opacity-60 animate-mandala-spin-slow" />
                        <div className="absolute inset-2 rounded-full border border-caramel-300 dark:border-caramel-600 opacity-40 animate-mandala-spin" />
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary-500 to-razzmatazz-500" />
                    </div>
                </div>

                <h2 className="text-2xl font-display text-gradient-mandala text-center mb-2">
                    {t('title')}
                </h2>
                <p className="text-sm text-surface-500 dark:text-surface-400 text-center mb-6">
                    {t('subtitle')}
                </p>

                {/* Language options */}
                <div className="grid grid-cols-1 gap-2 mb-6 max-h-64 overflow-y-auto">
                    {Object.entries(localeNames).map(([code, name]) => (
                        <button
                            key={code}
                            onClick={() => handleSelect(code)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 border ${selectedLocale === code
                                ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700 shadow-soft'
                                : 'bg-surface-50 dark:bg-velvet-800/50 border-surface-200 dark:border-velvet-700 hover:bg-surface-100 dark:hover:bg-velvet-800'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedLocale === code
                                ? 'border-primary-500'
                                : 'border-surface-300 dark:border-velvet-600'
                                }`}>
                                {selectedLocale === code && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-primary-500 to-razzmatazz-500" />
                                )}
                            </div>
                            <div>
                                <span className={`text-sm font-medium ${selectedLocale === code
                                    ? 'text-primary-700 dark:text-primary-300'
                                    : 'text-velvet-700 dark:text-surface-300'
                                    }`}>
                                    {name}
                                </span>
                            </div>
                            {code === 'en' && (
                                <span className="ml-auto text-xs text-surface-400 dark:text-surface-500 italic">
                                    {t('default')}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <Button
                    onClick={handleSave}
                    variant="primary"
                    className="w-full"
                    size="lg"
                >
                    {t('save')}
                </Button>

                <button
                    onClick={dismissPopup}
                    className="w-full mt-3 text-sm text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-400 transition-colors"
                >
                    {t('change')}
                </button>
            </div>
        </div>
    );
}