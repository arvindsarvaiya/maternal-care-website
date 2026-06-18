'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/components/auth-provider';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { Card, Badge, Button, ProgressBar } from '@/components/ui';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { getRecoveryPhase, getRecoveryPhaseLabel } from '@/lib/postpartum-calculator';
import { getWeekKnowledgeForLocale, type WeekKnowledge } from '@/lib/pregnancy-knowledge-i18n';
import { getPostpartumWeekKnowledge, type PostpartumWeekKnowledge } from '@/lib/postpartum-knowledge';
import {
    Heart,
    HeartHandshake,
    Trophy,
    Target,
    Star,
    CheckCircle2,
    Circle,
    TrendingUp,
    Calendar,
    CalendarDays,
    Clock,
    MapPin,
    Stethoscope,
    MessageCircle,
    ChevronRight,
    Gift,
    Zap,
    Shield,
    Droplets,
    UtensilsCrossed,
    Brain,
    Footprints,
    Smile,
    Award,
    Flame,
    Loader2,
    AlertCircle,
    AlertTriangle,
    X,
    ScrollText,
    ArrowDown,
    Baby,
    Apple,
    Activity,
    BookOpen,
} from 'lucide-react';

// ─── Types ───


interface MicroTask {
    id: string;
    title: string;
    description: string;
    category: 'care' | 'nutrition' | 'emotional' | 'logistics';
    completed: boolean;
    points: number;
    icon: React.ElementType;
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
}

interface WeekScore {
    day: string;
    score: number;
    tasks: number;
}

interface ReceivedRating {
    id: string;
    taskTitle: string;
    score: number;
    feedback: string | null;
    createdAt: string;
}

// ─── API Types ───

interface ApiTaskRating {
    id: string;
    score: number;
    feedback: string | null;
    ratedByUserId: string;
    ratedForUserId: string;
    createdAt: string;
}

interface ApiTaskAssignment {
    id: string;
    assignedTo: { id: string; firstName: string; lastName: string };
    completedAt: string | null;
}

interface ApiTask {
    id: string;
    type: string;
    status: string;
    title: string;
    description: string | null;
    dueAt: string | null;
    createdAt: string;
    updatedAt: string;
    assignments: ApiTaskAssignment[];
    ratings: ApiTaskRating[];
}

interface ApiTasksResponse {
    tasks: ApiTask[];
    total: number;
}

interface ApiWellnessLog {
    id: string;
    mood: number | null;
    createdAt: string;
}

interface ApiWellnessResponse {
    logs: ApiWellnessLog[];
    total: number;
}


interface ApiAppointment {
    id: string;
    type: string;
    provider: string | null;
    date: string;
    time: string;
    location: string | null;
    status: string;
    notes: string | null;
    scheduledAt: string;
}

interface ApiAppointmentsResponse {
    appointments: ApiAppointment[];
    total: number;
}


// ─── Constants ───

const POINTS_PER_TASK = 10;
const TASK_CATEGORY_MAP: Record<string, { category: MicroTask['category']; icon: React.ElementType }> = {
    health: { category: 'care', icon: Heart },
    care: { category: 'care', icon: HeartHandshake },
    support: { category: 'care', icon: HeartHandshake },
    nutrition: { category: 'nutrition', icon: UtensilsCrossed },
    emotional: { category: 'emotional', icon: Heart },
    logistics: { category: 'logistics', icon: Calendar },
    learning: { category: 'emotional', icon: Brain },
    preparation: { category: 'logistics', icon: Target },
    home: { category: 'logistics', icon: Shield },
    exercise: { category: 'care', icon: Footprints },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    care: HeartHandshake,
    nutrition: UtensilsCrossed,
    emotional: Brain,
    logistics: Calendar,
};

// ─── Helper Components ───

function TaskCard({ task }: { task: MicroTask }) {
    return (
        <div className={`flex items-start gap-3 p-3 rounded-lg transition-all ${task.completed
            ? 'bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800'
            : 'bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700'
            }`}>
            <div className="flex-shrink-0 mt-0.5">
                {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary-500" />
                ) : (
                    <Circle className="w-5 h-5 text-surface-300" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <task.icon className={`w-3.5 h-3.5 ${task.completed ? 'text-primary-400' : 'text-surface-400'}`} />
                    <p className={`text-sm font-medium ${task.completed ? 'text-primary-600 line-through' : 'text-surface-800 dark:text-surface-200'}`}>
                        {task.title}
                    </p>
                    <Badge variant={task.completed ? 'primary' : 'gold'}>+{task.points} pts</Badge>
                </div>
                <p className={`text-xs mt-0.5 ${task.completed ? 'text-primary-400' : 'text-surface-500'}`}>
                    {task.description}
                </p>
            </div>
        </div>
    );
}

function ScoreBar({ data, maxScore }: { data: WeekScore[]; maxScore: number }) {
    return (
        <div className="flex gap-1 items-end h-24">
            {data.map((d, i) => {
                const height = maxScore > 0 ? (d.score / maxScore) * 100 : 0;
                const today = new Date().getDay();
                const dayIndex = i + 1;
                const isToday = today === dayIndex || (today === 0 && i === 6);
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-surface-400 font-medium">{d.score > 0 ? d.score : ''}</span>
                        <div
                            className={`w-full rounded-t-sm transition-all ${isToday
                                ? 'bg-primary-500'
                                : d.score >= 60 ? 'bg-primary-400' : d.score >= 40 ? 'bg-primary-300' : d.score > 0 ? 'bg-primary-200' : 'bg-surface-100 dark:bg-surface-700'
                                }`}
                            style={{ height: `${Math.max(height, d.score > 0 ? 4 : 2)}%` }}
                        />
                        <span className={`text-[10px] ${isToday ? 'text-primary-600 font-bold' : 'text-surface-400'}`}>{d.day}</span>
                    </div>
                );
            })}
        </div>
    );
}

function PartnerSkeleton() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="space-y-2">
                    <div className="h-7 w-48 bg-surface-200 dark:bg-velvet-700 rounded" />
                    <div className="h-4 w-64 bg-surface-200 dark:bg-velvet-700 rounded" />
                </div>
                <div className="h-9 w-40 bg-surface-200 dark:bg-velvet-700 rounded" />
            </div>
            <div className="h-28 bg-surface-200 dark:bg-velvet-700 rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-48 bg-surface-200 dark:bg-velvet-700 rounded-xl" />
                <div className="h-48 bg-surface-200 dark:bg-velvet-700 rounded-xl" />
            </div>
            <div className="h-64 bg-surface-200 dark:bg-velvet-700 rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-surface-200 dark:bg-velvet-700 rounded-xl" />
                ))}
            </div>
            <div className="h-40 bg-surface-200 dark:bg-velvet-700 rounded-xl" />
            <div className="h-32 bg-surface-200 dark:bg-velvet-700 rounded-xl" />
        </div>
    );
}

// ─── Helpers ───

function getDayName(dayIndex: number, t: ReturnType<typeof import('next-intl').useTranslations<string>>): string {
    const days = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];
    return days[dayIndex] || '';
}


// ─── Partner Dashboard ───

export default function PartnerDashboard() {
    const { user, isPostpartum } = useAuth();
    const t = useTranslations('partner');
    const locale = useLocale();
    const currentUserId = user?.id || '';

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tasks, setTasks] = useState<MicroTask[]>([]);
    const [weekScores, setWeekScores] = useState<WeekScore[]>([]);
    const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
    const [saving, setSaving] = useState(false);
    const [profileIncomplete, setProfileIncomplete] = useState(false);
    const [profileBannerDismissed, setProfileBannerDismissed] = useState(false);
    const [receivedRatings, setReceivedRatings] = useState<ReceivedRating[]>([]);
    const [loginStreak, setLoginStreak] = useState<number>(0);
    const [currentWeek, setCurrentWeek] = useState<number>(0);
    const [currentTrimester, setCurrentTrimester] = useState<string>('');
    const [motherPhase, setMotherPhase] = useState<'pregnancy' | 'postpartum' | null>(null);
    const [postpartumWeek, setPostpartumWeek] = useState<number>(0);
    const [weekKnowledge, setWeekKnowledge] = useState<WeekKnowledge | null>(null);
    const [postpartumKnowledge, setPostpartumKnowledge] = useState<PostpartumWeekKnowledge | null>(null);

    // Gamification stats — computed from actual data
    const totalPoints = useMemo(() => {
        let pts = 0;
        tasks.forEach(t => { if (t.completed) pts += POINTS_PER_TASK; });
        receivedRatings.forEach(r => { pts += r.score; });
        return pts;
    }, [tasks, receivedRatings]);

    const streak = useMemo(() => {
        // Count consecutive days (from today backwards) with user login
        // This will be fetched from the API and stored in state
        return loginStreak || 0;
    }, [loginStreak]);

    const level = useMemo(() => {
        if (totalPoints >= 500) return 5;
        if (totalPoints >= 300) return 4;
        if (totalPoints >= 200) return 3;
        if (totalPoints >= 100) return 2;
        return 1;
    }, [totalPoints]);

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Record login for streak tracking (fire and forget)
            api.post('/login-streak').catch(() => { });

            const [tasksRes, appointmentsRes, streakRes, motherHealthRes] = await Promise.all([
                api.get<ApiTasksResponse>('/tasks?limit=50'),
                api.get<ApiAppointmentsResponse>('/appointments?status=upcoming&limit=5'),
                api.get<{ streak: number }>('/login-streak').catch(() => ({ streak: 0 })),
                api.get<{ currentWeek: number; trimester: string; phase?: string; postpartumWeek?: number }>('/partner/mother-health').catch(() => ({ currentWeek: 0, trimester: '', phase: undefined, postpartumWeek: 0 })),
            ]);

            // Set login streak
            setLoginStreak(streakRes.streak);

            // Set current pregnancy week from mother's health profile
            setCurrentWeek(motherHealthRes.currentWeek || 0);
            setCurrentTrimester(motherHealthRes.trimester || '');
            setMotherPhase((motherHealthRes.phase as 'pregnancy' | 'postpartum' | null) || null);
            setPostpartumWeek(motherHealthRes.postpartumWeek || 0);

            // Fetch week knowledge for the mother's current pregnancy week (used in "How to Support Her")
            const week = motherHealthRes.currentWeek || 0;
            const phase = motherHealthRes.phase as 'pregnancy' | 'postpartum' | null;
            if (phase === 'pregnancy' && week >= 1 && week <= 40) {
                const knowledge = getWeekKnowledgeForLocale(week, locale);
                setWeekKnowledge(knowledge);
                setPostpartumKnowledge(null);
            } else if (phase === 'postpartum' && motherHealthRes.postpartumWeek && motherHealthRes.postpartumWeek >= 1 && motherHealthRes.postpartumWeek <= 52) {
                const ppKnowledge = getPostpartumWeekKnowledge(motherHealthRes.postpartumWeek);
                setPostpartumKnowledge(ppKnowledge);
                setWeekKnowledge(null);
            } else {
                setWeekKnowledge(null);
                setPostpartumKnowledge(null);
            }

            // ─── Map Tasks ───
            const apiTasks = tasksRes.tasks || [];
            const mappedTasks: MicroTask[] = apiTasks.map(t => {
                const typeName = t.type || 'care';
                const catInfo = TASK_CATEGORY_MAP[typeName] || { category: 'care' as const, icon: Heart };
                // Get completion date from assignments for the current user
                const userAssignment = t.assignments?.find(a => a.assignedTo.id === currentUserId);
                const completedAt = userAssignment?.completedAt || null;
                return {
                    id: t.id,
                    title: t.title,
                    description: t.description || '',
                    category: catInfo.category,
                    completed: t.status === 'done',
                    points: POINTS_PER_TASK,
                    icon: catInfo.icon,
                    createdAt: t.createdAt,
                    updatedAt: t.updatedAt,
                    completedAt: completedAt,
                };
            });
            setTasks(mappedTasks);

            // ─── Extract Received Ratings ───
            const ratings: ReceivedRating[] = [];
            apiTasks.forEach(t => {
                if (t.ratings && t.ratings.length > 0) {
                    t.ratings.forEach(r => {
                        if (r.ratedForUserId === currentUserId) {
                            ratings.push({
                                id: r.id,
                                taskTitle: t.title,
                                score: r.score,
                                feedback: r.feedback,
                                createdAt: r.createdAt,
                            });
                        }
                    });
                }
            });
            // Sort newest first
            ratings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setReceivedRatings(ratings);


            // ─── Compute Week Scores from tasks ───
            const now = new Date();
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay()); // Sunday
            weekStart.setHours(0, 0, 0, 0);

            const dailyScores: Record<number, { score: number; tasks: number }> = {};
            for (let i = 0; i < 7; i++) {
                dailyScores[i] = { score: 0, tasks: 0 };
            }

            // Count completed tasks by their assignment completion dates
            apiTasks.forEach(t => {
                if (t.status === 'done') {
                    // Use assignment completion dates if available
                    const completedAssignments = t.assignments?.filter(a => a.completedAt && a.assignedTo.id === currentUserId) || [];
                    if (completedAssignments.length > 0) {
                        completedAssignments.forEach(a => {
                            const completedDate = new Date(a.completedAt!);
                            if (completedDate >= weekStart) {
                                const dayIdx = completedDate.getDay();
                                dailyScores[dayIdx].score += POINTS_PER_TASK;
                                dailyScores[dayIdx].tasks += 1;
                            }
                        });
                    } else {
                        // Fallback to task updatedAt (when it was last updated/completed), otherwise createdAt
                        const taskDate = new Date(t.updatedAt || t.createdAt);
                        if (taskDate >= weekStart) {
                            const dayIdx = taskDate.getDay();
                            dailyScores[dayIdx].score += POINTS_PER_TASK;
                            dailyScores[dayIdx].tasks += 1;
                        }
                    }
                }
            });

            const scores: WeekScore[] = [0, 1, 2, 3, 4, 5, 6].map(i => ({
                day: getDayName(i, t),
                score: dailyScores[i].score,
                tasks: dailyScores[i].tasks,
            }));
            setWeekScores(scores);

            // ─── Set Appointments ───
            const apiApps = appointmentsRes.appointments || [];
            setAppointments(apiApps.filter(a => a.status === 'upcoming'));

        } catch (err: any) {
            console.error('Failed to fetch partner dashboard:', err);
            setError(err?.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    }, [t, user?.id, locale]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    // Profile completion check
    useEffect(() => {
        async function checkProfileCompletion() {
            try {
                await api.get('/profile/father-health');
                setProfileIncomplete(false);
            } catch {
                setProfileIncomplete(true);
            }
        }
        if (user?.roles?.includes('partner')) {
            checkProfileCompletion();
        }
    }, [user]);

    // ─── Derived Stats ───
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => {
        if (!t.completed) return false;
        // Check if completedAt is today, otherwise use updatedAt (when task was last updated), otherwise createdAt
        const dateToCheck = t.completedAt || t.updatedAt || t.createdAt;
        return new Date(dateToCheck).toISOString().split('T')[0] === today;
    });
    const completedTasks = todayTasks.length;
    const totalTasks = tasks.length;
    const todayPoints = todayTasks.reduce((sum, t) => sum + t.points, 0);
    const weeklyScore = weekScores.reduce((sum, s) => sum + s.score, 0);
    const weeklyTarget = 400;

    const categoryStats = useMemo(() => {
        const categories: { key: string; icon: React.ElementType; label: string; completed: number; total: number; color: string; bgColor: string }[] = [
            { key: 'care', icon: HeartHandshake, label: t('careTasks'), completed: 0, total: 0, color: 'text-razzmatazz-500', bgColor: 'bg-razzmatazz-50 dark:bg-razzmatazz-900/20' },
            { key: 'nutrition', icon: UtensilsCrossed, label: t('nutrition'), completed: 0, total: 0, color: 'text-primary-500', bgColor: 'bg-primary-50 dark:bg-primary-900/20' },
            { key: 'emotional', icon: Brain, label: t('learning'), completed: 0, total: 0, color: 'text-gold-500', bgColor: 'bg-gold-50 dark:bg-gold-900/20' },
            { key: 'logistics', icon: Calendar, label: t('logistics'), completed: 0, total: 0, color: 'text-primary-500', bgColor: 'bg-primary-50 dark:bg-primary-900/20' },
        ];

        todayTasks.forEach(t => {
            const cat = categories.find(c => c.key === t.category);
            if (cat) {
                cat.total++;
                if (t.completed) cat.completed++;
            }
        });

        return categories;
    }, [todayTasks, t]);


    // ─── Loading State ───
    if (loading) {
        return (
            <AuthenticatedShell>
                <PartnerSkeleton />
            </AuthenticatedShell>
        );
    }

    // ─── Render ───
    return (
        <AuthenticatedShell>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                        <h2 className="text-2xl font-display text-surface-800 dark:text-surface-200">
                            {t('welcome', { name: user?.firstName || 'Partner' })}
                        </h2>
                        <p className="text-sm text-surface-500 mt-1">
                            {motherPhase === 'postpartum'
                                ? t('supportMakesDifferencePostpartum', { week: postpartumWeek || 1 })
                                : t('supportMakesDifference', { week: currentWeek || 1, trimester: currentTrimester === 'first' ? t('firstTrimester') : currentTrimester === 'second' ? t('secondTrimester') : currentTrimester === 'third' ? t('thirdTrimester') : t('firstTrimester') })
                            }
                        </p>
                    </div>
                    <Link href="/chat?mode=partner" className="btn-primary btn-sm flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        {t('askPartnerAssistant')}
                    </Link>
                </div>

                {/* Error Banner */}
                {error && (
                    <Card className="border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/20">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-danger-600 dark:text-danger-400 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-danger-700 dark:text-danger-300">{t('errorLoading')}</p>
                                <p className="text-xs text-danger-600 dark:text-danger-400 mt-0.5">{error}</p>
                            </div>
                            <button
                                onClick={fetchDashboard}
                                className="text-sm text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 font-medium underline flex-shrink-0"
                            >
                                {t('retry')}
                            </button>
                        </div>
                    </Card>
                )}

                {/* Profile Incompletion Banner */}
                {profileIncomplete && !profileBannerDismissed && (
                    <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-300 dark:border-warning-700 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-warning-800 dark:text-warning-200">
                                {t('profileIncompleteTitle')}
                            </p>
                            <p className="text-xs text-warning-700 dark:text-warning-300 mt-1">
                                {t('profileIncompleteDesc')}
                            </p>
                            <Link
                                href="/profile/complete-father"
                                className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-warning-700 dark:text-warning-300 hover:text-warning-800 dark:hover:text-warning-200 underline underline-offset-2"
                            >
                                {t('completeProfileNow')}
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <button
                            onClick={() => setProfileBannerDismissed(true)}
                            className="flex-shrink-0 p-1 rounded-md text-warning-500 hover:text-warning-700 dark:hover:text-warning-300 hover:bg-warning-100 dark:hover:bg-warning-800/50 transition-colors"
                            aria-label="Dismiss"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Streak & Motivation Banner */}
                <div className="bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 border border-primary-200 dark:border-primary-700 rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-primary-200 dark:bg-primary-800 flex items-center justify-center">
                                    <Flame className="w-8 h-8 text-primary-600 dark:text-primary-300" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-razzmatazz-500 text-white flex items-center justify-center text-xs font-bold">
                                    {streak}
                                </div>
                            </div>
                            <div>
                                <p className="font-display text-lg text-primary-800 dark:text-primary-200">
                                    {streak > 0 ? t('streakMessage', { count: streak }) : t('startYourStreak')}
                                </p>
                                <p className="text-sm text-primary-600 dark:text-primary-400">
                                    {streak > 0 ? t('streakKeepGoing') : t('completeFirstTask')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-display text-primary-700 dark:text-primary-300">{level}</p>
                                <p className="text-xs text-primary-500">{t('level')}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-display text-surface-700 dark:text-surface-300">{totalPoints}</p>
                                <p className="text-xs text-surface-500">{t('totalPoints')}</p>
                            </div>
                            <div className="text-center">
                                <Trophy className="w-5 h-5 text-warning-500 mx-auto" />
                                <p className="text-xs text-surface-500 mt-1">{t('beginner')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ratings Received — Mom's Feedback */}
                {receivedRatings.length > 0 && (
                    <div className="bg-gradient-to-r from-gold-50 to-warning-50 dark:from-gold-900/20 dark:to-warning-900/10 border border-gold-200 dark:border-gold-800 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <ScrollText className="w-5 h-5 text-gold-500" />
                            <h3 className="font-display text-lg text-gold-700 dark:text-gold-300">{t('ratingReceived')}</h3>
                        </div>
                        <div className="space-y-3">
                            {receivedRatings.slice(0, 3).map(rating => {
                                const isHigh = rating.score >= 50;
                                const isMid = rating.score >= 30 && rating.score < 50;
                                const isLow = rating.score < 30;
                                return (
                                    <div key={rating.id} className={`p-4 rounded-lg border ${isHigh
                                        ? 'bg-success-50/60 dark:bg-success-900/10 border-success-200 dark:border-success-800'
                                        : isMid
                                            ? 'bg-warning-50/60 dark:bg-warning-900/10 border-warning-200 dark:border-warning-800'
                                            : 'bg-razzmatazz-50/60 dark:bg-razzmatazz-900/10 border-razzmatazz-200 dark:border-razzmatazz-800'
                                        }`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isHigh
                                                ? 'bg-success-100 dark:bg-success-800 text-success-600 dark:text-success-300'
                                                : isMid
                                                    ? 'bg-warning-100 dark:bg-warning-800 text-warning-600 dark:text-warning-300'
                                                    : 'bg-razzmatazz-100 dark:bg-razzmatazz-800 text-razzmatazz-600 dark:text-razzmatazz-300'
                                                }`}>
                                                <Trophy className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-surface-800 dark:text-surface-200">
                                                    {isHigh
                                                        ? t('ratingCongratsHigh', { score: rating.score, task: rating.taskTitle })
                                                        : isMid
                                                            ? t('ratingCongratsMid', { score: rating.score, task: rating.taskTitle })
                                                            : t('ratingEncourageLow', { score: rating.score, task: rating.taskTitle })}
                                                </p>
                                                {rating.feedback && (
                                                    <div className="mt-2 p-2 rounded bg-white/50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
                                                        <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">{t('ratingFeedbackFromMom')}</p>
                                                        <p className="text-sm text-surface-700 dark:text-surface-300 italic">"{rating.feedback}"</p>
                                                    </div>
                                                )}
                                                {isLow && (
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <ArrowDown className="w-4 h-4 text-razzmatazz-400" />
                                                        <a
                                                            href="#how-to-support"
                                                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                                                        >
                                                            {t('viewHowToSupport')}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`text-lg font-display font-bold flex-shrink-0 ${isHigh ? 'text-success-600 dark:text-success-400' :
                                                isMid ? 'text-warning-600 dark:text-warning-400' :
                                                    'text-razzmatazz-600 dark:text-razzmatazz-400'
                                                }`}>+{rating.score}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}


                {/* Top Row — Weekly Score + Today's Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Weekly Score Card */}
                    <Card className="lg:col-span-2" variant="primary">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary-500" />
                                {t('weeklyProgress')}
                            </h3>
                            <Badge variant="primary">{weeklyScore} / {weeklyTarget} pts</Badge>
                        </div>
                        <ProgressBar value={weeklyScore} max={weeklyTarget} variant="primary" showLabel size="lg" />
                        <div className="mt-6">
                            <ScoreBar data={weekScores} maxScore={80} />
                        </div>
                        <p className="text-xs text-surface-400 mt-4 text-center">
                            {weeklyScore >= weeklyTarget
                                ? t('targetReached')
                                : t('pointsToReachTarget', { points: weeklyTarget - weeklyScore })}
                        </p>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-warning-400" />
                            {t('today')}
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-surface-600 dark:text-surface-400">{t('tasksCompletedCount')}</span>
                                <span className="text-sm font-medium text-surface-800 dark:text-surface-200">{completedTasks}/{totalTasks}</span>
                            </div>
                            <ProgressBar value={completedTasks} max={totalTasks || 1} variant="primary" showLabel size="sm" />
                            <div className="flex items-center justify-between pt-2 border-t border-surface-100 dark:border-surface-700">
                                <span className="text-sm text-surface-600 dark:text-surface-400">{t('pointsEarned')}</span>
                                <span className="text-lg font-display text-primary-600 dark:text-primary-300">+{todayPoints}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-surface-600 dark:text-surface-400">{t('streakBonus')}</span>
                                <span className="text-sm font-medium text-warning-600">+{streak * 5} pts</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Today's Micro-Tasks */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 flex items-center gap-2">
                            <Target className="w-5 h-5 text-razzmatazz-400" />
                            {t('todaysSupportActions')}
                        </h3>
                        <Link href="/partner/tasks" className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1">
                            {t('viewAll')} <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {tasks.length === 0 ? (
                        <p className="text-sm text-surface-400 dark:text-surface-500 text-center py-8">
                            {t('noTasksYet')}
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {tasks.slice(0, 8).map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    )}
                </Card>

                {/* Category Progress */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categoryStats.map((cat, i) => (
                        <div key={i} className={`p-4 rounded-xl border border-surface-200 dark:border-surface-700 ${cat.bgColor}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <cat.icon className={`w-4 h-4 ${cat.color}`} />
                                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{cat.label}</span>
                            </div>
                            <p className="text-2xl font-display text-surface-800 dark:text-surface-200 mb-1">{cat.completed}/{cat.total}</p>
                            <ProgressBar value={cat.completed} max={cat.total || 1} variant="primary" size="sm" showLabel={false} />
                        </div>
                    ))}
                </div>

                {/* Upcoming Appointments */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-primary-500" />
                            {t('upcomingAppointments') || 'Upcoming Appointments'}
                        </h3>
                        <Link href="/appointments" className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1">
                            {t('viewAll') || 'View All'} <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {appointments.length === 0 ? (
                        <p className="text-sm text-surface-400 dark:text-surface-500 text-center py-6">
                            {t('noUpcomingAppointments') || 'No upcoming appointments'}
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {appointments.slice(0, 4).map((appt) => (
                                <div
                                    key={appt.id}
                                    className="flex items-start gap-4 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700 hover:border-primary-200 dark:hover:border-primary-600 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center flex-shrink-0">
                                        <Stethoscope className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <p className="text-sm font-medium text-surface-800 dark:text-surface-200 capitalize">
                                                {appt.type}
                                            </p>
                                            <Badge variant="primary" className="text-[10px] px-1.5 py-0">
                                                {appt.status}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-surface-500 dark:text-surface-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {appt.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {appt.time}
                                            </span>
                                            {appt.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {appt.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Partner Tips */}
                <div id="how-to-support">
                    <Card variant="primary">
                        <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-3 flex items-center gap-2">
                            <Gift className="w-5 h-5 text-razzmatazz-400" />
                            {motherPhase === 'postpartum'
                                ? t('weekTipTitlePostpartum', { week: postpartumWeek || 1 })
                                : t('weekTipTitle', { week: currentWeek || 1 })
                            }
                        </h3>
                        {motherPhase === 'postpartum' && postpartumKnowledge ? (
                            <>
                                {/* Summary */}
                                <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed mb-4">
                                    {postpartumKnowledge.phaseLabel} · {postpartumKnowledge.summary}
                                </p>

                                {/* Recovery & Body Changes */}
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50 mb-3">
                                    <Heart className="w-5 h-5 text-razzmatazz-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-surface-800 dark:text-surface-200">
                                            {postpartumKnowledge.phaseLabel}
                                        </p>
                                        {postpartumKnowledge.recoveryNotes.length > 0 && (
                                            <ul className="mt-1 space-y-0.5">
                                                {postpartumKnowledge.recoveryNotes.slice(0, 3).map((item, i) => (
                                                    <li key={i} className="flex items-start gap-1.5 text-xs text-surface-600 dark:text-surface-400">
                                                        <span className="w-1 h-1 rounded-full bg-razzmatazz-400 mt-1.5 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                {/* Baby Development */}
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50 mb-3">
                                    <Baby className="w-5 h-5 text-razzmatazz-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-surface-800 dark:text-surface-200">
                                            {t('babyDevelopment') || 'Baby Development'}
                                        </p>
                                        {postpartumKnowledge.babyDevelopment.length > 0 && (
                                            <ul className="mt-1 space-y-0.5">
                                                {postpartumKnowledge.babyDevelopment.slice(0, 3).map((item, i) => (
                                                    <li key={i} className="flex items-start gap-1.5 text-xs text-surface-600 dark:text-surface-400">
                                                        <span className="w-1 h-1 rounded-full bg-razzmatazz-400 mt-1.5 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                {/* Support Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50">
                                        <Brain className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-0.5">{t('mentalHealth') || 'Mental Health'}</p>
                                            <p className="text-sm text-surface-700 dark:text-surface-300">
                                                {postpartumKnowledge.mentalHealthNotes.slice(0, 2).join(' · ')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50">
                                        <Shield className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-0.5">{t('howToHelp') || 'How You Can Help'}</p>
                                            <p className="text-sm text-surface-700 dark:text-surface-300">
                                                {postpartumKnowledge.weeklyGuidance.slice(0, 2).join(' · ')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50">
                                        <Apple className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-0.5">{t('nutrition') || 'Nutrition'}</p>
                                            <p className="text-sm text-surface-700 dark:text-surface-300">
                                                {postpartumKnowledge.nutritionalFocus.slice(0, 2).join(' · ')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50">
                                        <Activity className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-0.5">{t('activity') || 'Activity'}</p>
                                            <p className="text-sm text-surface-700 dark:text-surface-300">
                                                {postpartumKnowledge.activityNotes.slice(0, 2).join(' · ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Warning Signs */}
                                {postpartumKnowledge.warningSigns.length > 0 && (
                                    <div className="mt-4 p-3 rounded-lg bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800">
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-medium text-warning-700 dark:text-warning-300 uppercase tracking-wide mb-1">{t('warningSigns') || 'Warning Signs'}</p>
                                                <ul className="space-y-0.5">
                                                    {postpartumKnowledge.warningSigns.slice(0, 3).map((sign, i) => (
                                                        <li key={i} className="flex items-start gap-1.5 text-xs text-warning-700 dark:text-warning-300">
                                                            <span className="w-1 h-1 rounded-full bg-warning-500 mt-1.5 flex-shrink-0" />
                                                            {sign}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : motherPhase === 'postpartum' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50">
                                    <Baby className="w-4 h-4 text-razzmatazz-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-surface-700 dark:text-surface-300">{t('tipHelpNights')}</p>
                                </div>
                                <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50">
                                    <Brain className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-surface-700 dark:text-surface-300">{t('tipWatchPPD')}</p>
                                </div>
                                <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50">
                                    <Stethoscope className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-surface-700 dark:text-surface-300">{t('tip6WeekCheckup')}</p>
                                </div>
                                <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50">
                                    <Shield className="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-surface-700 dark:text-surface-300">{t('tipHouseholdChores')}</p>
                                </div>
                                <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50">
                                    <Droplets className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-surface-700 dark:text-surface-300">{t('tipBreastfeedingSupport')}</p>
                                </div>
                                <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50">
                                    <Heart className="w-4 h-4 text-razzmatazz-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-surface-700 dark:text-surface-300">{t('tipSkinToSkin')}</p>
                                </div>
                                <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50">
                                    <Zap className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-surface-700 dark:text-surface-300">{t('tipBabyDiaperChange')}</p>
                                </div>
                                <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50">
                                    <UtensilsCrossed className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-surface-700 dark:text-surface-300">{t('tipPostpartumNutrition')}</p>
                                </div>
                            </div>
                        ) : weekKnowledge ? (
                            <>
                                {/* Summary */}
                                <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed mb-4">
                                    {weekKnowledge.weeklyGuidance.slice(0, 2).join(' · ')}
                                </p>

                                {/* Baby Overview */}
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50 mb-3">
                                    <Baby className="w-5 h-5 text-razzmatazz-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-surface-800 dark:text-surface-200">
                                            {weekKnowledge.babySize} · {weekKnowledge.babyWeight} · {weekKnowledge.babyLength}
                                        </p>
                                        {weekKnowledge.babyDevelopment.length > 0 && (
                                            <ul className="mt-1 space-y-0.5">
                                                {weekKnowledge.babyDevelopment.slice(0, 3).map((item, i) => (
                                                    <li key={i} className="flex items-start gap-1.5 text-xs text-surface-600 dark:text-surface-400">
                                                        <span className="w-1 h-1 rounded-full bg-razzmatazz-400 mt-1.5 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                {/* Mother Body Changes */}
                                {weekKnowledge.motherBodyChanges.length > 0 && (
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50 mb-3">
                                        <Heart className="w-5 h-5 text-razzmatazz-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-surface-800 dark:text-surface-200">
                                                {weekKnowledge.motherBodyChanges.slice(0, 2).join(' · ')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Common Symptoms and Weekly Guidance */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50">
                                        <Activity className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-0.5">Common Symptoms</p>
                                            <p className="text-sm text-surface-700 dark:text-surface-300">
                                                {weekKnowledge.commonSymptoms.slice(0, 3).join(' · ')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50">
                                        <Shield className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-0.5">How You Can Help</p>
                                            <p className="text-sm text-surface-700 dark:text-surface-300">
                                                {weekKnowledge.weeklyGuidance.slice(0, 2).join(' · ')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50">
                                        <Apple className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-0.5">Nutrition</p>
                                            <p className="text-sm text-surface-700 dark:text-surface-300">
                                                {weekKnowledge.nutritionalFocus.slice(0, 2).join(' · ')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 p-3 rounded-lg bg-white dark:bg-surface-800/50">
                                        <BookOpen className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-0.5">Medical Reminders</p>
                                            <p className="text-sm text-surface-700 dark:text-surface-300">
                                                {weekKnowledge.medicalReminders.slice(0, 2).join(' · ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-surface-500 dark:text-surface-400 text-center py-4">
                                {t('noTasksYet')}
                            </p>
                        )}
                    </Card>
                </div>

                {/* Achievements */}
                <Card>
                    <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-warning-400" />
                        {t('achievements')}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: t('achievement5DayStreak'), icon: Flame, unlocked: streak >= 5, color: 'text-razzmatazz-500' },
                            { label: t('achievement50Tasks'), icon: CheckCircle2, unlocked: completedTasks >= 50, color: 'text-primary-500' },
                            { label: t('achievementFirstWeek'), icon: Star, unlocked: completedTasks > 0, color: 'text-warning-500' },
                            { label: t('achievementSuperPartner'), icon: Award, unlocked: completedTasks >= 100, color: 'text-surface-400' },
                        ].map((achievement, i) => (
                            <div key={i} className={`p-3 rounded-lg text-center border ${achievement.unlocked
                                ? 'border-primary-200 dark:border-primary-700 bg-primary-50/30 dark:bg-primary-900/10'
                                : 'border-surface-200 dark:border-surface-700 bg-surface-50/30 dark:bg-surface-800/30 opacity-60'
                                }`}>
                                <achievement.icon className={`w-6 h-6 mx-auto mb-1 ${achievement.unlocked ? achievement.color : 'text-surface-400'}`} />
                                <p className="text-xs font-medium text-surface-700 dark:text-surface-300">{achievement.label}</p>
                                <p className="text-[10px] text-surface-400">{achievement.unlocked ? t('unlocked') : t('locked')}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </AuthenticatedShell>
    );
}