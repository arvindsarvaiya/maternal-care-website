import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu'],
    defaultLocale: 'en',
    localeDetection: true,
});

export const localeNames: Record<string, string> = {
    en: 'English',
    hi: 'हिन्दी (Hindi)',
    bn: 'বাংলা (Bengali)',
    ta: 'தமிழ் (Tamil)',
    te: 'తెలుగు (Telugu)',
    mr: 'मराठी (Marathi)',
    gu: 'ગુજરાતી (Gujarati)',
};