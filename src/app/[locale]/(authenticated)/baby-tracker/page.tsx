'use client';

import { useState, useEffect, useCallback } from 'react';
import { LocaleLink as Link } from '@/i18n/locale-link';
import { useAuth } from '@/components/auth-provider';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { Card, Button, Input, Spinner } from '@/components/ui';
import { apiFetch } from '@/lib/api-client';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Baby, Weight, Droplets, Clock, TrendingUp, Plus, Calendar } from 'lucide-react';

interface HealthLog {
    id: string;
    logType: string;
    logDate: string;
    babyWeight: number | null;
    diaperCount: number | null;
    diaperType: string | null;
    feedingDuration: number | null;
    feedingSide: string | null;
    feedingNotes: string | null;
    notes: string | null;
}

interface BabyWeightEntry {
    date: string;
    weight: number;
}

export default function BabyTrackerPage() {
    const { user, isPostpartum } = useAuth();
    const t = useTranslations('postpartum');
    const n = useTranslations('nav');
    const m = useTranslations('mother');
    const [logs, setLogs] = useState<HealthLog[]>([]);
    const [weightEntries, setWeightEntries] = useState<BabyWeightEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showLogForm, setShowLogForm] = useState(false);
    const [logType, setLogType] = useState<'baby_weight' | 'baby_diaper' | 'breastfeeding'>('baby_weight');
    const [formData, setFormData] = useState({
        babyWeight: '',
        diaperCount: '',
        diaperType: 'wet',
        feedingDuration: '',
        feedingSide: 'both',
        feedingNotes: '',
        notes: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiFetch<{ logs: HealthLog[] }>('/profile/postpartum-health?days=30&limit=50');
            if (res && res.logs) {
                const babyLogs = res.logs.filter(
                    (l: HealthLog) => ['baby_weight', 'baby_diaper', 'breastfeeding'].includes(l.logType)
                );
                setLogs(babyLogs);

                // Extract weight entries for the chart
                const weights: BabyWeightEntry[] = res.logs
                    .filter((l: HealthLog) => l.logType === 'baby_weight' && l.babyWeight !== null)
                    .map((l: HealthLog) => ({
                        date: new Date(l.logDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                        weight: l.babyWeight!,
                    }))
                    .reverse();
                setWeightEntries(weights);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load baby data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmitLog = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await apiFetch('/profile/postpartum-health', {
                method: 'POST',
                body: JSON.stringify({
                    logType,
                    logDate: new Date().toISOString(),
                    babyWeight: logType === 'baby_weight' && formData.babyWeight ? parseFloat(formData.babyWeight) : undefined,
                    diaperCount: logType === 'baby_diaper' && formData.diaperCount ? parseInt(formData.diaperCount) : undefined,
                    diaperType: logType === 'baby_diaper' ? formData.diaperType : undefined,
                    feedingDuration: logType === 'breastfeeding' && formData.feedingDuration ? parseInt(formData.feedingDuration) : undefined,
                    feedingSide: logType === 'breastfeeding' ? formData.feedingSide : undefined,
                    feedingNotes: logType === 'breastfeeding' && formData.feedingNotes ? formData.feedingNotes : undefined,
                    notes: formData.notes || undefined,
                }),
            });
            setShowLogForm(false);
            setFormData({
                babyWeight: '',
                diaperCount: '',
                diaperType: 'wet',
                feedingDuration: '',
                feedingSide: 'both',
                feedingNotes: '',
                notes: '',
            });
            fetchData();
        } catch (err: any) {
            setError(err.message || 'Failed to log entry');
        } finally {
            setSubmitting(false);
        }
    };

    // Calculate stats
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const todayLogs = logs.filter(l => {
        const logDate = new Date(l.logDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        return logDate === today;
    });
    const todayDiapers = todayLogs.filter(l => l.logType === 'baby_diaper').reduce((sum, l) => sum + (l.diaperCount || 0), 0);
    const todayFeedings = todayLogs.filter(l => l.logType === 'breastfeeding');
    const totalFeedTime = todayFeedings.reduce((sum, l) => sum + (l.feedingDuration || 0), 0);
    const latestWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : null;
    const maxWeight = weightEntries.length > 0 ? Math.max(...weightEntries.map(w => w.weight)) : 10;

    if (!isPostpartum) {
        return (
            <AuthenticatedShell>
                <div className="max-w-4xl mx-auto py-12 text-center">
                    <Baby className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-display text-velvet-800 dark:text-surface-100 mb-2">
                        {n('babyTracker') || 'Baby Tracker'}
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
                                {n('babyTracker') || 'Baby Tracker'}
                            </h1>
                            <p className="text-surface-500 text-sm mt-1">
                                {t('babyCare') || 'Track feeding, diapers, and weight'}
                            </p>
                        </div>
                        <Button variant="primary" size="sm" onClick={() => setShowLogForm(!showLogForm)}>
                            <Plus className="w-4 h-4 mr-1" />
                            Log Entry
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Spinner className="w-8 h-8" />
                    </div>
                ) : (
                    <>
                        {/* Today's Summary */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Card padding="sm" className="text-center">
                                <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                                <div className="text-2xl font-bold text-velvet-800 dark:text-surface-100">{todayDiapers}</div>
                                <div className="text-xs text-surface-500">Diapers Today</div>
                            </Card>
                            <Card padding="sm" className="text-center">
                                <Clock className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                                <div className="text-2xl font-bold text-velvet-800 dark:text-surface-100">{totalFeedTime}</div>
                                <div className="text-xs text-surface-500">Min Feeding Today</div>
                            </Card>
                            <Card padding="sm" className="text-center">
                                <Baby className="w-5 h-5 text-pink-500 mx-auto mb-1" />
                                <div className="text-2xl font-bold text-velvet-800 dark:text-surface-100">{todayFeedings.length}</div>
                                <div className="text-xs text-surface-500">Feeding Sessions</div>
                            </Card>
                            <Card padding="sm" className="text-center">
                                <Weight className="w-5 h-5 text-green-500 mx-auto mb-1" />
                                <div className="text-2xl font-bold text-velvet-800 dark:text-surface-100">
                                    {latestWeight ? `${latestWeight}kg` : '—'}
                                </div>
                                <div className="text-xs text-surface-500">Latest Weight</div>
                            </Card>
                        </div>

                        {/* Log Form */}
                        {showLogForm && (
                            <Card>
                                <h2 className="text-lg font-semibold text-velvet-800 dark:text-surface-100 mb-4">New Entry</h2>
                                <form onSubmit={handleSubmitLog} className="space-y-4">
                                    <div className="flex gap-2">
                                        {(['baby_weight', 'baby_diaper', 'breastfeeding'] as const).map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setLogType(type)}
                                                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${logType === type
                                                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-medium'
                                                    : 'bg-surface-100 text-surface-600 dark:bg-velvet-800 dark:text-surface-400'
                                                    }`}
                                            >
                                                {type === 'baby_weight' ? 'Weight' : type === 'baby_diaper' ? 'Diaper' : 'Feeding'}
                                            </button>
                                        ))}
                                    </div>

                                    {logType === 'baby_weight' && (
                                        <Input
                                            label="Baby Weight (kg)"
                                            type="number"
                                            step="0.01"
                                            value={formData.babyWeight}
                                            onChange={e => setFormData(prev => ({ ...prev, babyWeight: e.target.value }))}
                                            placeholder="e.g. 3.5"
                                            required
                                        />
                                    )}

                                    {logType === 'baby_diaper' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Diaper Count"
                                                type="number"
                                                value={formData.diaperCount}
                                                onChange={e => setFormData(prev => ({ ...prev, diaperCount: e.target.value }))}
                                                placeholder="e.g. 8"
                                                required
                                            />
                                            <div>
                                                <label className="block text-sm font-medium text-velvet-700 dark:text-surface-300 mb-1">Type</label>
                                                <select
                                                    value={formData.diaperType}
                                                    onChange={e => setFormData(prev => ({ ...prev, diaperType: e.target.value }))}
                                                    className="w-full rounded-lg border border-surface-200 dark:border-velvet-700 bg-white dark:bg-velvet-800 px-3 py-2 text-sm"
                                                >
                                                    <option value="wet">Wet</option>
                                                    <option value="stool">Stool</option>
                                                    <option value="both">Both</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {logType === 'breastfeeding' && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    label="Duration (minutes)"
                                                    type="number"
                                                    value={formData.feedingDuration}
                                                    onChange={e => setFormData(prev => ({ ...prev, feedingDuration: e.target.value }))}
                                                    placeholder="e.g. 20"
                                                    required
                                                />
                                                <div>
                                                    <label className="block text-sm font-medium text-velvet-700 dark:text-surface-300 mb-1">Side</label>
                                                    <select
                                                        value={formData.feedingSide}
                                                        onChange={e => setFormData(prev => ({ ...prev, feedingSide: e.target.value }))}
                                                        className="w-full rounded-lg border border-surface-200 dark:border-velvet-700 bg-white dark:bg-velvet-800 px-3 py-2 text-sm"
                                                    >
                                                        <option value="left">Left</option>
                                                        <option value="right">Right</option>
                                                        <option value="both">Both</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <Input
                                                label="Feeding Notes"
                                                value={formData.feedingNotes}
                                                onChange={e => setFormData(prev => ({ ...prev, feedingNotes: e.target.value }))}
                                                placeholder="Latch quality, any issues..."
                                            />
                                        </>
                                    )}

                                    <Input
                                        label="Additional Notes (optional)"
                                        value={formData.notes}
                                        onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                        placeholder="Any observations..."
                                    />

                                    <div className="flex gap-3">
                                        <Button type="submit" variant="primary" loading={submitting}>
                                            Save Entry
                                        </Button>
                                        <Button type="button" variant="ghost" onClick={() => setShowLogForm(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        )}

                        {/* Weight Chart (Simple) */}
                        {weightEntries.length > 1 && (
                            <Card>
                                <h2 className="text-lg font-semibold text-velvet-800 dark:text-surface-100 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                    Weight Trend
                                </h2>
                                <div className="space-y-1">
                                    {weightEntries.map((entry, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="text-xs text-surface-400 w-16">{entry.date}</span>
                                            <div className="flex-1 bg-surface-100 dark:bg-velvet-800 rounded-full h-5 relative overflow-hidden">
                                                <div
                                                    className="bg-green-400 dark:bg-green-600 h-full rounded-full transition-all"
                                                    style={{ width: `${(entry.weight / maxWeight) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-velvet-700 dark:text-surface-300 w-14 text-right">
                                                {entry.weight} kg
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Recent Logs */}
                        <Card>
                            <h2 className="text-lg font-semibold text-velvet-800 dark:text-surface-100 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary-500" />
                                Recent Activity
                            </h2>
                            {logs.length === 0 ? (
                                <div className="text-center py-8 text-surface-400">
                                    <Baby className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No baby care logs yet. Start tracking feeding, diapers, and weight!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {logs.slice(0, 10).map((log) => (
                                        <div key={log.id} className="flex items-start gap-4 p-3 bg-surface-50 dark:bg-velvet-800/50 rounded-lg">
                                            <div className="text-xs text-surface-400 min-w-[90px] pt-0.5">
                                                {new Date(log.logDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap gap-2 items-center">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${log.logType === 'baby_weight'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : log.logType === 'baby_diaper'
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                        }`}>
                                                        {log.logType === 'baby_weight' ? 'Weight' : log.logType === 'baby_diaper' ? 'Diaper' : 'Feeding'}
                                                    </span>
                                                    {log.babyWeight && (
                                                        <span className="text-sm font-medium text-velvet-700 dark:text-surface-300">
                                                            {log.babyWeight} kg
                                                        </span>
                                                    )}
                                                    {log.diaperCount && (
                                                        <span className="text-sm text-velvet-700 dark:text-surface-300">
                                                            {log.diaperCount} {log.diaperType} diaper(s)
                                                        </span>
                                                    )}
                                                    {log.feedingDuration && (
                                                        <span className="text-sm text-velvet-700 dark:text-surface-300">
                                                            {log.feedingDuration} min ({log.feedingSide})
                                                        </span>
                                                    )}
                                                </div>
                                                {(log.feedingNotes || log.notes) && (
                                                    <p className="text-sm text-velvet-600 dark:text-surface-400 mt-1">
                                                        {log.feedingNotes || log.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </>
                )}
            </div>
        </AuthenticatedShell>
    );
}