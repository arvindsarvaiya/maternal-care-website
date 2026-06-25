'use client';

import { useState } from 'react';
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

  // Flatten all FAQ items for accordion display
  const allFaqs = faqData.flatMap(section => 
    section.items.map(item => ({ ...item, category: section.category }))
  );

  // State for accordion - first item expanded by default
  const [expandedIndex, setExpandedIndex] = useState(0);

  // Background colors for alternating FAQ items
  const bgColors = [
    'bg-[#FFF9E6]', // light yellow
    'bg-[#E8F4FF]', // light blue
    'bg-[#FFF0F6]', // light pink
    'bg-[#FFF9E6]', // light yellow (repeat)
  ];

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#9511F4] mb-4 leading-tight">
          {t('title')}
        </h1>
        
        {/* Subheading */}
        <p className="text-[#56616B] text-base sm:text-lg mb-12 leading-relaxed">
          {t('subtitle')}
        </p>

        {/* FAQ Accordion Items */}
        <div className="space-y-4">
          {allFaqs.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            const bgColor = bgColors[index % bgColors.length];
            
            return (
              <div
                key={index}
                className={`rounded-2xl border-2 border-[#FFD359] shadow-sm transition-all duration-300 ${bgColor} ${
                  isExpanded ? 'shadow-md' : ''
                }`}
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="text-[#0A4A9B] font-semibold text-base sm:text-lg pr-4">
                    {faq.q}
                  </span>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    {isExpanded ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9511F4"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6L6 18" />
                        <path d="M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9511F4"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Answer Content */}
                {isExpanded && (
                  <div className="px-6 pb-5 pt-0">
                    <p className="text-[#56616B] text-sm sm:text-base leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-[#F3E5F5] to-[#E8F4FF] border-2 border-[#FFD359] text-center relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-[#0A4A9B] mb-2">{t('ctaTitle')}</h2>
            <p className="text-[#56616B] text-sm mb-5">
              {t('ctaSubtitle')}
            </p>
            <Link href="/signup" className="inline-block px-8 py-3 rounded-full bg-[#9511F4] text-white text-base font-semibold hover:bg-[#7A0ED4] transition-colors shadow-lg shadow-[#9511F4]/25 no-underline">
              {t('ctaButton')}
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E8E8] bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-[#56616B]">
            {t('footerDisclaimer')}
          </p>
        </div>
      </footer>
    </div>
  );
}