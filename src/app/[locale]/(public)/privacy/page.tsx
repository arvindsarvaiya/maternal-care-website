'use client';

import { LocaleLink as Link } from '@/i18n/locale-link';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { PublicNavbar } from '@/components/public-navbar';

const cardColors = [
    'bg-[#FFF9E6]',
    'bg-[#E8F4FF]',
    'bg-[#FFF0F6]',
    'bg-[#F3E5F5]',
];

function PrivacyCard({ children, className = '', index = 0 }: { children: ReactNode; className?: string; index?: number }) {
    return (
        <section className={`rounded-2xl border-2 border-[#FFD359] shadow-sm p-6 ${cardColors[index % cardColors.length]} ${className}`}>
            {children}
        </section>
    );
}

function SectionTitle({ children }: { children: ReactNode }) {
    return <h2 className="text-xl sm:text-2xl font-semibold text-[#0A4A9B] mb-3">{children}</h2>;
}

function BodyText({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <p className={`text-[#56616B] text-sm sm:text-base leading-relaxed ${className}`}>{children}</p>;
}

export default function PrivacyPage() {
    const t = useTranslations('privacy');
    const n = useTranslations('nav');
    const c = useTranslations('common');

    const section3Items = [
        t('section3Item1'), t('section3Item2'), t('section3Item3'),
        t('section3Item4'), t('section3Item5'), t('section3Item6'), t('section3Item7'),
    ];

    const securityItems = [
        t('section5Item1'), t('section5Item2'), t('section5Item3'),
        t('section5Item4'), t('section5Item5'),
    ];

    const securityIcons = ['🔒', '🔐', '🗄️', '🔑', '🛡️'];

    const rights = [
        { label: t('rightAccessLabel'), desc: t('rightAccessDesc') },
        { label: t('rightRectificationLabel'), desc: t('rightRectificationDesc') },
        { label: t('rightErasureLabel'), desc: t('rightErasureDesc') },
        { label: t('rightRestrictionLabel'), desc: t('rightRestrictionDesc') },
        { label: t('rightPortabilityLabel'), desc: t('rightPortabilityDesc') },
        { label: t('rightObjectionLabel'), desc: t('rightObjectionDesc') },
    ];

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF9E6] border-2 border-[#FFD359] text-[#0A4A9B] text-xs sm:text-sm font-semibold mb-6 shadow-sm">
                    {t('badge')}
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#9511F4] mb-4 leading-tight">
                    {t('titlePrefix')} {t('titleSuffix')}
                </h1>
                <p className="text-[#56616B] text-sm sm:text-base mb-12 leading-relaxed">{t('lastUpdated')}</p>

                <div className="space-y-6">
                    <PrivacyCard index={0}>
                        <SectionTitle>{t('section1Title')}</SectionTitle>
                        <BodyText>{t('section1P1')}</BodyText>
                        <BodyText className="mt-3">{t('section1P2')}</BodyText>
                    </PrivacyCard>

                    <section>
                        <SectionTitle>{t('section2Title')}</SectionTitle>
                        <div className="grid gap-4">
                            {[
                                { title: t('section2_1Title'), desc: t('section2_1Desc') },
                                { title: t('section2_2Title'), desc: t('section2_2Desc') },
                                { title: t('section2_3Title'), desc: t('section2_3Desc') },
                                { title: t('section2_4Title'), desc: t('section2_4Desc') },
                            ].map((item, index) => (
                                <div key={item.title} className={`rounded-2xl border-2 border-[#FFD359] shadow-sm p-5 ${cardColors[(index + 1) % cardColors.length]}`}>
                                    <h3 className="text-[#0A4A9B] font-semibold text-base sm:text-lg mb-2">{item.title}</h3>
                                    <BodyText>{item.desc}</BodyText>
                                </div>
                            ))}
                        </div>
                    </section>

                    <PrivacyCard index={2}>
                        <SectionTitle>{t('section3Title')}</SectionTitle>
                        <ul className="space-y-3 text-[#56616B] text-sm sm:text-base leading-relaxed">
                            {section3Items.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="text-[#9511F4] mt-0.5 flex-shrink-0">◆</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </PrivacyCard>

                    <section>
                        <SectionTitle>{t('section4Title')}</SectionTitle>
                        <div className="grid gap-4">
                            {[
                                { title: t('section4_1Title'), desc: t('section4_1Desc') },
                                { title: t('section4_2Title'), desc: t('section4_2Desc') },
                                { title: t('section4_3Title'), desc: t('section4_3Desc') },
                            ].map((item, index) => (
                                <div key={item.title} className={`rounded-2xl border-2 border-[#FFD359] shadow-sm p-5 ${cardColors[index % cardColors.length]}`}>
                                    <h3 className="text-[#0A4A9B] font-semibold text-base sm:text-lg mb-2">{item.title}</h3>
                                    <BodyText>{item.desc}</BodyText>
                                </div>
                            ))}
                        </div>
                    </section>

                    <PrivacyCard index={1}>
                        <SectionTitle>{t('section5Title')}</SectionTitle>
                        <BodyText className="mb-4">{t('section5Intro')}</BodyText>
                        <ul className="space-y-3 text-[#56616B] text-sm sm:text-base leading-relaxed">
                            {securityItems.map((item, index) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="text-lg leading-none flex-shrink-0">{securityIcons[index]}</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="text-[#56616B] text-sm leading-relaxed mt-4 italic opacity-80">
                            {t('section5Disclaimer')}
                        </p>
                    </PrivacyCard>

                    <PrivacyCard index={3}>
                        <SectionTitle>{t('section6Title')}</SectionTitle>
                        <BodyText>{t('section6P1')}</BodyText>
                        <BodyText className="mt-3">{t('section6P2')}</BodyText>
                    </PrivacyCard>

                    <PrivacyCard index={0}>
                        <SectionTitle>{t('section7Title')}</SectionTitle>
                        <BodyText>{t('section7P1')}</BodyText>
                    </PrivacyCard>

                    <PrivacyCard index={2}>
                        <SectionTitle>{t('section8Title')}</SectionTitle>
                        <BodyText className="mb-4">{t('section8Intro')}</BodyText>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {rights.map((right) => (
                                <div key={right.label} className="rounded-xl border-2 border-[#FFD359] bg-white/70 p-4 shadow-sm">
                                    <strong className="text-[#0A4A9B] text-sm sm:text-base">{right.label}</strong>
                                    <p className="text-[#56616B] text-sm mt-1 leading-relaxed">{right.desc}</p>
                                </div>
                            ))}
                        </div>
                    </PrivacyCard>

                    <PrivacyCard index={1}>
                        <SectionTitle>{t('section9Title')}</SectionTitle>
                        <BodyText>{t('section9P1')}</BodyText>
                    </PrivacyCard>

                    <section className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-[#F3E5F5] to-[#E8F4FF] border-2 border-[#FFD359] text-center relative overflow-hidden shadow-sm">
                        <div className="relative z-10">
                            <h2 className="text-xl sm:text-2xl font-semibold text-[#0A4A9B] mb-3">{t('section10Title')}</h2>
                            <p className="text-[#56616B] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                                {t('section10P1')}
                            </p>
                            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#9511F4] shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-[#9511F4] animate-pulse" />
                                <span>{t('section10Status')}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="border-t border-[#E8E8E8] bg-white py-8">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#56616B] mb-4">
                        <span className="font-semibold text-[#9511F4]">{c('appName')}</span>
                        <Link href="/about" className="hover:text-[#9511F4] no-underline">{n('about')}</Link>
                        <Link href="/faq" className="hover:text-[#9511F4] no-underline">{n('faq')}</Link>
                        <Link href="/privacy" className="text-[#9511F4] font-semibold no-underline">{n('privacy')}</Link>
                    </div>
                    <p className="text-xs text-[#56616B]">
                        {t('footerDisclaimer')}
                    </p>
                </div>
            </footer>
        </div>
    );
}
