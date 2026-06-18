'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { useAuth } from '@/components/auth-provider';
import { api } from '@/lib/api-client';
import {
    Card,
    Badge,
} from '@/components/ui';
import {
    MessageSquare,
    StickyNote,
    CheckSquare,
    CalendarDays,
    TrendingUp,
    Heart,
    Baby,
    ArrowRight,
    Star,
    Loader2,
    AlertCircle,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface SharedUpdate {
    id: string;
    type: 'note' | 'task' | 'appointment' | 'mood';
    title: string;
    description: string;
    author: 'mother' | 'partner';
    timestamp: string;
    metadata?: string;
}

interface UpcomingMilestone {
    week: number;
    title: string;
    description: string;
    icon: React.ElementType;
}

interface QuickStat {
    value: string;
    change: string;
    color: string;
    labelKey: string;
}

// ─── API Types ────────────────────────────────────────────────────────────────

interface ApiNote {
    id: string;
    title: string;
    body: string;
    createdBy: { id: string; firstName: string; lastName: string };
    createdAt: string;
}

interface ApiTask {
    id: string;
    status: { name: string } | null;
    title: string;
    description: string | null;
    createdBy: { id: string; firstName: string; lastName: string };
    createdAt: string;
}

interface ApiAppointment {
    id: string;
    title: string;
    status: string;
    scheduledAt: string;
    notes: string | null;
    createdBy: { id: string; firstName: string; lastName: string };
    createdAt: string;
}

interface ApiWellnessLog {
    id: string;
    mood: number | null;
    createdAt: string;
}

interface ApiWeekContent {
    id: string;
    weekNumber: number;
    title: string;
    summary: string | null;
}

interface ApiPregnancy {
    currentPregnancyWeek: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<SharedUpdate['type'], { icon: React.ElementType; color: string; badgeVariant: 'primary' | 'razzmatazz' | 'gold'; typeKey: string }> = {
    note: { icon: StickyNote, color: 'text-gold-600 dark:text-gold-400', badgeVariant: 'gold', typeKey: 'sharedNote' },
    task: { icon: CheckSquare, color: 'text-primary-600 dark:text-primary-400', badgeVariant: 'primary', typeKey: 'sharedTask' },
    appointment: { icon: CalendarDays, color: 'text-razzmatazz-600 dark:text-razzmatazz-400', badgeVariant: 'razzmatazz', typeKey: 'appointment' },
    mood: { icon: Heart, color: 'text-razzmatazz-600 dark:text-razzmatazz-400', badgeVariant: 'razzmatazz', typeKey: 'moodUpdate' },
};

const MILESTONE_ICONS: React.ElementType[] = [Baby, TrendingUp, Heart];

const modules = [
    {
        href: '/shared/tasks',
        icon: CheckSquare,
        labelKey: 'moduleTasks',
        descKey: 'moduleTasksDesc',
        color: 'text-primary-600 dark:text-primary-400',
        bg: 'bg-primary-50 dark:bg-primary-900/30',
        border: 'border-primary-200 dark:border-primary-800',
    },
    {
        href: '/shared/notes',
        icon: StickyNote,
        labelKey: 'moduleNotes',
        descKey: 'moduleNotesDesc',
        color: 'text-gold-600 dark:text-gold-400',
        bg: 'bg-gold-50 dark:bg-gold-900/30',
        border: 'border-gold-200 dark:border-gold-800',
    },
    {
        href: '/appointments',
        icon: CalendarDays,
        labelKey: 'moduleCalendar',
        descKey: 'moduleCalendarDesc',
        color: 'text-razzmatazz-600 dark:text-razzmatazz-400',
        bg: 'bg-razzmatazz-50 dark:bg-razzmatazz-900/30',
        border: 'border-razzmatazz-200 dark:border-razzmatazz-800',
    },
    {
        href: '/chat',
        icon: MessageSquare,
        labelKey: 'moduleChat',
        descKey: 'moduleChatDesc',
        color: 'text-razzmatazz-600 dark:text-razzmatazz-400',
        bg: 'bg-razzmatazz-50 dark:bg-razzmatazz-900/30',
        border: 'border-razzmatazz-200 dark:border-razzmatazz-800',
    },
];

// ─── Components ──────────────────────────────────────────────────────────────

function UpdateCard({ update, t }: { update: SharedUpdate; t: ReturnType<typeof import('next-intl').useTranslations<string>> }) {
    const typeInfo = TYPE_CONFIG[update.type];
    const Icon = typeInfo.icon;

    return (
        <div className="flex items-start gap-4 p-4 rounded-xl border border-surface-200 dark:border-velvet-700 bg-white dark:bg-velvet-900 hover:shadow-soft transition-shadow">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-surface-100 dark:bg-velvet-800 ${typeInfo.color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant={typeInfo.badgeVariant}>{t(typeInfo.typeKey as any)}</Badge>
                    {update.metadata && (
                        <span className="text-xs text-surface-400">{update.metadata}</span>
                    )}
                </div>
                <h4 className="font-semibold text-sm text-velvet-900 dark:text-surface-100">
                    {update.title}
                </h4>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 line-clamp-2">
                    {update.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-surface-400">
                        {update.author === 'mother' ? `👩 ${t('mom')}` : `👨 ${t('partner')}`}
                    </span>
                    <span className="text-xs text-surface-300">•</span>
                    <span className="text-xs text-surface-400">
                        {new Date(update.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                </div>
            </div>
        </div>
    );
}

function OverviewSkeleton() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
            <div className="space-y-2">
                <div className="h-8 w-64 bg-surface-200 dark:bg-velvet-700 rounded" />
                <div className="h-4 w-96 bg-surface-200 dark:bg-velvet-700 rounded" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <Card key={i} padding="sm" className="text-center">
                        <div className="h-7 w-12 bg-surface-200 dark:bg-velvet-700 rounded mx-auto mb-2" />
                        <div className="h-3 w-16 bg-surface-200 dark:bg-velvet-700 rounded mx-auto mb-1" />
                        <div className="h-3 w-20 bg-surface-200 dark:bg-velvet-700 rounded mx-auto" />
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-5 rounded-2xl border border-surface-200 dark:border-velvet-700">
                        <div className="h-7 w-7 bg-surface-200 dark:bg-velvet-700 rounded mb-3" />
                        <div className="h-5 w-20 bg-surface-200 dark:bg-velvet-700 rounded mb-1" />
                        <div className="h-3 w-28 bg-surface-200 dark:bg-velvet-700 rounded" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2" padding="none">
                    <div className="p-5 border-b border-surface-200 dark:border-velvet-700">
                        <div className="h-6 w-36 bg-surface-200 dark:bg-velvet-700 rounded" />
                    </div>
                    <div className="p-5 space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-surface-200 dark:border-velvet-700">
                                <div className="w-10 h-10 rounded-full bg-surface-200 dark:bg-velvet-700" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-20 bg-surface-200 dark:bg-velvet-700 rounded" />
                                    <div className="h-4 w-40 bg-surface-200 dark:bg-velvet-700 rounded" />
                                    <div className="h-3 w-32 bg-surface-200 dark:bg-velvet-700 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card>
                    <div className="h-6 w-44 bg-surface-200 dark:bg-velvet-700 rounded mb-4" />
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-surface-200 dark:bg-velvet-700" />
                                <div className="flex-1 space-y-1">
                                    <div className="h-4 w-16 bg-surface-200 dark:bg-velvet-700 rounded" />
                                    <div className="h-4 w-32 bg-surface-200 dark:bg-velvet-700 rounded" />
                                    <div className="h-3 w-24 bg-surface-200 dark:bg-velvet-700 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function moodTitle(mood: number): string {
    if (mood >= 5) return 'Feeling great! 😄';
    if (mood >= 4) return 'Feeling good 🙂';
    if (mood >= 3) return 'Feeling okay 😐';
    if (mood >= 2) return 'Feeling low 😔';
    return 'Feeling down 😢';
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SharedSpacePage() {
    const t = useTranslations('shared');
    const { user, getDashboardUrl } = useAuth();
    const currentUserId = user?.id || '';

    const [loading, setLoading] = useState(true);
    const [dashboardUrl, setDashboardUrl] = useState<string>('/mother');

    // Fetch dashboard URL
    useEffect(() => {
        if (user?.roles) {
            getDashboardUrl(user.roles).then(setDashboardUrl);
        }
    }, [user?.roles, getDashboardUrl]);
    const [error, setError] = useState<string | null>(null);
    const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
    const [recentUpdates, setRecentUpdates] = useState<SharedUpdate[]>([]);
    const [milestones, setMilestones] = useState<UpcomingMilestone[]>([]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch pregnancy profile first to get current week
            // NOTE: /profile/pregnancy returns the raw PregnancyProfile, not a wrapped object
            let currentWeek = 0;
            try {
                const pregnancyRes = await api.get<ApiPregnancy | null>('/profile/pregnancy');
                currentWeek = pregnancyRes?.currentPregnancyWeek || 0;
            } catch {
                // pregnancy profile may not exist yet (e.g. partner viewing this page)
            }

            // Fallback: if no pregnancy profile (e.g. partner viewing shared page),
            // fetch from the partner/mother-health endpoint which resolves the mother's week
            if (currentWeek === 0) {
                try {
                    const motherHealthRes = await api.get<{ currentWeek: number }>('/partner/mother-health');
                    currentWeek = motherHealthRes.currentWeek || 0;
                } catch {
                    // mother-health endpoint also unavailable
                }
            }

            // Fetch all data in parallel
            const [notesRes, tasksRes, appointmentsRes, wellnessRes, weekRes] = await Promise.all([
                api.get<{ notes: ApiNote[]; total: number }>('/notes?limit=5'),
                api.get<{ tasks: ApiTask[]; total: number }>('/tasks?limit=5'),
                api.get<{ appointments: ApiAppointment[]; total: number }>('/appointments?limit=10'),
                api.get<{ logs: ApiWellnessLog[]; total: number }>('/wellness?limit=30'),
                currentWeek > 0
                    ? api.get<{ content: ApiWeekContent[] }>('/weekly-journey?limit=42')
                    : Promise.resolve({ content: [] as ApiWeekContent[] }),
            ]);

            const notes = notesRes.notes || [];
            const tasks = tasksRes.tasks || [];
            const appointments = appointmentsRes.appointments || [];
            const wellnessLogs = wellnessRes.logs || [];
            const weekContent = weekRes.content || [];

            // ─── Quick Stats ───
            const totalNotes = notesRes.total || 0;
            const totalTasks = tasksRes.total || 0;
            const completedTasks = tasks.filter(tk => tk.status?.name === 'done').length;
            const upcomingApps = appointments.filter(a => a.status === 'upcoming' || a.status === 'scheduled');
            const upcomingCount = upcomingApps.length;
            const nextAppointment = upcomingApps.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];
            const nextApptDate = nextAppointment ? formatTime(nextAppointment.scheduledAt) : null;

            const moodLogs = wellnessLogs.filter(l => l.mood != null);
            const avgMood = moodLogs.length > 0
                ? (moodLogs.reduce((sum, l) => sum + (l.mood || 0), 0) / moodLogs.length).toFixed(1)
                : '—';

            setQuickStats([
                {
                    value: String(totalNotes),
                    change: t('sharedNotes'),
                    color: 'text-primary-600',
                    labelKey: 'sharedNotes',
                },
                {
                    value: `${completedTasks}/${totalTasks}`,
                    change: totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% ${t('complete')}` : t('noTasks'),
                    color: 'text-gold-600',
                    labelKey: 'tasksDone',
                },
                {
                    value: String(upcomingCount),
                    change: nextApptDate ? `${t('nextAppointment')}: ${nextApptDate}` : t('appointments'),
                    color: 'text-razzmatazz-600',
                    labelKey: 'appointments',
                },
                {
                    value: avgMood,
                    change: moodLogs.length > 0 ? `${t('basedOn')} ${moodLogs.length} ${t('logs')}` : t('noData'),
                    color: 'text-razzmatazz-600',
                    labelKey: 'moodScore',
                },
            ]);

            // ─── Recent Activity Feed ───
            const activityItems: SharedUpdate[] = [];

            // Notes
            for (const note of notes) {
                activityItems.push({
                    id: `note-${note.id}`,
                    type: 'note',
                    title: note.title,
                    description: note.body || '',
                    author: note.createdBy?.id === currentUserId ? 'mother' : 'partner',
                    timestamp: note.createdAt,
                });
            }

            // Tasks
            for (const task of tasks) {
                const statusLabel = task.status?.name === 'done' ? 'Completed' : task.status?.name === 'in_progress' ? 'In Progress' : 'Pending';
                activityItems.push({
                    id: `task-${task.id}`,
                    type: 'task',
                    title: task.title,
                    description: task.description || '',
                    author: task.createdBy?.id === currentUserId ? 'mother' : 'partner',
                    timestamp: task.createdAt,
                    metadata: statusLabel,
                });
            }

            // Appointments
            for (const appt of appointments) {
                activityItems.push({
                    id: `appt-${appt.id}`,
                    type: 'appointment',
                    title: appt.title,
                    description: appt.notes || '',
                    author: appt.createdBy?.id === currentUserId ? 'mother' : 'partner',
                    timestamp: appt.createdAt,
                    metadata: formatDate(appt.scheduledAt),
                });
            }

            // Mood logs
            for (const log of moodLogs.slice(0, 5)) {
                if (log.mood != null) {
                    activityItems.push({
                        id: `mood-${log.id}`,
                        type: 'mood',
                        title: moodTitle(log.mood),
                        description: '',
                        author: 'mother',
                        timestamp: log.createdAt,
                        metadata: `Mood: ${log.mood}/5`,
                    });
                }
            }

            // Sort by timestamp descending and take top 5
            activityItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setRecentUpdates(activityItems.slice(0, 5));

            // ─── Milestones ───
            if (currentWeek > 0 && weekContent.length > 0) {
                const upcoming = weekContent
                    .filter(c => c.weekNumber >= currentWeek)
                    .sort((a, b) => a.weekNumber - b.weekNumber)
                    .slice(0, 3)
                    .map((c, i) => ({
                        week: c.weekNumber,
                        title: c.title,
                        description: c.summary || '',
                        icon: MILESTONE_ICONS[i % MILESTONE_ICONS.length],
                    }));
                setMilestones(upcoming);
            }
        } catch (err: any) {
            console.error('Failed to fetch shared overview data:', err);
            setError(err?.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    }, [currentUserId, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ─── Loading State ───
    if (loading) {
        return (
            <AuthenticatedShell>
                <OverviewSkeleton />
            </AuthenticatedShell>
        );
    }

    // ─── Render ───
    return (
        <AuthenticatedShell>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-display font-bold text-velvet-900 dark:text-surface-100">
                        {t('title')}
                    </h1>
                    <p className="text-surface-500 dark:text-surface-400 mt-1">
                        {t('sharedSubtitle')}
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <Card className="border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/20">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-danger-600 dark:text-danger-400 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-danger-700 dark:text-danger-300">{t('errorLoading')}</p>
                                <p className="text-xs text-danger-600 dark:text-danger-400 mt-0.5">{error}</p>
                            </div>
                            <button
                                onClick={fetchData}
                                className="text-sm text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 font-medium underline flex-shrink-0"
                            >
                                {t('retry')}
                            </button>
                        </div>
                    </Card>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {quickStats.map((stat, i) => (
                        <Card key={i} padding="sm" className="text-center">
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs text-surface-500 mt-1">{t(stat.labelKey as any)}</p>
                            <p className="text-xs text-surface-400 mt-0.5">{stat.change}</p>
                        </Card>
                    ))}
                </div>

                {/* Module Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {modules.map((mod, i) => (
                        <Link
                            key={i}
                            href={mod.href}
                            className={`
                block p-5 rounded-2xl border transition-all duration-200 no-underline
                hover:shadow-soft hover:-translate-y-0.5 ${mod.bg} ${mod.border}
              `}
                        >
                            <mod.icon className={`w-7 h-7 mb-3 ${mod.color}`} />
                            <h3 className="font-semibold text-velvet-900 dark:text-surface-100">
                                {t(mod.labelKey as any)}
                            </h3>
                            <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                                {t(mod.descKey as any)}
                            </p>
                        </Link>
                    ))}
                </div>

                {/* Updates & Milestones Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Updates */}
                    <Card className="lg:col-span-2" padding="none">
                        <div className="p-5 border-b border-surface-200 dark:border-velvet-700">
                            <h2 className="text-lg font-display font-bold text-velvet-900 dark:text-surface-100">
                                {t('recentActivity')}
                            </h2>
                        </div>
                        <div className="p-5 space-y-3">
                            {recentUpdates.length === 0 ? (
                                <p className="text-sm text-surface-400 dark:text-surface-500 text-center py-8">
                                    {t('noRecentActivity')}
                                </p>
                            ) : (
                                recentUpdates.map((update) => (
                                    <UpdateCard key={update.id} update={update} t={t} />
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Upcoming Milestones */}
                    <Card>
                        <h2 className="text-lg font-display font-bold text-velvet-900 dark:text-surface-100 mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-gold-500" />
                            {t('upcomingMilestones')}
                        </h2>
                        <div className="space-y-4">
                            {milestones.length === 0 ? (
                                <p className="text-sm text-surface-400 dark:text-surface-500 text-center py-4">
                                    {t('noMilestones')}
                                </p>
                            ) : (
                                milestones.map((milestone, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center flex-shrink-0">
                                            <milestone.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="primary">{t('weekPrefix', { week: milestone.week })}</Badge>
                                            </div>
                                            <h4 className="font-semibold text-sm text-velvet-900 dark:text-surface-100 mt-1">
                                                {milestone.title}
                                            </h4>
                                            <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                                                {milestone.description}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Engagement Banner */}
                <Card className="bg-gradient-to-r from-razzmatazz-50 to-primary-50 dark:from-razzmatazz-900/20 dark:to-primary-900/20 border-razzmatazz-200 dark:border-razzmatazz-800">
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-razzmatazz-100 dark:bg-razzmatazz-800 flex items-center justify-center">
                                <Heart className="w-5 h-5 text-razzmatazz-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-velvet-900 dark:text-surface-100">
                                    {t('stayConnected')}
                                </h3>
                                <p className="text-sm text-surface-500 dark:text-surface-400">
                                    {t('stayConnectedDesc')}
                                </p>
                            </div>
                        </div>
                        <Link href={dashboardUrl} className="btn-primary btn-sm flex items-center gap-2 whitespace-nowrap">
                            {t('goToDashboard')}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </Card>
            </div>
        </AuthenticatedShell>
    );
}