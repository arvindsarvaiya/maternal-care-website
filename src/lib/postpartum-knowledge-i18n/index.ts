// Postpartum Knowledge i18n Index
// Loads locale-specific translations and merges with English base
// Missing translations fall back to English automatically

import { PostpartumWeekKnowledge, postpartumKnowledgeBase, personalizePostpartumWeekKnowledge } from '../postpartum-knowledge';
import { formatSourceLegend } from '../source-abbreviations';
import type { PersonalizationFactors } from '../pregnancy-knowledge';

// Re-export type so consumers can import from the i18n module
export type { PostpartumWeekKnowledge } from '../postpartum-knowledge';
export type { PersonalizationFactors } from '../pregnancy-knowledge';

import { hiPostpartumKnowledge } from './hi';
import { bnPostpartumKnowledge } from './bn';
import { guPostpartumKnowledge } from './gu';
import { mrPostpartumKnowledge } from './mr';
import { taPostpartumKnowledge } from './ta';
import { tePostpartumKnowledge } from './te';

type LocalePostpartumKnowledgeMap = Record<number, PostpartumWeekKnowledge>;

const localePostpartumKnowledge: Record<string, LocalePostpartumKnowledgeMap> = {
    en: {}, // English is the base — no overrides needed
    hi: hiPostpartumKnowledge,
    bn: bnPostpartumKnowledge,
    gu: guPostpartumKnowledge,
    mr: mrPostpartumKnowledge,
    ta: taPostpartumKnowledge,
    te: tePostpartumKnowledge,
};

/**
 * Get postpartum week knowledge for a specific locale.
 * Falls back to English for any missing weeks or fields.
 */
export function getPostpartumWeekKnowledgeForLocale(
    week: number,
    locale: string
): PostpartumWeekKnowledge | null {
    if (week < 1 || week > 52) return null;

    const base = postpartumKnowledgeBase[week - 1];
    if (!base) return null;

    const overrides = localePostpartumKnowledge[locale]?.[week];
    if (!overrides) return base; // No translation available — use English

    // Merge: use translated fields where available, fall back to English for any missing
    return {
        week: base.week,
        recoveryPhase: base.recoveryPhase,
        phaseLabel: overrides.phaseLabel || base.phaseLabel,
        title: overrides.title || base.title,
        summary: overrides.summary || base.summary,
        recoveryNotes: overrides.recoveryNotes?.length ? overrides.recoveryNotes : base.recoveryNotes,
        bodyChanges: overrides.bodyChanges?.length ? overrides.bodyChanges : base.bodyChanges,
        babyCareNotes: overrides.babyCareNotes?.length ? overrides.babyCareNotes : base.babyCareNotes,
        babyDevelopment: overrides.babyDevelopment?.length ? overrides.babyDevelopment : base.babyDevelopment,
        mentalHealthNotes: overrides.mentalHealthNotes?.length ? overrides.mentalHealthNotes : base.mentalHealthNotes,
        activityNotes: overrides.activityNotes?.length ? overrides.activityNotes : base.activityNotes,
        nutritionalFocus: overrides.nutritionalFocus?.length ? overrides.nutritionalFocus : base.nutritionalFocus,
        warningSigns: overrides.warningSigns?.length ? overrides.warningSigns : base.warningSigns,
        weeklyGuidance: overrides.weeklyGuidance?.length ? overrides.weeklyGuidance : base.weeklyGuidance,
    };
}

/**
 * Format postpartum week knowledge for the Weekly Journey page, locale-aware.
 * Returns all content fields in the target language with English fallback.
 */
export function formatPostpartumWeekKnowledgeForJourneyForLocale(
    week: number,
    locale: string
): {
    weekNumber: number;
    title: string;
    summary: string;
    recoveryPhase: string;
    phaseLabel: string;
    recoveryNotes: string;
    babyCareNotes: string;
    mentalHealthNotes: string;
    activityNotes: string;
    warningSigns: string;
    bodyChanges: string[];
    babyDevelopment: string[];
    nutritionalFocus: string[];
    weeklyGuidance: string[];
    sourceLegend: string;
    sourceLegendHindi: string;
} | null {
    const knowledge = getPostpartumWeekKnowledgeForLocale(week, locale);
    if (!knowledge) return null;

    return {
        weekNumber: knowledge.week,
        title: knowledge.title,
        summary: knowledge.summary,
        recoveryPhase: knowledge.recoveryPhase,
        phaseLabel: knowledge.phaseLabel,
        recoveryNotes: knowledge.recoveryNotes.map(i => `- ${i}`).join('\n'),
        babyCareNotes: knowledge.babyCareNotes.map(i => `- ${i}`).join('\n'),
        mentalHealthNotes: knowledge.mentalHealthNotes.map(i => `- ${i}`).join('\n'),
        activityNotes: knowledge.activityNotes.map(i => `- ${i}`).join('\n'),
        warningSigns: knowledge.warningSigns.map(i => `- ${i}`).join('\n'),
        bodyChanges: knowledge.bodyChanges,
        babyDevelopment: knowledge.babyDevelopment,
        nutritionalFocus: knowledge.nutritionalFocus,
        weeklyGuidance: knowledge.weeklyGuidance,
        sourceLegend: formatSourceLegend('en'),
        sourceLegendHindi: formatSourceLegend('hi'),
    };
}

/**
 * Format postpartum knowledge for chatbot context, locale-aware.
 */
export function formatPostpartumWeekKnowledgeForChatForLocale(
    week: number,
    locale: string,
    topic?: string
): string | null {
    const knowledge = getPostpartumWeekKnowledgeForLocale(week, locale);
    if (!knowledge) return null;

    const pad = (label: string, items: string[]) =>
        `${label}\n${items.map(i => `  • ${i}`).join('\n')}`;

    const sections: string[] = [
        `📋 POSTPARTUM WEEK ${knowledge.week}: ${knowledge.title}`,
        `📝 ${knowledge.summary}`,
        `🏥 Recovery Phase: ${knowledge.phaseLabel}`,
    ];

    if (!topic || topic === 'recovery') sections.push(pad('🩹 Recovery', knowledge.recoveryNotes));
    if (!topic || topic === 'body') sections.push(pad('👤 Body Changes', knowledge.bodyChanges));
    if (!topic || topic === 'baby') {
        sections.push(pad('👶 Baby Care', knowledge.babyCareNotes));
        sections.push(pad('🧠 Baby Development', knowledge.babyDevelopment));
    }
    if (!topic || topic === 'mental') sections.push(pad('💚 Mental Health', knowledge.mentalHealthNotes));
    if (!topic || topic === 'activity') sections.push(pad('🏃 Activity', knowledge.activityNotes));
    if (!topic || topic === 'nutrition') sections.push(pad('🍽️ Nutrition', knowledge.nutritionalFocus));
    if (!topic || topic === 'warning') sections.push(pad('⚠️ Warning Signs', knowledge.warningSigns));
    sections.push(pad('📌 Weekly Guidance', knowledge.weeklyGuidance));

    sections.push(`\n📚 Sources: ${formatSourceLegend('en')}`);

    return sections.join('\n\n');
}

/**
 * Get personalized postpartum week knowledge for a specific locale.
 * Applies personalization first (condition-specific tips), then
 * merges with locale translations.
 */
export function getPersonalizedPostpartumWeekKnowledgeForLocale(
    week: number,
    locale: string,
    factors: PersonalizationFactors,
): PostpartumWeekKnowledge | null {
    // Get personalized base (English with condition-specific additions)
    const personalized = personalizePostpartumWeekKnowledge(week, factors);
    if (!personalized) return null;

    // Apply locale translations on top
    const overrides = localePostpartumKnowledge[locale]?.[week];
    if (!overrides) return personalized; // No translation — use personalized English base

    // Merge: use translated fields where available, preserving personalized extras
    // We need to compute how many extras were prepended by comparing array lengths
    const base = postpartumKnowledgeBase[week - 1];
    if (!base) return personalized;

    const recoveryExtras = Math.max(0, personalized.recoveryNotes.length - base.recoveryNotes.length);
    const nutritionExtras = Math.max(0, personalized.nutritionalFocus.length - base.nutritionalFocus.length);
    const warningExtras = Math.max(0, personalized.warningSigns.length - base.warningSigns.length);
    const activityExtras = Math.max(0, personalized.activityNotes.length - base.activityNotes.length);
    const mentalHealthExtras = Math.max(0, personalized.mentalHealthNotes.length - base.mentalHealthNotes.length);

    // Get translated base arrays
    const translatedRecovery = overrides.recoveryNotes?.length ? overrides.recoveryNotes : base.recoveryNotes;
    const translatedNutrition = overrides.nutritionalFocus?.length ? overrides.nutritionalFocus : base.nutritionalFocus;
    const translatedWarning = overrides.warningSigns?.length ? overrides.warningSigns : base.warningSigns;
    const translatedActivity = overrides.activityNotes?.length ? overrides.activityNotes : base.activityNotes;
    const translatedMentalHealth = overrides.mentalHealthNotes?.length ? overrides.mentalHealthNotes : base.mentalHealthNotes;

    return {
        week: personalized.week,
        recoveryPhase: personalized.recoveryPhase,
        phaseLabel: overrides.phaseLabel || personalized.phaseLabel,
        title: overrides.title || personalized.title,
        summary: overrides.summary || personalized.summary,
        // Prepend personalized extras to translated content
        recoveryNotes: recoveryExtras > 0
            ? [...personalized.recoveryNotes.slice(0, recoveryExtras), ...translatedRecovery]
            : translatedRecovery,
        bodyChanges: overrides.bodyChanges?.length ? overrides.bodyChanges : personalized.bodyChanges,
        babyCareNotes: overrides.babyCareNotes?.length ? overrides.babyCareNotes : personalized.babyCareNotes,
        babyDevelopment: overrides.babyDevelopment?.length ? overrides.babyDevelopment : personalized.babyDevelopment,
        mentalHealthNotes: mentalHealthExtras > 0
            ? [...personalized.mentalHealthNotes.slice(0, mentalHealthExtras), ...translatedMentalHealth]
            : translatedMentalHealth,
        activityNotes: activityExtras > 0
            ? [...personalized.activityNotes.slice(0, activityExtras), ...translatedActivity]
            : translatedActivity,
        nutritionalFocus: nutritionExtras > 0
            ? [...personalized.nutritionalFocus.slice(0, nutritionExtras), ...translatedNutrition]
            : translatedNutrition,
        warningSigns: warningExtras > 0
            ? [...personalized.warningSigns.slice(0, warningExtras), ...translatedWarning]
            : translatedWarning,
        weeklyGuidance: overrides.weeklyGuidance?.length ? overrides.weeklyGuidance : personalized.weeklyGuidance,
    };
}

/**
 * Format personalized postpartum week knowledge for the Weekly Journey page, locale-aware.
 */
export function formatPersonalizedPostpartumWeekKnowledgeForJourneyForLocale(
    week: number,
    locale: string,
    factors: PersonalizationFactors,
): {
    weekNumber: number;
    title: string;
    summary: string;
    recoveryPhase: string;
    phaseLabel: string;
    recoveryNotes: string;
    babyCareNotes: string;
    mentalHealthNotes: string;
    activityNotes: string;
    warningSigns: string;
    bodyChanges: string[];
    babyDevelopment: string[];
    nutritionalFocus: string[];
    weeklyGuidance: string[];
    sourceLegend: string;
    sourceLegendHindi: string;
} | null {
    const knowledge = getPersonalizedPostpartumWeekKnowledgeForLocale(week, locale, factors);
    if (!knowledge) return null;

    return {
        weekNumber: knowledge.week,
        title: knowledge.title,
        summary: knowledge.summary,
        recoveryPhase: knowledge.recoveryPhase,
        phaseLabel: knowledge.phaseLabel,
        recoveryNotes: knowledge.recoveryNotes.map(i => `- ${i}`).join('\n'),
        babyCareNotes: knowledge.babyCareNotes.map(i => `- ${i}`).join('\n'),
        mentalHealthNotes: knowledge.mentalHealthNotes.map(i => `- ${i}`).join('\n'),
        activityNotes: knowledge.activityNotes.map(i => `- ${i}`).join('\n'),
        warningSigns: knowledge.warningSigns.map(i => `- ${i}`).join('\n'),
        bodyChanges: knowledge.bodyChanges,
        babyDevelopment: knowledge.babyDevelopment,
        nutritionalFocus: knowledge.nutritionalFocus,
        weeklyGuidance: knowledge.weeklyGuidance,
        sourceLegend: formatSourceLegend('en'),
        sourceLegendHindi: formatSourceLegend('hi'),
    };
}