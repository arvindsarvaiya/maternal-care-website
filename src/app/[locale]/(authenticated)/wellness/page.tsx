'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/auth-provider';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { Card, Badge, Button, ProgressBar } from '@/components/ui';
import { api } from '@/lib/api-client';
import { Link } from '@/i18n/navigation';
import {
    Heart,
    Activity,
    Droplets,
    Moon,
    Sun,
    Footprints,
    Scale,
    TrendingUp,
    ChevronLeft,
    Plus,
    Calendar,
    Clock,
    Brain,
    Apple,
    Dumbbell,
    X,
} from 'lucide-react';

// ─── Types ───

interface WellnessLog {
    id: string;
    metricType: string;
    unitLabel: string;
    valueType: string;
    logDate: string;
    numericValue: number | null;
    booleanValue: boolean | null;
    textValue: string | null;
}

interface MetricDef {
    key: string;
    label: string;
    unit: string;
    icon: React.ElementType;
    color: string;
    target: number;
}

const METRIC_DEFS: MetricDef[] = [
    { key: 'sleep', label: 'Sleep', unit: 'hours', icon: Moon, color: 'text-primary-500', target: 8 },
    { key: 'water', label: 'Water', unit: 'glasses', icon: Droplets, color: 'text-gold-500', target: 8 },
    { key: 'steps', label: 'Steps', unit: 'steps', icon: Footprints, color: 'text-primary-500', target: 7000 },
    { key: 'weight', label: 'Weight', unit: 'kg', icon: Scale, color: 'text-razzmatazz-500', target: 72 },
    { key: 'mood', label: 'Mood', unit: '/5', icon: Brain, color: 'text-razzmatazz-500', target: 5 },
    { key: 'nutrition', label: 'Nutrition', unit: 'meals', icon: Apple, color: 'text-primary-500', target: 3 },
    { key: 'exercise', label: 'Exercise', unit: 'min', icon: Dumbbell, color: 'text-primary-500', target: 30 },
    { key: 'mental', label: 'Mental', unit: '/5', icon: Heart, color: 'text-razzmatazz-500', target: 5 },
];

const METRIC_ICON_MAP: Record<string, React.ElementType> = {
    sleep: Moon, water: Droplets, steps: Footprints, weight: Scale,
    mood: Brain, nutrition: Apple, exercise: Dumbbell, mental: Heart,
};
const METRIC_COLOR_MAP: Record<string, string> = {
    sleep: 'text-primary-500', water: 'text-gold-500', steps: 'text-primary-500',
    weight: 'text-razzmatazz-500', mood: 'text-razzmatazz-500', nutrition: 'text-primary-500',
    exercise: 'text-primary-500', mental: 'text-razzmatazz-500',
};

const WELLNESS_TIPS = [
    { icon: Moon, title: 'Sleep', tip: 'Aim for 7-9 hours. Try sleeping on your left side for better circulation.', color: 'text-primary-500' },
    { icon: Droplets, title: 'Hydration', tip: 'Drink 8-10 glasses of water daily. Infuse with lemon or mint for variety.', color: 'text-gold-500' },
    { icon: Footprints, title: 'Movement', tip: 'Aim for 30 minutes of gentle walking. Prenatal yoga is excellent.', color: 'text-primary-500' },
    { icon: Apple, title: 'Nutrition', tip: 'Eat small, frequent meals. Focus on iron, folate, calcium, and protein.', color: 'text-primary-500' },
    { icon: Brain, title: 'Mental Health', tip: 'Practice deep breathing. Take breaks. Accept help when offered.', color: 'text-razzmatazz-500' },
];

// ─── Helper: date strings ───

function todayStr(): string {
    return new Date().toISOString().slice(0, 10);
}

function daysAgoStr(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
}

function shortDayLabel(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
}

function toNumeric(v: number | null | undefined, fallback: number = 0): number {
    return typeof v === 'number' ? v : fallback;
}

// ─── Helper Components ───

function MetricCard({ def, value, target }: { def: MetricDef; value: number; target: number }) {
    const percentage = target > 0 ? Math.min(Math.round((value / target) * 100), 100) : 0;
    const Icon = def.icon;
    return (
        <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
            <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-5 h-5 ${def.color}`} />
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{def.label}</span>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-display text-surface-800 dark:text-surface-200">{value}</span>
                <span className="text-sm text-surface-400">{def.unit}</span>
            </div>
            <div className="flex items-center gap-2">
                <ProgressBar value={value} max={target} variant="primary" size="sm" showLabel={false} />
                <span className="text-xs text-surface-400">{percentage}%</span>
            </div>
        </div>
    );
}

function WeeklyChart({ data, label, color }: { data: { date: string; value: number }[]; label: string; color: string }) {
    const maxVal = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="space-y-1">
            <p className="text-xs text-surface-500 mb-2">{label}</p>
            <div className="flex gap-1 items-end h-16">
                {data.map((d, i) => {
                    const height = (d.value / maxVal) * 100;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div
                                className={`w-full rounded-t-sm ${color} bg-current opacity-80`}
                                style={{ height: `${height}%` }}
                            />
                            <span className="text-[10px] text-surface-400">{d.date}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function SkeletonBlock({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2 animate-pulse">
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className="h-4 bg-surface-200 dark:bg-surface-700 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
            ))}
        </div>
    );
}

// ─── Wellness Page ───

export default function WellnessPage() {
    const { user, getDashboardUrl } = useAuth();
    const t = useTranslations('wellness');
    const [logs, setLogs] = useState<WellnessLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [dashboardUrl, setDashboardUrl] = useState<string>('/mother');

    // Fetch dashboard URL
    useEffect(() => {
        if (user?.roles) {
            getDashboardUrl(user.roles).then(setDashboardUrl);
        }
    }, [user?.roles, getDashboardUrl]);
    const [selectedMetric, setSelectedMetric] = useState<string>('all');

    // Log modal
    const [showLogModal, setShowLogModal] = useState(false);
    const [logMetric, setLogMetric] = useState('mood');
    const [logValue, setLogValue] = useState('');
    const [saving, setSaving] = useState(false);

    // Weight tracking: latest weight and pregnancy profile
    const [weightLogs, setWeightLogs] = useState<WellnessLog[]>([]);
    const [pregnancyInfo, setPregnancyInfo] = useState<{ lmpDate?: string; dueDate?: string; prePregnancyWeight?: number | null } | null>(null);

    const fetchWellness = useCallback(async () => {
        try {
            setLoading(true);
            const [todayRes, weekRes] = await Promise.allSettled([
                api.get<any>(`/wellness?from=${todayStr()}&to=${todayStr()}&limit=50`),
                api.get<any>(`/wellness?from=${daysAgoStr(6)}&to=${todayStr()}&limit=200`),
            ]);

            let todayLogs: WellnessLog[] = [];
            let weekLogs: WellnessLog[] = [];

            if (todayRes.status === 'fulfilled') {
                todayLogs = todayRes.value?.logs ?? [];
            }
            if (weekRes.status === 'fulfilled') {
                weekLogs = weekRes.value?.logs ?? [];
            }

            // Merge: today logs take priority for the same metricType
            const todayMap = new Map<string, WellnessLog>();
            for (const l of todayLogs) todayMap.set(l.metricType, l);

            // Group week logs by date+metric for the chart
            const merged = [...weekLogs];
            for (const [mt, tl] of todayMap) {
                const idx = merged.findIndex(w => w.metricType === mt && w.logDate === todayStr());
                if (idx >= 0) merged[idx] = tl;
                else merged.push(tl);
            }

            setLogs(merged);

            // Extract weight logs
            const wLogs = merged.filter(l => l.metricType === 'weight').sort((a, b) => a.logDate.localeCompare(b.logDate));
            setWeightLogs(wLogs);
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPregnancyProfile = useCallback(async () => {
        try {
            const data = await api.get<any>('/profile/pregnancy');
            setPregnancyInfo(data);
        } catch {
            // no profile
        }
    }, []);

    useEffect(() => { fetchWellness(); fetchPregnancyProfile(); }, [fetchWellness, fetchPregnancyProfile]);

    // ─── Compute today's metrics from logs ───
    const todayLatest = new Map<string, WellnessLog>();
    for (const l of logs) {
        if (l.logDate === todayStr()) {
            const existing = todayLatest.get(l.metricType);
            if (!existing || l.id > existing.id) todayLatest.set(l.metricType, l);
        }
    }

    const todayValues: Record<string, number> = {};
    for (const def of METRIC_DEFS) {
        const l = todayLatest.get(def.key);
        todayValues[def.key] = l ? toNumeric(l.numericValue) : 0;
    }

    // ─── Compute weekly chart data per metric ───
    function buildWeeklySeries(metricType: string): { date: string; value: number }[] {
        const series: { date: string; value: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = daysAgoStr(i);
            const match = logs.filter(l => l.metricType === metricType && l.logDate === d);
            const latest = match.sort((a, b) => b.id.localeCompare(a.id))[0];
            series.push({ date: shortDayLabel(d), value: latest ? toNumeric(latest.numericValue) : 0 });
        }
        return series;
    }

    // ─── Handle log submission ───
    const handleLogSubmit = async () => {
        const val = parseFloat(logValue);
        if (isNaN(val) || val < 0) return;
        setSaving(true);
        try {
            await api.post('/wellness', {
                metricType: logMetric,
                valueType: 'numeric',
                numericValue: val,
                unitLabel: METRIC_DEFS.find(d => d.key === logMetric)?.unit ?? '',
                logDate: todayStr(),
            });
            setShowLogModal(false);
            setLogValue('');
            await fetchWellness();
        } catch (err: any) {
            // silent
        } finally {
            setSaving(false);
        }
    };

    // ─── Weight tracking computation ───
    const latestWeight = weightLogs.length > 0 ? toNumeric(weightLogs[weightLogs.length - 1].numericValue, 0) : 0;
    const prePregWeight = pregnancyInfo?.prePregnancyWeight ?? 0;
    const weightGain = latestWeight > 0 && prePregWeight > 0 ? latestWeight - prePregWeight : 0;

    // Pregnancy week from LMP
    let pregWeek = 0;
    if (pregnancyInfo?.lmpDate) {
        const lmp = new Date(pregnancyInfo.lmpDate);
        const diffDays = Math.floor((Date.now() - lmp.getTime()) / (1000 * 60 * 60 * 24));
        pregWeek = Math.max(0, Math.floor(diffDays / 7));
    }

    return (
        <AuthenticatedShell>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                        <Link href={dashboardUrl} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-2">
                            <ChevronLeft className="w-4 h-4" />
                            {t('backToDashboard')}
                        </Link>
                        <h2 className="text-2xl font-display text-surface-800 dark:text-surface-200">{t('title')}</h2>
                        <p className="text-sm text-surface-500 mt-1">{t('subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button size="sm" className="flex items-center gap-2" onClick={() => setShowLogModal(true)}>
                            <Plus className="w-4 h-4" />
                            {t('logToday')}
                        </Button>
                    </div>
                </div>

                {/* Today's Metrics Grid */}
                <div>
                    <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-500" />
                        {t('today')} — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h3>
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700 animate-pulse">
                                    <div className="h-4 w-16 bg-surface-200 dark:bg-surface-700 rounded mb-3" />
                                    <div className="h-8 w-12 bg-surface-200 dark:bg-surface-700 rounded mb-2" />
                                    <div className="h-2 w-full bg-surface-200 dark:bg-surface-700 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {METRIC_DEFS.map(def => (
                                <MetricCard
                                    key={def.key}
                                    def={def}
                                    value={todayValues[def.key]}
                                    target={def.target}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Weekly Trends */}
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-500" />
                            {t('weeklyTrends')}
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                            {['all', 'sleep', 'water', 'steps', 'mood', 'nutrition', 'exercise'].map(m => (
                                <button
                                    key={m}
                                    onClick={() => setSelectedMetric(m)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedMetric === m
                                        ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300'
                                        : 'text-surface-500 hover:text-surface-700'
                                        }`}
                                >
                                    {m === 'all' ? t('all') : m.charAt(0).toUpperCase() + m.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse space-y-2">
                                    <div className="h-3 w-24 bg-surface-200 dark:bg-surface-700 rounded" />
                                    <div className="h-16 w-full bg-surface-200 dark:bg-surface-700 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(['sleep', 'water', 'steps', 'mood', 'nutrition', 'exercise'] as const).map(mt => {
                                if (selectedMetric !== 'all' && selectedMetric !== mt) return null;
                                const def = METRIC_DEFS.find(d => d.key === mt)!;
                                return (
                                    <WeeklyChart
                                        key={mt}
                                        data={buildWeeklySeries(mt)}
                                        label={`${def.label} (${def.unit})`}
                                        color={def.color}
                                    />
                                );
                            })}
                        </div>
                    )}
                </Card>

                {/* Wellness Tips - static content */}
                <Card variant="calm">
                    <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-razzmatazz-400" />
                        {t('wellnessTipsTitle')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {WELLNESS_TIPS.map((tip, i) => (
                            <div key={i} className="flex gap-3 p-4 rounded-lg bg-white dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
                                <tip.icon className={`w-5 h-5 ${tip.color} flex-shrink-0 mt-0.5`} />
                                <div>
                                    <p className="text-sm font-medium text-surface-800 dark:text-surface-200 mb-1">{tip.title}</p>
                                    <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">{tip.tip}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Weight Tracking */}
                <Card>
                    <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
                        <Scale className="w-5 h-5 text-razzmatazz-400" />
                        {t('weightTracking')}
                    </h3>
                    <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
                        {t('weightTrackingDesc')}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                            <p className="text-xl font-display text-surface-800 dark:text-surface-200">
                                {loading ? '...' : (latestWeight || '—')}
                            </p>
                            <p className="text-xs text-surface-500">{t('current')}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                            <p className="text-xl font-display text-surface-800 dark:text-surface-200">
                                {prePregWeight || '—'}
                            </p>
                            <p className="text-xs text-surface-500">{t('prePregnancy')}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                            <p className="text-xl font-display text-primary-600 dark:text-primary-300">
                                {weightGain > 0 ? `+${weightGain.toFixed(1)}` : (latestWeight > 0 && prePregWeight > 0 ? '0.0' : '—')}
                            </p>
                            <p className="text-xs text-surface-500">{t('totalGain')}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                            <p className="text-xl font-display text-surface-800 dark:text-surface-200">
                                {pregWeek > 0 ? `Week ${pregWeek}` : '—'}
                            </p>
                            <p className="text-xs text-surface-500">{t('currentWeek')}</p>
                        </div>
                    </div>
                </Card>

                {/* Disclaimer */}
                <div className="text-center text-xs text-surface-400 py-2">
                    {t('disclaimer')}
                </div>

                {/* ─── Log Entry Modal ─── */}
                {showLogModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-display text-lg text-surface-800 dark:text-surface-200">
                                    {t('logToday')}
                                </h3>
                                <button
                                    onClick={() => { setShowLogModal(false); setLogValue(''); }}
                                    className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                                    Metric
                                </label>
                                <select
                                    value={logMetric}
                                    onChange={e => setLogMetric(e.target.value)}
                                    className="w-full rounded-lg border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 px-3 py-2 text-sm text-surface-800 dark:text-surface-200"
                                >
                                    {METRIC_DEFS.map(d => (
                                        <option key={d.key} value={d.key}>{d.label} ({d.unit})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                                    Value
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={logValue}
                                        onChange={e => setLogValue(e.target.value)}
                                        placeholder={`e.g. ${METRIC_DEFS.find(d => d.key === logMetric)?.target ?? 0}`}
                                        className="flex-1 rounded-lg border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 px-3 py-2 text-sm text-surface-800 dark:text-surface-200"
                                    />
                                    <span className="text-sm text-surface-400">{METRIC_DEFS.find(d => d.key === logMetric)?.unit ?? ''}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => { setShowLogModal(false); setLogValue(''); }}
                                >
                                    {t('cancel') || 'Cancel'}
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleLogSubmit}
                                    disabled={saving || !logValue.trim()}
                                >
                                    {saving ? '...' : (t('save') || 'Save')}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedShell>
    );
}