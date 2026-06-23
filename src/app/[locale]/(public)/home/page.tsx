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
                className="absolute inset-x-0 top-0 w-full h-[86%] object-cover object-top opacity-20 pointer-events-none"
            />
            {/* Decorative S-curve ribbon — overlaps hero + next section */}
            <div className="absolute bottom-0 left-0 w-full overflow-visible pointer-events-none translate-y-[45%]">
                <svg
                    viewBox="0 0 1920 675"
                    preserveAspectRatio="none"
                    className="w-full h-[290px] md:h-[360px] lg:h-[430px]"
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
                            <stop offset="0%" stopColor="#C3AAFB" />
                            <stop offset="100%" stopColor="#7CDBFF" stopOpacity="0.7" />
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
                        strokeWidth="170"
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
                    <span className="absolute inset-0 rounded-full bg-[#D6006D] -z-0" />
                </div>
                <h1
                    className="font-semibold text-[#9511F4] text-lg sm:text-xl md:text-2xl lg:text-5xl leading-tight mt-2"
                >
                    {t('heroTitle').slice(heroFirstWord.length).trim()}
                </h1>
                <p
                    className="mt-6 md:mt-8 text-[#4A698F] text-sm sm:text-base md:text-lg lg:text-xl max-w-4xl"
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
    gradient,
}: {
    img: string;
    title: string;
    description: string;
    gradient: string;
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
                className="rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] pt-16 sm:pt-20 lg:pt-24 px-4 sm:px-5 lg:px-6 pb-6 sm:pb-7 lg:pb-8 min-h-0 sm:min-h-[320px] lg:min-h-[360px] border-2 border-[#FFD359]"
                style={{ background: gradient }}
            >
                <h3
                    className="text-[#0A4A9B] text-[18px] sm:text-[20px] lg:text-[22px] font-semibold leading-tight mb-3 sm:mb-4"
                >
                    {title}
                </h3>

                <p
                    className="text-[#56616B] text-[14px] sm:text-base lg:text-lg leading-relaxed"
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
                        className="font-semibold text-[#9511F4] text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-4 sm:mb-6 lg:mb-8"
                    >
                        {t('featuresTitle')}
                    </h2>

                    <p
                        className="text-[#0A4A9B] text-lg sm:text-xl lg:text-2xl"
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
                            gradient="linear-gradient(180deg, rgba(255,228,242,0.5) 0%, rgba(255,228,242,0.3) 100%)"
                        />
                    </div>
                    <div className="md:mt-20">
                        <PhoneCard
                            img="/images/figma/0e1ba4a47d961ffe3fc861c7d90a9ebbf1751e95.png"
                            title={t('feature2Title')}
                            description={t('feature2Desc')}
                            gradient="linear-gradient(180deg, rgba(255,251,239,0.5) 0%, rgba(255,251,239,0.3) 100%)"
                        />
                    </div>
                    <div>
                        <PhoneCard
                            img="/images/figma/94f1812d6b0a0dd597463eca20fe449336dbde3b.png"
                            title={t('feature3Title')}
                            description={t('feature3Desc')}
                            gradient="linear-gradient(180deg, rgba(208,233,255,0.5) 0%, rgba(208,233,255,0.3) 100%)"
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
                    <path d={svgPaths.p4f55700} fill="#F7941D" />
                </svg>
            ),
            title: t("step1Title"),
            description: t("step1Desc"),
        },
        {
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 52 52">
                    <path d={svgPaths.p2437bbc0} fill="#F7941D" />
                </svg>
            ),
            title: t("step2Title"),
            description: t("step2Desc"),
        },
        {
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 47 47">
                    <path d={svgPaths.p9873c40} fill="#F7941D" />
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
                    className="font-semibold text-[#9511F4] text-3xl sm:text-5xl md:text-7xl leading-tight mb-4 sm:mb-6"
                >
                    {t("howItWorksTitle")}
                </h2>

                <p
                    className="text-[#0A4A9B] text-base sm:text-xl md:text-2xl"
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
                            <stop offset="0%" stopColor="#9370E2" />
                            <stop offset="100%" stopColor="#00AEEF" />
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
                        strokeOpacity="0.50"
                        fill="none"
                    />
                </svg>

                {/* Step 1 — near top */}
                <div className="absolute left-[55px] sm:left-[80px] top-[20px] right-4 flex items-start gap-3">
                    <div className="shrink-0 flex flex-col items-center">
                        <div
                            className="text-[60px] sm:text-[80px] font-normal leading-none select-none bg-clip-text bg-gradient-to-b from-[#d6006d] to-white text-transparent"
                        >
                            1
                        </div>
                        <div className="w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] rounded-full bg-[#FFE089] flex items-center justify-center shadow-lg -mt-3">
                            {steps[0].icon}
                        </div>
                    </div>
                    <div className="pt-6 sm:pt-8">
                        <h3 className="text-[#0A4A9B] text-[17px] sm:text-[19px] font-semibold mb-1.5">
                            {steps[0].title}
                        </h3>
                        <p className="text-[#56616B] text-[14px] sm:text-[15px] leading-relaxed">
                            {steps[0].description}
                        </p>
                    </div>
                </div>

                {/* Step 2 — middle */}
                <div className="absolute left-[55px] sm:left-[80px] top-[240px] sm:top-[260px] right-4 flex items-start gap-3">
                    <div className="shrink-0 flex flex-col items-center">
                        <div
                            className="text-[60px] sm:text-[80px] font-normal leading-none select-none bg-clip-text bg-gradient-to-b from-[#d6006d] to-white text-transparent"
                        >
                            2
                        </div>
                        <div className="w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] rounded-full bg-[#FFE089] flex items-center justify-center shadow-lg -mt-3">
                            {steps[1].icon}
                        </div>
                    </div>
                    <div className="pt-6 sm:pt-8">
                        <h3 className="text-[#0A4A9B] text-[17px] sm:text-[19px] font-semibold mb-1.5">
                            {steps[1].title}
                        </h3>
                        <p className="text-[#56616B] text-[14px] sm:text-[15px] leading-relaxed">
                            {steps[1].description}
                        </p>
                    </div>
                </div>

                {/* Step 3 — near bottom */}
                <div className="absolute left-[55px] sm:left-[80px] top-[480px] sm:top-[520px] right-4 flex items-start gap-3">
                    <div className="shrink-0 flex flex-col items-center">
                        <div
                            className="text-[60px] sm:text-[80px] font-normal leading-none select-none bg-clip-text bg-gradient-to-b from-[#d6006d] to-white text-transparent"
                        >
                            3
                        </div>
                        <div className="w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] rounded-full bg-[#FFE089] flex items-center justify-center shadow-lg -mt-3">
                            {steps[2].icon}
                        </div>
                    </div>
                    <div className="pt-6 sm:pt-8">
                        <h3 className="text-[#0A4A9B] text-[17px] sm:text-[19px] font-semibold mb-1.5">
                            {steps[2].title}
                        </h3>
                        <p className="text-[#56616B] text-[14px] sm:text-[15px] leading-relaxed">
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
                            <stop offset="0%" stopColor="#9370E2" />
                            <stop offset="100%" stopColor="#00AEEF" />
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
                        strokeOpacity="0.50"
                        fill="none"
                    />
                </svg>

                {/* Steps */}
                <div className="relative h-full max-w-[1200px] mx-auto px-6">

                    {/* STEP 1 */}
                    <div className="absolute left-[8%] top-[170px]">

                        <div
                            className="absolute -left-0 top-20 text-[150px] font-normal leading-none select-none whitespace-nowrap bg-clip-text bg-gradient-to-b from-[#d6006d] to-white text-transparent"
                        >
                            1
                        </div>

                        <div className="relative z-10 w-[78px] h-[78px] rounded-full bg-[#FFE089] flex items-center justify-center shadow-lg">
                            {steps[0].icon}
                        </div>

                        <div className="mt-40 max-w-[300px]">
                            <h3 className="text-[#0A4A9B] text-[22px] font-semibold mb-3">
                                {steps[0].title}
                            </h3>

                            <p className="text-[#56616B] text-[17px] leading-relaxed">
                                {steps[0].description}
                            </p>
                        </div>
                    </div>

                    {/* STEP 2 */}
                    <div className="absolute left-[43%] top-[300px]">

                        <div
                            className="absolute left-2 -top-[170px] text-[150px] font-normal leading-none select-none whitespace-nowrap bg-clip-text bg-gradient-to-b from-[#d6006d] to-white text-transparent"
                        >
                            2
                        </div>

                        <div className="relative z-10 w-[78px] h-[78px] rounded-full bg-[#FFE089] flex items-center justify-center shadow-lg">
                            {steps[1].icon}
                        </div>

                        <div className="absolute left-[130px] -top-[150px] w-[280px]">
                            <h3 className="text-[#0A4A9B] text-[22px] font-semibold mb-3">
                                {steps[1].title}
                            </h3>

                            <p className="text-[#56616B] text-[17px] leading-relaxed">
                                {steps[1].description}
                            </p>
                        </div>
                    </div>

                    {/* STEP 3 */}
                    <div className="absolute right-[15%] top-[355px]">

                        <div
                            className="absolute right-[100px] top-28 text-[150px] font-normal leading-none select-none whitespace-nowrap bg-clip-text bg-gradient-to-b from-[#d6006d] to-white text-transparent"
                        >
                            3
                        </div>

                        <div className="relative z-10 w-[78px] h-[78px] rounded-full bg-[#FFE089] flex items-center justify-center shadow-lg">
                            {steps[2].icon}
                        </div>

                        <div className="absolute left-[2px] top-28 w-[300px]">
                            <h3 className="text-[#0A4A9B] text-[22px] font-semibold mb-3">
                                {steps[2].title}
                            </h3>

                            <p className="text-[#56616B] text-[17px] leading-relaxed">
                                {steps[2].description}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

function BottomCardsAndFooterSection() {
    const t = useTranslations("home");

    return (
        <div className="relative overflow-hidden">

            {/* Single shared blue-purple wave — tall enough to span cards + footer */}
            <div className="absolute z-10 pointer-events-none w-[130vw] sm:w-[1900px] max-w-none h-[1100px] sm:h-[1450px] lg:h-[1900px] -left-[15vw] sm:left-[-400px] -top-[170px] sm:-top-[180px] lg:-top-[120px]">
                <div style={{ transform: "scaleY(-1) rotate(-179deg)", width: "100%", height: "100%" }}>
                    <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 2187.62 1012.39"
                    >
                        <defs>
                            <linearGradient
                                gradientUnits="userSpaceOnUse"
                                id="sharedWaveGrad"
                                x1="233.031" x2="1665.72"
                                y1="710.146" y2="702.433"
                            >
                                <stop stopColor="#A4DCFC" />
                                <stop offset="1" stopColor="#C3AAFB" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0 155C350 255 710 335 1107.19 270C1490 205 1810 95 2118.92 175C2175 410 2165 735 2118.92 1012.39L143.354 996.168C95 725 45 430 0 155Z"
                            fill="url(#sharedWaveGrad)"
                        />
                    </svg>
                </div>
            </div>

            {/* ── BOTTOM CARDS SECTION ── */}
            <section className="relative pt-10 sm:pt-14 lg:pt-18 pb-20 sm:pb-32 lg:pb-40 overflow-visible -mt-16 sm:-mt-24 lg:-mt-32">

                {/* Pink glow — kept behind the shared blue wave */}
                <div
                    className="absolute z-0 pointer-events-none w-[120%] sm:w-[1407px] max-w-none h-[410px] sm:h-[510px] lg:h-[610px] -left-[10%] sm:left-[-67px] -top-[40px]"
                    style={{
                        backgroundImage:
                            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,200,221,0.45) 0%, rgba(255,200,221,0.22) 50%, rgba(255,255,255,0) 100%)",
                    }}
                />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mt-72 sm:mt-96 lg:mt-[34rem]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-0 justify-items-center mt-8 sm:mt-12 lg:mt-16">

                        {/* Card 1 – Baby Growth Tracking */}
                        <div
                            className="w-full max-w-[260px] sm:max-w-[280px] h-[320px] sm:h-[340px] lg:h-[360px] rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] p-4 sm:p-5 lg:p-6 flex flex-col text-center border-2 border-[#FFD359]"
                            style={{ background: "#e8f4ff" }}
                        >
                            <div className="w-full h-[105px] sm:h-[120px] lg:h-[135px] mb-4 rounded-[20px] sm:rounded-[24px] lg:rounded-[27px] overflow-hidden">
                                <img
                                    src="/images/figma/a0c958de0eeab311bbddb2d43e15b58cc628b3c2.png"
                                    alt={t("feature4Title")}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-[18px] sm:text-[18px] lg:text-[17px] font-semibold leading-[1.4] text-[#0A4A9B] mb-2 sm:mb-5">
                                {t("feature4Title")}
                            </h3>
                            <p className="text-[13px] sm:text-[13px] lg:text-[14px] leading-[1.5] text-[#56616B]">
                                {t("feature4Desc")}
                            </p>
                        </div>

                        {/* Card 2 – Appointment Management */}
                        <div
                            className="w-full max-w-[260px] sm:max-w-[280px] md:mt-20 h-[320px] sm:h-[340px] lg:h-[360px] rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] p-4 sm:p-5 lg:p-6 flex flex-col text-center border-2 border-[#FFD359]"
                            style={{ background: "#fff0f6" }}
                        >
                            <div className="w-full h-[105px] sm:h-[120px] lg:h-[135px] mb-4 rounded-[20px] sm:rounded-[24px] lg:rounded-[27px] overflow-hidden">
                                <img
                                    src="/images/figma/d4566c710abaf5be681213683ebd1beab175ee34.png"
                                    alt={t("feature5Title")}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-[16px] sm:text-[17px] lg:text-[18px] font-semibold leading-[1.3] text-[#0A4A9B] mb-2 sm:mb-3">
                                {t("feature5Title")}
                            </h3>
                            <p className="text-[13px] sm:text-[13px] lg:text-[14px] leading-[1.5] text-[#56616B]">
                                {t("feature5Desc")}
                            </p>
                        </div>

                        {/* Card 3 – Multi-language Support */}
                        <div
                            className="w-full max-w-[260px] sm:max-w-[280px] h-[320px] sm:h-[340px] lg:h-[360px] rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] p-4 sm:p-5 lg:p-6 flex flex-col text-center border-2 border-[#FFD359]"
                            style={{ background: "#e8f4ff" }}
                        >
                            <div className="w-full h-[105px] sm:h-[120px] lg:h-[135px] mb-4 rounded-[20px] sm:rounded-[24px] lg:rounded-[27px] overflow-hidden">
                                <img
                                    src="/images/figma/f05cf4e5cbd8dab7cbcb1476df9b36e51e124919.png"
                                    alt={t("feature6Title")}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-[16px] sm:text-[17px] lg:text-[18px] font-semibold leading-[1.3] text-[#0A4A9B] mb-2 sm:mb-3">
                                {t("feature6Title")}
                            </h3>
                            <p className="text-[13px] sm:text-[13px] lg:text-[14px] leading-[1.5] text-[#56616B]">
                                {t("feature6Desc")}
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── FOOTER SECTION ── */}
            {/* background removed — wave from parent shows through */}
            <section className="relative z-20 py-0 overflow-visible">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6 lg:py-7">

                    {/* White rounded container */}
                    <div className="bg-white rounded-[24px] sm:rounded-[28px] lg:rounded-[34px] p-3 sm:p-4 lg:p-5">
                        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">

                            {/* Left: CTA + contact */}
                            <div className="flex flex-col justify-center gap-3 lg:gap-4 flex-1">
                                {/* Logo */}
                                <p className="font-normal text-[#56616B] text-xl sm:text-2xl lg:text-3xl leading-tight">
                                    Logo
                                </p>

                                {/* CTA text */}
                                <div className="flex flex-col gap-2">
                                    <h2 className="font-semibold text-[#0A4A9B] text-lg sm:text-xl lg:text-2xl leading-tight">
                                        {t("ctaTitle")}
                                    </h2>
                                    <p className="text-[#56616B] text-xs sm:text-sm leading-relaxed">
                                        {t("ctaSubtitle")}
                                    </p>
                                </div>

                                {/* Contact info */}
                                <div className="flex flex-col gap-1.5">
                                    {/* Phone */}
                                    <div className="flex items-center gap-3">
                                        <div className="shrink-0 size-8 flex items-center justify-center">
                                            <svg className="size-full" fill="none" viewBox="0 0 40 40">
                                                <path d={svgPaths.p4f55700} fill="#D6006D" transform="scale(0.69) translate(9, 9)" />
                                            </svg>
                                        </div>
                                        <p className="text-[#56616B] text-sm sm:text-base">8459 3208 3438</p>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-center gap-3">
                                        <div className="shrink-0 size-8 flex items-center justify-center">
                                            <svg className="size-full" fill="none" viewBox="0 0 47 47">
                                                <path d={svgPaths.p9873c40} fill="#D6006D" transform="scale(0.85) translate(4, 4)" />
                                            </svg>
                                        </div>
                                        <p className="text-[#56616B] text-sm sm:text-base">abcdf@gmail.com</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Contact form card */}
                            <div
                                className="rounded-[20px] p-3 sm:p-4 lg:p-5 flex-1 border border-[#FFE089] shadow-[0px_4px_10px_0px_#FFD359]"
                                style={{ background: "#e7f4ff" }}
                            >
                                <form className="space-y-2.5" onSubmit={(e) => e.preventDefault()}>
                                    <div>
                                        <label className="block text-[#D6006D] text-sm sm:text-base font-medium mb-1.5">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3.5 py-2 rounded-[14px] bg-white text-[#56616B] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9511F4]/30 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#D6006D] text-sm sm:text-base font-medium mb-1.5">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-3.5 py-2 rounded-[14px] bg-white text-[#56616B] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9511F4]/30 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#D6006D] text-sm sm:text-base font-medium mb-1.5">
                                            Message
                                        </label>
                                        <textarea
                                            rows={3}
                                            className="w-full px-3.5 py-2 rounded-[14px] bg-white text-[#56616B] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9511F4]/30 transition-colors resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-2 rounded-[50px] bg-[#9511F4] text-white text-sm font-semibold hover:bg-[#7A0ED4] transition-colors shadow-lg shadow-[#9511F4]/25 cursor-pointer"
                                    >
                                        {t("ctaButton")}
                                    </button>
                                </form>
                            </div>

                        </div>

                        {/* Divider */}
                        <div className="mt-4 sm:mt-5">
                            <svg className="w-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1222.5 1.5">
                                <path d="M0.75 0.75H1221.75" stroke="#56616B" strokeLinecap="round" strokeOpacity="0.6" strokeWidth="1.5" />
                            </svg>
                        </div>

                        {/* Bottom bar */}
                        <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-[#56616B]">
                            <p className="text-xs sm:text-sm whitespace-nowrap">
                                &copy; {new Date().getFullYear()} MaternalCare India. All rights reserved
                            </p>
                            <div className="flex items-center gap-5 text-xs sm:text-sm">
                                <Link href="/about" className="hover:text-[#0A4A9B] transition-colors no-underline">
                                    About
                                </Link>
                                <Link href="/faq" className="hover:text-[#0A4A9B] transition-colors no-underline">
                                    FAQ
                                </Link>
                                <Link href="/privacy" className="hover:text-[#0A4A9B] transition-colors no-underline">
                                    Privacy Policy
                                </Link>
                            </div>
                            <p className="text-[11px] sm:text-xs text-center max-w-md">
                                This app provides informational support and is not a substitute for professional medical advice. Always consult your healthcare provider.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}


export default function HomePage() {
    return (
        <div className="min-h-screen bg-white font-yatra">
            <PublicNavbar />
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <BottomCardsAndFooterSection />
        </div>
    );
}
