'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { Card, Button, Spinner } from '@/components/ui';
import { apiFetch } from '@/lib/api-client';
import { calcPostpartumWeek, getRecoveryPhaseLabel, RECOVERY_PHASE_BADGES } from '@/lib/postpartum-calculator';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Timer, Activity, Heart, AlertTriangle, CheckCircle2, Droplets, Baby } from 'lucide-react';

interface PostpartumProfile {
    phase: string;
    postpartumWeek: number;
    deliveryDate: string;
}

interface HealthLog {
    id: string;
    logType: string;
    logDate: string;
    bleedingLevel: string | null;
    painLevel: number | null;
    perineumHealing: string | null;
    cSectionHealing: string | null;
    moodScore: number | null;
    sleepHours: number | null;
    notes: string | null;
}

const RECOVERY_TIPS: Record<string, string[]> = {
    immediate: [
        'Rest as much as possible — your body is healing from a major event.',
        'Use a peri-bottle with warm water after using the bathroom.',
        'Apply ice packs or witch hazel pads for perineal discomfort.',
        'Accept all offers of help with meals, housework, and baby care.',
        'Monitor bleeding — it should gradually decrease over 2-6 weeks.',
        'Take prescribed pain medication as directed by your doctor.',
    ],
    early: [
        'Gradually increase walking — start with 5-10 minutes and build up.',
        'Continue pelvic floor exercises (Kegels) daily.',
        'Stay hydrated and eat iron-rich foods to support healing.',
        'Avoid heavy lifting (anything heavier than your baby).',
        'Schedule your 6-week postpartum checkup if not already done.',
        'Watch for signs of infection: fever, foul-smelling discharge, increased pain.',
    ],
    late: [
        'You can gradually return to more physical activities.',
        'Consider joining a postpartum exercise class or support group.',
        'Continue monitoring your emotional well-being.',
        'Focus on core strengthening exercises (after doctor clearance).',
        'Pay attention to any lingering pain or discomfort.',
    ],
    extended: [
        'Continue building strength and endurance gradually.',
        'Maintain a balanced diet rich in calcium, iron, and protein.',
        'Stay connected with your support network.',
        'Consider your long-term health goals and discuss with your doctor.',
        'Remember that full recovery can take up to a year or more.',
    ],
};

export default function PostpartumRecoveryPage() {
    const { user, isPostpartum } = useAuth();
    const t = useTranslations('postpartum');
    const m = useTranslations('mother');
    const n = useTranslations('nav');
    const [profile, setProfile] = useState<PostpartumProfile | null>(null);
    const [logs, setLogs] = useState<HealthLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const weekInfo = profile?.deliveryDate ? calcPostpartumWeek(profile.deliveryDate) : null;
    const recoveryPhase = weekInfo?.recoveryPhase || 'immediate';
    const phaseLabel = getRecoveryPhaseLabel(recoveryPhase);
    const phaseBadge = RECOVERY_PHASE_BADGES[recoveryPhase];

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [profileRes, logsRes] = await Promise.all([
                apiFetch<{ id: string; phase: string; postpartumWeek: number; deliveryDate: string }>('/profile/pregnancy'),
                apiFetch<{ logs: HealthLog[] }>('/profile/postpartum-health?logType=recovery&days=14'),
            ]);
            if (profileRes) {
                setProfile({
                    phase: (profileRes as any).phase || 'postpartum',
                    postpartumWeek: (profileRes as any).postpartumWeek || 0,
                    deliveryDate: (profileRes as any).deliveryDate || '',
                });
            }
            if (logsRes && logsRes.logs) {
                setLogs(logsRes.logs);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load recovery data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const tips = RECOVERY_TIPS[recoveryPhase] || RECOVERY_TIPS.early;

    const getBleedingBadge = (level: string | null) => {
        if (!level) return null;
        const colors: Record<string, string> = {
            none: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            light: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            moderate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            heavy: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        };
        return (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[level] || ''}`}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
            </span>
        );
    };

    const getHealingBadge = (status: string | null) => {
        if (!status) return null;
        const isGood = status === 'healing_well';
        return (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isGood
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                {status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </span>
        );
    };

    if (!isPostpartum) {
        return (
            <AuthenticatedShell>
                <div className="max-w-4xl mx-auto py-12 text-center">
                    <Heart className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-display text-velvet-800 dark:text-surface-100 mb-2">
                        {t('title') || 'Postpartum Recovery'}
                    </h1>
                    <p className="text-surface-500 mb-6">
                        This section is available after recording your delivery. Visit your dashboard to transition.
                    </p>
                    <Link href="/mother" className="btn-primary">
                        {m('backToDashboard') || 'Go to Dashboard'}
                    </Link>
                </div>
            </AuthenticatedShell>
        );
    }

    return (
        <AuthenticatedShell>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <Link href="/mother" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-2">
                        <ArrowLeft className="w-4 h-4" />
                        {n('backToDashboard') || 'Back to Dashboard'}
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        <div>
                            <h1 className="text-2xl font-display text-gradient-mandala">
                                {n('postpartumRecovery') || 'Postpartum Recovery'}
                            </h1>
                            <p className="text-surface-500 text-sm mt-1">
                                {t('recoveryTracker') || 'Recovery Progress'}
                            </p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Spinner className="w-8 h-8" />
                    </div>
                ) : (
                    <>
                        {/* Recovery Progress Card */}
                        <Card variant="primary">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                                    <Timer className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-white">
                                        {weekInfo ? `Postpartum Week ${weekInfo.week}, Day ${weekInfo.daysSinceDelivery}` : 'Recovery Status'}
                                    </h2>
                                    <p className="text-white/80 text-sm">
                                        {phaseLabel} · {weekInfo?.month ? `${weekInfo.month} month(s) postpartum` : ''}
                                    </p>
                                </div>
                                <div className={`text-sm font-medium px-3 py-1 rounded-full ${phaseBadge?.color || 'bg-white/20 text-white'}`}>
                                    {phaseBadge?.label || phaseLabel}
                                </div>
                            </div>

                            {/* Recovery Phase Progress */}
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="flex justify-between text-xs text-white/70 mb-1">
                                    <span>Week 1</span>
                                    <span>Week 6 (Checkup)</span>
                                    <span>Week 52</span>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-2">
                                    <div
                                        className="bg-white rounded-full h-2 transition-all duration-500"
                                        style={{ width: `${Math.min(100, ((weekInfo?.week || 1) / 52) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Recovery Tips */}
                        <Card>
                            <h2 className="text-lg font-semibold text-velvet-800 dark:text-surface-100 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                {phaseLabel} Recovery Tips
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {tips.map((tip, i) => (
                                    <div key={i} className="flex gap-3 p-3 bg-surface-50 dark:bg-velvet-800/50 rounded-lg">
                                        <span className="text-primary-500 font-bold text-sm mt-0.5">{i + 1}.</span>
                                        <p className="text-sm text-velvet-700 dark:text-surface-300">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Recent Recovery Logs */}
                        <Card>
                            <h2 className="text-lg font-semibold text-velvet-800 dark:text-surface-100 mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary-500" />
                                Recent Recovery Logs
                            </h2>
                            {logs.length === 0 ? (
                                <div className="text-center py-8 text-surface-400">
                                    <Droplets className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No recovery logs yet. Log your first entry from the wellness tracker.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {logs.slice(0, 7).map((log) => (
                                        <div key={log.id} className="flex items-start gap-4 p-3 bg-surface-50 dark:bg-velvet-800/50 rounded-lg">
                                            <div className="text-xs text-surface-400 min-w-[80px] pt-0.5">
                                                {new Date(log.logDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex flex-wrap gap-2">
                                                    {getBleedingBadge(log.bleedingLevel)}
                                                    {log.painLevel !== null && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                                            Pain: {log.painLevel}/10
                                                        </span>
                                                    )}
                                                    {getHealingBadge(log.perineumHealing)}
                                                    {getHealingBadge(log.cSectionHealing)}
                                                    {log.moodScore !== null && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                                            Mood: {log.moodScore}/5
                                                        </span>
                                                    )}
                                                    {log.sleepHours !== null && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                            Sleep: {log.sleepHours}h
                                                        </span>
                                                    )}
                                                </div>
                                                {log.notes && (
                                                    <p className="text-sm text-velvet-600 dark:text-surface-400">{log.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* Warning Signs */}
                        <Card className="border-warning-200 dark:border-warning-800 bg-warning-50/50 dark:bg-warning-900/10">
                            <h2 className="text-lg font-semibold text-warning-800 dark:text-warning-200 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-warning-600" />
                                {t('warningSigns') || 'Warning Signs — Contact Your Doctor If:'}
                            </h2>
                            <ul className="space-y-2 text-sm text-warning-700 dark:text-warning-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-warning-500 mt-0.5">•</span>
                                    Heavy bleeding (soaking a pad in less than an hour)
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-warning-500 mt-0.5">•</span>
                                    Fever above 38°C (100.4°F)
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-warning-500 mt-0.5">•</span>
                                    Foul-smelling vaginal discharge
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-warning-500 mt-0.5">•</span>
                                    Severe pain not relieved by medication
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-warning-500 mt-0.5">•</span>
                                    Redness, swelling, or discharge from C-section incision
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-warning-500 mt-0.5">•</span>
                                    Thoughts of harming yourself or your baby
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-warning-500 mt-0.5">•</span>
                                    Chest pain, difficulty breathing, or severe headache
                                </li>
                            </ul>
                        </Card>
                    </>
                )}
            </div>
        </AuthenticatedShell>
    );
}