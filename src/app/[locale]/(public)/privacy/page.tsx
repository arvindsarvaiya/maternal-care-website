'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PublicNavbar } from '@/components/public-navbar';

export default function PrivacyPage() {
    const t = useTranslations('privacy');
    const n = useTranslations('nav');
    const c = useTranslations('common');

    const section3Items = [
        t('section3Item1'), t('section3Item2'), t('section3Item3'),
        t('section3Item4'), t('section3Item5'), t('section3Item6'), t('section3Item7'),
    ];

    const section3Colors = [
        'text-primary-500', 'text-razzmatazz-500', 'text-caramel-500',
        'text-ochre-500', 'text-wine-500', 'text-primary-500', 'text-razzmatazz-500',
    ];

    const securityItems = [
        t('section5Item1'), t('section5Item2'), t('section5Item3'),
        t('section5Item4'), t('section5Item5'),
    ];

    const securityIcons = ['🔒', '🔐', '🗄️', '🔑', '🛡️'];

    const rights = [
        { label: t('rightAccessLabel'), desc: t('rightAccessDesc'), color: 'primary' },
        { label: t('rightRectificationLabel'), desc: t('rightRectificationDesc'), color: 'razzmatazz' },
        { label: t('rightErasureLabel'), desc: t('rightErasureDesc'), color: 'wine' },
        { label: t('rightRestrictionLabel'), desc: t('rightRestrictionDesc'), color: 'caramel' },
        { label: t('rightPortabilityLabel'), desc: t('rightPortabilityDesc'), color: 'ochre' },
        { label: t('rightObjectionLabel'), desc: t('rightObjectionDesc'), color: 'primary' },
    ];

    const colorMap: Record<string, string> = {
        primary: 'border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/20',
        razzmatazz: 'border-razzmatazz-300 dark:border-razzmatazz-700 bg-razzmatazz-50/50 dark:bg-razzmatazz-900/20',
        caramel: 'border-caramel-300 dark:border-caramel-700 bg-caramel-50/50 dark:bg-caramel-900/20',
        wine: 'border-wine-300 dark:border-wine-700 bg-wine-50/50 dark:bg-wine-900/20',
        ochre: 'border-ochre-300 dark:border-ochre-700 bg-ochre-50/50 dark:bg-ochre-900/20',
    };

    const textMap: Record<string, string> = {
        primary: 'text-primary-700 dark:text-primary-300',
        razzmatazz: 'text-razzmatazz-700 dark:text-razzmatazz-300',
        caramel: 'text-caramel-700 dark:text-caramel-300',
        wine: 'text-wine-700 dark:text-wine-300',
        ochre: 'text-ochre-700 dark:text-ochre-300',
    };

    return (
        <div className="min-h-screen bg-surface-50 mandala-pattern-dots pt-24">
            <PublicNavbar />

            {/* Content */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                {/* Decorative mandala ornament */}
                <div className="absolute top-10 right-10 w-32 h-32 opacity-[0.03] animate-mandala-spin pointer-events-none hidden lg:block" aria-hidden="true">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" className="text-primary-800" />
                        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.4" className="text-razzmatazz-700" />
                        <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="0.3" className="text-caramel-600" />
                        <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="0.3" className="text-wine-600" />
                        <path d="M50 2C50 2 58 20 50 35C42 20 50 2 50 2Z" fill="currentColor" opacity="0.3" className="text-primary-600" />
                        <path d="M50 98C50 98 58 80 50 65C42 80 50 98 50 98Z" fill="currentColor" opacity="0.3" className="text-primary-600" />
                        <path d="M2 50C2 50 20 42 35 50C20 58 2 50 2 50Z" fill="currentColor" opacity="0.3" className="text-razzmatazz-500" />
                        <path d="M98 50C98 50 80 42 65 50C80 58 98 50 98 50Z" fill="currentColor" opacity="0.3" className="text-razzmatazz-500" />
                        <path d="M15 15C15 15 30 18 35 35C18 30 15 15 15 15Z" fill="currentColor" opacity="0.2" className="text-caramel-500" />
                        <path d="M85 85C85 85 70 82 65 65C82 70 85 85 85 85Z" fill="currentColor" opacity="0.2" className="text-caramel-500" />
                    </svg>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium mb-6">
                    {t('badge')}
                </div>
                <h1 className="text-4xl lg:text-5xl font-display text-velvet-900 dark:text-surface-100 mb-3">
                    {t('titlePrefix')} <span className="text-gradient-mandala">{t('titleSuffix')}</span>
                </h1>
                <p className="text-surface-500 text-sm mb-12">{t('lastUpdated')}</p>

                <div className="space-y-10">
                    {/* Section 1 - Introduction */}
                    <section className="card-calm">
                        <h2 className="text-xl font-display text-velvet-800 dark:text-surface-200 mb-3">{t('section1Title')}</h2>
                        <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                            {t('section1P1')}
                        </p>
                        <p className="text-surface-600 dark:text-surface-300 leading-relaxed mt-3">
                            {t('section1P2')}
                        </p>
                    </section>

                    {/* Section 2 - Data we collect */}
                    <section>
                        <h2 className="text-xl font-display text-velvet-800 dark:text-surface-200 mb-5">{t('section2Title')}</h2>

                        <div className="space-y-5">
                            <div className="card-calm">
                                <h3 className="text-lg font-medium text-velvet-700 dark:text-surface-200 mb-2">{t('section2_1Title')}</h3>
                                <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                                    {t('section2_1Desc')}
                                </p>
                            </div>

                            <div className="card-calm">
                                <h3 className="text-lg font-medium text-velvet-700 dark:text-surface-200 mb-2">{t('section2_2Title')}</h3>
                                <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                                    {t('section2_2Desc')}
                                </p>
                            </div>

                            <div className="card-calm">
                                <h3 className="text-lg font-medium text-velvet-700 dark:text-surface-200 mb-2">{t('section2_3Title')}</h3>
                                <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                                    {t('section2_3Desc')}
                                </p>
                            </div>

                            <div className="card-calm">
                                <h3 className="text-lg font-medium text-velvet-700 dark:text-surface-200 mb-2">{t('section2_4Title')}</h3>
                                <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                                    {t('section2_4Desc')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 - How we use data */}
                    <section>
                        <h2 className="text-xl font-display text-velvet-800 dark:text-surface-200 mb-4">{t('section3Title')}</h2>
                        <div className="card-calm">
                            <ul className="space-y-3 text-surface-600 dark:text-surface-300 leading-relaxed">
                                {section3Items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className={`${section3Colors[i]} mt-0.5 flex-shrink-0`}>◆</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Section 4 - Data sharing */}
                    <section>
                        <h2 className="text-xl font-display text-velvet-800 dark:text-surface-200 mb-5">{t('section4Title')}</h2>

                        <div className="space-y-5">
                            <div className="card-calm border-l-4 border-primary-400 dark:border-primary-600">
                                <h3 className="text-lg font-medium text-velvet-700 dark:text-surface-200 mb-2">{t('section4_1Title')}</h3>
                                <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                                    {t('section4_1Desc')}
                                </p>
                            </div>

                            <div className="card-calm border-l-4 border-razzmatazz-400 dark:border-razzmatazz-600">
                                <h3 className="text-lg font-medium text-velvet-700 dark:text-surface-200 mb-2">{t('section4_2Title')}</h3>
                                <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                                    {t('section4_2Desc')}
                                </p>
                            </div>

                            <div className="card-calm border-l-4 border-wine-400 dark:border-wine-600">
                                <h3 className="text-lg font-medium text-velvet-700 dark:text-surface-200 mb-2">{t('section4_3Title')}</h3>
                                <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                                    {t('section4_3Desc')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 5 - Data security */}
                    <section>
                        <h2 className="text-xl font-display text-velvet-800 dark:text-surface-200 mb-4">{t('section5Title')}</h2>
                        <div className="card-calm">
                            <p className="text-surface-600 dark:text-surface-300 leading-relaxed mb-4">
                                {t('section5Intro')}
                            </p>
                            <ul className="space-y-3 text-surface-600 dark:text-surface-300 leading-relaxed">
                                {securityItems.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="text-primary-500 mt-0.5 flex-shrink-0 text-lg leading-none">{securityIcons[i]}</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-surface-500 dark:text-surface-400 leading-relaxed mt-4 text-sm italic">
                                {t('section5Disclaimer')}
                            </p>
                        </div>
                    </section>

                    {/* Section 6 - Data retention */}
                    <section className="card-calm">
                        <h2 className="text-xl font-display text-velvet-800 dark:text-surface-200 mb-3">{t('section6Title')}</h2>
                        <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                            {t('section6P1')}
                        </p>
                        <p className="text-surface-600 dark:text-surface-300 leading-relaxed mt-3">
                            {t('section6P2')}
                        </p>
                    </section>

                    {/* Section 7 - Children's privacy */}
                    <section className="card-calm">
                        <h2 className="text-xl font-display text-velvet-800 dark:text-surface-200 mb-3">{t('section7Title')}</h2>
                        <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                            {t('section7P1')}
                        </p>
                    </section>

                    {/* Section 8 - Your rights */}
                    <section>
                        <h2 className="text-xl font-display text-velvet-800 dark:text-surface-200 mb-4">{t('section8Title')}</h2>
                        <div className="card-calm">
                            <p className="text-surface-600 dark:text-surface-300 leading-relaxed mb-4">
                                {t('section8Intro')}
                            </p>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {rights.map((right) => (
                                    <div key={right.label} className={`border rounded-xl p-4 ${colorMap[right.color]}`}>
                                        <strong className={`${textMap[right.color]} text-sm`}>{right.label}</strong>
                                        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{right.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Section 9 - Changes */}
                    <section className="card-calm">
                        <h2 className="text-xl font-display text-velvet-800 dark:text-surface-200 mb-3">{t('section9Title')}</h2>
                        <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                            {t('section9P1')}
                        </p>
                    </section>

                    {/* Section 10 - Contact */}
                    <section className="card" style={{ background: 'linear-gradient(135deg, rgba(113, 35, 140, 0.03), rgba(228, 68, 116, 0.03))' }}>
                        <h2 className="text-xl font-display text-velvet-800 dark:text-surface-200 mb-3">{t('section10Title')}</h2>
                        <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                            {t('section10P1')}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400">
                            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                            <span>{t('section10Status')}</span>
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
                            <Link href="/privacy" className="text-primary-600 font-medium no-underline">{n('privacy')}</Link>
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