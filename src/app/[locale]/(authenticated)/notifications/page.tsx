'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { useAuth } from '@/components/auth-provider';
import {
    Card,
    Badge,
    Button,
    Select,
    EmptyState,
} from '@/components/ui';
import {
    Bell,
    CalendarDays,
    Pill,
    Heart,
    Users,
    AlertTriangle,
    Check,
    Settings,
    Clock,
    ArrowLeft,
    CheckCheck,
    Baby,
    Loader2,
    Info,
} from 'lucide-react';
import { api } from '@/lib/api-client';

// ─── Types ───────────────────────────────────────────────────────────────────

type NotificationCategory = 'appointment' | 'medication' | 'weekly_update' | 'partner_activity' | 'rule_triggered' | 'system';

interface ApiNotification {
    id: string;
    type: string;
    status: string;
    channel: string;
    scheduledFor: string;
    sentAt: string | null;
    readAt: string | null;
    payload: Record<string, unknown> | null;
    createdAt: string;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    category: NotificationCategory;
    read: boolean;
    dismissed: boolean;
    timestamp: string;
    actionUrl?: string;
    actionLabel?: string;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const NOTIFICATION_CATEGORY_CONFIG: Record<NotificationCategory, {
    labelKey: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    badgeVariant: 'primary' | 'razzmatazz' | 'gold' | 'wine' | 'ochre';
}> = {
    appointment: {
        labelKey: 'appointments',
        icon: CalendarDays,
        color: 'text-gold-600 dark:text-gold-400',
        bg: 'bg-gold-100 dark:bg-gold-800',
        badgeVariant: 'gold',
    },
    medication: {
        labelKey: 'medication',
        icon: Pill,
        color: 'text-razzmatazz-600 dark:text-razzmatazz-400',
        bg: 'bg-razzmatazz-100 dark:bg-razzmatazz-800',
        badgeVariant: 'razzmatazz',
    },
    weekly_update: {
        labelKey: 'weeklyUpdates',
        icon: Baby,
        color: 'text-primary-600 dark:text-primary-400',
        bg: 'bg-primary-100 dark:bg-primary-800',
        badgeVariant: 'primary',
    },
    partner_activity: {
        labelKey: 'partner',
        icon: Users,
        color: 'text-razzmatazz-600 dark:text-razzmatazz-400',
        bg: 'bg-razzmatazz-100 dark:bg-razzmatazz-800',
        badgeVariant: 'razzmatazz',
    },
    rule_triggered: {
        labelKey: 'alerts',
        icon: AlertTriangle,
        color: 'text-wine-600 dark:text-wine-400',
        bg: 'bg-wine-100 dark:bg-wine-800',
        badgeVariant: 'wine',
    },
    system: {
        labelKey: 'system',
        icon: Info,
        color: 'text-surface-600 dark:text-surface-400',
        bg: 'bg-surface-100 dark:bg-surface-800',
        badgeVariant: 'primary',
    },
};

const STAT_CARDS: { key: NotificationCategory | 'unread'; labelKey: string; icon: React.ElementType; color: string }[] = [
    { key: 'appointment', labelKey: 'appointments', icon: CalendarDays, color: 'text-gold-600' },
    { key: 'medication', labelKey: 'medication', icon: Pill, color: 'text-razzmatazz-600' },
    { key: 'weekly_update', labelKey: 'weeklyUpdates', icon: Baby, color: 'text-primary-600' },
    { key: 'partner_activity', labelKey: 'partner', icon: Users, color: 'text-razzmatazz-600' },
    { key: 'rule_triggered', labelKey: 'alerts', icon: AlertTriangle, color: 'text-wine-600' },
    { key: 'unread', labelKey: 'unread', icon: Bell, color: 'text-danger-600' },
];

function mapApiTypeToCategory(type: string): NotificationCategory {
    const validCategories: NotificationCategory[] = ['appointment', 'medication', 'weekly_update', 'partner_activity', 'rule_triggered', 'system'];
    if (validCategories.includes(type as NotificationCategory)) return type as NotificationCategory;
    // Map appointment-related sub-types to the 'appointment' category
    if (type.startsWith('appointment') || type.includes('_appointment')) return 'appointment';
    return 'system';
}

function mapApiNotification(api: ApiNotification): Notification {
    const payload = api.payload || {};
    return {
        id: api.id,
        title: (payload.title as string) || api.type.replace(/_/g, ' '),
        message: (payload.message as string) || (payload.body as string) || '',
        category: mapApiTypeToCategory(api.type),
        read: api.status === 'read' || api.readAt !== null,
        dismissed: api.status === 'dismissed',
        timestamp: api.createdAt || api.scheduledFor,
        actionUrl: payload.actionUrl as string | undefined,
        actionLabel: payload.actionLabel as string | undefined,
    };
}

function getTimeAgo(timestamp: string, t: ReturnType<typeof import('next-intl').useTranslations<string>>): string {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('justNow');
    if (diffMins < 60) return t('minutesAgo', { n: diffMins });
    if (diffHrs < 24) return t('hoursAgo', { n: diffHrs });
    if (diffDays < 7) return t('daysAgo', { n: diffDays });
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ─── Components ──────────────────────────────────────────────────────────────

function NotificationRow({
    notification,
    onMarkRead,
    t,
}: {
    notification: Notification;
    onMarkRead: (id: string) => void;
    t: ReturnType<typeof import('next-intl').useTranslations<string>>;
}) {
    const catConfig = NOTIFICATION_CATEGORY_CONFIG[notification.category];
    const Icon = catConfig.icon;
    const timeAgo = getTimeAgo(notification.timestamp, t);

    return (
        <div
            className={`
        flex items-start gap-4 p-4 transition-all duration-200
        ${notification.read
                    ? 'bg-white dark:bg-velvet-900'
                    : 'bg-primary-50/50 dark:bg-primary-900/10'
                }
      `}
        >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${catConfig.bg}`}>
                <Icon className={`w-5 h-5 ${catConfig.color}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="text-sm font-semibold text-velvet-900 dark:text-surface-100">
                        {notification.title}
                    </h4>
                    <Badge variant={catConfig.badgeVariant}>{t(catConfig.labelKey as any)}</Badge>
                    {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                    )}
                </div>
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-2">
                    {notification.message}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-surface-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo}
                    </span>
                    {notification.actionUrl && (
                        <Link
                            href={notification.actionUrl}
                            className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                            {notification.actionLabel || t('view')} →
                        </Link>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
                {!notification.read && (
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            onMarkRead(notification.id);
                        }}
                        className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                        title={t('markAsRead')}
                    >
                        <Check className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

function NotificationSkeleton() {
    return (
        <div className="animate-pulse">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-start gap-4 p-4 border-b border-surface-200 dark:border-velvet-700">
                    <div className="w-10 h-10 rounded-full bg-surface-200 dark:bg-velvet-700 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="h-4 bg-surface-200 dark:bg-velvet-700 rounded w-40" />
                            <div className="h-5 bg-surface-200 dark:bg-velvet-700 rounded-full w-16" />
                        </div>
                        <div className="h-3 bg-surface-200 dark:bg-velvet-700 rounded w-full" />
                        <div className="h-3 bg-surface-200 dark:bg-velvet-700 rounded w-20" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
    const t = useTranslations('notifications');
    const { user, getDashboardUrl } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<NotificationCategory | 'all'>('all');
    const [loading, setLoading] = useState(true);
    const [dashboardUrl, setDashboardUrl] = useState<string>('/mother');

    // Fetch dashboard URL
    useEffect(() => {
        if (user?.roles) {
            getDashboardUrl(user.roles).then(setDashboardUrl);
        }
    }, [user?.roles, getDashboardUrl]);
    const [markingIds, setMarkingIds] = useState<Set<string>>(new Set());
    const [markingAll, setMarkingAll] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.get<{ notifications: ApiNotification[] }>('/notifications?limit=100');
            const mapped = (data.notifications || []).map(mapApiNotification);
            setNotifications(mapped);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const filteredNotifications = useMemo(() => {
        return notifications
            .filter(n => !n.dismissed)
            .filter(n => {
                if (categoryFilter === 'all') return true;
                return n.category === categoryFilter;
            })
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [notifications, categoryFilter]);

    const unreadCount = notifications.filter(n => !n.read && !n.dismissed).length;

    const handleMarkRead = useCallback(async (id: string) => {
        setMarkingIds(prev => new Set(prev).add(id));
        try {
            await api.patch('/notifications', { ids: [id] });
            setNotifications(prev =>
                prev.map(n => (n.id === id ? { ...n, read: true } : n))
            );
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        } finally {
            setMarkingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    }, []);

    const handleMarkAllRead = useCallback(async () => {
        setMarkingAll(true);
        try {
            await api.patch('/notifications', { ids: [] });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        } finally {
            setMarkingAll(false);
        }
    }, []);

    // Group notifications by date
    const groupedNotifications = useMemo(() => {
        const groups = new Map<string, Notification[]>();
        filteredNotifications.forEach(n => {
            const dateKey = new Date(n.timestamp).toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
            });
            if (!groups.has(dateKey)) groups.set(dateKey, []);
            groups.get(dateKey)!.push(n);
        });
        return groups;
    }, [filteredNotifications]);

    // Category stats
    const categoryStats = useMemo(() => {
        return STAT_CARDS.map(stat => ({
            ...stat,
            count: notifications.filter(n => !n.dismissed && (stat.key === 'unread' ? !n.read : n.category === stat.key)).length,
        }));
    }, [notifications]);

    return (
        <AuthenticatedShell>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                        <Link
                            href={dashboardUrl}
                            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 mb-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('backToDashboard')}
                        </Link>
                        <h1 className="text-2xl lg:text-3xl font-display font-bold text-velvet-900 dark:text-surface-100 flex items-center gap-2">
                            <Bell className="w-6 h-6 text-primary-600" />
                            {t('title')}
                            {unreadCount > 0 && (
                                <span className="text-sm font-normal bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400 px-2.5 py-0.5 rounded-full">
                                    {t('newCount', { count: unreadCount })}
                                </span>
                            )}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {unreadCount > 0 && (
                            <Button
                                onClick={handleMarkAllRead}
                                size="sm"
                                variant="outline"
                                disabled={markingAll}
                                className="flex items-center gap-2"
                            >
                                {markingAll ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCheck className="w-4 h-4" />
                                )}
                                {t('markAllRead')}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {categoryStats.map(({ key, labelKey, icon: Icon, color, count }) => (
                        <Card key={key} padding="sm" className="text-center">
                            <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
                            <p className="text-xl font-bold text-velvet-900 dark:text-surface-100">{count}</p>
                            <p className="text-xs text-surface-500">
                                {t(labelKey as any)}
                            </p>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value as NotificationCategory | 'all')}
                        options={[
                            { value: 'all', label: t('allNotifications') },
                            ...Object.entries(NOTIFICATION_CATEGORY_CONFIG).map(([key, cfg]) => ({
                                value: key,
                                label: t(cfg.labelKey as any),
                            })),
                        ]}
                        className="w-full sm:w-48"
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                        {(Object.keys(NOTIFICATION_CATEGORY_CONFIG) as NotificationCategory[]).map(
                            cat => {
                                const cfg = NOTIFICATION_CATEGORY_CONFIG[cat];
                                const count = notifications.filter(n => !n.dismissed && n.category === cat).length;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
                                        className={`
                      px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5
                      ${categoryFilter === cat
                                                ? 'bg-primary-500 text-white shadow-glow'
                                                : 'bg-surface-100 dark:bg-velvet-800 text-surface-600 dark:text-surface-400 hover:bg-primary-100 dark:hover:bg-primary-900/30'
                                            }
                    `}
                                    >
                                        <span>{t(cfg.labelKey as any)}</span>
                                        {count > 0 && (
                                            <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            }
                        )}
                    </div>
                </div>

                {/* Notification List */}
                <Card padding="none">
                    <div className="divide-y divide-surface-200 dark:divide-velvet-700">
                        {loading ? (
                            <NotificationSkeleton />
                        ) : filteredNotifications.length === 0 ? (
                            <div className="py-12">
                                <EmptyState
                                    icon={<Bell className="w-12 h-12" />}
                                    title={t('noNotifications')}
                                    description={t('noNotificationsDesc')}
                                    action={
                                        <Link href="/settings" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                            {t('manageSettings')}
                                        </Link>
                                    }
                                />
                            </div>
                        ) : (
                            Array.from(groupedNotifications.entries()).map(
                                ([timeGroup, groupNotifications]) => (
                                    <div key={timeGroup}>
                                        {/* Date Header */}
                                        <div className="px-4 py-2 bg-surface-50 dark:bg-velvet-800/50 border-b border-surface-200 dark:border-velvet-700">
                                            <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">
                                                {timeGroup}
                                            </p>
                                        </div>
                                        {/* Notifications for this date */}
                                        {groupNotifications.map(notification => (
                                            <NotificationRow
                                                key={notification.id}
                                                notification={notification}
                                                onMarkRead={handleMarkRead}
                                                t={t}
                                            />
                                        ))}
                                    </div>
                                )
                            )
                        )}
                    </div>
                </Card>
            </div>
        </AuthenticatedShell>
    );
}