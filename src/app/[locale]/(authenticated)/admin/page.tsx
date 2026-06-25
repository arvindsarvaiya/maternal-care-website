'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { useAuth } from '@/components/auth-provider';
import { Card, Button, Badge, ProgressBar, EmptyState } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
    Users,
    MessageCircle,
    Activity,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Clock,
    Shield,
    UserCheck,
    UserX,
    FileText,
    Settings,
    ChevronRight,
    BarChart3,
    Eye,
    RefreshCw,
} from 'lucide-react';

// ─── Types ───

interface PlatformStats {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    totalChatSessions: number;
    emergencyEscalations: number;
    totalAppointments: number;
    totalSymptoms: number;
    ruleViolations: number;
}

interface RecentActivity {
    id: string;
    type: 'user_joined' | 'emergency' | 'rule_triggered' | 'content_updated' | 'chat_session';
    description: string;
    timestamp: string;
    severity?: 'info' | 'warning' | 'danger';
}

interface RoleBreakdown {
    role: string;
    count: number;
    color: string;
}

// ─── Mock Data ───

const MOCK_STATS: PlatformStats = {
    totalUsers: 1247,
    activeUsers: 389,
    newUsersToday: 14,
    totalChatSessions: 3421,
    emergencyEscalations: 23,
    totalAppointments: 856,
    totalSymptoms: 2903,
    ruleViolations: 5,
};

const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
    { id: '1', type: 'user_joined', description: 'New mother account created from Mumbai', timestamp: '2 minutes ago', severity: 'info' },
    { id: '2', type: 'emergency', description: 'Emergency keyword detected in chat session #1842', timestamp: '15 minutes ago', severity: 'danger' },
    { id: '3', type: 'rule_triggered', description: 'High-risk symptom pattern detected for user #482', timestamp: '28 minutes ago', severity: 'warning' },
    { id: '4', type: 'content_updated', description: 'Weekly guidance content updated for Week 28', timestamp: '1 hour ago', severity: 'info' },
    { id: '5', type: 'chat_session', description: 'Partner support chat completed — 12 messages', timestamp: '1 hour ago', severity: 'info' },
    { id: '6', type: 'user_joined', description: 'New partner account created from Delhi', timestamp: '2 hours ago', severity: 'info' },
    { id: '7', type: 'rule_triggered', description: 'Unshared symptom flag: 3+ high severity symptoms unshared', timestamp: '3 hours ago', severity: 'warning' },
    { id: '8', type: 'emergency', description: 'Admin escalated chat session #1877 to support', timestamp: '4 hours ago', severity: 'danger' },
];

const MOCK_ROLE_BREAKDOWN: RoleBreakdown[] = [
    { role: 'Mothers', count: 523, color: 'bg-ochre-500' },
    { role: 'Partners', count: 487, color: 'bg-gold-500' },
    { role: 'Caregivers', count: 156, color: 'bg-primary-500' },
    { role: 'Family', count: 72, color: 'bg-wine-500' },
    { role: 'Admins', count: 9, color: 'bg-surface-700' },
];

const MOCK_WEEKLY_TRENDING = {
    newUsers: [23, 31, 28, 35, 42, 38, 14],
    chatSessions: [145, 167, 152, 189, 201, 178, 89],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

// ─── Stat Card ───

function StatCard({
    label,
    value,
    icon: Icon,
    trend,
    color,
}: {
    label: string;
    value: number | string;
    icon: React.ElementType;
    trend?: 'up' | 'down' | 'neutral';
    color: string;
}) {
    return (
        <Card className="relative overflow-hidden">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-surface-500 dark:text-surface-400 font-medium uppercase tracking-wide">
                        {label}
                    </p>
                    <p className="text-2xl font-display text-velvet-800 dark:text-surface-200 mt-1">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {trend && (
                        <div className="flex items-center gap-1 mt-1">
                            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-primary-500" />}
                            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-danger-500" />}
                            <span className={cn(
                                'text-[11px] font-medium',
                                trend === 'up' && 'text-primary-600',
                                trend === 'down' && 'text-danger-600',
                                trend === 'neutral' && 'text-surface-400',
                            )}>
                                {trend === 'up' ? '+12%' : trend === 'down' ? '-3%' : 'Stable'}
                            </span>
                        </div>
                    )}
                </div>
                <div className={cn('p-2.5 rounded-xl', color)}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </div>
            {/* Accent bar */}
            <div className={cn('absolute bottom-0 left-0 right-0 h-1', color)} />
        </Card>
    );
}

// ─── Activity Item ───

function ActivityItem({ activity }: { activity: RecentActivity }) {
    const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
        user_joined: { icon: UserCheck, color: 'text-primary-500' },
        emergency: { icon: AlertTriangle, color: 'text-danger-500' },
        rule_triggered: { icon: Shield, color: 'text-warning-500' },
        content_updated: { icon: FileText, color: 'text-gold-500' },
        chat_session: { icon: MessageCircle, color: 'text-razzmatazz-500' },
    };

    const config = typeConfig[activity.type];
    const Icon = config?.icon || Activity;

    return (
        <div className="flex items-start gap-3 py-2.5">
            <div className={cn('p-1.5 rounded-lg bg-surface-100 dark:bg-surface-800', config?.color)}>
                <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-surface-700 dark:text-surface-300">{activity.description}</p>
                <p className="text-[11px] text-surface-400 mt-0.5">{activity.timestamp}</p>
            </div>
            {activity.severity && activity.severity !== 'info' && (
                <Badge variant={activity.severity === 'danger' ? 'danger' : 'warning'}>
                    {activity.severity}
                </Badge>
            )}
        </div>
    );
}

// ─── Mini Bar Chart ───

function MiniBarChart({ data, labels }: { data: number[]; labels: string[] }) {
    const max = Math.max(...data);
    return (
        <div className="flex items-end gap-1.5 h-24">
            {data.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                        className="w-full bg-primary-200 dark:bg-primary-700 rounded-t-sm transition-all hover:bg-primary-300 dark:hover:bg-primary-600"
                        style={{ height: `${(val / max) * 100}%`, minHeight: 4 }}
                    />
                    <span className="text-[10px] text-surface-400">{labels[i]}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Main Component ───

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const [stats] = useState<PlatformStats>(MOCK_STATS);
    const [activities] = useState<RecentActivity[]>(MOCK_RECENT_ACTIVITY);
    const t = useTranslations('admin');

    // Quick admin links
    const quickLinks = [
        { label: t('contentEditor'), href: '/admin/content', icon: FileText, description: t('contentEditorDesc') },
        { label: t('ruleEngine'), href: '/admin/rules', icon: Settings, description: t('ruleEngineDesc') },
        { label: t('userOverview'), href: '/admin/users', icon: Users, description: t('userOverviewDesc') },
        { label: t('auditLog'), href: '/admin/audit', icon: Eye, description: t('auditLogDesc') },
    ];

    const totalRoles = MOCK_ROLE_BREAKDOWN.reduce((s, r) => s + r.count, 0);

    return (
        <AuthenticatedShell>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                        <h1 className="text-2xl font-display text-velvet-800 dark:text-surface-200">
                            {t('title')}
                        </h1>
                        <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
                            {t('subtitle')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-surface-400 bg-surface-100 dark:bg-surface-800 px-2.5 py-1 rounded-full">
                            {t('lastUpdated')}
                        </span>
                        <button className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label={t('totalUsers')} value={stats.totalUsers} icon={Users} trend="up" color="bg-primary-500" />
                    <StatCard label={t('activeToday')} value={stats.activeUsers} icon={Activity} trend="up" color="bg-gold-500" />
                    <StatCard label={t('chatSessions')} value={stats.totalChatSessions} icon={MessageCircle} trend="up" color="bg-razzmatazz-500" />
                    <StatCard label={t('escalations')} value={stats.emergencyEscalations} icon={AlertTriangle} trend="down" color="bg-danger-500" />
                </div>

                {/* Charts & Breakdown Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Signups (7-day) */}
                    <Card className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-velvet-800 dark:text-surface-200">
                                {t('newUsersThisWeek')}
                            </h2>
                            <span className="text-[11px] text-surface-400">
                                {MOCK_WEEKLY_TRENDING.newUsers.reduce((a, b) => a + b, 0)} {t('total')}
                            </span>
                        </div>
                        <MiniBarChart data={MOCK_WEEKLY_TRENDING.newUsers} labels={MOCK_WEEKLY_TRENDING.labels} />
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-surface-100 dark:border-surface-700">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-sm bg-primary-300" />
                                <span className="text-[11px] text-surface-500">{t('newUsers')}</span>
                            </div>
                            <span className="text-[11px] text-surface-400">
                                {t('avgPerDay', { n: Math.round(MOCK_WEEKLY_TRENDING.newUsers.reduce((a, b) => a + b, 0) / 7) })}
                            </span>
                        </div>
                    </Card>

                    {/* Role Breakdown */}
                    <Card>
                        <h2 className="text-sm font-semibold text-velvet-800 dark:text-surface-200 mb-4">
                            {t('userRoles')}
                        </h2>
                        <div className="space-y-3">
                            {MOCK_ROLE_BREAKDOWN.map((role) => (
                                <div key={role.role}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-surface-600 dark:text-surface-400">{role.role}</span>
                                        <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                                            {role.count} ({Math.round((role.count / totalRoles) * 100)}%)
                                        </span>
                                    </div>
                                    <ProgressBar
                                        value={role.count}
                                        max={totalRoles}
                                        variant="primary"
                                        size="sm"
                                        showLabel={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Quick Links + Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Admin Links */}
                    <Card className="lg:col-span-1">
                        <h2 className="text-sm font-semibold text-velvet-800 dark:text-surface-200 mb-3">
                            {t('adminTools')}
                        </h2>
                        <div className="space-y-1">
                            {quickLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors group"
                                    >
                                        <div className="p-1.5 rounded-lg bg-primary-100 dark:bg-primary-800">
                                            <Icon className="w-4 h-4 text-primary-600 dark:text-primary-300" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-surface-700 dark:text-surface-300">{link.label}</p>
                                            <p className="text-[11px] text-surface-400">{link.description}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-surface-300 group-hover:text-surface-500 transition-colors" />
                                    </Link>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold text-velvet-800 dark:text-surface-200">
                                {t('recentActivity')}
                            </h2>
                            <Link href="/admin/audit" className="text-[11px] text-primary-600 dark:text-primary-400 hover:underline">
                                {t('viewAll')}
                            </Link>
                        </div>
                        <div className="divide-y divide-surface-100 dark:divide-surface-800">
                            {activities.map((act) => (
                                <ActivityItem key={act.id} activity={act} />
                            ))}
                        </div>
                    </Card>
                </div>

                {/* System Health */}
                <Card>
                    <h2 className="text-sm font-semibold text-velvet-800 dark:text-surface-200 mb-3">
                        {t('systemHealth')}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: t('apiStatus'), value: t('operational'), color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
                            { label: t('database'), value: t('healthy'), color: 'text-gold-600', bg: 'bg-gold-50 dark:bg-gold-900/20' },
                            { label: t('chatService'), value: t('operational'), color: 'text-razzmatazz-600', bg: 'bg-razzmatazz-50 dark:bg-razzmatazz-900/20' },
                            { label: t('ruleEngine'), value: t('active'), color: 'text-wine-600', bg: 'bg-wine-50 dark:bg-wine-900/20' },
                        ].map((item) => (
                            <div key={item.label} className={cn('rounded-xl p-3', item.bg)}>
                                <p className="text-[11px] text-surface-500">{item.label}</p>
                                <p className={cn('text-sm font-semibold mt-0.5', item.color)}>{item.value}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </AuthenticatedShell>
    );
}