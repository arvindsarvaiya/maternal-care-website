'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PublicNavbar } from '@/components/public-navbar';

export default function AboutPage() {
    const t = useTranslations('about');
    const n = useTranslations('nav');
    const c = useTranslations('common');

    const principles = [
        { title: t('principle1Title'), desc: t('principle1Desc'), icon: '🛡️' },
        { title: t('principle2Title'), desc: t('principle2Desc'), icon: '🌱' },
        { title: t('principle3Title'), desc: t('principle3Desc'), icon: '⚕️' },
        { title: t('principle4Title'), desc: t('principle4Desc'), icon: '💜' },
    ];

    const notItems = [
        t('not1'),
        t('not2'),
        t('not3'),
        t('not4'),
    ];

    return (
        <div className="min-h-screen bg-surface-50 mandala-pattern-dots pt-24">
            <PublicNavbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                {/* Decorative mandala ornament */}
                <div className="absolute top-10 right-10 w-32 h-32 opacity-[0.04] animate-mandala-spin pointer-events-none hidden lg:block" aria-hidden="true">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" className="text-primary-800" />
                        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.4" className="text-razzmatazz-700" />
                        <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="0.3" className="text-caramel-600" />
                        <path d="M50 2C50 2 58 20 50 35C42 20 50 2 50 2Z" fill="currentColor" opacity="0.3" className="text-primary-600" />
                        <path d="M50 98C50 98 58 80 50 65C42 80 50 98 50 98Z" fill="currentColor" opacity="0.3" className="text-primary-600" />
                        <path d="M2 50C2 50 20 42 35 50C20 58 2 50 2 50Z" fill="currentColor" opacity="0.3" className="text-razzmatazz-500" />
                        <path d="M98 50C98 50 80 42 65 50C80 58 98 50 98 50Z" fill="currentColor" opacity="0.3" className="text-razzmatazz-500" />
                    </svg>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium mb-6">
                    {t('badge')}
                </div>
                <h1 className="text-4xl lg:text-5xl font-display text-velvet-900 dark:text-surface-100 mb-6">
                    {t('title')}
                </h1>
                <p className="text-lg text-surface-600 dark:text-surface-300 leading-relaxed mb-8">
                    {t('intro')}
                </p>

                <div className="space-y-14">
                    {/* Philosophy */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="mandala-divider flex-1" />
                        </div>
                        <h2 className="text-2xl font-display text-velvet-800 dark:text-surface-200 mb-5">{t('philosophyTitle')}</h2>
                        <div className="space-y-4 text-surface-600 dark:text-surface-300 leading-relaxed">
                            <p>{t('philosophy1')}</p>
                            <p>{t('philosophy2')}</p>
                        </div>
                    </section>

                    {/* Design Principles */}
                    <section>
                        <h2 className="text-2xl font-display text-velvet-800 dark:text-surface-200 mb-6">{t('designTitle')}</h2>
                        <div className="grid sm:grid-cols-2 gap-6">
                            {principles.map((p) => (
                                <div key={p.title} className="card card-calm group hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300">
                                    <span className="text-2xl mb-3 block">{p.icon}</span>
                                    <h3 className="font-display text-velvet-800 dark:text-surface-200 mb-2">{p.title}</h3>
                                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{p.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* What This Platform Is Not */}
                    <section>
                        <h2 className="text-2xl font-display text-velvet-800 dark:text-surface-200 mb-6">{t('notTitle')}</h2>
                        <div className="card border-danger-200 dark:border-danger-800 bg-danger-50/30 dark:bg-danger-900/10">
                            <ul className="space-y-3 text-surface-600 dark:text-surface-300">
                                {notItems.map((item) => (
                                    <li key={item} className="flex gap-3">
                                        <span className="text-danger-500 font-bold flex-shrink-0">✕</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-surface-200 bg-surface-50 py-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-surface-500 text-sm">
                            <span className="font-display text-gradient-mandala font-semibold">{c('appName')}</span>
                            <span className="text-surface-300">—</span>
                            <span>{t('footerTagline')}</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-surface-500">
                            <Link href="/about" className="hover:text-surface-700 no-underline">{n('about')}</Link>
                            <Link href="/faq" className="hover:text-surface-700 no-underline">{n('faq')}</Link>
                            <Link href="/privacy" className="hover:text-surface-700 no-underline">{n('privacy')}</Link>
                        </div>
                    </div>
                    <p className="text-center text-xs text-surface-400 mt-6 max-w-xl mx-auto">
                        {t('footerDisclaimer')}
                    </p>
                </div>
            </footer>
        </div>
    );
}