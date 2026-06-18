'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PublicNavbar } from '@/components/public-navbar';

type TabType = 'myths' | 'facts';

export default function FactsAndMythsPage() {
    const t = useTranslations('factsAndMyths');
    const n = useTranslations('nav');
    const c = useTranslations('common');
    const [activeTab, setActiveTab] = useState<TabType>('myths');

    const myths = [
        {
            myth: t('myth1Myth'),
            fact: t('myth1Fact'),
            icon: '🫒',
        },
        {
            myth: t('myth2Myth'),
            fact: t('myth2Fact'),
            icon: '🧡',
        },
        {
            myth: t('myth3Myth'),
            fact: t('myth3Fact'),
            icon: '🍽️',
        },
        {
            myth: t('myth4Myth'),
            fact: t('myth4Fact'),
            icon: '🧘',
        },
        {
            myth: t('myth5Myth'),
            fact: t('myth5Fact'),
            icon: '🫕',
        },
        {
            myth: t('myth6Myth'),
            fact: t('myth6Fact'),
            icon: '🌑',
        },
        {
            myth: t('myth7Myth'),
            fact: t('myth7Fact'),
            icon: '🌶️',
        },
        {
            myth: t('myth8Myth'),
            fact: t('myth8Fact'),
            icon: '🪜',
        },
        {
            myth: t('myth9Myth'),
            fact: t('myth9Fact'),
            icon: '🥥',
        },
        {
            myth: t('myth10Myth'),
            fact: t('myth10Fact'),
            icon: '👶',
        },
    ];

    const facts = [
        {
            title: t('fact1Title'),
            description: t('fact1Desc'),
            icon: '💊',
        },
        {
            title: t('fact2Title'),
            description: t('fact2Desc'),
            icon: '💉',
        },
        {
            title: t('fact3Title'),
            description: t('fact3Desc'),
            icon: '🏥',
        },
        {
            title: t('fact4Title'),
            description: t('fact4Desc'),
            icon: '🧂',
        },
        {
            title: t('fact5Title'),
            description: t('fact5Desc'),
            icon: '🩸',
        },
        {
            title: t('fact6Title'),
            description: t('fact6Desc'),
            icon: '🥛',
        },
        {
            title: t('fact7Title'),
            description: t('fact7Desc'),
            icon: '🤱',
        },
        {
            title: t('fact8Title'),
            description: t('fact8Desc'),
            icon: '🦘',
        },
    ];

    return (
        <div className="min-h-screen bg-surface-50 pt-24">
            <PublicNavbar />

            {/* Hero */}
            <section className="relative overflow-hidden mandala-pattern-rangoli py-16 lg:py-24">
                <div className="absolute inset-0 bg-gradient-to-b from-surface-50 via-surface-50/80 to-surface-100" />
                {/* Decorative mandala */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.04] animate-mandala-spin pointer-events-none" aria-hidden="true">
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="150" cy="150" r="140" stroke="currentColor" strokeWidth="0.5" className="text-primary-800" />
                        <circle cx="150" cy="150" r="110" stroke="currentColor" strokeWidth="0.4" className="text-razzmatazz-700" />
                        <circle cx="150" cy="150" r="80" stroke="currentColor" strokeWidth="0.3" className="text-caramel-600" />
                        <circle cx="150" cy="150" r="50" stroke="currentColor" strokeWidth="0.3" className="text-wine-600" />
                    </svg>
                </div>
                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4 border border-primary-200">
                        {t('badge')}
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-velvet-900 mb-4">
                        {t('heroTitle')}
                    </h1>
                    <p className="text-surface-600 text-base sm:text-lg max-w-2xl mx-auto">
                        {t('heroSubtitle')}
                    </p>
                </div>
            </section>

            {/* Tabs */}
            <section className="relative z-10 -mt-8 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    {/* Tab Buttons */}
                    <div className="flex justify-center gap-2 mb-10">
                        <button
                            onClick={() => setActiveTab('myths')}
                            className={`px-6 py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 ${activeTab === 'myths'
                                    ? 'bg-razzmatazz-500 text-white shadow-lg shadow-razzmatazz-500/25'
                                    : 'bg-white text-surface-600 border border-surface-200 hover:border-razzmatazz-300 hover:text-razzmatazz-600'
                                }`}
                        >
                            {t('mythsTab')}
                        </button>
                        <button
                            onClick={() => setActiveTab('facts')}
                            className={`px-6 py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 ${activeTab === 'facts'
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                    : 'bg-white text-surface-600 border border-surface-200 hover:border-primary-300 hover:text-primary-600'
                                }`}
                        >
                            {t('factsTab')}
                        </button>
                    </div>

                    {/* Myths Content */}
                    {activeTab === 'myths' && (
                        <div className="space-y-5">
                            <p className="text-center text-surface-500 text-sm mb-6">
                                {t('mythsDisclaimer')}
                            </p>
                            {myths.map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="p-5 sm:p-6">
                                        <div className="flex gap-4">
                                            <div className="shrink-0 w-10 h-10 rounded-full bg-razzmatazz-100 flex items-center justify-center text-xl">
                                                {item.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {/* Myth */}
                                                <div className="mb-3">
                                                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-razzmatazz-100 text-razzmatazz-700 text-xs font-semibold mb-2">
                                                        {t('mythLabel')}
                                                    </span>
                                                    <p className="text-surface-500 line-through text-sm sm:text-base">
                                                        {item.myth}
                                                    </p>
                                                </div>
                                                {/* Fact */}
                                                <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                                                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold mb-2">
                                                        {t('factLabel')}
                                                    </span>
                                                    <p className="text-surface-700 text-sm sm:text-base leading-relaxed">
                                                        {item.fact}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Facts Content */}
                    {activeTab === 'facts' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {facts.map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl border border-surface-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-xl">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-velvet-900 font-semibold text-base sm:text-lg mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-surface-600 text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-wine-800 py-16">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.06] animate-mandala-spin pointer-events-none" aria-hidden="true">
                    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="200" cy="200" r="190" stroke="white" strokeWidth="0.5" />
                        <circle cx="200" cy="200" r="150" stroke="white" strokeWidth="0.4" />
                        <circle cx="200" cy="200" r="110" stroke="white" strokeWidth="0.3" />
                        <circle cx="200" cy="200" r="70" stroke="white" strokeWidth="0.3" />
                    </svg>
                </div>
                <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
                        {t('ctaTitle')}
                    </h2>
                    <p className="text-white/80 text-base mb-8">
                        {t('ctaSubtitle')}
                    </p>
                    <Link
                        href="/signup"
                        className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-primary-700 font-semibold text-base shadow-lg hover:shadow-xl hover:bg-surface-50 transition-all duration-200 no-underline"
                    >
                        {t('ctaButton')}
                    </Link>
                </div>
            </section>

            {/* Safety Disclaimer */}
            <section className="bg-surface-50 border-t border-surface-200 py-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-warning-100 text-warning-600 mb-3">
                        ⚠️
                    </div>
                    <h3 className="text-velvet-900 font-semibold text-lg mb-2">
                        {t('safetyTitle')}
                    </h3>
                    <p className="text-surface-500 text-sm leading-relaxed">
                        {t('safetyText')}
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-surface-200 bg-surface-50 py-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-razzmatazz-500 flex items-center justify-center shadow-glow">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-lg font-heading font-bold text-velvet-900">
                            {c('appName')}
                        </span>
                    </div>
                    <p className="text-surface-400 text-sm mb-4">{c('builtWithLove')}</p>
                    <div className="flex items-center justify-center gap-6 text-sm text-surface-400 mb-4">
                        <Link href="/privacy" className="hover:text-primary-600 transition-colors no-underline">
                            {c('privacyPolicy')}
                        </Link>
                        <Link href="/about" className="hover:text-primary-600 transition-colors no-underline">
                            {n('about')}
                        </Link>
                        <Link href="/faq" className="hover:text-primary-600 transition-colors no-underline">
                            {n('faq')}
                        </Link>
                    </div>
                    <p className="text-xs text-surface-300">{t('footerDisclaimer')}</p>
                </div>
            </footer>
        </div>
    );
}