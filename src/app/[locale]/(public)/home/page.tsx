'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PublicNavbar } from '@/components/public-navbar';
import svgPaths from '@/lib/svg-paths';

function HeroSection() {
    const t = useTranslations('home');
    const heroFirstWord = t('heroTitle').split(' ')[0];

    return (
        <section className="relative bg-white min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-start">
            {/* Background image */}
            <img
                src="/images/hero-bg-1.png"
                alt=""
                aria-hidden
                className="absolute inset-x-0 top-0 w-full h-[87%] object-cover object-top opacity-20 pointer-events-none"
            />
            {/* Decorative S-curve ribbon — overlaps hero + next section */}
            <div className="absolute bottom-0 left-0 w-full overflow-visible pointer-events-none translate-y-[40%]">
                <svg
                    viewBox="0 0 1920 675"
                    preserveAspectRatio="none"
                    className="w-full h-[260px] md:h-[320px] lg:h-[380px]"
                >
                    <defs>
                        <linearGradient
                            id="heroCurveGrad"
                            x1="0"
                            y1="0"
                            x2="1920"
                            y2="0"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0%" stopColor="#C6B2E4" />
                            <stop offset="55%" stopColor="#D7C2E8" />
                            <stop offset="100%" stopColor="#F1C4D6" />
                        </linearGradient>
                    </defs>

                    <path
                        d="
    M -100 250
    C 200 60,
      650 100,
      950 260

    C 1200 370,
      1450 420,
      1700 250

    C 1850 170,
      1980 80,
      2400 -50
  "
                        fill="none"
                        stroke="url(#heroCurveGrad)"
                        strokeWidth="250"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-24 lg:pt-40 pb-0">
                {/* Highlight capsule behind first word */}
                <div className="relative inline-block mb-4 px-4">
                    <span
                        className="relative z-10 font-semibold text-white text-xl sm:text-2xl md:text-3xl lg:text-5xl leading-tight"
                    >
                        {heroFirstWord}
                    </span>
                    <span className="absolute inset-0 rounded-full bg-[#a997b4] -z-0" />
                </div>
                <h1
                    className="font-semibold text-[#a86b81] text-lg sm:text-xl md:text-2xl lg:text-5xl leading-tight mt-2"
                >
                    {t('heroTitle').slice(heroFirstWord.length).trim()}
                </h1>
                <p
                    className="mt-6 md:mt-8 text-[#a86b81] text-sm sm:text-base md:text-lg lg:text-xl max-w-4xl"
                >
                    {t('heroSubtitle')}
                </p>
            </div>
        </section>
    );
}

function PhoneCard({
    img,
    title,
    description,
}: {
    img: string;
    title: string;
    description: string;
}) {
    return (
        <div className="relative w-full max-w-[260px] sm:max-w-[280px] mx-auto pt-12">
            {/* Floating Icon */}
            <div className="absolute top-0 left-0 z-20">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <img
                        src={img}
                        alt=""
                        className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain"
                    />
                </div>
            </div>

            {/* Card */}
            <div
                className="rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] pt-16 sm:pt-20 lg:pt-24 px-4 sm:px-5 lg:px-6 pb-6 sm:pb-7 lg:pb-8 min-h-0 sm:min-h-[320px] lg:min-h-[360px]"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(255, 200, 221, 0.5) 0%, rgba(218, 213, 239, 0.5) 48%, rgba(189, 224, 254, 0.5) 100%)",
                }}
            >
                <h3
                    className="text-[#a86b81] text-[18px] sm:text-[20px] lg:text-[22px] font-semibold leading-tight mb-3 sm:mb-4"
                >
                    {title}
                </h3>

                <p
                    className="text-[#5F6670] text-[14px] sm:text-base lg:text-lg leading-relaxed"
                >
                    {description}
                </p>
            </div>
        </div>
    );
}

function FeaturesSection() {
    const t = useTranslations('home');

    return (
        <section className="bg-white py-12 sm:py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                <div className="text-center mb-14 sm:mb-20 lg:mb-24">
                    <h2
                        className="font-semibold text-[#a86b81] text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-4 sm:mb-6 lg:mb-8"
                    >
                        {t('featuresTitle')}
                    </h2>

                    <p
                        className="text-[#a86b81] text-lg sm:text-xl lg:text-2xl"
                    >
                        {t('featuresSubtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-0 justify-items-center mt-8 sm:mt-12 lg:mt-16">
                    <div>
                        <PhoneCard
                            img="/images/figma/e6a060fb703e0bb7ec2cfe0a205f1042abcf3d3d.png"
                            title={t('feature1Title')}
                            description={t('feature1Desc')}
                        />
                    </div>
                    <div className="md:mt-20">
                        <PhoneCard
                            img="/images/figma/0e1ba4a47d961ffe3fc861c7d90a9ebbf1751e95.png"
                            title={t('feature2Title')}
                            description={t('feature2Desc')}
                        />
                    </div>
                    <div>
                        <PhoneCard
                            img="/images/figma/94f1812d6b0a0dd597463eca20fe449336dbde3b.png"
                            title={t('feature3Title')}
                            description={t('feature3Desc')}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
function HowItWorksSection() {
    const t = useTranslations("home");

    const steps = [
        {
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 58 58">
                    <path d={svgPaths.p4f55700} fill="white" />
                </svg>
            ),
            title: t("step1Title"),
            description: t("step1Desc"),
        },
        {
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 52 52">
                    <path d={svgPaths.p2437bbc0} fill="white" />
                </svg>
            ),
            title: t("step2Title"),
            description: t("step2Desc"),
        },
        {
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 47 47">
                    <path d={svgPaths.p9873c40} fill="white" />
                </svg>
            ),
            title: t("step3Title"),
            description: t("step3Desc"),
        },
    ];

    return (
        <section className="relative py-12 sm:py-16 lg:py-24 overflow-hidden bg-white">

            {/* Heading */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-10 sm:mb-14">
                <h2
                    className="font-semibold text-[#A86B81] text-3xl sm:text-5xl md:text-7xl leading-tight mb-4 sm:mb-6"
                >
                    {t("howItWorksTitle")}
                </h2>

                <p
                    className="text-[#A86B81] text-base sm:text-xl md:text-2xl"
                >
                    {t("howItWorksSubtitle")}
                </p>
            </div>

            {/* === MOBILE/TABLET: Vertical wave with steps along it (hidden on lg+) === */}
            <div className="lg:hidden relative max-w-lg mx-auto px-4 h-[720px] sm:h-[800px]">
                {/* Vertical wave SVG — goes down the left side */}
                <svg
                    className="absolute left-6 sm:left-10 top-0 h-full w-[70px] sm:w-[90px] pointer-events-none"
                    viewBox="0 0 80 800"
                    fill="none"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient
                            id="timelineGradV"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="800"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0%" stopColor="#FFAFCC" />
                            <stop offset="100%" stopColor="#BDE0FE" />
                        </linearGradient>
                    </defs>

                    <path
                        d="
                            M 40 -10
                            C 100 60,
                              0 140,
                              40 230
                            C 80 320,
                              0 400,
                              40 490
                            C 80 580,
                              0 660,
                              40 810
                        "
                        stroke="url(#timelineGradV)"
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeOpacity="0.30"
                        fill="none"
                    />
                </svg>

                {/* Step 1 — near top */}
                <div className="absolute left-[55px] sm:left-[80px] top-[20px] right-4 flex items-start gap-3">
                    <div className="shrink-0 flex flex-col items-center">
                        <div
                            className="text-[60px] sm:text-[80px] font-normal leading-none select-none bg-clip-text bg-gradient-to-b from-[#cdb4db] to-white text-transparent"
                        >
                            1
                        </div>
                        <div className="w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] rounded-full bg-[#FFC8DD] flex items-center justify-center shadow-lg -mt-3">
                            {steps[0].icon}
                        </div>
                    </div>
                    <div className="pt-6 sm:pt-8">
                        <h3 className="text-[#A86B81] text-[17px] sm:text-[19px] font-semibold mb-1.5">
                            {steps[0].title}
                        </h3>
                        <p className="text-[#5F6670] text-[14px] sm:text-[15px] leading-relaxed">
                            {steps[0].description}
                        </p>
                    </div>
                </div>

                {/* Step 2 — middle */}
                <div className="absolute left-[55px] sm:left-[80px] top-[240px] sm:top-[260px] right-4 flex items-start gap-3">
                    <div className="shrink-0 flex flex-col items-center">
                        <div
                            className="text-[60px] sm:text-[80px] font-normal leading-none select-none bg-clip-text bg-gradient-to-b from-[#cdb4db] to-white text-transparent"
                        >
                            2
                        </div>
                        <div className="w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] rounded-full bg-[#FFC8DD] flex items-center justify-center shadow-lg -mt-3">
                            {steps[1].icon}
                        </div>
                    </div>
                    <div className="pt-6 sm:pt-8">
                        <h3 className="text-[#A86B81] text-[17px] sm:text-[19px] font-semibold mb-1.5">
                            {steps[1].title}
                        </h3>
                        <p className="text-[#5F6670] text-[14px] sm:text-[15px] leading-relaxed">
                            {steps[1].description}
                        </p>
                    </div>
                </div>

                {/* Step 3 — near bottom */}
                <div className="absolute left-[55px] sm:left-[80px] top-[480px] sm:top-[520px] right-4 flex items-start gap-3">
                    <div className="shrink-0 flex flex-col items-center">
                        <div
                            className="text-[60px] sm:text-[80px] font-normal leading-none select-none bg-clip-text bg-gradient-to-b from-[#cdb4db] to-white text-transparent"
                        >
                            3
                        </div>
                        <div className="w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] rounded-full bg-[#FFC8DD] flex items-center justify-center shadow-lg -mt-3">
                            {steps[2].icon}
                        </div>
                    </div>
                    <div className="pt-6 sm:pt-8">
                        <h3 className="text-[#A86B81] text-[17px] sm:text-[19px] font-semibold mb-1.5">
                            {steps[2].title}
                        </h3>
                        <p className="text-[#5F6670] text-[14px] sm:text-[15px] leading-relaxed">
                            {steps[2].description}
                        </p>
                    </div>
                </div>
            </div>

            {/* === DESKTOP: Horizontal wave with absolute-positioned steps (hidden below lg) === */}
            <div className="hidden lg:block relative h-[560px]">

                {/* Wave */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 1600 560"
                    fill="none"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient
                            id="timelineGrad"
                            x1="0"
                            y1="0"
                            x2="1600"
                            y2="0"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0%" stopColor="#FFAFCC" />
                            <stop offset="100%" stopColor="#BDE0FE" />
                        </linearGradient>
                    </defs>

                    <path
                        d="
                            M -20 250
                            C 250 150,
                              500 240,
                              800 360
                            C 1050 460,
                               1350 450,
                               1620 220
                        "
                        stroke="url(#timelineGrad)"
                        strokeWidth="18"
                        strokeLinecap="round"
                        strokeOpacity="0.28"
                        fill="none"
                    />
                </svg>

                {/* Steps */}
                <div className="relative h-full max-w-[1200px] mx-auto px-6">

                    {/* STEP 1 */}
                    <div className="absolute left-[8%] top-[170px]">

                        <div
                            className="absolute -left-0 top-20 text-[150px] font-normal leading-none select-none whitespace-nowrap bg-clip-text bg-gradient-to-b from-[#cdb4db] to-white text-transparent"
                        >
                            1
                        </div>

                        <div className="relative z-10 w-[78px] h-[78px] rounded-full bg-[#FFC8DD] flex items-center justify-center shadow-lg">
                            {steps[0].icon}
                        </div>

                        <div className="mt-40 max-w-[300px]">
                            <h3 className="text-[#A86B81] text-[22px] font-semibold mb-3">
                                {steps[0].title}
                            </h3>

                            <p className="text-[#5F6670] text-[17px] leading-relaxed">
                                {steps[0].description}
                            </p>
                        </div>
                    </div>

                    {/* STEP 2 */}
                    <div className="absolute left-[43%] top-[300px]">

                        <div
                            className="absolute left-2 -top-[170px] text-[150px] font-normal leading-none select-none whitespace-nowrap bg-clip-text bg-gradient-to-b from-[#cdb4db] to-white text-transparent"
                        >
                            2
                        </div>

                        <div className="relative z-10 w-[78px] h-[78px] rounded-full bg-[#FFC8DD] flex items-center justify-center shadow-lg">
                            {steps[1].icon}
                        </div>

                        <div className="absolute left-[130px] -top-[150px] w-[280px]">
                            <h3 className="text-[#A86B81] text-[22px] font-semibold mb-3">
                                {steps[1].title}
                            </h3>

                            <p className="text-[#5F6670] text-[17px] leading-relaxed">
                                {steps[1].description}
                            </p>
                        </div>
                    </div>

                    {/* STEP 3 */}
                    <div className="absolute right-[15%] top-[355px]">

                        <div
                            className="absolute right-[100px] top-28 text-[150px] font-normal leading-none select-none whitespace-nowrap bg-clip-text bg-gradient-to-b from-[#cdb4db] to-white text-transparent"
                        >
                            3
                        </div>

                        <div className="relative z-10 w-[78px] h-[78px] rounded-full bg-[#FFC8DD] flex items-center justify-center shadow-lg">
                            {steps[2].icon}
                        </div>

                        <div className="absolute left-[2px] top-28 w-[300px]">
                            <h3 className="text-[#A86B81] text-[22px] font-semibold mb-3">
                                {steps[2].title}
                            </h3>

                            <p className="text-[#5F6670] text-[17px] leading-relaxed">
                                {steps[2].description}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
function BottomCardsSection() {
    const t = useTranslations("home");

    return (
        <section className="relative pt-10 sm:pt-14 lg:pt-18 pb-20 sm:pb-32 lg:pb-40 overflow-hidden -mt-16 sm:-mt-24 lg:-mt-32">
            {/* Subtle light gradient wash — blends into sections above/below with no hard line */}

            {/* Subtle pink glow at bottom — radial gradient, inverted: strongest near the blue wave, fading upward */}
            <div
                className="absolute pointer-events-none w-[120%] sm:w-[1407px] max-w-none h-[410px] sm:h-[510px] lg:h-[610px] -left-[10%] sm:left-[-67px] -top-[120px]"
                style={{
                    backgroundImage:
                        "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,200,221,0.45) 0%, rgba(255,200,221,0.22) 50%, rgba(255,255,255,0) 100%)",
                }}
            />

            {/* Blue wave SVG — responsive, hidden on very small screens to avoid overflow issues */}
            <div
                className="absolute pointer-events-none w-[130vw] sm:w-[1900px] max-w-none h-[600px] sm:h-[800px] lg:h-[1038px] -left-[15vw] sm:left-[-400px] top-[20px] sm:top-[50px]"
            >
                <div
                    style={{
                        transform: "scaleY(-1) rotate(-179.33deg)",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 2187.62 1012.39"
                    >
                        <path
                            d="M1107.19 232.356C494.047 485.438 62.7759 151.833 0 0L143.354 996.168L2118.92 1012.39C2170.77 755.94 2243.35 222.258 2118.92 139.145L2115.99 137.188C1961.72 34.1116 1828.3 -55.0363 1107.19 232.356Z"
                            fill="#D2E4FA"
                            fillOpacity="0.75"
                        />
                    </svg>
                </div>
            </div>

            <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 mt-40 sm:mt-64 lg:mt-96">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Card 1 – Pink gradient */}
                    <div
                        className="rounded-[30px] sm:rounded-[40px] lg:rounded-[50px] p-5 sm:p-6 lg:p-8 min-h-0 sm:min-h-[340px] lg:min-h-[380px] flex flex-col text-center"
                        style={{
                            background:
                                "linear-gradient(179.94deg, rgb(255, 255, 255) 0%, rgb(255, 200, 221) 113.98%)",
                        }}
                    >
                        <div className="w-full h-[120px] sm:h-[140px] lg:h-[160px] mb-4 sm:mb-5 rounded-[20px] sm:rounded-[24px] lg:rounded-[27px] bg-gradient-to-br from-[#FFC8DD]/30 to-[#FFAFCC]/50 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 sm:w-10 sm:h-10 text-[#A86B81]/20"
                                fill="none"
                                viewBox="0 0 58 58"
                            >
                                <path d={svgPaths.p4f55700} fill="currentColor" />
                            </svg>
                        </div>

                        <h3 className="text-[18px] sm:text-[18px] lg:text-[17px] font-semibold leading-[1.4] text-[#56616b] mb-2 sm:mb-5">
                            {t("feature4Title")}
                        </h3>

                        <p className="text-[13px] sm:text-[13px] lg:text-[14px] leading-[1.5] text-[#56616b]">
                            {t("feature4Desc")}
                        </p>
                    </div>

                    {/* Card 2 – Blue gradient */}
                    <div
                        className="rounded-[30px] sm:rounded-[40px] lg:rounded-[50px] p-5 sm:p-6 lg:p-8 min-h-0 sm:min-h-[340px] lg:min-h-[380px] flex flex-col text-center"
                        style={{
                            background:
                                "linear-gradient(179.94deg, rgb(255, 255, 255) 0%, rgb(189, 224, 254) 113.98%)",
                        }}
                    >
                        <div className="w-full h-[120px] sm:h-[140px] lg:h-[160px] mb-4 sm:mb-5 rounded-[20px] sm:rounded-[24px] lg:rounded-[27px] overflow-hidden">
                            <img
                                src="/images/appointment-card.jpg"
                                alt={t("feature5Title")}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h3 className="text-[16px] sm:text-[17px] lg:text-[18px] font-semibold leading-[1.3] text-[#56616b] mb-2 sm:mb-3">
                            {t("feature5Title")}
                        </h3>

                        <p className="text-[13px] sm:text-[13px] lg:text-[14px] leading-[1.5] text-[#56616b]">
                            {t("feature5Desc")}
                        </p>
                    </div>

                    {/* Card 3 – Blue gradient */}
                    <div
                        className="rounded-[30px] sm:rounded-[40px] lg:rounded-[50px] p-5 sm:p-6 lg:p-8 min-h-0 sm:min-h-[340px] lg:min-h-[380px] flex flex-col md:col-span-2 lg:col-span-1 text-center"
                        style={{
                            background:
                                "linear-gradient(179.94deg, rgb(255, 255, 255) 0%, rgb(189, 224, 254) 113.98%)",
                        }}
                    >
                        <div className="w-full h-[120px] sm:h-[140px] lg:h-[160px] mb-4 sm:mb-5 rounded-[20px] sm:rounded-[24px] lg:rounded-[27px] bg-gradient-to-br from-[#BDE0FE]/30 to-[#8EC5FC]/50 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 sm:w-10 sm:h-10 text-[#56616b]/20"
                                fill="none"
                                viewBox="0 0 47 47"
                            >
                                <path d={svgPaths.p9873c40} fill="currentColor" />
                            </svg>
                        </div>

                        <h3 className="text-[16px] sm:text-[17px] lg:text-[18px] font-semibold leading-[1.3] text-[#56616b] mb-2 sm:mb-3">
                            {t("feature6Title")}
                        </h3>

                        <p className="text-[13px] sm:text-[13px] lg:text-[14px] leading-[1.5] text-[#56616b]">
                            {t("feature6Desc")}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}



export default function HomePage() {
    return (
        <div className="min-h-screen bg-white font-yatra">
            <PublicNavbar />
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <BottomCardsSection />

        </div>
    );
}
