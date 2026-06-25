'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { useAuth } from '@/components/auth-provider';
import { Card, Button, Badge, Toggle, EmptyState } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
    ChevronLeft,
    Settings,
    Shield,
    AlertTriangle,
    Bell,
    Activity,
    Heart,
    Users,
    Calendar,
    CheckCircle2,
    XCircle,
    Pencil,
    RefreshCw,
    Plus,
    Clock,
} from 'lucide-react';

// ─── Types ───

interface Rule {
    id: string;
    name: string;
    description: string;
    category: 'safety' | 'reminder' | 'support' | 'wellness' | 'risk';
    enabled: boolean;
    triggerCount: number;
    lastTriggered: string;
    priority: 'high' | 'medium' | 'low';
    conditions: string;
    actions: string;
}

// ─── Mock Data ───

const MOCK_RULES: Rule[] = [
    {
        id: '1',
        name: 'High-Risk Symptom Detection',
        description: 'Detects when 3+ high-severity symptoms are logged within 24 hours and have not been shared with a partner or caregiver.',
        category: 'safety',
        enabled: true,
        triggerCount: 47,
        lastTriggered: '15 minutes ago',
        priority: 'high',
        conditions: 'symptomCount >= 3 AND severity = high AND shared = false',
        actions: 'Suggest sharing symptoms | Notify partner | Flag for admin review',
    },
    {
        id: '2',
        name: 'Emergency Keyword in Chat',
        description: 'Detects pregnancy emergency keywords in chatbot messages and triggers escalation protocol.',
        category: 'safety',
        enabled: true,
        triggerCount: 23,
        lastTriggered: '15 minutes ago',
        priority: 'high',
        conditions: 'messageContains([bleeding, severe pain, no movement, ...])',
        actions: 'Show emergency response | Log escalation event | Suggest 108',
    },
    {
        id: '3',
        name: 'Missed Appointment Alert',
        description: 'Alerts when a scheduled appointment is within 48 hours and no confirmation has been recorded.',
        category: 'reminder',
        enabled: true,
        triggerCount: 312,
        lastTriggered: '5 minutes ago',
        priority: 'medium',
        conditions: 'appointment.dueDate <= now + 48h AND confirmed = false',
        actions: 'Send reminder notification | Show on dashboard',
    },
    {
        id: '4',
        name: 'Weekly Guidance Unread',
        description: 'Reminds mother if weekly guidance content has not been viewed by Wednesday of the current week.',
        category: 'reminder',
        enabled: true,
        triggerCount: 89,
        lastTriggered: '1 hour ago',
        priority: 'low',
        conditions: 'currentDay >= Wednesday AND weeklyGuidanceViewed = false',
        actions: 'Show dashboard prompt | Send notification',
    },
    {
        id: '5',
        name: 'Partner Inactivity Nudge',
        description: 'Detects when partner has not logged in for 3+ days and sends a re-engagement suggestion.',
        category: 'support',
        enabled: true,
        triggerCount: 156,
        lastTriggered: '30 minutes ago',
        priority: 'medium',
        conditions: 'partnerLastLogin > 3 days',
        actions: 'Send partner notification | Suggest support actions',
    },
    {
        id: '6',
        name: 'Unshared Mood Decline',
        description: 'Detects pattern of declining mood scores over 5+ days that have not been shared.',
        category: 'wellness',
        enabled: true,
        triggerCount: 34,
        lastTriggered: '2 hours ago',
        priority: 'medium',
        conditions: 'moodTrend = declining AND days >= 5 AND shared = false',
        actions: 'Suggest sharing with partner | Offer emotional support resources',
    },
    {
        id: '7',
        name: 'Vaccination Due Reminder',
        description: 'Reminds mother about upcoming vaccination based on pregnancy week.',
        category: 'reminder',
        enabled: true,
        triggerCount: 198,
        lastTriggered: '10 minutes ago',
        priority: 'medium',
        conditions: 'pregnancyWeek >= vaccinationDueWeek - 1 AND taken = false',
        actions: 'Show vaccination card | Send reminder',
    },
    {
        id: '8',
        name: 'Low Wellness Score Alert',
        description: 'Triggers when combined wellness score (sleep + activity + mood + nutrition) falls below threshold.',
        category: 'risk',
        enabled: false,
        triggerCount: 0,
        lastTriggered: 'Never',
        priority: 'high',
        conditions: 'wellnessScore < 40 AND sustainedFor >= 3 days',
        actions: 'Suggest wellness check | Notify partner | Flag for review',
    },
    {
        id: '9',
        name: 'Multiple Support Requests',
        description: 'Detects when mother has sent 3+ support requests to partner within a short period without response.',
        category: 'support',
        enabled: true,
        triggerCount: 28,
        lastTriggered: '45 minutes ago',
        priority: 'low',
        conditions: 'supportRequestCount >= 3 AND partnerResponseCount = 0',
        actions: 'Nudge partner | Suggest alternative support',
    },
    {
        id: '10',
        name: 'Third Trimester Checklist',
        description: 'Activates shared task reminders when mother enters third trimester (week 28+).',
        category: 'support',
        enabled: true,
        triggerCount: 67,
        lastTriggered: '3 hours ago',
        priority: 'medium',
        conditions: 'pregnancyWeek >= 28',
        actions: 'Create shared tasks | Send preparation reminders',
    },
];

const CATEGORY_CONFIG: Record<string, { labelKey: string; icon: React.ElementType; color: 'primary' | 'razzmatazz' | 'gold' | 'wine' | 'danger' }> = {
    safety: { labelKey: 'admin.rules.categorySafety', icon: Shield, color: 'danger' },
    reminder: { labelKey: 'admin.rules.categoryReminder', icon: Bell, color: 'gold' },
    support: { labelKey: 'admin.rules.categorySupport', icon: Users, color: 'primary' },
    wellness: { labelKey: 'admin.rules.categoryWellness', icon: Heart, color: 'razzmatazz' },
    risk: { labelKey: 'admin.rules.categoryRisk', icon: AlertTriangle, color: 'wine' },
};

const PRIORITY_CONFIG: Record<string, { labelKey: string; color: 'primary' | 'gold' | 'danger' }> = {
    high: { labelKey: 'admin.rules.priorityHigh', color: 'danger' },
    medium: { labelKey: 'admin.rules.priorityMedium', color: 'gold' },
    low: { labelKey: 'admin.rules.priorityLow', color: 'primary' },
};

// ─── Component ───

export default function RuleEnginePage() {
    const { user } = useAuth();
    const [rules, setRules] = useState<Rule[]>(MOCK_RULES);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [expandedRule, setExpandedRule] = useState<string | null>(null);
    const t = useTranslations();

    const filteredRules = rules.filter(r =>
        categoryFilter === 'all' || r.category === categoryFilter
    );

    const handleToggle = (id: string) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    };

    const totalTriggers = rules.reduce((s, r) => s + r.triggerCount, 0);
    const enabledCount = rules.filter(r => r.enabled).length;
    const highPriorityCount = rules.filter(r => r.priority === 'high' && r.enabled).length;

    return (
        <AuthenticatedShell>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-surface-500" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-display text-velvet-800 dark:text-surface-200">{t('admin.rules.title')}</h1>
                            <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
                                {t('admin.rules.subtitle')}
                            </p>
                        </div>
                    </div>
                    <button className="btn-primary btn-sm flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        {t('admin.rules.newRule')}
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { labelKey: 'admin.rules.totalRules', value: rules.length, icon: Settings, color: 'text-surface-700 dark:text-surface-300' },
                        { labelKey: 'admin.rules.enabled', value: `${enabledCount}/${rules.length}`, icon: CheckCircle2, color: 'text-primary-600' },
                        { labelKey: 'admin.rules.totalTriggers', value: totalTriggers.toLocaleString(), icon: Activity, color: 'text-gold-600' },
                        { labelKey: 'admin.rules.highPriority', value: highPriorityCount, icon: AlertTriangle, color: 'text-danger-600' },
                    ].map((stat) => (
                        <Card key={stat.labelKey}>
                            <div className="flex items-center gap-2">
                                <stat.icon className={cn('w-4 h-4', stat.color)} />
                                <p className="text-xs text-surface-500">{t(stat.labelKey as any)}</p>
                            </div>
                            <p className={cn('text-xl font-display mt-1', stat.color)}>{stat.value}</p>
                        </Card>
                    ))}
                </div>

                {/* Category Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setCategoryFilter('all')}
                        className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                            categoryFilter === 'all'
                                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                : 'text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
                        )}
                    >
                        {t('admin.rules.all')} ({rules.length})
                    </button>
                    {(Object.entries(CATEGORY_CONFIG) as [string, typeof CATEGORY_CONFIG['safety']][]).map(([key, config]) => {
                        const count = rules.filter(r => r.category === key).length;
                        const Icon = config.icon;
                        return (
                            <button
                                key={key}
                                onClick={() => setCategoryFilter(key)}
                                className={cn(
                                    'px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5',
                                    categoryFilter === key
                                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                        : 'text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
                                )}
                            >
                                <Icon className="w-3 h-3" />
                                {t(config.labelKey as any)} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Rules List */}
                <div className="space-y-3">
                    {filteredRules.map((rule) => {
                        const catConfig = CATEGORY_CONFIG[rule.category];
                        const priConfig = PRIORITY_CONFIG[rule.priority];
                        const CatIcon = catConfig.icon;
                        const isExpanded = expandedRule === rule.id;

                        return (
                            <Card key={rule.id} className={cn(!rule.enabled && 'opacity-60')}>
                                <div className="flex items-start gap-4">
                                    {/* Category Icon */}
                                    <div className={cn(
                                        'p-2 rounded-lg flex-shrink-0',
                                        rule.enabled
                                            ? 'bg-surface-100 dark:bg-surface-800'
                                            : 'bg-surface-50 dark:bg-surface-800/50'
                                    )}>
                                        <CatIcon className="w-4 h-4 text-surface-500" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-sm font-semibold text-velvet-800 dark:text-surface-200">
                                                {rule.name}
                                            </h3>
                                            <Badge variant={catConfig.color}>{t(catConfig.labelKey as any)}</Badge>
                                            <Badge variant={priConfig.color}>{t(priConfig.labelKey as any)}</Badge>
                                            {!rule.enabled && (
                                                <Badge variant="warning">{t('admin.rules.disabled')}</Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                                            {rule.description}
                                        </p>

                                        {/* Meta */}
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-[11px] text-surface-400 flex items-center gap-1">
                                                <Activity className="w-3 h-3" />
                                                {t('admin.rules.triggeredTimes', { count: rule.triggerCount })}
                                            </span>
                                            <span className="text-[11px] text-surface-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {t('admin.rules.last')} {rule.lastTriggered}
                                            </span>
                                        </div>

                                        {/* Expanded Details */}
                                        {isExpanded && (
                                            <div className="mt-3 pt-3 border-t border-surface-100 dark:border-surface-700 space-y-2">
                                                <div>
                                                    <p className="text-[11px] font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wide">{t('admin.rules.conditions')}</p>
                                                    <code className="text-xs text-velvet-700 dark:text-surface-300 bg-surface-50 dark:bg-surface-800 px-2 py-1 rounded mt-0.5 block">
                                                        {rule.conditions}
                                                    </code>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wide">{t('admin.rules.actions')}</p>
                                                    <code className="text-xs text-velvet-700 dark:text-surface-300 bg-surface-50 dark:bg-surface-800 px-2 py-1 rounded mt-0.5 block">
                                                        {rule.actions}
                                                    </code>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Controls */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                                            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                            title={isExpanded ? t('admin.rules.collapse') : t('admin.rules.expand')}
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <Toggle
                                            checked={rule.enabled}
                                            onChange={() => handleToggle(rule.id)}
                                        />
                                    </div>
                                </div>
                            </Card>
                        );
                    })}

                    {filteredRules.length === 0 && (
                        <EmptyState
                            icon={<Settings className="w-10 h-10" />}
                            title={t('admin.rules.noRules')}
                            description={t('admin.rules.noRulesDesc')}
                        />
                    )}
                </div>

                {/* Rule Engine Info */}
                <Card variant="calm">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gold-100 dark:bg-gold-900/20">
                            <Activity className="w-4 h-4 text-gold-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-velvet-800 dark:text-surface-200">
                                {t('admin.rules.howRulesWork')}
                            </h3>
                            <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                                {t('admin.rules.howRulesWorkDesc')}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </AuthenticatedShell>
    );
}