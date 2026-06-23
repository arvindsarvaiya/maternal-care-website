// ─── Notification Scheduler ──────────────────────────────────────
// Determines which personalized notifications to show each day
// Uses the content library, rotation schedule, and deterministic
// selection to ensure variety without repetition.
// ───────────────────────────────────────────────────────────────────

import {
    ALL_NOTIFICATION_TEMPLATES,
    CATEGORY_ROTATION,
    getTemplatesForPhase,
    type NotificationContentTemplate,
    type MedicalConditionTag,
} from './notification-content';

/**
 * Deterministic hash function (djb2) for selecting templates
 * Same userId + date always produces the same selection
 */
function hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
}

/**
 * Shuffle an array deterministically using a seed
 * Fisher-Yates with seeded random
 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
    const shuffled = [...arr];
    let s = seed;
    for (let i = shuffled.length - 1; i > 0; i--) {
        s = (s * 1103515245 + 12345) | 0;
        const j = Math.abs(s) % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Get the current day index for the 3-day rotation cycle
 * Day 0 = phase-specific + nutrition
 * Day 1 = hydration/exercise + mental health
 * Day 2 = baby care/partner + condition-specific
 */
function getRotationDayIndex(date: Date): number {
    // Use the number of days since epoch modulo 3
    const epochDays = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
    return epochDays % 3;
}

/**
 * Get today's date string in YYYY-MM-DD format (UTC)
 */
function getTodayDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
}

/**
 * Determine which notification templates to show for a user today.
 * Returns the selected templates with deterministic variety.
 *
 * @param userId - The user's ID for deterministic selection
 * @param pregnancyWeek - Current pregnancy week (null if postpartum)
 * @param postpartumWeek - Current postpartum week (null if pregnant)
 * @param medicalConditions - User's medical conditions
 * @param date - The date to generate notifications for
 * @param count - How many notifications to generate (default: 3)
 * @returns Array of selected templates for today
 */
export function getDailyNotificationTemplates(
    userId: string,
    pregnancyWeek: number | null,
    postpartumWeek: number | null,
    medicalConditions: MedicalConditionTag[],
    date: Date = new Date(),
    count: number = 3,
): NotificationContentTemplate[] {
    // Get all templates applicable to this user's phase
    const applicable = getTemplatesForPhase(pregnancyWeek, postpartumWeek, medicalConditions);

    if (applicable.length === 0) {
        return [];
    }

    // Determine which categories are active today based on rotation
    const dayIndex = getRotationDayIndex(date);
    const todayCategories = CATEGORY_ROTATION[dayIndex];

    // Filter templates by today's active categories
    const categoryTemplates = applicable.filter(t => todayCategories.includes(t.category));

    // If no templates match today's categories (edge case), fall back to all applicable
    const pool = categoryTemplates.length > 0 ? categoryTemplates : applicable;

    // Create a deterministic seed from userId + date
    const dateString = getTodayDateString(date);
    const seed = hashString(`${userId}:${dateString}`);
    const shuffled = seededShuffle(pool, seed);

    // Prioritize high-priority templates but ensure variety
    const high = shuffled.filter(t => t.priority === 'high');
    const medium = shuffled.filter(t => t.priority === 'medium');
    const low = shuffled.filter(t => t.priority === 'low');

    // Build selection: at least 1 high priority, then fill with medium/low
    const selected: NotificationContentTemplate[] = [];
    const usedIds = new Set<string>();

    // Add high priority first (up to 2)
    for (const t of high) {
        if (selected.length >= count) break;
        if (!usedIds.has(t.id)) {
            selected.push(t);
            usedIds.add(t.id);
        }
    }

    // Fill remaining with medium
    for (const t of medium) {
        if (selected.length >= count) break;
        if (!usedIds.has(t.id)) {
            selected.push(t);
            usedIds.add(t.id);
        }
    }

    // Fill remaining with low
    for (const t of low) {
        if (selected.length >= count) break;
        if (!usedIds.has(t.id)) {
            selected.push(t);
            usedIds.add(t.id);
        }
    }

    return selected;
}

/**
 * Calculate the "scheduledFor" time for a notification.
 * Spreads notifications throughout the day for natural feel.
 *
 * @param date - Base date
 * @param index - Which notification in the batch (0, 1, 2...)
 * @returns Date object with appropriate time
 */
export function getScheduledTime(date: Date, index: number): Date {
    const scheduled = new Date(date);
    // Spread notifications at 9 AM, 2 PM, and 7 PM
    const hours = [9, 14, 19];
    const hour = hours[index % hours.length];
    scheduled.setHours(hour, 0, 0, 0);
    return scheduled;
}

/**
 * Get the template ID prefix for marking today's batch
 * Used to check if notifications for today have already been created
 */
export function getTodayBatchKey(date: Date): string {
    return getTodayDateString(date);
}