'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PublicNavbar } from '@/components/public-navbar';

function UniqueFeatureCard({
    icon,
    title,
    description,
    bgColor,
    iconSize = 80,
    iconTop = 0,
}: {
    icon: string;
    title: string;
    description: string;
    bgColor: string;
    iconSize?: number;
    iconTop?: number;
}) {
    return (
        <div className="relative w-full max-w-[320px] mx-auto" style={{ paddingTop: iconTop > 0 ? `${iconTop}px` : '0px' }}>
            {/* Floating Icon */}
            <div
                className="absolute right-0 z-20 flex items-center justify-center"
                style={{
                    width: `${iconSize}px`,
                    height: `${iconSize}px`,
                    top: iconTop < 0 ? `${iconTop}px` : '0px',
                }}
            >
                <img
                    src={icon}
                    alt=""
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Card body */}
            <div
                className="rounded-[30px] border-2 border-[#FFD359] min-h-[260px] pt-[60px] px-[28px] pb-6"
                style={{ background: bgColor }}
            >
                <h3 className="font-yatra text-[22px] leading-[32px] text-[#D6006D] mb-[10px]">
                    {title}
                </h3>
                <p className="font-inter text-[15px] leading-[20px] text-[#0A4A9B]">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default function AboutPage() {
    const t = useTranslations('about');
    const n = useTranslations('nav');
    const c = useTranslations('common');

    const uniqueFeatures = [
        {
            icon: '/images/figma/icon-partner.png',
            title: 'Shared Parenthood',
            description:
                'Pregnancy is a journey for both parents. VATSALYA encourages active involvement from fathers and caregivers through collaborative tools, shared updates, and meaningful support.',
            bgColor: '#FFF9E8',
            iconSize: 80,
            iconTop: 0,
        },
        {
            icon: '/images/figma/icon-ai.png',
            title: 'Personalized Care',
            description:
                'Receive guidance tailored to your pregnancy stage, health conditions, lifestyle preferences, and wellness needs, ensuring care that adapts to every family.',
            bgColor: '#FFEFF5',
            iconSize: 80,
            iconTop: 0,
        },
        {
            icon: '/images/figma/icon-tracking.png',
            title: 'Accessible for Everyone',
            description:
                'With multilingual support and inclusive design, VATSALYA makes maternal healthcare information understandable, accessible, and available to diverse communities.',
            bgColor: '#E6F4FF',
            iconSize: 80,
            iconTop: 0,
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
                {/* About MaternalCare Section */}
                <section className="mb-16">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#9511F4] mb-6 leading-tight">
                        About MaternalCare
                    </h1>
                    <p className="text-[#56616B] text-base sm:text-lg leading-relaxed max-w-3xl">
                        MaternalCare was designed to make pregnancy care coordinated, measurable, and deeply respectful. We believe that mothers should be in control of their care journey, and partners should have practical, meaningful ways to support them rooted in the warmth and wisdom of Indian family traditions.
                    </p>
                </section>

                {/* Our Philosophy Section */}
                <section className="mb-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-semibold text-[#9511F4] mb-6 leading-tight">
                                Our philosophy
                            </h2>
                            <div className="space-y-4 text-[#56616B] text-base sm:text-lg leading-relaxed">
                                <p>
                                    Pregnancy is a profound life transition that deserves care, support, and celebration. At MaternalCare, we're inspired by the Indian concept of Vatsalya — the deep, unconditional love and protection that a mother provides.
                                </p>
                                <p>
                                    Our platform blends modern healthcare technology with traditional family values, creating a space where both mothers and partners feel supported, informed, and connected throughout the parenthood journey.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-center lg:justify-end">
                            <img
                                src="/images/about-illustration.png"
                                alt="Mother and child illustration"
                                className="w-full max-w-md h-auto rounded-2xl"
                            />
                        </div>
                    </div>
                </section>

                {/* What Makes VATSALYA Unique Section */}
                <section>
                    <h2 className="text-3xl sm:text-4xl font-semibold text-[#9511F4] mb-4 leading-tight">
                        What Makes VATSALYA Unique?
                    </h2>
                    <p className="text-[#56616B] text-base sm:text-lg mb-10 leading-relaxed">
                        Supporting mothers and partners with personalized care throughout the parenthood journey.
                    </p>

                    {/* Horizontal row of feature cards */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-[60px] justify-center">
                        {uniqueFeatures.map((feature, index) => (
                            <UniqueFeatureCard
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                bgColor={feature.bgColor}
                                iconSize={feature.iconSize}
                                iconTop={feature.iconTop}
                            />
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
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