'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PublicNavbar } from '@/components/public-navbar';

export default function FactsAndMythsPage() {
    const t = useTranslations('factsAndMyths');

    const myths = [
        { myth: t('myth1Myth'), fact: t('myth1Fact'), icon: '🫒' },
        { myth: t('myth2Myth'), fact: t('myth2Fact'), icon: '🧡' },
        { myth: t('myth3Myth'), fact: t('myth3Fact'), icon: '🍽️' },
        { myth: t('myth4Myth'), fact: t('myth4Fact'), icon: '🧘' },
        { myth: t('myth5Myth'), fact: t('myth5Fact'), icon: '🫕' },
        { myth: t('myth6Myth'), fact: t('myth6Fact'), icon: '🌑' },
        { myth: t('myth7Myth'), fact: t('myth7Fact'), icon: '🌶️' },
        { myth: t('myth8Myth'), fact: t('myth8Fact'), icon: '🪜' },
        { myth: t('myth9Myth'), fact: t('myth9Fact'), icon: '🥥' },
        { myth: t('myth10Myth'), fact: t('myth10Fact'), icon: '👶' },
    ];

    const facts = [
        { title: t('fact1Title'), description: t('fact1Desc') },
        { title: t('fact2Title'), description: t('fact2Desc') },
        { title: t('fact3Title'), description: t('fact3Desc') },
        { title: t('fact4Title'), description: t('fact4Desc') },
        { title: t('fact5Title'), description: t('fact5Desc') },
        { title: t('fact6Title'), description: t('fact6Desc') },
        { title: t('fact7Title'), description: t('fact7Desc') },
        { title: t('fact8Title'), description: t('fact8Desc') },
    ];

    // Slight rotations for the sticky-note look, alternating per card position
    const cardRotations = [-2.5, 1.8, -1.2, 2.2];

    // Key Facts Slider
    const factsPerPage = 4;
    const totalFactSlides = Math.ceil(facts.length / factsPerPage);
    const [factsSlide, setFactsSlide] = useState(0);

    const nextFactsSlide = () => setFactsSlide((p) => (p + 1) % totalFactSlides);
    const prevFactsSlide = () => setFactsSlide((p) => (p - 1 + totalFactSlides) % totalFactSlides);
    const getCurrentFacts = () => facts.slice(factsSlide * factsPerPage, factsSlide * factsPerPage + factsPerPage);

    // Myths Carousel
    const [currentMythIndex, setCurrentMythIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const goToMyth = (index: number) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentMythIndex(index);
            setIsAnimating(false);
        }, 280);
    };

    const nextMyth = () => goToMyth((currentMythIndex + 1) % myths.length);

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">

                {/* ── Hero ── */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#9511F4] mb-4 leading-tight text-center">
                    Facts &amp; Myths of pregnancy
                </h1>
                <p className="text-[#56616B] text-base sm:text-lg mb-16 leading-relaxed text-center max-w-2xl mx-auto">
                    {t('heroSubtitle')}
                </p>

                {/* ── Key Facts ── */}
                <section className="mb-20">
                    <div
                        className="relative rounded-[32px] px-10 py-10"
                        style={{ background: '#E0F0FF', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#9511F4] mb-2 text-center">
                            Key facts
                        </h2>
                        <p className="text-[#56616B] text-base mb-10 text-center max-w-xl mx-auto">
                            Essential information every expectant mother should know.
                        </p>

                        {/* Arrow — Left */}
                        <button
                            onClick={prevFactsSlide}
                            aria-label="Previous facts"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-shadow z-10"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D6016D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>

                        {/* Arrow — Right */}
                        <button
                            onClick={nextFactsSlide}
                            aria-label="Next facts"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-shadow z-10"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D6016D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>

                        {/* Cards Grid — 2 columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8 px-6 py-4">
                            {getCurrentFacts().map((item, index) => (
                                <div
                                    key={`${factsSlide}-${index}`}
                                    className="relative rounded-2xl px-6 pt-8 pb-6 shadow-md bg-cover bg-center bg-no-repeat"
                                    style={{
                                        backgroundImage: "url('/images/key-facts-bg.png')",
                                        transform: `rotate(${cardRotations[index % cardRotations.length]}deg)`,
                                        transition: 'transform 0.3s ease',
                                    }}
                                >
                                    {/* Push-pin */}
                                    <span
                                        className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl select-none"
                                        role="img"
                                        aria-label="pin"
                                    >
                                        📌
                                    </span>

                                    <h3 className="text-base font-bold text-[#D6006D] mb-2 text-center leading-snug">
                                        {item.title}
                                    </h3>
                                    <p className="text-[#56616B] text-sm leading-relaxed text-center">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Dots */}
                        <div className="flex justify-center gap-2 mt-10">
                            {Array.from({ length: totalFactSlides }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setFactsSlide(i)}
                                    className={`h-3 rounded-full transition-all duration-300 ${
                                        factsSlide === i ? 'bg-[#9511F4] w-7' : 'bg-white w-3 opacity-60'
                                    }`}
                                    aria-label={`Slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Myths ── */}
                <section className="mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#9511F4] mb-3 text-center">
                        Myths
                    </h2>
                    <p className="text-[#56616B] text-base mb-12 text-center max-w-xl mx-auto">
                        Busting traditional misconceptions with science.
                    </p>

                    <div className="relative max-w-xl mx-auto">
                        {/* Card */}
                        <div
                            className="rounded-3xl overflow-hidden transition-all duration-280"
                            style={{
                                background: '#FFF9F0',
                                border: '2px solid #FFD359',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                                opacity: isAnimating ? 0 : 1,
                                transform: isAnimating ? 'translateX(24px)' : 'translateX(0)',
                                transition: 'opacity 0.28s ease, transform 0.28s ease',
                            }}
                        >
                            <div className="flex items-stretch gap-4 p-7">
                                {/* Text */}
                                <div className="flex-1 flex flex-col gap-5">
                                    {/* Myth row */}
                                    <div>
                                        <span className="inline-block px-4 py-1 rounded-full text-white text-xs font-bold tracking-wide mb-2"
                                            style={{ background: '#FF6B9D' }}>
                                            Myth :
                                        </span>
                                        <p className="text-sm text-[#aaa] line-through leading-relaxed">
                                            {myths[currentMythIndex].myth}
                                        </p>
                                    </div>

                                    {/* Fact row */}
                                    <div>
                                        <span className="inline-block px-4 py-1 rounded-full text-white text-xs font-bold tracking-wide mb-2"
                                            style={{ background: '#9511F4' }}>
                                            Fact :
                                        </span>
                                        <p className="text-sm text-[#444] leading-relaxed">
                                            {myths[currentMythIndex].fact}
                                        </p>
                                    </div>
                                </div>

                                {/* Illustration */}
                                <div className="flex items-center justify-center w-16 flex-shrink-0">
                                    <span className="text-5xl select-none" role="img" aria-label="icon">
                                        {myths[currentMythIndex].icon}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Next arrow — bottom-right of card */}
                        <button
                            onClick={nextMyth}
                            aria-label="Next myth"
                            className="absolute -bottom-4 right-4 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
                            style={{ background: '#9511F4' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>

                        {/* Dots */}
                        <div className="flex justify-center gap-2 mt-10">
                            {myths.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goToMyth(i)}
                                    className={`h-3 rounded-full transition-all duration-300 ${
                                        currentMythIndex === i ? 'bg-[#9511F4] w-7' : 'bg-[#E0E0E0] w-3'
                                    }`}
                                    aria-label={`Myth ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA ── */}
                <div
                    className="mt-16 p-8 rounded-2xl text-center relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #F3E5F5 0%, #E8F4FF 100%)',
                        border: '2px solid #FFD359',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    }}
                >
                    <h2 className="text-xl font-semibold text-[#0A4A9B] mb-2">{t('ctaTitle')}</h2>
                    <p className="text-[#56616B] text-sm mb-5">{t('ctaSubtitle')}</p>
                    <Link
                        href="/signup"
                        className="inline-block px-8 py-3 rounded-full text-white text-base font-semibold no-underline transition-colors"
                        style={{ background: '#9511F4', boxShadow: '0 6px 20px rgba(149,17,244,0.3)' }}
                    >
                        {t('ctaButton')}
                    </Link>
                </div>
            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-[#E8E8E8] bg-white py-8">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-xs text-[#56616B]">
                        © {new Date().getFullYear()} MaternalCare India. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}