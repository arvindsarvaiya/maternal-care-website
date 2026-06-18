// ─── Types ───

export type RecoveryPhase = 'immediate' | 'early' | 'late' | 'extended';

export interface PostpartumWeekInfo {
    /** Weeks since delivery (1-52) */
    week: number;
    /** Days since delivery */
    daysSinceDelivery: number;
    /** Delivery date */
    deliveryDate: Date;
    /** Current recovery phase */
    recoveryPhase: RecoveryPhase;
    /** Human-readable phase label */
    phaseLabel: string;
    /** Whether this is within the first 6 weeks (critical recovery) */
    isCriticalRecovery: boolean;
    /** Month postpartum (1-12) */
    month: number;
    /** Progress percentage through postpartum year (0-100). Not displayed as "100%" — used for progress bar visuals only. */
    progressPercent: number;
    /** Human-readable label: "Postpartum Week X" */
    weekLabel: string;
}

// ─── Recovery Phase Definitions ───

/**
 * Recovery phases:
 * - immediate: Weeks 1-2   (immediate postpartum)
 * - early:     Weeks 3-6   (early recovery)
 * - late:      Weeks 7-12  (late recovery)
 * - extended:  Weeks 13-52 (extended postpartum)
 */
export function getRecoveryPhase(week: number): RecoveryPhase {
    if (week <= 2) return 'immediate';
    if (week <= 6) return 'early';
    if (week <= 12) return 'late';
    return 'extended';
}

export function getRecoveryPhaseLabel(phase: RecoveryPhase): string {
    switch (phase) {
        case 'immediate': return 'Immediate Postpartum';
        case 'early': return 'Early Recovery';
        case 'late': return 'Late Recovery';
        case 'extended': return 'Extended Postpartum';
    }
}

// ─── Calculator ───

/**
 * Calculate postpartum week info from a delivery date.
 * @param deliveryDate - The date of delivery (Date object or ISO string)
 * @returns PostpartumWeekInfo or null if deliveryDate is in the future
 */
export function calcPostpartumWeek(deliveryDate: string | Date): PostpartumWeekInfo | null {
    const delivery = typeof deliveryDate === 'string' ? new Date(deliveryDate) : deliveryDate;
    const now = new Date();
    const msSinceDelivery = now.getTime() - delivery.getTime();

    if (msSinceDelivery < 0) return null; // delivery date is in the future

    const daysSinceDelivery = Math.floor(msSinceDelivery / (1000 * 60 * 60 * 24));
    const week = Math.min(52, Math.max(1, Math.ceil(msSinceDelivery / (7 * 24 * 60 * 60 * 1000))));
    const recoveryPhase = getRecoveryPhase(week);
    const month = Math.min(12, Math.ceil(week / 4.345)); // average weeks per month

    return {
        week,
        daysSinceDelivery,
        deliveryDate: delivery,
        recoveryPhase,
        phaseLabel: getRecoveryPhaseLabel(recoveryPhase),
        isCriticalRecovery: week <= 6,
        month,
        progressPercent: Math.round((week / 52) * 100),
        weekLabel: `Postpartum Week ${week}`,
    };
}

/**
 * Get the current postpartum week number from a profile.
 * @param profile - Object with deliveryDate and optional postpartumWeek
 * @returns week number (1-52) or null if delivery date is missing/future
 */
export function getCurrentPostpartumWeek(profile: {
    deliveryDate: string | Date | null;
    postpartumWeek?: number | null;
}): number | null {
    if (profile.postpartumWeek) return profile.postpartumWeek;
    if (!profile.deliveryDate) return null;
    const info = calcPostpartumWeek(profile.deliveryDate);
    return info?.week ?? null;
}

/**
 * Calculate postpartum week info from a known week number.
 * Useful for previewing content for a specific week.
 */
export function calcPostpartumFromWeekNumber(week: number, deliveryDate?: string | Date): PostpartumWeekInfo {
    const clampedWeek = Math.max(1, Math.min(52, week));
    const delivery = deliveryDate ? new Date(deliveryDate) : new Date();
    const daysSinceDelivery = clampedWeek * 7;
    const recoveryPhase = getRecoveryPhase(clampedWeek);
    const month = Math.min(12, Math.ceil(clampedWeek / 4.345));

    return {
        week: clampedWeek,
        daysSinceDelivery,
        deliveryDate: delivery,
        recoveryPhase,
        phaseLabel: getRecoveryPhaseLabel(recoveryPhase),
        isCriticalRecovery: clampedWeek <= 6,
        month,
        progressPercent: Math.round((clampedWeek / 52) * 100),
        weekLabel: `Postpartum Week ${clampedWeek}`,
    };
}

// ─── Phase Badge Config ───

export interface RecoveryPhaseBadge {
    phase: RecoveryPhase;
    label: string;
    color: string;   // Tailwind color classes for bg/border
    emoji: string;
}

export const RECOVERY_PHASE_BADGES: Record<RecoveryPhase, RecoveryPhaseBadge> = {
    immediate: {
        phase: 'immediate',
        label: 'Immediate',
        color: 'bg-razzmatazz-100 text-razzmatazz-800 border-razzmatazz-300',
        emoji: '🏥',
    },
    early: {
        phase: 'early',
        label: 'Early Recovery',
        color: 'bg-warning-100 text-warning-800 border-warning-300',
        emoji: '🩹',
    },
    late: {
        phase: 'late',
        label: 'Late Recovery',
        color: 'bg-primary-100 text-primary-800 border-primary-300',
        emoji: '🌱',
    },
    extended: {
        phase: 'extended',
        label: 'Extended',
        color: 'bg-success-100 text-success-800 border-success-300',
        emoji: '💪',
    },
};

/**
 * Get the badge config for a given postpartum week.
 */
export function getPostpartumBadge(week: number): RecoveryPhaseBadge {
    return RECOVERY_PHASE_BADGES[getRecoveryPhase(week)];
}