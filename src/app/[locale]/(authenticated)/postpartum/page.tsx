'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth-provider';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { useTranslations, useLocale } from 'next-intl';
import { Card, Badge, ProgressBar } from '@/components/ui';
import { api } from '@/lib/api-client';
import { calcPostpartumWeek, PostpartumWeekInfo, getRecoveryPhaseLabel } from '@/lib/postpartum-calculator';
import { getPersonalizedPostpartumWeekKnowledgeForLocale, type PersonalizationFactors, type PostpartumWeekKnowledge } from '@/lib/postpartum-knowledge-i18n';
import { Link, useRouter } from '@/i18n/navigation';
import {
    Baby, Heart, Calendar, Activity, BookOpen,
    ChevronRight, Clock, Droplets,
    Smile, Frown, Meh, AlertTriangle, X,
    Shield, Send,
    HeartHandshake, Stethoscope, MessageCircle,
    Loader2, CheckCircle2, Star,
    Dumbbell, ClipboardList, Ruler,
    Timer, Milk, Weight, TrendingUp, Thermometer,
    Moon, Sun,
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
    // Medical conditions for personalization
    anemia?: boolean;
    diabetes?: boolean;
    highBP?: boolean;
    lowBP?: boolean;
    thyroidDisorder?: boolean;
    pcos?: boolean;
    asthma?: boolean;
    heartDisease?: boolean;
    kidneyIssues?: boolean;
    epilepsy?: boolean;
    depressionAnxiety?: boolean;
    bmi?: number;
    diet?: string;
    allergies?: string;
}

function buildPersonalizationFactors(mh: MotherHealthProfile): PersonalizationFactors {
    return {
        bmi: mh.bmi ?? undefined,
        allergies: mh.allergies ? mh.allergies.split(',').map(a => a.trim()).filter(Boolean) : undefined,
        medicalConditions: {
            anemia: mh.anemia ?? false,
            diabetes: mh.diabetes ?? false,
            hypertension: mh.highBP ?? false,
            highBP: mh.highBP ?? false,
            lowBP: mh.lowBP ?? false,
            thyroidDisorder: mh.thyroidDisorder ?? false,
            pcos: mh.pcos ?? false,
            asthma: mh.asthma ?? false,
            heartDisease: mh.heartDisease ?? false,
            kidneyIssues: mh.kidneyIssues ?? false,
            epilepsy: mh.epilepsy ?? false,
            highRiskPregnancy: false,
        },
        diet: (mh.diet === 'veg' || mh.diet === 'non-veg') ? (mh.diet as 'veg' | 'non-veg') : undefined,
    };
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

// ─── Postpartum Dashboard ───

export default function PostpartumDashboard() {
    const { user } = useAuth();
    const t = useTranslations('postpartum');
    const locale = useLocale();
    const router = useRouter();

    // Data state
    const [postpartumInfo, setPostpartumInfo] = useState<PostpartumWeekInfo | null>(null);
    const [weekGuidance, setWeekGuidance] = useState<ApiWeekContent | null>(null);
    const [symptoms, setSymptoms] = useState<ApiSymptom[]>([]);
    const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
    const [moodHistory, setMoodHistory] = useState<{ date: string; value: number; label: string }[]>([]);
    const [moodValue, setMoodValue] = useState<number>(4);
    const [privateNote, setPrivateNote] = useState('');
    const [loading, setLoading] = useState(true);
    const [savingMood, setSavingMood] = useState(false);
    const [savingNote, setSavingNote] = useState(false);

    // Support request state
    const [requestingSupport, setRequestingSupport] = useState<string | null>(null);
    const [requestedSupport, setRequestedSupport] = useState<Set<string>>(new Set());

    // Profile state
    const [motherProfile, setMotherProfile] = useState<MotherHealthProfile | null>(null);
    const [profileIncomplete, setProfileIncomplete] = useState(false);
    const [profileBannerDismissed, setProfileBannerDismissed] = useState(false);

    // Rating state
    const [completedTasksToRate, setCompletedTasksToRate] = useState<ApiTask[]>([]);
    const [ratingScores, setRatingScores] = useState<Record<string, number>>({});
    const [ratingFeedback, setRatingFeedback] = useState<Record<string, string>>({});
    const [submittingRating, setSubmittingRating] = useState<Record<string, boolean>>({});
    const [ratedTasks, setRatedTasks] = useState<Set<string>>(new Set());

    useEffect(() => {
        async function checkProfileCompletion() {
            try {
                const res = await api.get<MotherHealthProfile>('/profile/mother-health');
                setMotherProfile(res);
                if (!res.deliveryType || !res.breastfeedingStatus || !res.babyBirthWeight) {
                    setProfileIncomplete(true);
                }
            } catch {
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
            let localPostpartumInfo: PostpartumWeekInfo | null = null;

            const [pregnancyRes, motherHealthRes, symptomsRes, appointmentsRes, wellnessRes, weekRes, tasksRes] = await Promise.allSettled([
                api.get<any>('/profile/pregnancy'),
                api.get<MotherHealthProfile>('/profile/mother-health'),
                api.get<{ logs: ApiSymptom[] }>('/symptoms?limit=3'),
                api.get<{ appointments: ApiAppointment[] }>('/appointments?limit=3'),
                api.get<{ logs: ApiWellnessLog[] }>('/wellness?metricType=mood&limit=7'),
                api.get<{ content: ApiWeekContent[] }>('/weekly-journey?limit=1&contentType=postpartum'),
                api.get<{ tasks: ApiTask[] }>('/tasks?type=support&status=completed&limit=20'),
            ]);

            // Get postpartum info from pregnancy profile
            if (pregnancyRes.status === 'fulfilled') {
                const profile = pregnancyRes.value;
                if (profile.phase === 'postpartum' && profile.deliveryDate) {
                    const ppInfo = calcPostpartumWeek(profile.deliveryDate);
                    if (ppInfo) {
                        localPostpartumInfo = ppInfo;
                        setPostpartumInfo(ppInfo);
                    }
                }
            }

            // Update mother health profile from API (for personalization)
            if (motherHealthRes.status === 'fulfilled') {
                setMotherProfile(motherHealthRes.value);
            }

            // Fallback: use MotherHealthProfile delivery date
            if (!localPostpartumInfo && motherHealthRes.status === 'fulfilled') {
                const mhProfile = motherHealthRes.value;
                if (mhProfile.deliveryDate) {
                    const ppInfo = calcPostpartumWeek(mhProfile.deliveryDate);
                    if (ppInfo) {
                        localPostpartumInfo = ppInfo;
                        setPostpartumInfo(ppInfo);
                    }
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

            // Week guidance
            if (weekRes.status === 'fulfilled') {
                const content = weekRes.value.content;
                if (content && content.length > 0) {
                    setWeekGuidance(content[0]);
                }
            }

            // Fallback for postpartum: build personalized guidance from knowledge database
            if (!weekGuidance && localPostpartumInfo) {
                const profile = motherHealthRes.status === 'fulfilled' ? motherHealthRes.value as MotherHealthProfile : null;
                const personalizeFactors = profile ? buildPersonalizationFactors(profile) : {};
                const personalized = getPersonalizedPostpartumWeekKnowledgeForLocale(localPostpartumInfo.week, locale, personalizeFactors);
                const phaseLabel = getRecoveryPhaseLabel(localPostpartumInfo.recoveryPhase);
                if (personalized) {
                    setWeekGuidance({
                        id: `fallback-pp-week-${localPostpartumInfo.week}`,
                        weekNumber: personalized.week,
                        title: personalized.title || `Postpartum Week ${localPostpartumInfo.week} — ${phaseLabel}`,
                        summary: personalized.summary,
                        bodyMarkdown: null,
                        dietNotes: personalized.nutritionalFocus.join(' · '),
                        activityNotes: personalized.activityNotes.join(' · '),
                        warningSigns: personalized.warningSigns.join(' · '),
                    });
                } else {
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
                title: 'Private Note',
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

    // Request support
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
            setCompletedTasksToRate(prev => prev.filter(t => t.id !== taskId));
        } catch (err) {
            console.error('Failed to submit rating:', err);
        } finally {
            setSubmittingRating(prev => ({ ...prev, [taskId]: false }));
        }
    };

    return (
        <AuthenticatedShell>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                        <h2 className="text-2xl font-display text-surface-800 dark:text-surface-200">
                            {t('welcome') || `Welcome, ${user?.firstName || ''}`}
                        </h2>
                        {postpartumInfo && (
                            <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
                                {t('postpartumWeekInfo') || `Postpartum Week ${postpartumInfo.week}, Day ${postpartumInfo.daysSinceDelivery} — ${getRecoveryPhaseLabel(postpartumInfo.recoveryPhase)}`}
                            </p>
                        )}
                    </div>
                    <Link href="/chat" className="btn-primary btn-sm flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        {t('askAssistant') || 'Ask Assistant'}
                    </Link>
                </div>

                {/* Emergency Banner */}
                <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-danger-700 dark:text-danger-300">
                            {t('emergencyTitle') || 'Emergency Warning'}
                        </p>
                        <p className="text-xs text-danger-600 dark:text-danger-400 mt-1">
                            {t('emergencyDisclaimer') || 'If you experience heavy bleeding, fever, severe pain, or thoughts of self-harm, seek immediate medical help.'}
                        </p>
                    </div>
                </div>

                {/* Profile Incompletion Banner */}
                {profileIncomplete && !profileBannerDismissed && (
                    <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-300 dark:border-warning-700 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-warning-800 dark:text-warning-200">
                                {t('completePostpartumProfile') || 'Complete Your Postpartum Profile'}
                            </p>
                            <p className="text-xs text-warning-700 dark:text-warning-300 mt-1">
                                {t('postpartumProfileDesc') || 'Please add your delivery details, baby information, and breastfeeding status to personalize your recovery journey.'}
                            </p>
                            <Link
                                href="/profile"
                                className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-warning-700 dark:text-warning-300 hover:text-warning-800 dark:hover:text-warning-200 underline underline-offset-2"
                            >
                                {t('completeNow') || 'Complete Now'}
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

                {/* Baby Information Card */}
                {motherProfile && (
                    <Card variant="calm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
                                <Baby className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                            </div>
                            <div>
                                <h3 className="font-display text-lg text-surface-800 dark:text-surface-200">{t('babyInfo') || 'Baby Information'}</h3>
                                <p className="text-sm text-surface-500">{t('babyDetails') || 'Your baby\'s birth details'}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                <p className="text-xs text-surface-500 mb-1">{t('deliveryType') || 'Delivery Type'}</p>
                                <p className="text-sm font-medium text-surface-800 dark:text-surface-200 capitalize">
                                    {motherProfile.deliveryType || '-'}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                <p className="text-xs text-surface-500 mb-1">{t('birthWeight') || 'Birth Weight'}</p>
                                <p className="text-sm font-medium text-surface-800 dark:text-surface-200">
                                    {motherProfile.babyBirthWeight ? `${motherProfile.babyBirthWeight} kg` : '-'}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                <p className="text-xs text-surface-500 mb-1">{t('babyGender') || 'Gender'}</p>
                                <p className="text-sm font-medium text-surface-800 dark:text-surface-200 capitalize">
                                    {motherProfile.babyGender || '-'}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                <p className="text-xs text-surface-500 mb-1">{t('breastfeeding') || 'Breastfeeding'}</p>
                                <p className="text-sm font-medium text-surface-800 dark:text-surface-200 capitalize">
                                    {motherProfile.breastfeedingStatus || '-'}
                                </p>
                            </div>
                        </div>
                        {motherProfile.nicuStay && (
                            <div className="mt-3 p-2 rounded-lg bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800">
                                <p className="text-xs text-warning-700 dark:text-warning-300">
                                    {t('nicuStay') || 'Baby required NICU stay'}
                                </p>
                            </div>
                        )}
                    </Card>
                )}

                {/* Top Row — Recovery Progress + Mood */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recovery Progress Card */}
                    <Card className="lg:col-span-2" variant="calm">
                        {loading && !postpartumInfo ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-10 bg-surface-200 dark:bg-surface-700 rounded w-3/4" />
                                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded-full" />
                                <div className="grid grid-cols-3 gap-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-16 bg-surface-200 dark:bg-surface-700 rounded" />
                                    ))}
                                </div>
                            </div>
                        ) : postpartumInfo ? (
                            <>
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
                                    <Badge variant="primary">{t('postpartumWeek') || 'Postpartum Week'} {postpartumInfo.week}</Badge>
                                </div>

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
                                        <p className="text-xs text-surface-500">{t('recoveryPhase') || 'Phase'}</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-display text-razzmatazz-600 dark:text-razzmatazz-300">{postpartumInfo.daysSinceDelivery}</p>
                                        <p className="text-xs text-surface-500">{t('daysPostpartum') || 'Days Postpartum'}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <Timer className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                                <p className="text-surface-500 text-sm">{t('noDeliveryDate') || 'No delivery date set. Please complete your profile.'}</p>
                                <Link href="/profile" className="text-primary-600 text-sm mt-2 inline-block hover:underline">
                                    {t('setDeliveryDate') || 'Set Delivery Date'}
                                </Link>
                            </div>
                        )}
                    </Card>

                    {/* Mood Check-in */}
                    <Card>
                        <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-razzmatazz-400" />
                            {t('todaysMood') || "Today's Mood"}
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
                            {moodValue >= 4 ? (t('feelingGood') || 'Feeling Good') : moodValue >= 3 ? (t('doingOkay') || 'Doing Okay') : (t('roughDay') || 'Rough Day')}
                        </p>

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

                {/* This Week's Recovery Guidance */}
                <Card variant="calm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-primary-600" />
                            <h3 className="font-display text-lg text-surface-800 dark:text-surface-200">
                                {t('thisWeekRecovery') || "This Week's Recovery"}
                            </h3>
                        </div>
                        <Link href="/postpartum-recovery" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                            {t('fullRecoveryJourney') || 'Full Recovery Journey'} <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {weekGuidance ? (
                        <>
                            <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed mb-4">
                                {weekGuidance.summary}
                            </p>

                            {postpartumInfo && (
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-razzmatazz-50 dark:bg-razzmatazz-900/10 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-razzmatazz-100 dark:bg-razzmatazz-800 flex items-center justify-center flex-shrink-0">
                                        <Timer className="w-5 h-5 text-razzmatazz-600 dark:text-razzmatazz-300" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('recoveryPhase') || 'Recovery Phase'}: {getRecoveryPhaseLabel(postpartumInfo.recoveryPhase)}</p>
                                        <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5">
                                            {postpartumInfo.isCriticalRecovery
                                                ? (t('criticalRecoveryTip') || 'Focus on rest and recovery. Accept help. Monitor bleeding and temperature.')
                                                : (t('recoveryProgressTip') || 'Continue gentle activities. Gradually increase walking. Stay hydrated.')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                <div className="flex gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                    <Dumbbell className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{t('activityWellness') || 'Activity & Wellness'}</p>
                                        <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5">
                                            {weekGuidance.activityNotes || t('activityDefault') || 'Gentle walking, pelvic floor exercises, avoid heavy lifting.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {weekGuidance.warningSigns && (
                                <div className="mt-4 p-3 rounded-lg bg-warning-50 dark:bg-warning-900/10 border border-warning-200 dark:border-warning-800">
                                    <p className="text-xs font-medium text-warning-700 dark:text-warning-300 mb-1">{t('warningTitle') || 'Warning Signs'}</p>
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
                        </div>
                    )}
                </Card>

                {/* Bottom Grid — Symptoms + Appointments + Support */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Symptoms */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-razzmatazz-400" />
                                {t('recentSymptoms') || 'Recent Symptoms'}
                            </h3>
                            <Link href="/symptoms" className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                {t('logNew') || 'Log New'} +
                            </Link>
                        </div>

                        {symptoms.length === 0 ? (
                            <p className="text-sm text-surface-500 text-center py-6">{t('noRecentSymptoms') || 'No recent symptoms logged'}</p>
                        ) : (
                            <div className="space-y-3">
                                {symptoms.map(s => (
                                    <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                                        <div>
                                            <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{s.symptomType}</p>
                                            <p className="text-xs text-surface-500">{t('severity') || 'Severity'} {s.severity}</p>
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
                                {t('appointments') || 'Appointments'}
                            </h3>
                            <Link href="/appointments" className="text-xs text-primary-600 hover:text-primary-700">
                                {t('viewAll') || 'View All'}
                            </Link>
                        </div>

                        {appointments.length === 0 ? (
                            <p className="text-sm text-surface-500 text-center py-6">{t('noUpcomingAppts') || 'No upcoming appointments'}</p>
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
                            {t('requestSupport') || 'Request Support'}
                        </h3>

                        <div className="space-y-2">
                            <SupportRequestButton
                                icon={Clock}
                                label={t('supportRest') || 'Rest Break'}
                                color="text-gold-500"
                                onClick={() => handleSupportRequest('rest', t('supportRest') || 'Rest Break')}
                                loading={requestingSupport === 'rest'}
                                success={requestedSupport.has('rest')}
                            />
                            <SupportRequestButton
                                icon={Droplets}
                                label={t('supportFood') || 'Meal Help'}
                                color="text-primary-500"
                                onClick={() => handleSupportRequest('food', t('supportFood') || 'Meal Help')}
                                loading={requestingSupport === 'food'}
                                success={requestedSupport.has('food')}
                            />
                            <SupportRequestButton
                                icon={Heart}
                                label={t('supportEmotional') || 'Emotional Support'}
                                color="text-razzmatazz-500"
                                onClick={() => handleSupportRequest('emotional', t('supportEmotional') || 'Emotional Support')}
                                loading={requestingSupport === 'emotional'}
                                success={requestedSupport.has('emotional')}
                            />
                            <SupportRequestButton
                                icon={Stethoscope}
                                label={t('supportDoctor') || 'Doctor Visit'}
                                color="text-gold-500"
                                onClick={() => handleSupportRequest('doctor', t('supportDoctor') || 'Doctor Visit')}
                                loading={requestingSupport === 'doctor'}
                                success={requestedSupport.has('doctor')}
                            />
                        </div>
                    </Card>
                </div>

                {/* Rate Partner's Completed Support Tasks */}
                {completedTasksToRate.length > 0 && (
                    <Card variant="primary">
                        <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-2 flex items-center gap-2">
                            <Star className="w-5 h-5 text-gold-400" />
                            {t('ratePartnerTask') || 'Rate Partner Support'}
                        </h3>
                        <p className="text-sm text-surface-500 mb-4">
                            {t('ratePartnerTaskDesc') || 'Rate the support your partner provided'}
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
                                    <div className="flex gap-2 mb-3">
                                        {[
                                            { score: 50, label: t('scoreGood') || 'Great', color: 'bg-success-100 dark:bg-success-900/30 border-success-300 dark:border-success-700 text-success-700 dark:text-success-300' },
                                            { score: 30, label: t('scoreOkay') || 'Good', color: 'bg-warning-100 dark:bg-warning-900/30 border-warning-300 dark:border-warning-700 text-warning-700 dark:text-warning-300' },
                                            { score: 10, label: t('scorePoor') || 'Fair', color: 'bg-razzmatazz-100 dark:bg-razzmatazz-900/30 border-razzmatazz-300 dark:border-razzmatazz-700 text-razzmatazz-700 dark:text-razzmatazz-300' },
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
                                    {ratingScores[task.id] !== undefined && (
                                        <div className="mb-3">
                                            <textarea
                                                className="input min-h-[60px] w-full text-sm"
                                                placeholder={t('feedbackPlaceholder') || 'Add feedback (optional)'}
                                                value={ratingFeedback[task.id] || ''}
                                                onChange={e => setRatingFeedback(prev => ({ ...prev, [task.id]: e.target.value }))}
                                                disabled={submittingRating[task.id] || ratedTasks.has(task.id)}
                                            />
                                        </div>
                                    )}
                                    <div className="flex justify-end">
                                        {ratedTasks.has(task.id) ? (
                                            <span className="text-sm text-success-600 dark:text-success-400 flex items-center gap-1">
                                                <CheckCircle2 className="w-4 h-4" />
                                                {t('ratingSubmitted') || 'Submitted'}
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
                                                        {t('submitRating') || 'Submit Rating'}
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
                            {t('privateNotes') || 'Private Notes'}
                        </h3>
                        <Badge variant="gold">{t('onlyVisibleToYou') || 'Only Visible to You'}</Badge>
                    </div>
                    <p className="text-sm text-surface-500 mb-4">
                        {t('privateNotesDesc') || 'Write private notes about your recovery journey'}
                    </p>
                    <textarea
                        className="input min-h-[80px]"
                        placeholder={t('privateNotesPlaceholder') || 'How are you feeling today? Any concerns or milestones?'}
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
                            {savingNote ? (t('saving') || 'Saving...') : (t('saveNote') || 'Save Note')}
                        </button>
                    </div>
                </Card>
            </div>
        </AuthenticatedShell>
    );
}
