import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options,
    });
}

export function formatRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(d);
}

export function computePregnancyWeek(lmpDate: Date): { week: number; day: number; trimester: number; dueDate: Date } {
    const lmp = new Date(lmpDate);
    const dueDate = new Date(lmp);
    dueDate.setDate(dueDate.getDate() + 280); // 40 weeks
    const now = new Date();
    const diffMs = now.getTime() - lmp.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    const week = Math.min(Math.max(Math.floor(diffDays / 7) + 1, 1), 42);
    const day = (diffDays % 7) + 1;
    let trimester = 1;
    if (week >= 14) trimester = 2;
    if (week >= 28) trimester = 3;
    return { week, day, trimester, dueDate };
}

export function computePregnancyWeekFromDueDate(dueDate: Date): { week: number; day: number; trimester: number } {
    const due = new Date(dueDate);
    const lmp = new Date(due);
    lmp.setDate(lmp.getDate() - 280);
    const { week, day, trimester } = computePregnancyWeek(lmp);
    return { week, day, trimester };
}

export function getTrimesterLabel(trimester: number): string {
    switch (trimester) {
        case 1: return 'First Trimester';
        case 2: return 'Second Trimester';
        case 3: return 'Third Trimester';
        default: return 'Unknown';
    }
}

export function daysUntil(date: Date): number {
    const now = new Date();
    const target = new Date(date);
    const diffMs = target.getTime() - now.getTime();
    return Math.ceil(diffMs / 86400000);
}

export function isInNextDays(date: Date, days: number): boolean {
    const d = daysUntil(date);
    return d >= 0 && d <= days;
}

export const EMERGENCY_KEYWORDS = [
    'bleeding',
    'heavy bleeding',
    'severe headache',
    'reduced movement',
    'no movement',
    'severe pain',
    'chest pain',
    'difficulty breathing',
    'seizure',
    'vision changes',
    'blurred vision',
    'fever and chills',
    'water broke',
    'contractions before 37 weeks',
    'thoughts of harming',
    'suicidal',
];

export function detectEmergencyKeywords(text: string): string[] {
    const lower = text.toLowerCase();
    return EMERGENCY_KEYWORDS.filter(kw => lower.includes(kw));
}

export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
    return /^\+?[\d\s\-()]{7,15}$/.test(phone);
}