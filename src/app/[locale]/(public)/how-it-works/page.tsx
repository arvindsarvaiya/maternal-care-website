'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PublicNavbar } from '@/components/public-navbar';

const stepColorMap: Record<string, { bg: string; border: string; text: string; line: string }> = {
    primary: { bg: 'bg-primary-100 dark:bg-primary-900/30', border: 'border-primary-300 dark:border-primary-700', text: 'text-primary-700 dark:text-primary-300', line: 'bg-primary-200 dark:bg-primary-800' },
    razzmatazz: { bg: 'bg-razzmatazz-100 dark:bg-razzmatazz-900/30', border: 'border-razzmatazz-300 dark:border-razzmatazz-700', text: 'text-razzmatazz-700 dark:text-razzmatazz-300', line: 'bg-razzmatazz-200 dark:bg-razzmatazz-800' },
    gold: { bg: 'bg-caramel-100 dark:bg-caramel-900/30', border: 'border-caramel-300 dark:border-caramel-700', text: 'text-caramel-700 dark:text-caramel-300', line: 'bg-caramel-200 dark:bg-caramel-800' },
    ochre: { bg: 'bg-ochre-100 dark:bg-ochre-900/30', border: 'border-ochre-300 dark:border-ochre-700', text: 'text-ochre-700 dark:text-ochre-300', line: 'bg-ochre-200 dark:bg-ochre-800' },
    wine: { bg: 'bg-wine-100 dark:bg-wine-900/30', border: 'border-wine-300 dark:border-wine-700', text: 'text-wine-700 dark:text-wine-300', line: 'bg-wine-200 dark:bg-wine-800' },
};

const stepColors: (keyof typeof stepColorMap)[] = ['primary', 'razzmatazz', 'gold', 'ochre', 'wine', 'primary'];

export default function HowItWorksPage() {
    const t = useTranslations('howItWorks');
    const n = useTranslations('nav');
    const c = useTranslations('common');

    const steps = [
        { number: 1, title: t('step1Title'), description: t('step1Desc'), details: [t('step1Detail1'), t('step1Detail2'), t('step1Detail3'), t('step1Detail4')], color: stepColors[0] },
        { number: 2, title: t('step2Title'), description: t('step2Desc'), details: [t('step2Detail1'), t('step2Detail2'), t('step2Detail3'), t('step2Detail4')], color: stepColors[1] },
        { number: 3, title: t('step3Title'), description: t('step3Desc'), details: [t('step3Detail1'), t('step3Detail2'), t('step3Detail3'), t('step3Detail4')], color: stepColors[2] },
        { number: 4, title: t('step4Title'), description: t('step4Desc'), details: [t('step4Detail1'), t('step4Detail2'), t('step4Detail3'), t('step4Detail4')], color: stepColors[3] },
        { number: 5, title: t('step5Title'), description: t('step5Desc'), details: [t('step5Detail1'), t('step5Detail2'), t('step5Detail3'), t('step5Detail4')], color: stepColors[4] },
        { number: 6, title: t('step6Title'), description: t('step6Desc'), details: [t('step6Detail1'), t('step6Detail2'), t('step6Detail3'), t('step6Detail4')], color: stepColors[5] },
    ];

    const roles = [
        { icon: '🤰', title: t('role1Title'), description: t('role1Desc'), access: t('role1Access') },
        { icon: '🤝', title: t('role2Title'), description: t('role2Desc'), access: t('role2Access') },
        { icon: '👨‍👩‍👧', title: t('role3Title'), description: t('role3Desc'), access: t('role3Access') },
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
                        {[...Array(12)].map((_, i) => {
                            const angle = (i * Math.PI) / 6 - Math.PI / 2;
                            const x = 150 + 125 * Math.cos(angle);
                            const y = 150 + 125 * Math.sin(angle);
                            return <circle key={i} cx={x} cy={y} r="6" fill="currentColor" opacity="0.12" className="text-primary-500" />;
                        })}
                        {[...Array(6)].map((_, i) => {
                            const angle = (i * Math.PI) / 3;
                            const x1 = 150 + 95 * Math.cos(angle);
                            const y1 = 150 + 95 * Math.sin(angle);
                            const x2 = 150 + 95 * Math.cos(angle + Math.PI / 6);
                            const y2 = 150 + 95 * Math.sin(angle + Math.PI / 6);
                            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.3" opacity="0.1" className="text-caramel-500" />;
                        })}
                    </svg>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium mb-6">
                        {t('badge')}
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-display text-velvet-900 dark:text-surface-100 mb-4">
                        {t('heroTitle')}
                    </h1>
                    <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
                        {t('heroSubtitle')}
                    </p>
                </div>
            </section>

            {/* Step-by-step flow */}
            <section className="py-16 lg:py-24 mandala-pattern-dots">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="space-y-0">
                        {steps.map((step, i) => {
                            const c = stepColorMap[step.color] || stepColorMap.primary;
                            return (
                                <div key={step.number} className="relative flex gap-6 pb-16 last:pb-0">
                                    {i < steps.length - 1 && (
                                        <div className={`absolute left-[27px] top-16 bottom-0 w-0.5 ${c.line}`} />
                                    )}
                                    <div className={`relative z-10 flex-shrink-0 w-14 h-14 rounded-full ${c.bg} border-2 ${c.border} flex items-center justify-center shadow-soft`}>
                                        <span className={`text-xl font-display font-bold ${c.text}`}>{step.number}</span>
                                    </div>
                                    <div className="pt-3 flex-1">
                                        <h3 className="text-xl font-display text-velvet-800 dark:text-surface-200 mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-surface-600 dark:text-surface-400 leading-relaxed mb-4">
                                            {step.description}
                                        </p>
                                        {step.details && (
                                            <ul className="space-y-2">
                                                {step.details.map((detail, di) => (
                                                    <li key={di} className="flex items-start gap-2 text-sm text-surface-500 dark:text-surface-400">
                                                        <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${c.text}`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Roles section */}
            <section className="bg-surface-100 py-16 lg:py-20 mandala-pattern-dots">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-display text-velvet-800 dark:text-surface-200 mb-4">
                            {t('rolesTitle')}
                        </h2>
                        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
                            {t('rolesSubtitle')}
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {roles.map((role) => (
                            <div key={role.title} className="card card-calm text-center group hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300">
                                <div className="text-5xl mb-4">{role.icon}</div>
                                <h3 className="text-lg font-display text-velvet-800 dark:text-surface-200 mb-3">{role.title}</h3>
                                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{role.description}</p>
                                <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                                    <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                                        {role.access}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Safety note */}
            <section className="py-16 lg:py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card border-l-4 border-l-warning-400 bg-warning-50/50 dark:bg-warning-900/10 text-left">
                        <div className="flex gap-4">
                            <span className="text-2xl flex-shrink-0">⚠️</span>
                            <div>
                                <h3 className="font-display text-velvet-800 dark:text-surface-200 mb-2">{t('safetyTitle')}</h3>
                                <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
                                    {t('safetyText')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-wine-800 py-20">
                {/* Decorative mandala */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.06] animate-mandala-spin pointer-events-none" aria-hidden="true">
                    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="200" cy="200" r="190" stroke="white" strokeWidth="0.5" />
                        <circle cx="200" cy="200" r="150" stroke="white" strokeWidth="0.4" />
                        <circle cx="200" cy="200" r="110" stroke="white" strokeWidth="0.3" />
                        <circle cx="200" cy="200" r="70" stroke="white" strokeWidth="0.3" />
                        {[...Array(16)].map((_, i) => {
                            const angle = (i * Math.PI) / 8;
                            const x = 200 + 170 * Math.cos(angle);
                            const y = 200 + 170 * Math.sin(angle);
                            return <circle key={i} cx={x} cy={y} r="5" fill="white" opacity="0.15" />;
                        })}
                    </svg>
                </div>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl font-display text-white mb-4">
                        {t('ctaTitle')}
                    </h2>
                    <p className="text-primary-200 mb-8">
                        {t('ctaSubtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup" className="btn-primary text-base no-underline bg-white text-primary-700 hover:bg-primary-50">
                            {t('ctaButton')}
                        </Link>
                        <Link href="/faq" className="btn-ghost text-base no-underline text-white hover:text-primary-200">
                            {t('ctaLink')}
                        </Link>
                    </div>
                </div>
            </section>

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