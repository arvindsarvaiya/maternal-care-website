'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth-provider';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { Card, Badge, Button, ProgressBar } from '@/components/ui';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api-client';
import { LocaleLink as Link } from '@/i18n/locale-link';
import {
    ChevronLeft,
    Shield,
    CheckCircle2,
    Clock,
    Calendar,
    Bell,
    Syringe,
    AlertTriangle,
    Info,
    ChevronRight,
    Loader2,
} from 'lucide-react';

// ─── Types ───

interface VaccineEntry {
    id: string;
    vaccineName: string;
    description: string | null;
    status: string;
    ruleLabel: string | null;
    dueDate: string | null;
    scheduledDate: string | null;
    completedDate: string | null;
    notes: string | null;
}

// ─── Helper Components ───

function VaccineCard({ vaccine }: { vaccine: VaccineEntry }) {
    const t = useTranslations('vaccinations');
    const statusConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
        completed: { icon: CheckCircle2, color: 'text-primary-600', bgColor: 'bg-primary-50 dark:bg-primary-900/20', label: t('completed') },
        upcoming: { icon: Clock, color: 'text-gold-600', bgColor: 'bg-gold-50 dark:bg-gold-900/20', label: t('upcoming') },
        overdue: { icon: AlertTriangle, color: 'text-danger-600', bgColor: 'bg-danger-50 dark:bg-danger-900/20', label: t('overdue') },
        optional: { icon: Info, color: 'text-surface-500', bgColor: 'bg-surface-50 dark:bg-surface-800/50', label: t('optional') },
    };

    const config = statusConfig[vaccine.status] || statusConfig.optional;
    const Icon = config.icon;

    return (
        <div className={`p-5 rounded-xl border border-surface-200 dark:border-surface-700 hover:shadow-soft transition-shadow ${config.bgColor}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${vaccine.status === 'completed' ? 'bg-primary-100 dark:bg-primary-800' :
                        vaccine.status === 'upcoming' ? 'bg-gold-100 dark:bg-gold-800' :
                            vaccine.status === 'overdue' ? 'bg-danger-100 dark:bg-danger-800' :
                                'bg-surface-100 dark:bg-surface-700'
                        }`}>
                        <Syringe className={`w-5 h-5 ${vaccine.status === 'completed' ? 'text-primary-600' :
                            vaccine.status === 'upcoming' ? 'text-gold-600' :
                                vaccine.status === 'overdue' ? 'text-danger-600' :
                                    'text-surface-500'
                            }`} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="font-medium text-surface-800 dark:text-surface-200">{vaccine.vaccineName}</h4>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color} ${config.bgColor}`}>
                                <Icon className="w-3 h-3" />
                                {config.label}
                            </span>
                        </div>
                        {vaccine.description && (
                            <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{vaccine.description}</p>
                        )}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-surface-500">
                            {vaccine.ruleLabel && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {vaccine.ruleLabel}
                                </span>
                            )}
                            {vaccine.dueDate && (
                                <span className="flex items-center gap-1">
                                    <Bell className="w-3 h-3" />
                                    {t('dueDate')}: {new Date(vaccine.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            )}
                            {vaccine.completedDate && (
                                <span className="text-primary-600 dark:text-primary-400">
                                    {t('received')}: {new Date(vaccine.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            )}
                        </div>
                        {vaccine.notes && (
                            <p className="text-xs text-surface-400 mt-2 italic">{vaccine.notes}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Vaccinations Page ───

export default function VaccinationsPage() {
    const t = useTranslations('vaccinations');
    const { user, getDashboardUrl } = useAuth();
    const [vaccines, setVaccines] = useState<VaccineEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'completed' | 'upcoming' | 'overdue' | 'optional'>('all');
    const [dashboardUrl, setDashboardUrl] = useState<string>('/mother');

    // Fetch dashboard URL
    useEffect(() => {
        if (user?.roles) {
            getDashboardUrl(user.roles).then(setDashboardUrl);
        }
    }, [user?.roles, getDashboardUrl]);

    const fetchVaccines = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.get<any>('/vaccinations?limit=100');
            setVaccines(data?.vaccinations ?? []);
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchVaccines(); }, [fetchVaccines]);

    const filteredVaccines = filter === 'all'
        ? vaccines
        : vaccines.filter(v => v.status === filter);

    const completedCount = vaccines.filter(v => v.status === 'completed').length;
    const totalEssential = vaccines.length || 1; // avoid divide by zero

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
                </div>

                {/* Progress Overview */}
                <Card variant="primary">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-primary-600 dark:text-primary-300" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-1">{t('vaccinationProgress')}</h3>
                            <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">
                                {t('ofRecommended', { total: totalEssential })}
                            </p>
                            {loading ? (
                                <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full animate-pulse" />
                            ) : (
                                <ProgressBar value={completedCount} max={totalEssential} variant="primary" showLabel size="md" />
                            )}
                        </div>
                    </div>
                </Card>

                {/* Importance Notice */}
                <div className="bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 rounded-xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-gold-700 dark:text-gold-300">{t('whyVaccinesMatter')}</p>
                        <p className="text-xs text-gold-600 dark:text-gold-400 mt-1">
                            {t('whyVaccinesDesc')}
                        </p>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex gap-2 border-b border-surface-200 dark:border-surface-700 pb-1 overflow-x-auto">
                    {([
                        { value: 'all', label: t('allVaccines') },
                        { value: 'completed', label: t('completed') },
                        { value: 'upcoming', label: t('upcoming') },
                        { value: 'overdue', label: t('overdue') },
                        { value: 'optional', label: t('optional') },
                    ] as const).map(f => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all border-b-2 -mb-[2px] whitespace-nowrap ${filter === f.value
                                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-surface-500 hover:text-surface-700'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Vaccine List */}
                <div className="space-y-3">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-5 rounded-xl border border-surface-200 dark:border-surface-700 animate-pulse">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-surface-200 dark:bg-surface-700" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 w-48 bg-surface-200 dark:bg-surface-700 rounded" />
                                        <div className="h-4 w-full bg-surface-200 dark:bg-surface-700 rounded" />
                                        <div className="h-3 w-32 bg-surface-200 dark:bg-surface-700 rounded" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : filteredVaccines.length === 0 ? (
                        <Card>
                            <p className="text-sm text-surface-500 text-center py-8">
                                {t('noVaccinations')}
                            </p>
                        </Card>
                    ) : (
                        filteredVaccines.map(v => (
                            <VaccineCard key={v.id} vaccine={v} />
                        ))
                    )}
                </div>

                {/* Disclaimer */}
                <div className="text-center text-xs text-surface-400 py-2">
                    {t('disclaimer')}
                </div>
            </div>
        </AuthenticatedShell>
    );
}