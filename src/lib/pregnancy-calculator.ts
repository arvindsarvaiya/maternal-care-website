/**
 * Pregnancy Calculator Utility
 * 
 * Calculates current pregnancy week, trimester, days until due date, and related
 * metrics from LMP (Last Menstrual Period) date or Due Date. All calculations
 * are dynamic — they use the current date at call time, not a stored value.
 */

export interface PregnancyWeekInfo {
    /** Current pregnancy week (1–42) */
    week: number;
    /** Day within the current week (1–7) */
    day: number;
    /** Trimester number (1, 2, or 3) */
    trimester: number;
    /** Trimester label */
    trimesterLabel: 'First Trimester' | 'Second Trimester' | 'Third Trimester';
    /** ISO date string of estimated due date */
    dueDate: string;
    /** Days remaining until due date */
    daysUntilDue: number;
    /** Weeks remaining until due date */
    weeksRemaining: number;
    /** Total days of pregnancy so far */
    daysElapsed: number;
    /** Percentage of pregnancy completed (0–100) */
    progressPercent: number;
    /** Whether pregnancy is past due date */
    isPastDue: boolean;
    /** The LMP date used for calculation */
    lmpDate: string;
    /** Conception date estimate (LMP + 14 days) */
    conceptionDate: string;
    /** Start of current trimester */
    trimesterStartWeek: number;
    /** End of current trimester */
    trimesterEndWeek: number;
}

const GESTATION_DAYS = 280; // Standard 40-week gestation from LMP

/**
 * Calculate pregnancy week info from LMP date.
 * Due date is always derived as LMP + 280 days to ensure that week,
 * daysUntilDue, and weeksRemaining are mathematically consistent.
 */
export function calcPregnancyFromLmp(lmpDate: string | Date): PregnancyWeekInfo {
    const lmp = new Date(lmpDate);
    const now = new Date();

    // Due date is always LMP + 280 days (standard gestation)
    const due = new Date(lmp.getTime() + GESTATION_DAYS * 86400000);

    const diffMs = now.getTime() - lmp.getTime();
    const totalDays = diffMs / 86400000;
    const totalWeeks = totalDays / 7;

    const week = Math.max(1, Math.min(42, Math.floor(totalWeeks)));
    const day = Math.max(1, Math.min(7, Math.floor((totalWeeks - week) * 7) + 1));

    const trimester = week <= 13 ? 1 : week <= 26 ? 2 : 3;
    const trimesterLabel =
        trimester === 1 ? 'First Trimester' : trimester === 2 ? 'Second Trimester' : 'Third Trimester';

    const trimesterStartWeek = trimester === 1 ? 1 : trimester === 2 ? 14 : 27;
    const trimesterEndWeek = trimester === 1 ? 13 : trimester === 2 ? 26 : 40;

    const daysUntilDue = Math.max(0, Math.ceil((due.getTime() - now.getTime()) / 86400000));
    const weeksRemaining = Math.max(0, Math.ceil(daysUntilDue / 7));
    const progressPercent = Math.min(100, Math.round((week / 40) * 100));
    const isPastDue = daysUntilDue === 0 && week >= 40;

    return {
        week,
        day,
        trimester,
        trimesterLabel,
        dueDate: due.toISOString().split('T')[0],
        daysUntilDue,
        weeksRemaining,
        daysElapsed: Math.floor(totalDays),
        progressPercent,
        isPastDue,
        lmpDate: lmp.toISOString().split('T')[0],
        conceptionDate: new Date(lmp.getTime() + 14 * 86400000).toISOString().split('T')[0],
        trimesterStartWeek,
        trimesterEndWeek,
    };
}

/**
 * Calculate pregnancy week info from Due Date (working backwards).
 * LMP is estimated as Due Date - 280 days.
 */
export function calcPregnancyFromDueDate(dueDate: string | Date): PregnancyWeekInfo {
    const due = new Date(dueDate);
    const lmp = new Date(due.getTime() - GESTATION_DAYS * 86400000);
    return calcPregnancyFromLmp(lmp);
}

/**
 * Calculate pregnancy week info from a profile that may have either
 * lmpDate or dueDate (or both).
 */
export function calcPregnancyWeek(profile: {
    lmpDate?: string | Date | null;
    dueDate?: string | Date | null;
}): PregnancyWeekInfo | null {
    if (profile.lmpDate) {
        return calcPregnancyFromLmp(profile.lmpDate);
    }
    if (profile.dueDate) {
        return calcPregnancyFromDueDate(profile.dueDate);
    }
    return null;
}

/**
 * Get the current week number (1-40) for quick lookups.
 * Returns null if no dates are available.
 */
export function getCurrentWeekNumber(profile: {
    lmpDate?: string | Date | null;
    dueDate?: string | Date | null;
}): number | null {
    const info = calcPregnancyWeek(profile);
    return info ? Math.min(40, info.week) : null;
}

/**
 * Get the trimester number (1, 2, or 3).
 */
export function getTrimester(week: number): number {
    if (week <= 13) return 1;
    if (week <= 26) return 2;
    return 3;
}

/**
 * Calculate pregnancy week info from just a week number (e.g. from
 * MotherHealthProfile.weeksOfPregnancy). Since we don't have an exact LMP
 * or due date, we estimate LMP as today minus (week × 7) days and due date
 * as LMP + 280 days. Day is set to 1 (mid-week estimate).
 */
export function calcPregnancyFromWeekNumber(week: number): PregnancyWeekInfo {
    const safeWeek = Math.max(1, Math.min(42, week));
    const now = new Date();

    // Estimate LMP: today minus (safeWeek * 7) days
    const estimatedLmp = new Date(now.getTime() - safeWeek * 7 * 86400000);
    // Estimate due date: LMP + 280 days
    const estimatedDue = new Date(estimatedLmp.getTime() + GESTATION_DAYS * 86400000);

    const trimester = safeWeek <= 13 ? 1 : safeWeek <= 26 ? 2 : 3;
    const trimesterLabel =
        trimester === 1 ? 'First Trimester' : trimester === 2 ? 'Second Trimester' : 'Third Trimester';

    const trimesterStartWeek = trimester === 1 ? 1 : trimester === 2 ? 14 : 27;
    const trimesterEndWeek = trimester === 1 ? 13 : trimester === 2 ? 26 : 40;

    const daysUntilDue = Math.max(0, Math.ceil((estimatedDue.getTime() - now.getTime()) / 86400000));
    const weeksRemaining = Math.max(0, Math.ceil(daysUntilDue / 7));
    const progressPercent = Math.min(100, Math.round((safeWeek / 40) * 100));
    const isPastDue = daysUntilDue === 0 && safeWeek >= 40;

    return {
        week: safeWeek,
        day: 1, // estimated mid-week
        trimester,
        trimesterLabel,
        dueDate: estimatedDue.toISOString().split('T')[0],
        daysUntilDue,
        weeksRemaining,
        daysElapsed: safeWeek * 7,
        progressPercent,
        isPastDue,
        lmpDate: estimatedLmp.toISOString().split('T')[0],
        conceptionDate: new Date(estimatedLmp.getTime() + 14 * 86400000).toISOString().split('T')[0],
        trimesterStartWeek,
        trimesterEndWeek,
    };
}

/**
 * Format a friendly display string for pregnancy progress.
 * e.g., "Week 24, Day 3 — Second Trimester"
 */
export function formatPregnancyProgress(info: PregnancyWeekInfo): string {
    return `Week ${info.week}, Day ${info.day} — ${info.trimesterLabel}`;
}