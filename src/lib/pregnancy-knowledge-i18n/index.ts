// Pregnancy Knowledge i18n Index
// Loads locale-specific translations and merges with English base
// Missing translations fall back to English automatically

import { WeekKnowledge, pregnancyKnowledgeBase } from '../pregnancy-knowledge';

// Re-export WeekKnowledge type so consumers can import it from the i18n module
export type { WeekKnowledge } from '../pregnancy-knowledge';
import { hiKnowledge } from './hi';

// Import placeholder locale files (will be populated by translators)
import { bnKnowledge } from './bn';
import { guKnowledge } from './gu';
import { mrKnowledge } from './mr';
import { taKnowledge } from './ta';
import { teKnowledge } from './te';

type LocaleKnowledgeMap = Record<number, WeekKnowledge>;

const localeKnowledge: Record<string, LocaleKnowledgeMap> = {
    en: {}, // English is the base — no overrides needed
    hi: hiKnowledge,
    bn: bnKnowledge,
    gu: guKnowledge,
    mr: mrKnowledge,
    ta: taKnowledge,
    te: teKnowledge,
};

/**
 * Get week knowledge for a specific locale.
 * Falls back to English for any missing weeks or fields.
 */
export function getWeekKnowledgeForLocale(week: number, locale: string): WeekKnowledge | null {
    if (week < 1 || week > 40) return null;

    const base = pregnancyKnowledgeBase[week - 1];
    if (!base) return null;

    const overrides = localeKnowledge[locale]?.[week];
    if (!overrides) return base; // No translation available — use English

    // Merge: use translated fields where available, fall back to English for any missing
    return {
        week: base.week,
        babyDevelopment: overrides.babyDevelopment?.length ? overrides.babyDevelopment : base.babyDevelopment,
        babySize: overrides.babySize || base.babySize,
        babyWeight: overrides.babyWeight || base.babyWeight,
        babyLength: overrides.babyLength || base.babyLength,
        motherBodyChanges: overrides.motherBodyChanges?.length ? overrides.motherBodyChanges : base.motherBodyChanges,
        commonSymptoms: overrides.commonSymptoms?.length ? overrides.commonSymptoms : base.commonSymptoms,
        nutritionalFocus: overrides.nutritionalFocus?.length ? overrides.nutritionalFocus : base.nutritionalFocus,
        exerciseGuidance: overrides.exerciseGuidance?.length ? overrides.exerciseGuidance : base.exerciseGuidance,
        hydrationGuidance: overrides.hydrationGuidance?.length ? overrides.hydrationGuidance : base.hydrationGuidance,
        medicalReminders: overrides.medicalReminders?.length ? overrides.medicalReminders : base.medicalReminders,
        warningSigns: overrides.warningSigns?.length ? overrides.warningSigns : base.warningSigns,
        weeklyGuidance: overrides.weeklyGuidance?.length ? overrides.weeklyGuidance : base.weeklyGuidance,
    };
}

/**
 * Format week knowledge for the Weekly Journey page, locale-aware.
 * Section headers in bodyMarkdown stay in English for parsing compatibility,
 * but all content items are translated.
 */
export function formatWeekKnowledgeForJourneyForLocale(week: number, locale: string): {
    weekNumber: number;
    title: string;
    summary: string;
    bodyMarkdown: string;
    dietNotes: string;
    activityNotes: string;
    warningSigns: string;
    babySize: string;
    babyWeight: string;
    babyLength: string;
    babyDevelopment: string[];
    motherBodyChanges: string[];
    commonSymptoms: string[];
    hydrationGuidance: string[];
    medicalReminders: string[];
    weeklyGuidance: string[];
} | null {
    const knowledge = getWeekKnowledgeForLocale(week, locale);
    if (!knowledge) return null;

    const bulletSection = (heading: string, items: string[]) =>
        `## ${heading}\n${items.map(i => `- ${i}`).join('\n')}`;

    const bodyMarkdown = [
        bulletSection('Baby Development', knowledge.babyDevelopment),
        bulletSection('Mother Body Changes', knowledge.motherBodyChanges),
        bulletSection('Common Symptoms', knowledge.commonSymptoms),
        bulletSection('Weekly Guidance', knowledge.weeklyGuidance),
        bulletSection('Hydration Guidance', knowledge.hydrationGuidance),
        bulletSection('Medical Reminders', knowledge.medicalReminders),
        `Baby Size: ${knowledge.babySize}`,
        `Baby Weight: ${knowledge.babyWeight}`,
        `Baby Length: ${knowledge.babyLength}`,
    ].join('\n\n');

    return {
        weekNumber: knowledge.week,
        title: `Week ${knowledge.week} — ${knowledge.babySize}`,
        summary: knowledge.weeklyGuidance.join(' · '),
        bodyMarkdown,
        dietNotes: knowledge.nutritionalFocus.map(i => `- ${i}`).join('\n'),
        activityNotes: knowledge.exerciseGuidance.map(i => `- ${i}`).join('\n'),
        warningSigns: knowledge.warningSigns.map(i => `- ${i}`).join('\n'),
        babySize: knowledge.babySize,
        babyWeight: knowledge.babyWeight,
        babyLength: knowledge.babyLength,
        babyDevelopment: knowledge.babyDevelopment,
        motherBodyChanges: knowledge.motherBodyChanges,
        commonSymptoms: knowledge.commonSymptoms,
        hydrationGuidance: knowledge.hydrationGuidance,
        medicalReminders: knowledge.medicalReminders,
        weeklyGuidance: knowledge.weeklyGuidance,
    };
}