'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PublicNavbar } from '@/components/public-navbar';

export default function FAQPage() {
  const t = useTranslations('faq');
  const n = useTranslations('nav');
  const c = useTranslations('common');

  const categoryIcons: Record<string, string> = {
    [t('cat1Name')]: '🚀',
    [t('cat2Name')]: '🔒',
    [t('cat3Name')]: '✨',
    [t('cat4Name')]: '🛡️',
  };

  const faqData = [
    {
      category: t('cat1Name'),
      items: [
        { q: t('cat1Q1'), a: t('cat1A1') },
        { q: t('cat1Q2'), a: t('cat1A2') },
        { q: t('cat1Q3'), a: t('cat1A3') },
      ],
    },
    {
      category: t('cat2Name'),
      items: [
        { q: t('cat2Q1'), a: t('cat2A1') },
        { q: t('cat2Q2'), a: t('cat2A2') },
        { q: t('cat2Q3'), a: t('cat2A3') },
      ],
    },
    {
      category: t('cat3Name'),
      items: [
        { q: t('cat3Q1'), a: t('cat3A1') },
        { q: t('cat3Q2'), a: t('cat3A2') },
        { q: t('cat3Q3'), a: t('cat3A3') },
        { q: t('cat3Q4'), a: t('cat3A4') },
      ],
    },
    {
      category: t('cat4Name'),
      items: [
        { q: t('cat4Q1'), a: t('cat4A1') },
        { q: t('cat4Q2'), a: t('cat4A2') },
        { q: t('cat4Q3'), a: t('cat4A3') },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-surface-50 mandala-pattern-dots pt-24">
      <PublicNavbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Decorative mandala ornament */}
        <div className="absolute -top-10 -left-20 w-48 h-48 opacity-[0.03] animate-mandala-spin pointer-events-none hidden lg:block" aria-hidden="true">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.5" className="text-primary-800" />
            <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="0.4" className="text-razzmatazz-700" />
            <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="0.3" className="text-caramel-600" />
            <circle cx="100" cy="100" r="35" stroke="currentColor" strokeWidth="0.3" className="text-wine-600" />
            <circle cx="100" cy="100" r="15" stroke="currentColor" strokeWidth="0.2" className="text-primary-500" />
            {[...Array(8)].map((_, i) => {
              const angle = (i * Math.PI) / 4;
              const x = 100 + 85 * Math.cos(angle);
              const y = 100 + 85 * Math.sin(angle);
              return <circle key={i} cx={x} cy={y} r="5" fill="currentColor" opacity="0.15" className="text-primary-500" />;
            })}
          </svg>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium mb-6">
          {t('badge')}
        </div>
        <h1 className="text-4xl lg:text-5xl font-display text-velvet-900 dark:text-surface-100 mb-4">
          {t('title')}
        </h1>
        <p className="text-surface-600 dark:text-surface-400 mb-14 leading-relaxed">
          {t('subtitle')}
        </p>

        <div className="space-y-14">
          {faqData.map((section) => (
            <section key={section.category}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xl">{categoryIcons[section.category] || '📋'}</span>
                <h2 className="text-2xl font-display text-velvet-800 dark:text-surface-200">
                  {section.category}
                </h2>
                <div className="mandala-divider flex-1 ml-2" />
              </div>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.q} className="card card-calm hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300">
                    <h3 className="font-medium text-velvet-800 dark:text-surface-200 mb-2 flex items-start gap-2">
                      <span className="text-primary-500 mt-0.5 flex-shrink-0">◆</span>
                      {item.q}
                    </h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed pl-5">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-razzmatazz-50 dark:from-primary-900/20 dark:to-razzmatazz-900/20 border border-primary-200 dark:border-primary-800 text-center relative overflow-hidden">
          <div className="absolute inset-0 mandala-pattern-rangoli opacity-[0.04]" />
          <div className="relative z-10">
            <h2 className="text-xl font-display text-velvet-800 dark:text-surface-200 mb-2">{t('ctaTitle')}</h2>
            <p className="text-surface-600 dark:text-surface-400 text-sm mb-5">
              {t('ctaSubtitle')}
            </p>
            <Link href="/signup" className="btn-primary no-underline">
              {t('ctaButton')}
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-surface-200 bg-surface-50 py-8 relative z-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs text-surface-400">
            {t('footerDisclaimer')}
          </p>
        </div>
      </footer>
    </div>
  );
}