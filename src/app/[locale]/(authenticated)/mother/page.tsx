'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth-provider';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { useTranslations, useLocale } from 'next-intl';
import { Card, Badge, ProgressBar } from '@/components/ui';
import { api } from '@/lib/api-client';
import { getWeekKnowledgeForLocale, WeekKnowledge } from '@/lib/pregnancy-knowledge-i18n';
import { calcPregnancyWeek as calcPregnancyWeekInfo, PregnancyWeekInfo } from '@/lib/pregnancy-calculator';
import { calcPostpartumWeek, PostpartumWeekInfo, getRecoveryPhaseLabel } from '@/lib/postpartum-calculator';
import { getPostpartumWeekKnowledge, type PostpartumWeekKnowledge } from '@/lib/postpartum-knowledge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Baby, Heart, Calendar, Activity, BookOpen,
    ChevronRight, Clock, Droplets,
    Smile, Frown, Meh, AlertTriangle, X,
    Shield, Eye, EyeOff, Send,
    HeartHandshake, Stethoscope, MessageCircle,
    Loader2, CheckCircle2, Star,
    Apple, Dumbbell, ClipboardList, Ruler,
    Timer, Milk, Weight, TrendingUp,
} from 'lucide-react';

// ─── Types ───

interface ApiSymptom {
    id: string;
    symptomType: string;
    severity: string;
    severityRank: number;
    loggedAt: string;
    notes: string | null;
}

interface ApiAppointment {
    id: string;
    type: string;
    provider: string | null;
    date: string;
    time: string;
    location: string | null;
    status: string;
}

interface ApiWellnessLog {
    id: string;
    metricType: string;
    logDate: string;
    numericValue: number | null;
    textValue: string | null;
}

interface ApiWeekContent {
    id: string;
    weekNumber: number;
    title: string;
    summary: string;
    bodyMarkdown: string | null;
    dietNotes: string | null;
    activityNotes: string | null;
    warningSigns: string | null;
}

interface ApiTaskRating {
    id: string;
    score: number;
    feedback: string | null;
    ratedByUserId: string;
    ratedForUserId: string;
    createdAt: string;
}

interface ApiTask {
    id: string;
    title: string;
    description: string | null;
    type: string;
    status: string;
    statusId: string;
    taskTypeId: string;
    dueAt: string | null;
    createdByUserId: string;
    completedAt: string | null;
    ratings: ApiTaskRating[];
}

interface MotherHealthProfile {
    id: string;
    deliveryType: string | null;
    breastfeedingStatus: string | null;
    babyBirthWeight: number | null;
    babyGender: string | null;
    deliveryComplications: string | null;
    babyCount: number | null;
    nicuStay: boolean | null;
    postpartumSupport: string | null;
    deliveryDate: string | null;
}

// ─── Helper Components ───

function MoodEmoji({ value }: { value: number }) {
    if (value >= 4) return <Smile className="w-5 h-5 text-primary-500" />;
    if (value >= 3) return <Meh className="w-5 h-5 text-warning-500" />;
    return <Frown className="w-5 h-5 text-razzmatazz-500" />;
}

function SupportRequestButton({ icon: Icon, label, color, onClick, loading, success }: {
    icon: React.ElementType;
    label: string;
    color: string;
    onClick?: () => void;
    loading?: boolean;
    success?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={loading || success}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm w-full ${success
                ? 'border-success-200 dark:border-success-700 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 cursor-default'
                : loading
                    ? 'border-surface-200 dark:border-surface-700 bg-surface-100 dark:bg-surface-700 text-surface-400 cursor-wait'
                    : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:shadow-soft text-surface-700 dark:text-surface-300'
                }`}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : success ? (
                <CheckCircle2 className="w-4 h-4 text-success-500" />
            ) : (
                <Icon className={`w-4 h-4 ${color}`} />
            )}
            <span>{success ? 'Requested ✓' : label}</span>
        </button>
    );
}


// ─── Mother Dashboard ───

export default function MotherDashboard() {
    const { user, isPostpartum } = useAuth();
    const t = useTranslations('mother');
    const locale = useLocale();
    const router = useRouter();

    // Phase state
    const [isPostpartumPhase, setIsPostpartumPhase] = useState(isPostpartum ?? false);

    // Data state
    const [pregnancy, setPregnancy] = useState<PregnancyWeekInfo | null>(null);
    const [postpartumInfo, setPostpartumInfo] = useState<PostpartumWeekInfo | null>(null);
    const [weekKnowledge, setWeekKnowledge] = useState<WeekKnowledge | null>(null);
    const [postpartumKnowledge, setPostpartumKnowledge] = useState<PostpartumWeekKnowledge | null>(null);
    const [symptoms, setSymptoms] = useState<ApiSymptom[]>([]);
    const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
    const [moodHistory, setMoodHistory] = useState<{ date: string; value: number; label: string }[]>([]);
    const [moodValue, setMoodValue] = useState<number>(4);
    const [weekGuidance, setWeekGuidance] = useState<ApiWeekContent | null>(null);
    const [privateNote, setPrivateNote] = useState('');
    const [loading, setLoading] = useState(true);
    const [savingMood, setSavingMood] = useState(false);
    const [savingNote, setSavingNote] = useState(false);

    // Support request state
    const [requestingSupport, setRequestingSupport] = useState<string | null>(null);
    const [requestedSupport, setRequestedSupport] = useState<Set<string>>(new Set());

    // Mother health profile (postpartum fields)
    const [motherProfile, setMotherProfile] = useState<MotherHealthProfile | null>(null);

    // Profile incompletion check
    const [profileIncomplete, setProfileIncomplete] = useState(false);
    const [profileBannerDismissed, setProfileBannerDismissed] = useState(false);

    // Due date passed — show postpartum info fields
    const [dueDatePassed, setDueDatePassed] = useState(false);

    // Rating state
    const [completedTasksToRate, setCompletedTasksToRate] = useState<ApiTask[]>([]);
    const [ratingScores, setRatingScores] = useState<Record<string, number>>({});
    const [ratingFeedback, setRatingFeedback] = useState<Record<string, string>>({});
    const [submittingRating, setSubmittingRating] = useState<Record<string, boolean>>({});
    const [ratedTasks, setRatedTasks] = useState<Set<string>>(new Set());

    // Phase transition banner state
    const [showTransitionBanner, setShowTransitionBanner] = useState(false);
    const [dueDatePassedDays, setDueDatePassedDays] = useState(0);
    const [transitionDismissed, setTransitionDismissed] = useState(false);
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        async function checkProfileCompletion() {
            try {
                await api.get('/profile/mother-health');
                // Profile exists — no banner needed
                setProfileIncomplete(false);
            } catch {
                // 404 or error — profile doesn't exist
                setProfileIncomplete(true);
            }
        }
        if (user?.roles?.includes('mother')) {
            checkProfileCompletion();
        }
    }, [user]);

    // Fetch all dashboard data
    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            let localPregnancyInfo: PregnancyWeekInfo | null = null;
            let localPostpartumInfo: PostpartumWeekInfo | null = null;
            let detectedPhase: 'pregnancy' | 'postpartum' | null = null;
            const [pregnancyRes, motherHealthRes, symptomsRes, appointmentsRes, wellnessRes, weekRes, tasksRes] = await Promise.allSettled([
                api.get<any>('/profile/pregnancy'),
                api.get<any>('/profile/mother-health'),
                api.get<{ logs: ApiSymptom[] }>('/symptoms?limit=3'),
                api.get<{ appointments: ApiAppointment[] }>('/appointments?limit=3'),
                api.get<{ logs: ApiWellnessLog[] }>('/wellness?metricType=mood&limit=7'),
                api.get<{ content: ApiWeekContent[] }>('/weekly-journey?limit=1'),
                api.get<{ tasks: ApiTask[] }>('/tasks?type=support&status=completed&limit=20'),
            ]);

            // Track mother health profile data for fallback phase detection
            let motherHealthData: any = null;
            if (motherHealthRes.status === 'fulfilled') {
                motherHealthData = motherHealthRes.value;
            }

            // Detect phase from pregnancy profile
            if (pregnancyRes.status === 'fulfilled') {
                const profile = pregnancyRes.value;
                // If profile exists, use its phase; otherwise fall back to mother-health
                if (profile.exists !== false) {
                    detectedPhase = profile.phase || 'pregnancy';
                } else if (motherHealthData?.deliveryDate) {
                    // No pregnancy profile, but mother-health has deliveryDate → postpartum
                    detectedPhase = 'postpartum';
                } else if (motherHealthData?.lmpDate || motherHealthData?.dueDate) {
                    detectedPhase = 'pregnancy';
                }

                if (detectedPhase === 'postpartum') {
                    // Postpartum mode — calculate postpartum week
                    const deliveryDate = profile.deliveryDate || motherHealthData?.deliveryDate;
                    if (deliveryDate) {
                        const ppInfo = calcPostpartumWeek(deliveryDate);
                        if (ppInfo) {
                            localPostpartumInfo = ppInfo;
                            setPostpartumInfo(ppInfo);
                            setIsPostpartumPhase(true);
                            // Load postpartum knowledge
                            const ppKnowledge = getPostpartumWeekKnowledge(ppInfo.week);
                            setPostpartumKnowledge(ppKnowledge);
                            setWeekKnowledge(null);
                        }
                    }
                } else if (detectedPhase === 'pregnancy') {
                    // Pregnancy mode — calculate pregnancy week from LMP/due date
                    const info = calcPregnancyWeekInfo({
                        lmpDate: profile.lmpDate || motherHealthData?.lmpDate,
                        dueDate: profile.dueDate || motherHealthData?.dueDate,
                    });
                    if (info) {
                        localPregnancyInfo = info;
                        setPregnancy(info);
                        const knowledge = getWeekKnowledgeForLocale(Math.min(40, info.week), locale);
                        setWeekKnowledge(knowledge);
                        setPostpartumKnowledge(null);
                    }
                }
            }

            // Check if due date has passed and user is still in pregnancy phase
            if (detectedPhase === 'pregnancy' && pregnancyRes.status === 'fulfilled') {
                const profile = pregnancyRes.value;
                const dueDateStr = profile?.dueDate || motherHealthData?.dueDate;
                if (dueDateStr) {
                    const dueDate = new Date(dueDateStr);
                    const now = new Date();
                    const daysSinceDue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
                    if (daysSinceDue > 0) {
                        setShowTransitionBanner(true);
                        setDueDatePassedDays(daysSinceDue);
                        setDueDatePassed(true);
                    }
                }
            }

            // Fetch mother health profile (postpartum medical info)
            if (motherHealthData) {
                const mh = motherHealthData as MotherHealthProfile;
                setMotherProfile(mh);
                // Also check due date from mother health profile
                if (mh.deliveryDate) {
                    const delDate = new Date(mh.deliveryDate);
                    const now = new Date();
                    if (delDate <= now) {
                        setDueDatePassed(true);
                    }
                }
                // If we still don't have a phase and no pregnancy info, check mother-health for postpartum
                if (!detectedPhase && !localPostpartumInfo && mh.deliveryDate) {
                    const ppInfo = calcPostpartumWeek(mh.deliveryDate);
                    if (ppInfo) {
                        localPostpartumInfo = ppInfo;
                        setPostpartumInfo(ppInfo);
                        setIsPostpartumPhase(true);
                        detectedPhase = 'postpartum';
                        // Load postpartum knowledge
                        const ppKnowledge = getPostpartumWeekKnowledge(ppInfo.week);
                        setPostpartumKnowledge(ppKnowledge);
                        setWeekKnowledge(null);
                    }
                }
            }

            // Fallback: use MotherHealthProfile for LMP/dueDate if no pregnancy phase detected
            if (!localPregnancyInfo && !localPostpartumInfo && motherHealthData) {
                const mhProfile = motherHealthData;
                const info = calcPregnancyWeekInfo({
                    lmpDate: mhProfile.lmpDate,
                    dueDate: mhProfile.dueDate,
                });
                if (info) {
                    localPregnancyInfo = info;
                    setPregnancy(info);
                    const knowledge = getWeekKnowledgeForLocale(Math.min(40, info.week), locale);
                    setWeekKnowledge(knowledge);
                    setPostpartumKnowledge(null);
                }
            }

            // Symptoms
            if (symptomsRes.status === 'fulfilled') {
                setSymptoms(symptomsRes.value.logs || []);
            }

            // Appointments
            if (appointmentsRes.status === 'fulfilled') {
                setAppointments((appointmentsRes.value.appointments || []).filter(
                    (a: ApiAppointment) => a.status === 'upcoming'
                ));
            }

            // Mood history
            if (wellnessRes.status === 'fulfilled') {
                const moodLogs = wellnessRes.value.logs || [];
                const moodData = moodLogs.map((l: ApiWellnessLog) => ({
                    date: new Date(l.logDate).toLocaleDateString('en-US', { weekday: 'short' }),
                    value: l.numericValue ?? 3,
                    label: (l.numericValue ?? 3) >= 4 ? 'Good' : (l.numericValue ?? 3) >= 3 ? 'Okay' : 'Low',
                }));
                setMoodHistory(moodData.length > 0 ? moodData : [
                    { date: 'Mon', value: 4, label: 'Good' },
                    { date: 'Tue', value: 3, label: 'Okay' },
                    { date: 'Wed', value: 5, label: 'Great' },
                    { date: 'Thu', value: 4, label: 'Good' },
                    { date: 'Fri', value: 3, label: 'Okay' },
                    { date: 'Sat', value: 4, label: 'Good' },
                    { date: 'Sun', value: 4, label: 'Good' },
                ]);
            }

            // Week guidance — try API first, fall back to knowledge database
            let hasApiGuidance = false;
            if (weekRes.status === 'fulfilled') {
                const content = weekRes.value.content;
                if (content && content.length > 0) {
                    setWeekGuidance(content[0]);
                    hasApiGuidance = true;
                }
            }

            // Fallback: use knowledge database if no API content available
            if (!hasApiGuidance && localPregnancyInfo) {
                const knowledge = getWeekKnowledgeForLocale(localPregnancyInfo.week, locale);
                if (knowledge) {
                    setWeekGuidance({
                        id: `fallback-week-${localPregnancyInfo.week}`,
                        weekNumber: knowledge.week,
                        title: `Week ${knowledge.week} — ${knowledge.babySize}`,
                        summary: knowledge.weeklyGuidance.join(' · '),
                        bodyMarkdown: null,
                        dietNotes: knowledge.nutritionalFocus.join(' · '),
                        activityNotes: knowledge.exerciseGuidance.join(' · '),
                        warningSigns: knowledge.warningSigns.join(' · '),
                    });
                }
            }

            // Fallback for postpartum: build guidance from knowledge library
            if (!hasApiGuidance && localPostpartumInfo) {
                const ppWeek = localPostpartumInfo.week;
                const ppKnowledge = getPostpartumWeekKnowledge(ppWeek);
                if (ppKnowledge) {
                    setWeekGuidance({
                        id: `fallback-pp-week-${ppWeek}`,
                        weekNumber: ppWeek,
                        title: ppKnowledge.title,
                        summary: ppKnowledge.summary,
                        bodyMarkdown: null,
                        dietNotes: ppKnowledge.nutritionalFocus.join(' · '),
                        activityNotes: ppKnowledge.activityNotes.join(' · '),
                        warningSigns: ppKnowledge.warningSigns.join(' · '),
                    });
                } else {
                    const phaseLabel = getRecoveryPhaseLabel(localPostpartumInfo.recoveryPhase);
                    setWeekGuidance({
                        id: `fallback-pp-week-${localPostpartumInfo.week}`,
                        weekNumber: localPostpartumInfo.week,
                        title: `Postpartum Week ${localPostpartumInfo.week} — ${phaseLabel}`,
                        summary: `You are ${localPostpartumInfo.daysSinceDelivery} days postpartum, in the ${phaseLabel} recovery phase.${localPostpartumInfo.isCriticalRecovery ? ' Schedule your 6-week follow-up checkup.' : ''}`,
                        bodyMarkdown: null,
                        dietNotes: 'Focus on nutrient-dense foods: iron-rich, protein, and hydration for recovery and breastfeeding.',
                        activityNotes: 'Gentle walking, pelvic floor exercises (Kegels), avoid heavy lifting until cleared by doctor.',
                        warningSigns: 'Heavy bleeding, fever, severe pain, shortness of breath, chest pain, thoughts of self-harm.',
                    });
                }
            }

            // Completed support tasks to rate
            if (tasksRes.status === 'fulfilled') {
                const tasks = tasksRes.value.tasks || [];
                const unrated = tasks.filter(t => {
                    const rated = t.ratings && t.ratings.length > 0 && t.ratings.some(r => r.ratedByUserId === user?.id);
                    return !rated;
                });
                setCompletedTasksToRate(unrated);
            }
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    // Save mood
    const handleMoodChange = async (value: number) => {
        setMoodValue(value);
        setSavingMood(true);
        try {
            await api.post('/wellness', {
                metricType: 'mood',
                logDate: new Date().toISOString().split('T')[0],
                numericValue: value,
            });
            // Add to local mood history
            const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
            setMoodHistory(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                if (lastIdx >= 0 && updated[lastIdx].date === today) {
                    updated[lastIdx] = { date: today, value, label: value >= 4 ? 'Good' : value >= 3 ? 'Okay' : 'Low' };
                } else {
                    updated.push({ date: today, value, label: value >= 4 ? 'Good' : value >= 3 ? 'Okay' : 'Low' });
                }
                return updated.slice(-7);
            });
        } catch (err) {
            console.error('Failed to save mood:', err);
        } finally {
            setSavingMood(false);
        }
    };

    // Save private note
    const handleSaveNote = async () => {
        if (!privateNote.trim()) return;
        setSavingNote(true);
        try {
            await api.post('/notes', {
                title: t('privateNoteShort') || 'Private Note',
                body: privateNote.trim(),
                visibility: 'private',
            });
            setPrivateNote('');
        } catch (err) {
            console.error('Failed to save note:', err);
        } finally {
            setSavingNote(false);
        }
    };

    // Request support — creates a shared task for the linked partner
    const handleSupportRequest = async (type: string, title: string) => {
        setRequestingSupport(type);
        try {
            await api.post('/tasks', {
                type: 'support',
                title,
                description: `Support requested by ${user?.firstName || 'the mother'} on ${new Date().toLocaleDateString()}`,
                dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            });
            setRequestedSupport(prev => new Set(prev).add(type));
        } catch (err) {
            console.error('Failed to request support:', err);
        } finally {
            setRequestingSupport(null);
        }
    };

    // Submit rating for a completed task
    const handleSubmitRating = async (taskId: string) => {
        const score = ratingScores[taskId];
        if (!score) return;
        setSubmittingRating(prev => ({ ...prev, [taskId]: true }));
        try {
            await api.post(`/tasks/${taskId}/rate`, {
                score,
                feedback: ratingFeedback[taskId]?.trim() || undefined,
            });
            setRatedTasks(prev => new Set(prev).add(taskId));
            // Remove from completedTasksToRate
            setCompletedTasksToRate(prev => prev.filter(t => t.id !== taskId));
        } catch (err) {
            console.error('Failed to submit rating:', err);
        } finally {
            setSubmittingRating(prev => ({ ...prev, [taskId]: false }));
        }
    };

    // Phase transition handler
    const handleTransition = async () => {
        setTransitioning(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            await api.post('/profile/pregnancy/transition', { deliveryDate: today });
            setShowTransitionBanner(false);
            setTransitionDismissed(true);
            setIsPostpartumPhase(true);
            setDueDatePassed(true);
            // Refresh dashboard to show postpartum content
            await fetchDashboard();
        } catch (err) {
            console.error('Failed to transition phase:', err);
        } finally {
            setTransitioning(false);
        }
    };

    const trimesterLabel = pregnancy
        ? (pregnancy.trimester === 1 ? t('firstTrimester') : pregnancy.trimester === 2 ? t('secondTrimester') : t('thirdTrimester'))
        : '';

    return (
        <AuthenticatedShell>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                        <h2 className="text-2xl font-display text-surface-800 dark:text-surface-200">
                            {t('welcome', { name: user?.firstName || '' })}
                        </h2>
                        {isPostpartumPhase && postpartumInfo && (
                            <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
                                {t('postpartumWeekInfo', { week: postpartumInfo.week, day: postpartumInfo.daysSinceDelivery, phase: getRecoveryPhaseLabel(postpartumInfo.recoveryPhase) })}
                            </p>
                        )}
                        {!isPostpartumPhase && pregnancy && (
                            <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
                                {t('trimesterInfo', { trimester: trimesterLabel, week: pregnancy.week, day: pregnancy.day })}
                            </p>
                        )}
                    </div>
                    <Link href="/chat" className="btn-primary btn-sm flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        {t('askAssistant')}
                    </Link>
                </div>

                {/* Emergency Banner */}
                <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-danger-700 dark:text-danger-300">
                            {t('emergencyTitle')}
                        </p>
                        <p className="text-xs text-danger-600 dark:text-danger-400 mt-1">
                            {t('emergencyDisclaimer')}
                        </p>
                    </div>
                </div>

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
                                href="/profile/complete"
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

                {/* Phase Transition Banner — due date passed */}
                {showTransitionBanner && !transitionDismissed && !isPostpartumPhase && (
                    <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-300 dark:border-primary-700 rounded-xl p-4 flex items-start gap-3">
                        <Baby className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
                                {t('transitionTitle')}
                            </p>
                            <p className="text-xs text-primary-700 dark:text-primary-300 mt-1">
                                {t('transitionPastDue', { days: dueDatePassedDays })}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                                <button
                                    onClick={handleTransition}
                                    disabled={transitioning}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
                                >
                                    {transitioning ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <CheckCircle2 className="w-4 h-4" />
                                    )}
                                    {transitioning ? t('transitionLoading') : t('transitionYes')}
                                </button>
                                <button
                                    onClick={() => setTransitionDismissed(true)}
                                    disabled={transitioning}
                                    className="text-sm text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-colors"
                                >
                                    {t('transitionNotYet')}
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => setTransitionDismissed(true)}
                            disabled={transitioning}
                            className="flex-shrink-0 p-1 rounded-md text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800/50 transition-colors"
                            aria-label="Dismiss"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Baby & Delivery Details Card — shown when due date has passed */}
                {isPostpartumPhase && motherProfile && (
                    <Card variant="calm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
                                <Baby className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-display text-lg text-surface-800 dark:text-surface-200">{t('babyInfoCard')}</h3>
                                <p className="text-sm text-surface-500">{t('babyDetails')}</p>
                            </div>
                            <Link href="/profile" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                {t('editProfile')} <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                <p className="text-xs text-surface-500 mb-1">{t('deliveryType')}</p>
                                <p className="text-sm font-medium text-surface-800 dark:text-surface-200 capitalize">
                                    {motherProfile.deliveryType || '-'}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                <p className="text-xs text-surface-500 mb-1">{t('birthWeight')}</p>
                                <p className="text-sm font-medium text-surface-800 dark:text-surface-200">
                                    {motherProfile.babyBirthWeight ? `${motherProfile.babyBirthWeight} ${t('kg')}` : '-'}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                <p className="text-xs text-surface-500 mb-1">{t('babyGender')}</p>
                                <p className="text-sm font-medium text-surface-800 dark:text-surface-200 capitalize">
                                    {motherProfile.babyGender || '-'}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                <p className="text-xs text-surface-500 mb-1">{t('breastfeeding')}</p>
                                <p className="text-sm font-medium text-surface-800 dark:text-surface-200 capitalize">
                                    {motherProfile.breastfeedingStatus || '-'}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                            <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                <p className="text-xs text-surface-500 mb-1">{t('deliveryComplications')}</p>
                                <p className="text-sm font-medium text-surface-800 dark:text-surface-200 capitalize">
                                    {motherProfile.deliveryComplications || '-'}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                <p className="text-xs text-surface-500 mb-1">{t('babyCount')}</p>
                                <p className="text-sm font-medium text-surface-800 dark:text-surface-200">
                                    {motherProfile.babyCount || '-'}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                <p className="text-xs text-surface-500 mb-1">{t('nicuStay')}</p>
                                <p className="text-sm font-medium text-surface-800 dark:text-surface-200">
                                    {motherProfile.nicuStay ? t('yes') : motherProfile.nicuStay === false ? t('no') : '-'}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                <p className="text-xs text-surface-500 mb-1">{t('postpartumSupport')}</p>
                                <p className="text-sm font-medium text-surface-800 dark:text-surface-200 capitalize">
                                    {motherProfile.postpartumSupport || '-'}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Show prompt to complete postpartum profile when due date passed but no data */}
                {isPostpartumPhase && !motherProfile && (
                    <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4 flex items-start gap-3">
                        <Baby className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
                                {t('noPostpartumDetails')}
                            </p>
                            <Link
                                href="/profile"
                                className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-200 underline underline-offset-2"
                            >
                                {t('completePostpartumDetails')}
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Top Row — Progress + Mood */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Progress Card — Pregnancy or Postpartum */}
                    <Card className="lg:col-span-2" variant="calm">
                        {loading && !pregnancy && !postpartumInfo ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-10 bg-surface-200 dark:bg-surface-700 rounded w-3/4" />
                                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded-full" />
                                <div className="grid grid-cols-3 gap-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-16 bg-surface-200 dark:bg-surface-700 rounded" />
                                    ))}
                                </div>
                            </div>
                        ) : isPostpartumPhase && postpartumInfo ? (
                            <>
                                {/* Postpartum Recovery Progress */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-razzmatazz-100 dark:bg-razzmatazz-800 flex items-center justify-center">
                                            <Timer className="w-5 h-5 text-razzmatazz-600 dark:text-razzmatazz-300" />
                                        </div>
                                        <div>
                                            <h3 className="font-display text-lg text-surface-800 dark:text-surface-200">{t('yourRecovery') || 'Your Recovery Journey'}</h3>
                                            <p className="text-sm text-surface-500">
                                                {postpartumInfo.isCriticalRecovery
                                                    ? (t('criticalRecovery') || 'Critical recovery period — take it easy')
                                                    : (t('postpartumDayCount', { days: postpartumInfo.daysSinceDelivery }) || `${postpartumInfo.daysSinceDelivery} days postpartum`)}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="primary">{postpartumInfo.weekLabel} · {t('day') || 'Day'} {postpartumInfo.daysSinceDelivery % 7 || 7}</Badge>
                                </div>

                                <ProgressBar value={postpartumInfo.progressPercent} max={100} variant="accent" showLabel={false} size="lg" />

                                <div className="grid grid-cols-4 gap-3 mt-6 text-center">
                                    <div>
                                        <p className="text-2xl font-display text-razzmatazz-600 dark:text-razzmatazz-300">{postpartumInfo.week}</p>
                                        <p className="text-xs text-surface-500">{t('postpartumWeek') || 'Postpartum Week'}</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-display text-razzmatazz-600 dark:text-razzmatazz-300">{postpartumInfo.month}</p>
                                        <p className="text-xs text-surface-500">{t('month') || 'Month'}</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-display text-razzmatazz-600 dark:text-razzmatazz-300">{getRecoveryPhaseLabel(postpartumInfo.recoveryPhase)}</p>
                                        <p className="text-xs text-surface-500">{t('recoveryPhase') || 'Recovery Phase'}</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-display text-razzmatazz-600 dark:text-razzmatazz-300">{postpartumInfo.daysSinceDelivery}</p>
                                        <p className="text-xs text-surface-500">{t('daysPostpartum') || 'Days Postpartum'}</p>
                                    </div>
                                </div>
                            </>
                        ) : pregnancy ? (
                            <>
                                {/* Pregnancy Progress */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
                                            <Baby className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                                        </div>
                                        <div>
                                            <h3 className="font-display text-lg text-surface-800 dark:text-surface-200">{t('yourPregnancy')}</h3>
                                            <p className="text-sm text-surface-500">
                                                {pregnancy.isPastDue
                                                    ? t('pastDue')
                                                    : `${pregnancy.daysUntilDue} ${t('daysUntilDue')}`}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="primary">{t('currentWeek')} {pregnancy.week}, {t('day')} {pregnancy.day}</Badge>
                                </div>

                                <ProgressBar value={pregnancy.progressPercent} max={100} variant="primary" showLabel size="lg" />

                                <div className="grid grid-cols-4 gap-3 mt-6 text-center">
                                    <div>
                                        <p className="text-2xl font-display text-primary-600 dark:text-primary-300">{pregnancy.week}</p>
                                        <p className="text-xs text-surface-500">{t('currentWeek')}</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-display text-primary-600 dark:text-primary-300">{pregnancy.weeksRemaining}</p>
                                        <p className="text-xs text-surface-500">{t('weeksToGo')}</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-display text-primary-600 dark:text-primary-300">{trimesterLabel}</p>
                                        <p className="text-xs text-surface-500">{t('trimester')}</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-display text-primary-600 dark:text-primary-300">{pregnancy.progressPercent}%</p>
                                        <p className="text-xs text-surface-500">{t('progress')}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <Baby className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                                <p className="text-surface-500 text-sm">{t('noPregnancyProfile') || 'No pregnancy profile set up yet.'}</p>
                                <Link href="/settings" className="text-primary-600 text-sm mt-2 inline-block hover:underline">
                                    {t('setupProfile') || 'Set up your pregnancy profile'}
                                </Link>
                            </div>
                        )}
                    </Card>

                    {/* Mood Check-in */}
                    <Card>
                        <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-razzmatazz-400" />
                            {t('todaysMood')}
                        </h3>

                        <div className="flex justify-center gap-3 mb-4">
                            {[1, 2, 3, 4, 5].map(v => (
                                <button
                                    key={v}
                                    onClick={() => handleMoodChange(v)}
                                    disabled={savingMood}
                                    className={`p-2 rounded-xl transition-all ${moodValue === v ? 'bg-primary-100 dark:bg-primary-800 ring-2 ring-primary-300 scale-110' : 'hover:bg-surface-100 dark:hover:bg-surface-700'} ${savingMood ? 'opacity-50' : ''}`}
                                >
                                    <MoodEmoji value={v} />
                                </button>
                            ))}
                        </div>

                        <p className="text-center text-sm text-surface-600 dark:text-surface-400 mb-4">
                            {moodValue >= 4 ? t('feelingGood') : moodValue >= 3 ? t('doingOkay') : t('roughDay')}
                        </p>

                        {/* Mood trend */}
                        <div className="flex gap-1 justify-center items-end h-12">
                            {moodHistory.map((m, i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <div
                                        className={`w-6 rounded-t-sm transition-all ${m.value >= 4 ? 'bg-primary-400' : m.value >= 3 ? 'bg-warning-400' : 'bg-razzmatazz-400'}`}
                                        style={{ height: `${m.value * 8}px` }}
                                    />
                                    <span className="text-[10px] text-surface-400">{m.date}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* This Week's Guidance — shows during pregnancy AND postpartum */}
                {!isPostpartumPhase ? (
                    <Card variant="calm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-5 h-5 text-primary-600" />
                                <h3 className="font-display text-lg text-surface-800 dark:text-surface-200">
                                    {t('thisWeekGuidance')}
                                </h3>
                            </div>
                            <Link href="/weekly-journey" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                {t('fullJourney')} <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {weekGuidance || weekKnowledge ? (
                            <>
                                {/* Summary */}
                                <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed mb-4">
                                    {weekGuidance?.summary || (pregnancy
                                        ? `${t('weekTitle', { week: pregnancy.week })} — ${weekGuidance?.title || `Week ${pregnancy.week}`}`
                                        : weekGuidance?.title || (weekKnowledge ? `Week ${weekKnowledge.week} — ${weekKnowledge.babySize}` : ''))}
                                </p>

                                {/* Baby Overview — from knowledge database (pregnancy only) */}
                                {weekKnowledge && (
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/10 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center flex-shrink-0">
                                            <Baby className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('babyThisWeek')}</p>
                                            <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5">
                                                {weekKnowledge.babySize} · {weekKnowledge.babyWeight} · {weekKnowledge.babyLength}
                                            </p>
                                            {weekKnowledge.babyDevelopment.length > 0 && (
                                                <ul className="mt-2 space-y-1">
                                                    {weekKnowledge.babyDevelopment.slice(0, 3).map((item, i) => (
                                                        <li key={i} className="flex items-start gap-1.5 text-xs text-surface-600 dark:text-surface-400">
                                                            <span className="w-1 h-1 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Mother Body Changes — from knowledge database (pregnancy only) */}
                                {weekKnowledge && weekKnowledge.motherBodyChanges.length > 0 && (
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50 mb-4">
                                        <Heart className="w-5 h-5 text-razzmatazz-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('motherChanges')}</p>
                                            <ul className="mt-1 space-y-1">
                                                {weekKnowledge.motherBodyChanges.slice(0, 3).map((item, i) => (
                                                    <li key={i} className="flex items-start gap-1.5 text-xs text-surface-600 dark:text-surface-400">
                                                        <span className="w-1 h-1 rounded-full bg-razzmatazz-400 mt-1.5 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Common Symptoms — from knowledge database (pregnancy only) */}
                                {weekKnowledge && weekKnowledge.commonSymptoms.length > 0 && (
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50 mb-4">
                                        <Activity className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('commonSymptoms')}</p>
                                            <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5">
                                                {weekKnowledge.commonSymptoms.slice(0, 4).join(' · ')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Tips Grid — Diet, Activity, Hydration, Medical */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                        <Apple className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('dietNutrition')}</p>
                                            <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5">
                                                {weekGuidance?.dietNotes || (weekKnowledge ? weekKnowledge.nutritionalFocus.slice(0, 2).join(' · ') : t('dietDefault'))}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                        <Dumbbell className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('activityWellness')}</p>
                                            <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5">
                                                {weekGuidance?.activityNotes || (weekKnowledge ? weekKnowledge.exerciseGuidance.slice(0, 2).join(' · ') : t('activityDefault'))}
                                            </p>
                                        </div>
                                    </div>
                                    {weekKnowledge && weekKnowledge.hydrationGuidance.length > 0 && (
                                        <div className="flex gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                            <Droplets className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('hydration')}</p>
                                                <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5">
                                                    {weekKnowledge.hydrationGuidance.slice(0, 2).join(' · ')}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {weekKnowledge && weekKnowledge.medicalReminders.length > 0 && (
                                        <div className="flex gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                            <Stethoscope className="w-5 h-5 text-surface-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('medicalReminders')}</p>
                                                <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5">
                                                    {weekKnowledge.medicalReminders.slice(0, 2).join(' · ')}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Warning Signs */}
                                {(weekGuidance?.warningSigns || (weekKnowledge && weekKnowledge.warningSigns.length > 0)) && (
                                    <div className="mt-4 p-3 rounded-lg bg-warning-50 dark:bg-warning-900/10 border border-warning-200 dark:border-warning-800">
                                        <p className="text-xs font-medium text-warning-700 dark:text-warning-300 mb-1">{t('warningTitle')}</p>
                                        <p className="text-xs text-warning-600 dark:text-warning-400">
                                            {weekGuidance?.warningSigns || weekKnowledge!.warningSigns.join(' · ')}
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-full" />
                                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-16 bg-surface-200 dark:bg-surface-700 rounded" />
                                    <div className="h-16 bg-surface-200 dark:bg-surface-700 rounded" />
                                </div>
                            </div>
                        )}
                    </Card>
                ) : (
                    /* Postpartum Weekly Guidance */
                    <Card variant="calm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-5 h-5 text-razzmatazz-500" />
                                <h3 className="font-display text-lg text-surface-800 dark:text-surface-200">
                                    {t('thisWeekGuidance') || 'This Week\'s Guidance'}
                                </h3>
                            </div>
                            <Link href="/weekly-journey" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                {t('fullJourney')} <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {postpartumKnowledge ? (
                            <>
                                {/* Summary */}
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="primary">{postpartumKnowledge.phaseLabel}</Badge>
                                    <span className="text-xs text-surface-500">{t('postpartumWeek') || 'Postpartum Week'} {postpartumKnowledge.week}</span>
                                </div>
                                <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed mb-4">
                                    {postpartumKnowledge.summary}
                                </p>

                                {/* Recovery & Body Changes */}
                                {postpartumKnowledge.recoveryNotes.length > 0 && (
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-razzmatazz-50 dark:bg-razzmatazz-900/10 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-razzmatazz-100 dark:bg-razzmatazz-800 flex items-center justify-center flex-shrink-0">
                                            <Heart className="w-5 h-5 text-razzmatazz-600 dark:text-razzmatazz-300" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('yourRecovery') || 'Your Recovery'}</p>
                                            <ul className="mt-2 space-y-1">
                                                {postpartumKnowledge.recoveryNotes.slice(0, 3).map((item, i) => (
                                                    <li key={i} className="flex items-start gap-1.5 text-xs text-surface-600 dark:text-surface-400">
                                                        <span className="w-1 h-1 rounded-full bg-razzmatazz-400 mt-1.5 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                            {postpartumKnowledge.bodyChanges.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-razzmatazz-100 dark:border-razzmatazz-800/30">
                                                    <p className="text-xs text-surface-500 mb-1">{t('bodyChanges') || 'Body Changes'}</p>
                                                    <ul className="space-y-1">
                                                        {postpartumKnowledge.bodyChanges.slice(0, 2).map((item, i) => (
                                                            <li key={i} className="flex items-start gap-1.5 text-xs text-surface-600 dark:text-surface-400">
                                                                <span className="w-1 h-1 rounded-full bg-surface-400 mt-1.5 flex-shrink-0" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Baby Development */}
                                {postpartumKnowledge.babyDevelopment.length > 0 && (
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/10 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center flex-shrink-0">
                                            <Baby className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('babyDevelopment') || 'Baby Development'}</p>
                                            <ul className="mt-2 space-y-1">
                                                {postpartumKnowledge.babyDevelopment.slice(0, 3).map((item, i) => (
                                                    <li key={i} className="flex items-start gap-1.5 text-xs text-surface-600 dark:text-surface-400">
                                                        <span className="w-1 h-1 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                            {postpartumKnowledge.babyCareNotes.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-primary-100 dark:border-primary-800/30">
                                                    <p className="text-xs text-surface-500 mb-1">{t('babyCareTips') || 'Baby Care Tips'}</p>
                                                    <ul className="space-y-1">
                                                        {postpartumKnowledge.babyCareNotes.slice(0, 2).map((item, i) => (
                                                            <li key={i} className="flex items-start gap-1.5 text-xs text-surface-600 dark:text-surface-400">
                                                                <span className="w-1 h-1 rounded-full bg-surface-400 mt-1.5 flex-shrink-0" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Support Grid — Mental Health, Nutrition, Activity */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Mental Health */}
                                    <div className="flex gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                        <Heart className="w-5 h-5 text-razzmatazz-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('mentalHealth') || 'Mental Health'}</p>
                                            <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5">
                                                {postpartumKnowledge.mentalHealthNotes.slice(0, 2).join(' · ')}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Nutrition */}
                                    <div className="flex gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                        <Apple className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('dietNutrition') || 'Diet & Nutrition'}</p>
                                            <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5">
                                                {postpartumKnowledge.nutritionalFocus.slice(0, 2).join(' · ')}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Activity */}
                                    <div className="flex gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                        <Dumbbell className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('activityWellness') || 'Activity & Wellness'}</p>
                                            <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5">
                                                {postpartumKnowledge.activityNotes.slice(0, 2).join(' · ')}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Weekly Guidance */}
                                    {postpartumKnowledge.weeklyGuidance.length > 0 && (
                                        <div className="flex gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                            <BookOpen className="w-5 h-5 text-surface-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('weeklyTips') || 'Weekly Tips'}</p>
                                                <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5">
                                                    {postpartumKnowledge.weeklyGuidance.slice(0, 2).join(' · ')}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Warning Signs */}
                                {postpartumKnowledge.warningSigns.length > 0 && (
                                    <div className="mt-4 p-3 rounded-lg bg-warning-50 dark:bg-warning-900/10 border border-warning-200 dark:border-warning-800">
                                        <p className="text-xs font-medium text-warning-700 dark:text-warning-300 mb-1">{t('warningTitle') || '⚠️ Warning Signs'}</p>
                                        <ul className="space-y-1">
                                            {postpartumKnowledge.warningSigns.slice(0, 4).map((sign, i) => (
                                                <li key={i} className="flex items-start gap-1.5 text-xs text-warning-600 dark:text-warning-400">
                                                    <span className="w-1 h-1 rounded-full bg-warning-500 mt-1.5 flex-shrink-0" />
                                                    {sign}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Fallback: show basic guidance from API or calculator */
                            <>
                                {weekGuidance ? (
                                    <>
                                        <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed mb-4">
                                            {weekGuidance.summary}
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                                <Apple className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('dietNutrition')}</p>
                                                    <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5">
                                                        {weekGuidance.dietNotes || t('dietDefault')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                                <Dumbbell className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('activityWellness')}</p>
                                                    <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5">
                                                        {weekGuidance.activityNotes || t('activityDefault')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {weekGuidance.warningSigns && (
                                            <div className="mt-4 p-3 rounded-lg bg-warning-50 dark:bg-warning-900/10 border border-warning-200 dark:border-warning-800">
                                                <p className="text-xs font-medium text-warning-700 dark:text-warning-300 mb-1">{t('warningTitle')}</p>
                                                <p className="text-xs text-warning-600 dark:text-warning-400">
                                                    {weekGuidance.warningSigns}
                                                </p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="animate-pulse space-y-3">
                                        <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-full" />
                                        <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-16 bg-surface-200 dark:bg-surface-700 rounded" />
                                            <div className="h-16 bg-surface-200 dark:bg-surface-700 rounded" />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </Card>
                )}

                {/* Bottom Grid — Symptoms + Appointments + Support */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Symptoms */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-razzmatazz-400" />
                                {t('recentSymptoms')}
                            </h3>
                            <Link href="/symptoms" className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                {t('logNew')} +
                            </Link>
                        </div>

                        {symptoms.length === 0 ? (
                            <p className="text-sm text-surface-500 text-center py-6">{t('noRecentSymptoms')}</p>
                        ) : (
                            <div className="space-y-3">
                                {symptoms.map(s => (
                                    <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                        <div>
                                            <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{s.symptomType}</p>
                                            <p className="text-xs text-surface-500">{t('severity')} {s.severity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Upcoming Appointments */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gold-400" />
                                {t('appointments')}
                            </h3>
                            <Link href="/appointments" className="text-xs text-primary-600 hover:text-primary-700">
                                {t('viewAll') || 'View All'}
                            </Link>
                        </div>

                        {appointments.length === 0 ? (
                            <p className="text-sm text-surface-500 text-center py-6">{t('noUpcomingAppts')}</p>
                        ) : (
                            <div className="space-y-3">
                                {appointments.map(a => (
                                    <div key={a.id} className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Stethoscope className="w-4 h-4 text-primary-500" />
                                            <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{a.type}</p>
                                        </div>
                                        <p className="text-xs text-surface-500">
                                            {[a.provider, a.location].filter(Boolean).join(' · ')}
                                        </p>
                                        <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 font-medium">
                                            {new Date(a.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Support Requests */}
                    <Card>
                        <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
                            <HeartHandshake className="w-5 h-5 text-razzmatazz-400" />
                            {t('requestSupport')}
                        </h3>

                        <div className="space-y-2">
                            <SupportRequestButton
                                icon={Clock}
                                label={t('supportRest')}
                                color="text-gold-500"
                                onClick={() => handleSupportRequest('rest', t('supportRest'))}
                                loading={requestingSupport === 'rest'}
                                success={requestedSupport.has('rest')}
                            />
                            <SupportRequestButton
                                icon={Droplets}
                                label={t('supportFood')}
                                color="text-primary-500"
                                onClick={() => handleSupportRequest('food', t('supportFood'))}
                                loading={requestingSupport === 'food'}
                                success={requestedSupport.has('food')}
                            />
                            <SupportRequestButton
                                icon={Heart}
                                label={t('supportEmotional')}
                                color="text-razzmatazz-500"
                                onClick={() => handleSupportRequest('emotional', t('supportEmotional'))}
                                loading={requestingSupport === 'emotional'}
                                success={requestedSupport.has('emotional')}
                            />
                            <SupportRequestButton
                                icon={AlertTriangle}
                                label={t('supportTransport')}
                                color="text-razzmatazz-500"
                                onClick={() => handleSupportRequest('transport', t('supportTransport'))}
                                loading={requestingSupport === 'transport'}
                                success={requestedSupport.has('transport')}
                            />
                            <SupportRequestButton
                                icon={Stethoscope}
                                label={t('supportDoctor')}
                                color="text-gold-500"
                                onClick={() => handleSupportRequest('doctor', t('supportDoctor'))}
                                loading={requestingSupport === 'doctor'}
                                success={requestedSupport.has('doctor')}
                            />
                            <SupportRequestButton
                                icon={Shield}
                                label={t('supportPrivacy')}
                                color="text-surface-600"
                                onClick={() => handleSupportRequest('privacy', t('supportPrivacy'))}
                                loading={requestingSupport === 'privacy'}
                                success={requestedSupport.has('privacy')}
                            />
                        </div>
                    </Card>
                </div>

                {/* Rate Partner's Completed Support Tasks */}
                {completedTasksToRate.length > 0 && (
                    <Card variant="primary">
                        <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-2 flex items-center gap-2">
                            <Star className="w-5 h-5 text-gold-400" />
                            {t('ratePartnerTask')}
                        </h3>
                        <p className="text-sm text-surface-500 mb-4">
                            {t('ratePartnerTaskDesc')}
                        </p>
                        <div className="space-y-4">
                            {completedTasksToRate.map(task => (
                                <div key={task.id} className="p-4 rounded-lg bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
                                    <p className="text-sm font-medium text-surface-800 dark:text-surface-200 mb-3">
                                        {task.title}
                                    </p>
                                    {task.description && (
                                        <p className="text-xs text-surface-500 mb-3">{task.description}</p>
                                    )}
                                    {/* Score selector */}
                                    <div className="flex gap-2 mb-3">
                                        {[
                                            { score: 50, label: t('scoreGood'), color: 'bg-success-100 dark:bg-success-900/30 border-success-300 dark:border-success-700 text-success-700 dark:text-success-300' },
                                            { score: 30, label: t('scoreOkay'), color: 'bg-warning-100 dark:bg-warning-900/30 border-warning-300 dark:border-warning-700 text-warning-700 dark:text-warning-300' },
                                            { score: 10, label: t('scorePoor'), color: 'bg-razzmatazz-100 dark:bg-razzmatazz-900/30 border-razzmatazz-300 dark:border-razzmatazz-700 text-razzmatazz-700 dark:text-razzmatazz-300' },
                                            { score: 0, label: t('scorePoor'), color: 'bg-surface-200 dark:bg-surface-700 border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-400' },
                                        ].map(opt => (
                                            <button
                                                key={opt.score}
                                                onClick={() => setRatingScores(prev => ({ ...prev, [task.id]: opt.score }))}
                                                disabled={submittingRating[task.id] || ratedTasks.has(task.id)}
                                                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${ratingScores[task.id] === opt.score
                                                    ? `ring-2 ring-offset-1 ring-primary-400 ${opt.color}`
                                                    : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 text-surface-600 dark:text-surface-400'
                                                    } ${(submittingRating[task.id] || ratedTasks.has(task.id)) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                            >
                                                {opt.label} ({opt.score}pts)
                                            </button>
                                        ))}
                                    </div>
                                    {/* Feedback textbox */}
                                    {ratingScores[task.id] !== undefined && (
                                        <div className="mb-3">
                                            <textarea
                                                className="input min-h-[60px] w-full text-sm"
                                                placeholder={t('feedbackPlaceholder')}
                                                value={ratingFeedback[task.id] || ''}
                                                onChange={e => setRatingFeedback(prev => ({ ...prev, [task.id]: e.target.value }))}
                                                disabled={submittingRating[task.id] || ratedTasks.has(task.id)}
                                            />
                                        </div>
                                    )}
                                    {/* Submit button */}
                                    <div className="flex justify-end">
                                        {ratedTasks.has(task.id) ? (
                                            <span className="text-sm text-success-600 dark:text-success-400 flex items-center gap-1">
                                                <CheckCircle2 className="w-4 h-4" />
                                                {t('ratingSubmitted')}
                                            </span>
                                        ) : (
                                            <button
                                                className="btn-primary btn-sm flex items-center gap-2"
                                                onClick={() => handleSubmitRating(task.id)}
                                                disabled={!ratingScores[task.id] || submittingRating[task.id]}
                                            >
                                                {submittingRating[task.id] ? (
                                                    <>
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        {t('saving') || 'Submitting...'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-3.5 h-3.5" />
                                                        {t('submitRating')}
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Private Notes */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-surface-400" />
                            {t('privateNotes')}
                        </h3>
                        <Badge variant="gold">{t('onlyVisibleToYou')}</Badge>
                    </div>
                    <p className="text-sm text-surface-500 mb-4">
                        {t('privateNotesDesc')}
                    </p>
                    <textarea
                        className="input min-h-[80px]"
                        placeholder={t('privateNotesPlaceholder')}
                        value={privateNote}
                        onChange={e => setPrivateNote(e.target.value)}
                    />
                    <div className="flex justify-end mt-3">
                        <button
                            className="btn-primary btn-sm flex items-center gap-2"
                            onClick={handleSaveNote}
                            disabled={savingNote || !privateNote.trim()}
                        >
                            <Send className="w-3.5 h-3.5" />
                            {savingNote ? (t('saving') || 'Saving...') : t('saveNote')}
                        </button>
                    </div>
                </Card>
            </div>
        </AuthenticatedShell>
    );
}
