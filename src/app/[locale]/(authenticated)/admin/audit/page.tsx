'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { Card, Badge, EmptyState, Select } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
    Search,
    Filter,
    AlertTriangle,
    Info,
    Shield,
    FileText,
    UserCheck,
    MessageCircle,
    Clock,
    Activity,
    ChevronLeft,
} from 'lucide-react';

// ─── Types ───

interface AuditEntry {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    type: 'user' | 'content' | 'system' | 'security' | 'emergency';
    details: string;
    ip?: string;
    severity: 'info' | 'warning' | 'danger';
}

// ─── Config ───

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: 'primary' | 'gold' | 'razzmatazz' | 'wine' | 'danger' }> = {
    user: { icon: UserCheck, color: 'primary' },
    content: { icon: FileText, color: 'gold' },
    system: { icon: Activity, color: 'razzmatazz' },
    security: { icon: Shield, color: 'wine' },
    emergency: { icon: AlertTriangle, color: 'danger' },
};

// ─── Mock Data ───

const MOCK_ENTRIES: AuditEntry[] = [
    { id: '1', timestamp: '2026-06-01 14:02:15', user: 'admin@maternalcare.in', action: 'Content updated', type: 'content', details: 'Week 28 guidance article modified', ip: '192.168.1.45', severity: 'info' },
    { id: '2', timestamp: '2026-06-01 13:45:10', user: 'system', action: 'Emergency alert', type: 'emergency', details: 'High-risk keyword detected in chat #1842', ip: '—', severity: 'danger' },
    { id: '3', timestamp: '2026-06-01 13:30:00', user: 'priya.sharma@email.com', action: 'Account created', type: 'user', details: 'New mother registration from Mumbai', ip: '203.0.113.42', severity: 'info' },
    { id: '4', timestamp: '2026-06-01 12:55:22', user: 'system', action: 'Rule triggered', type: 'security', details: 'Unshared symptom flag: user #482, 3+ high severity', ip: '—', severity: 'warning' },
    { id: '5', timestamp: '2026-06-01 12:20:45', user: 'admin@maternalcare.in', action: 'User role changed', type: 'user', details: 'User #289 role updated: mother → admin', ip: '192.168.1.45', severity: 'warning' },
    { id: '6', timestamp: '2026-06-01 11:10:05', user: 'rajesh.kumar@email.com', action: 'Chat session', type: 'system', details: 'Partner support chat — 18 messages exchanged', ip: '198.51.100.12', severity: 'info' },
    { id: '7', timestamp: '2026-06-01 10:45:33', user: 'system', action: 'Backup completed', type: 'system', details: 'Daily database backup — 342 MB', ip: '—', severity: 'info' },
    { id: '8', timestamp: '2026-06-01 10:12:18', user: 'admin@maternalcare.in', action: 'Rule updated', type: 'security', details: 'High-risk symptom rule threshold adjusted', ip: '192.168.1.45', severity: 'info' },
    { id: '9', timestamp: '2026-06-01 09:30:40', user: 'system', action: 'Failed login', type: 'security', details: '3 failed attempts for user #512 from IP 203.0.113.99', ip: '203.0.113.99', severity: 'danger' },
    { id: '10', timestamp: '2026-06-01 08:55:12', user: 'anita.desai@email.com', action: 'Symptoms logged', type: 'user', details: 'Logged 3 symptoms: headache, fatigue, dizziness', ip: '198.51.100.55', severity: 'info' },
];

// ─── Main Component ───

export default function AuditLogPage() {
    const [entries] = useState<AuditEntry[]>(MOCK_ENTRIES);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [severityFilter, setSeverityFilter] = useState('all');
    const t = useTranslations('admin');

    const filteredEntries = entries.filter(e => {
        const matchesSearch = !searchQuery ||
            e.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.details.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || e.type === typeFilter;
        const matchesSeverity = severityFilter === 'all' || e.severity === severityFilter;
        return matchesSearch && matchesType && matchesSeverity;
    });

    return (
        <AuthenticatedShell>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                        <Link href="/admin" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-2">
                            <ChevronLeft className="w-4 h-4" />
                            {t('backToDashboard')}
                        </Link>
                        <h1 className="text-2xl font-display text-velvet-800 dark:text-surface-200">
                            {t('audit.title')}
                        </h1>
                        <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
                            {t('audit.subtitle')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-surface-400 bg-surface-100 dark:bg-surface-800 px-2.5 py-1 rounded-full">
                            {t('audit.entries', { count: filteredEntries.length })}
                        </span>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input
                            type="text"
                            placeholder={t('audit.searchLogs')}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-velvet-900 text-velvet-800 dark:text-surface-200 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        />
                    </div>
                    <Select
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value)}
                        className="w-full sm:w-40"
                        options={[
                            { value: 'all', label: t('audit.allTypes') },
                            { value: 'user', label: t('audit.typeUser') },
                            { value: 'content', label: t('audit.typeContent') },
                            { value: 'system', label: t('audit.typeSystem') },
                            { value: 'security', label: t('audit.typeSecurity') },
                            { value: 'emergency', label: t('audit.typeEmergency') },
                        ]}
                    />
                    <Select
                        value={severityFilter}
                        onChange={e => setSeverityFilter(e.target.value)}
                        className="w-full sm:w-40"
                        options={[
                            { value: 'all', label: t('audit.allSeverity') },
                            { value: 'info', label: t('audit.severityInfo') },
                            { value: 'warning', label: t('audit.severityWarning') },
                            { value: 'danger', label: t('audit.severityDanger') },
                        ]}
                    />
                </div>

                {/* Table */}
                <Card padding="none">
                    {filteredEntries.length === 0 ? (
                        <div className="py-12">
                            <EmptyState
                                icon={<Search className="w-6 h-6" />}
                                title={t('audit.noEntries')}
                                description={t('audit.noEntriesDesc')}
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-surface-100 dark:border-surface-800">
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">{t('audit.time')}</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">{t('audit.type')}</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">{t('audit.user')}</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">{t('audit.action')}</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">{t('audit.details')}</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">{t('audit.severity')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                                    {filteredEntries.map((entry) => {
                                        const typeConfig = TYPE_CONFIG[entry.type];
                                        const TypeIcon = typeConfig?.icon || Activity;
                                        return (
                                            <tr key={entry.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3 text-surface-400" />
                                                        <span className="text-xs text-surface-500">{entry.timestamp}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {typeConfig && (
                                                        <Badge variant={typeConfig.color}>
                                                            <TypeIcon className="w-3 h-3 mr-1" />
                                                            {entry.type}
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-xs text-surface-600 dark:text-surface-300">{entry.user}</span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-velvet-800 dark:text-surface-200">{entry.action}</span>
                                                </td>
                                                <td className="px-4 py-3 max-w-xs">
                                                    <p className="text-xs text-surface-500 truncate">{entry.details}</p>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={cn(
                                                        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase',
                                                        entry.severity === 'danger' && 'bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400',
                                                        entry.severity === 'warning' && 'bg-warning-50 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400',
                                                        entry.severity === 'info' && 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400',
                                                    )}>
                                                        {entry.severity}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {Object.entries(
                        entries.reduce((acc, e) => {
                            acc[e.type] = (acc[e.type] || 0) + 1;
                            return acc;
                        }, {} as Record<string, number>)
                    ).map(([type, count]) => {
                        const typeConfig = TYPE_CONFIG[type];
                        const TypeIcon = typeConfig?.icon || Activity;
                        return (
                            <Card key={type} className="text-center">
                                <TypeIcon className="w-5 h-5 mx-auto mb-1 text-surface-400" />
                                <p className="text-lg font-display text-velvet-800 dark:text-surface-200">{count}</p>
                                <p className="text-[11px] text-surface-400 capitalize">{type}</p>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedShell>
    );
}