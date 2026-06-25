'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth-provider';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { Card, Badge, Button, Toggle, Input, Select } from '@/components/ui';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api-client';
import { LocaleLink as Link } from '@/i18n/locale-link';
import {
    Activity,
    Plus,
    X,
    Search,
    Filter,
    Calendar,
    ChevronLeft,
    MessageCircle,
    Clock,
    Zap,
    Thermometer,
    Moon,
    Trash2,
    Loader2,
} from 'lucide-react';

// ─── Types ───

interface SymptomLogEntry {
    id: string;
    symptomType: string;
    severity: string;
    severityRank: number;
    notes: string | null;
    loggedAt: string;
}

const SYMPTOM_TYPES = [
    'Nausea',
    'Vomiting',
    'Back Pain',
    'Headache',
    'Fatigue',
    'Dizziness',
    'Swelling',
    'Heartburn',
    'Shortness of Breath',
    'Cramping',
    'Insomnia',
    'Mood Changes',
    'Breast Tenderness',
    'Constipation',
    'Frequent Urination',
    'Other',
];

const SEVERITY_RANK: Record<string, number> = { Mild: 1, Moderate: 2, Severe: 3 };

const SEVERITY_ICONS: Record<string, React.ElementType> = {
    Mild: Zap,
    Moderate: Thermometer,
    Severe: Moon,
};

const SEVERITY_COLORS: Record<string, string> = {
    Mild: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20',
    Moderate: 'text-warning-500 bg-warning-50 dark:bg-warning-900/20',
    Severe: 'text-danger-500 bg-danger-50 dark:bg-danger-900/20',
};

// ─── Helper Components ───

function SeverityBadge({ severity }: { severity: string }) {
    const Icon = SEVERITY_ICONS[severity] || Zap;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[severity] || ''}`}>
            <Icon className="w-3 h-3" />
            {severity}
        </span>
    );
}

// ─── Symptom Log Page ───

export default function SymptomLogPage() {
    const t = useTranslations('symptoms');
    const { user, getDashboardUrl } = useAuth();
    const [symptoms, setSymptoms] = useState<SymptomLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dashboardUrl, setDashboardUrl] = useState<string>('/mother');

    // Fetch dashboard URL
    useEffect(() => {
        if (user?.roles) {
            getDashboardUrl(user.roles).then(setDashboardUrl);
        }
    }, [user?.roles, getDashboardUrl]);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('all');

    const [newSymptom, setNewSymptom] = useState({
        symptomType: '',
        severity: 'Mild' as 'Mild' | 'Moderate' | 'Severe',
        notes: '',
    });

    const fetchSymptoms = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.get<any>('/symptoms?limit=100');
            setSymptoms(data?.logs ?? []);
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchSymptoms(); }, [fetchSymptoms]);

    // Filter symptoms
    const filteredSymptoms = symptoms.filter(s => {
        const matchesSearch =
            s.symptomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.notes ?? '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSeverity = filterSeverity === 'all' || s.severity === filterSeverity;
        return matchesSearch && matchesSeverity;
    });

    const handleAddSymptom = async () => {
        if (!newSymptom.symptomType) return;
        setSaving(true);
        try {
            await api.post('/symptoms', {
                symptomType: newSymptom.symptomType,
                severity: newSymptom.severity,
                severityRank: SEVERITY_RANK[newSymptom.severity] ?? 1,
                notes: newSymptom.notes || null,
                loggedAt: new Date().toISOString(),
            });
            setNewSymptom({ symptomType: '', severity: 'Mild', notes: '' });
            setShowNewForm(false);
            await fetchSymptoms();
        } catch {
            // silent
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeleting(id);
        try {
            await api.delete(`/symptoms/${id}`);
            setSymptoms(prev => prev.filter(s => s.id !== id));
        } catch {
            // silent
        } finally {
            setDeleting(null);
        }
    };

    return (
        <AuthenticatedShell>
            <div className="max-w-4xl mx-auto space-y-6">
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
                        <Link href="/chat" className="btn-secondary btn-sm flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            {t('askAboutSymptoms')}
                        </Link>
                        <Button onClick={() => setShowNewForm(!showNewForm)} size="sm" className="flex items-center gap-2">
                            {showNewForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {showNewForm ? t('cancel') : t('logSymptom')}
                        </Button>
                    </div>
                </div>

                {/* New Symptom Form */}
                {showNewForm && (
                    <Card>
                        <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-4">{t('logNewSymptom')}</h3>
                        <div className="space-y-4">
                            <Select
                                label={t('symptomType')}
                                value={newSymptom.symptomType}
                                onChange={e => setNewSymptom({ ...newSymptom, symptomType: e.target.value })}
                                options={[
                                    { value: '', label: t('selectSymptom') },
                                    ...SYMPTOM_TYPES.map(ty => ({ value: ty, label: ty })),
                                ]}
                            />

                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">{t('severity')}</label>
                                <div className="flex gap-2">
                                    {(['Mild', 'Moderate', 'Severe'] as const).map(severity => (
                                        <button
                                            key={severity}
                                            onClick={() => setNewSymptom({ ...newSymptom, severity })}
                                            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${newSymptom.severity === severity
                                                ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                                : 'border-surface-200 dark:border-surface-700 text-surface-600 hover:border-surface-300'
                                                }`}
                                        >
                                            {severity}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">{t('notes')}</label>
                                <textarea
                                    className="input min-h-[80px]"
                                    value={newSymptom.notes}
                                    onChange={e => setNewSymptom({ ...newSymptom, notes: e.target.value })}
                                    placeholder={t('notesPlaceholder')}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="secondary" onClick={() => setShowNewForm(false)} size="sm">
                                    {t('cancel')}
                                </Button>
                                <Button
                                    onClick={handleAddSymptom}
                                    size="sm"
                                    disabled={saving || !newSymptom.symptomType}
                                    className="flex items-center gap-2"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <Plus className="w-4 h-4" />
                                    {t('logSymptom')}
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input
                            className="input pl-10"
                            placeholder={t('searchSymptoms')}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select
                        value={filterSeverity}
                        onChange={e => setFilterSeverity(e.target.value)}
                        options={[
                            { value: 'all', label: t('allSeverities') },
                            { value: 'Mild', label: t('mild') },
                            { value: 'Moderate', label: t('moderate') },
                            { value: 'Severe', label: t('severe') },
                        ]}
                    />
                </div>

                {/* Symptom List */}
                <div className="space-y-3">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i}>
                                <div className="animate-pulse space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-28 bg-surface-200 dark:bg-surface-700 rounded" />
                                        <div className="h-4 w-16 bg-surface-200 dark:bg-surface-700 rounded-full" />
                                    </div>
                                    <div className="h-4 w-3/4 bg-surface-200 dark:bg-surface-700 rounded" />
                                    <div className="h-3 w-40 bg-surface-200 dark:bg-surface-700 rounded" />
                                </div>
                            </Card>
                        ))
                    ) : filteredSymptoms.length === 0 ? (
                        <Card>
                            <p className="text-sm text-surface-500 text-center py-8">
                                {t('noSymptoms')}
                            </p>
                        </Card>
                    ) : (
                        filteredSymptoms.map(s => (
                            <Card key={s.id} className="hover:shadow-soft transition-shadow">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-surface-800 dark:text-surface-200">{s.symptomType}</h4>
                                            <SeverityBadge severity={s.severity} />
                                        </div>
                                        {s.notes && (
                                            <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2">{s.notes}</p>
                                        )}
                                        <div className="flex items-center gap-3 mt-2 text-xs text-surface-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(s.loggedAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(s.loggedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(s.id)}
                                        disabled={deleting === s.id}
                                        className="p-2 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                                        title="Delete"
                                    >
                                        {deleting === s.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {/* Danger Warning */}
                <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl p-4">
                    <p className="text-sm text-danger-700 dark:text-danger-300">
                        <strong>{t('dangerWarningTitle')}</strong> {t('dangerWarningText')}
                    </p>
                </div>
            </div>
        </AuthenticatedShell>
    );
}