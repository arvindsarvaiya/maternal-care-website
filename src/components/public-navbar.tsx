'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { LanguageButton } from '@/components/language-selector';

export function PublicNavbar() {
    const n = useTranslations('nav');
    const pathname = usePathname();
    const currentPath = pathname.replace(/^\/[a-z]{2}/, '') || '/home';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);

    const navLinks = [
        { href: '/home', label: n('home'), key: '/home' },
        { href: '/about', label: n('about'), key: '/about' },
        { href: '/facts-and-myths', label: n('factsAndMyths'), key: '/facts-and-myths' },
        { href: '/faq', label: n('faq'), key: '/faq' },
    ];

    // Close mobile menu on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
                setMobileMenuOpen(false);
            }
        }
        if (mobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [mobileMenuOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = ''; };
        }
    }, [mobileMenuOpen]);

    return (
        <header
            ref={headerRef}
            className="fixed top-4 left-1/2 z-50 mx-auto flex w-[calc(100%-32px)] max-w-6xl -translate-x-1/2 items-center justify-between rounded-2xl bg-white/55 backdrop-blur-xl px-4 py-2 border border-white/45 shadow-sm md:top-6 md:rounded-3xl lg:top-7"
        >
            {/* Logo */}
            <Link href="/home" className="no-underline shrink-0">
                <span
                    className="font-semibold text-[#9511F4] text-2xl lg:text-3xl"
                >
                    MaternalCare
                </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden p-1 lg:block">
                <ul className="flex items-center">
                    {navLinks.map((link) => (
                        <li key={link.key} className="px-2 py-1">
                            <Link
                                href={link.href}
                                className={`text-base no-underline transition-colors duration-100 ${currentPath === link.key
                                    ? 'font-medium text-[#9511F4]'
                                    : 'font-light text-[#56616b] hover:text-[#9511F4]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Desktop Right Side: Language + CTAs */}
            <div className="hidden items-center gap-2 lg:inline-flex">
                <LanguageButton />
                <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-base font-medium tracking-[-0.084px] transition-colors duration-300 bg-white/55 border border-white/50 text-[#56616b] hover:bg-white/80 no-underline"
                >
                    {n('signIn')}
                </Link>
                <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-base font-medium tracking-[-0.084px] transition-colors duration-300 bg-[#181B25] text-white hover:bg-gray-800 no-underline"
                >
                    {n('getStarted')}
                </Link>
            </div>

            {/* Mobile Hamburger + Language */}
            <div className="flex items-center gap-2 lg:hidden">
                <LanguageButton />
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="size-9 inline-flex items-center justify-center rounded-xl bg-white/55 border border-white/50 text-[#56616b] hover:bg-white/80 transition-colors cursor-pointer"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white/75 backdrop-blur-xl rounded-3xl shadow-elevated border border-white/50 py-4 px-2 lg:hidden z-50">
                    <nav>
                        <ul className="flex flex-col">
                            {navLinks.map((link) => (
                                <li key={link.key}>
                                    <Link
                                        href={link.href}
                                        className={`block px-3 py-2 text-base no-underline rounded-xl transition-colors ${currentPath === link.key
                                            ? 'font-medium text-[#9511F4] bg-[#9511F4]/5'
                                            : 'text-[#56616b] hover:bg-surface-50'
                                            }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="border-t border-surface-200 mt-2 pt-4 px-4 flex flex-col gap-3">
                        <Link
                            href="/login"
                            className="block w-full text-center py-1.5 rounded-xl border border-surface-200 text-[#56616b] text-base font-medium hover:bg-surface-50 transition-colors no-underline"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {n('signIn')}
                        </Link>
                        <Link
                            href="/signup"
                            className="block w-full text-center py-1.5 rounded-xl bg-[#181B25] text-white text-base font-medium hover:bg-gray-800 transition-colors no-underline"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {n('getStarted')}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
