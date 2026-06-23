// Pregnancy Knowledge i18n Index
// Loads locale-specific translations and merges with English base
// Missing translations fall back to English automatically

import { WeekKnowledge, pregnancyKnowledgeBase, personalizeWeekKnowledge, PersonalizationFactors } from '../pregnancy-knowledge';

// Re-export WeekKnowledge type so consumers can import it from the i18n module
export type { WeekKnowledge } from '../pregnancy-knowledge';
export type { PersonalizationFactors } from '../pregnancy-knowledge';
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

/**
 * Get personalized week knowledge for a specific locale, factoring in the
 * mother's medical profile, BMI, diet, allergies, and mood.
 *
 * This is the primary function that UI pages should call to get
 * condition-specific tips (e.g., anemia → iron-rich foods, diabetes →
 * blood sugar monitoring, etc.).
 */
export function getPersonalizedWeekKnowledgeForLocale(
    week: number,
    locale: string,
    factors: PersonalizationFactors,
): WeekKnowledge | null {
    // First, get the English base + personalization
    const personalized = personalizeWeekKnowledge(week, factors);
    if (!personalized) return null;

    // Then apply locale translations on top (overrides translated fields
    // where available, but keeps the personalized additions since those
    // are prepended to the base arrays)
    const localeOverrides = localeKnowledge[locale]?.[week];
    if (!localeOverrides) return personalized;

    // Merge: use translated fields where available, but keep personalized
    // additions that were prepended by personalizeWeekKnowledge
    const base = pregnancyKnowledgeBase[week - 1];
    if (!base) return personalized;

    // For each field, if the locale has a translation, use it — but we
    // need to preserve the extra personalized tips that were prepended.
    // The personalized version already has base + extras prepended.
    // We need to: keep personalized extras + replace base with locale translations.
    // Since personalizeWeekKnowledge prepends extras to the base arrays,
    // we can compute how many extras were added and keep them.

    const baseNutritionalLen = base.nutritionalFocus.length;
    const baseWarningLen = base.warningSigns.length;
    const baseExerciseLen = base.exerciseGuidance.length;
    const baseMedicalLen = base.medicalReminders.length;
    const baseHydrationLen = base.hydrationGuidance.length;

    const extraNutrition = personalized.nutritionalFocus.slice(0, personalized.nutritionalFocus.length - baseNutritionalLen);
    const extraWarning = personalized.warningSigns.slice(0, personalized.warningSigns.length - baseWarningLen);
    const extraExercise = personalized.exerciseGuidance.slice(0, personalized.exerciseGuidance.length - baseExerciseLen);
    const extraMedical = personalized.medicalReminders.slice(0, personalized.medicalReminders.length - baseMedicalLen);
    const extraHydration = personalized.hydrationGuidance.slice(0, personalized.hydrationGuidance.length - baseHydrationLen);

    return {
        week: personalized.week,
        babyDevelopment: localeOverrides.babyDevelopment?.length ? localeOverrides.babyDevelopment : personalized.babyDevelopment,
        babySize: localeOverrides.babySize || personalized.babySize,
        babyWeight: localeOverrides.babyWeight || personalized.babyWeight,
        babyLength: localeOverrides.babyLength || personalized.babyLength,
        motherBodyChanges: localeOverrides.motherBodyChanges?.length ? localeOverrides.motherBodyChanges : personalized.motherBodyChanges,
        commonSymptoms: localeOverrides.commonSymptoms?.length ? localeOverrides.commonSymptoms : personalized.commonSymptoms,
        nutritionalFocus: [
            ...extraNutrition,
            ...(localeOverrides.nutritionalFocus?.length ? localeOverrides.nutritionalFocus : base.nutritionalFocus),
        ],
        exerciseGuidance: [
            ...extraExercise,
            ...(localeOverrides.exerciseGuidance?.length ? localeOverrides.exerciseGuidance : base.exerciseGuidance),
        ],
        hydrationGuidance: [
            ...extraHydration,
            ...(localeOverrides.hydrationGuidance?.length ? localeOverrides.hydrationGuidance : base.hydrationGuidance),
        ],
        medicalReminders: [
            ...extraMedical,
            ...(localeOverrides.medicalReminders?.length ? localeOverrides.medicalReminders : base.medicalReminders),
        ],
        warningSigns: [
            ...extraWarning,
            ...(localeOverrides.warningSigns?.length ? localeOverrides.warningSigns : base.warningSigns),
        ],
        weeklyGuidance: localeOverrides.weeklyGuidance?.length ? localeOverrides.weeklyGuidance : personalized.weeklyGuidance,
    };
}

/**
 * Format personalized week knowledge for the Weekly Journey page, locale-aware.
 * Same as formatWeekKnowledgeForJourneyForLocale but uses personalization.
 */
export function formatPersonalizedWeekKnowledgeForJourneyForLocale(
    week: number,
    locale: string,
    factors: PersonalizationFactors,
): {
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
    const knowledge = getPersonalizedWeekKnowledgeForLocale(week, locale, factors);
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