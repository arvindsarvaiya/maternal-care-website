'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { useAuth } from '@/components/auth-provider';
import { api } from '@/lib/api-client';
import {
    Card,
    Badge,
    ProgressBar,
    Button,
    EmptyState,
} from '@/components/ui';
import {
    CheckCircle2,
    ArrowLeft,
    Trophy,
    Star,
    Clock,
    ListTodo,
    MessageCircle,
    Filter,
    Loader2,
    AlertCircle,
    Baby,
    Heart,
} from 'lucide-react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// ─── Types ───────────────────────────────────────────────────────────────────

type TaskCategory = 'health' | 'nutrition' | 'preparation' | 'home' | 'logistics' | 'learning' | 'babycare' | 'recovery' | 'all';

interface SupportTask {
    id: string;
    title: string;
    description: string;
    category: Exclude<TaskCategory, 'all'>;
    completed: boolean;
    dueDate?: string;
    priority: 'high' | 'medium' | 'low';
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    progress: number;
    total: number;
    icon: React.ElementType;
    unlocked: boolean;
}

// ─── API Types ───

interface ApiTask {
    id: string;
    type: string;
    status: string;
    title: string;
    description: string | null;
    dueAt: string | null;
    createdAt: string;
}

interface ApiTasksResponse {
    tasks: ApiTask[];
    total: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────

interface CategoryConfigEntry {
    variant: 'primary' | 'razzmatazz' | 'gold' | 'wine' | 'ochre';
    icon: string;
    labelKey: string;
}

const CATEGORY_CONFIG: Record<Exclude<TaskCategory, 'all'>, CategoryConfigEntry> = {
    health: { variant: 'razzmatazz', icon: '💊', labelKey: 'categoryHealth' },
    nutrition: { variant: 'primary', icon: '🥗', labelKey: 'categoryNutrition' },
    preparation: { variant: 'gold', icon: '📋', labelKey: 'categoryPrep' },
    home: { variant: 'wine', icon: '🏠', labelKey: 'categoryHome' },
    logistics: { variant: 'ochre', icon: '🚗', labelKey: 'categoryLogistics' },
    learning: { variant: 'primary', icon: '📚', labelKey: 'categoryLearn' },
    babycare: { variant: 'razzmatazz', icon: '👶', labelKey: 'categoryBabycare' },
    recovery: { variant: 'primary', icon: '🩹', labelKey: 'categoryRecovery' },
};

const TYPE_TO_CATEGORY: Record<string, Exclude<TaskCategory, 'all'>> = {
    health: 'health',
    nutrition: 'nutrition',
    preparation: 'preparation',
    home: 'home',
    logistics: 'logistics',
    learning: 'learning',
    babycare: 'babycare',
    recovery: 'recovery',
};

// ─── Components ──────────────────────────────────────────────────────────────

function TaskRow({ task, t }: {
    task: SupportTask;
    t: ReturnType<typeof import('next-intl').useTranslations<string>>;
}) {
    const CategoryBadge = ({ category }: { category: Exclude<TaskCategory, 'all'> }) => {
        const c = CATEGORY_CONFIG[category];
        const label = t(`category${category.charAt(0).toUpperCase() + category.slice(1)}` as any) || category;
        return (
            <Badge variant={c.variant}>
                {c.icon} {label}
            </Badge>
        );
    };

    const priorityColor = {
        high: 'text-danger-600 dark:text-danger-400',
        medium: 'text-warning-600 dark:text-warning-400',
        low: 'text-primary-600 dark:text-primary-400',
    };

    return (
        <div
            className={`
        flex items-start gap-4 p-4 rounded-xl border transition-all duration-200
        ${task.completed
                    ? 'bg-primary-50/30 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800'
                    : 'bg-white dark:bg-velvet-900 border-surface-200 dark:border-velvet-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-soft'
                }
      `}
        >
            {/* Status indicator (read-only) */}
            <div
                className={`
          mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
          ${task.completed
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : 'border-surface-300 dark:border-velvet-600'
                    }
        `}
            >
                {task.completed && <CheckCircle2 className="w-4 h-4" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4
                        className={`text-sm font-semibold ${task.completed
                            ? 'text-surface-500 dark:text-surface-400 line-through'
                            : 'text-velvet-900 dark:text-surface-100'
                            }`}
                    >
                        {task.title}
                    </h4>
                    <span className={`text-xs font-medium ${priorityColor[task.priority]}`}>
                        {task.priority.toUpperCase()}
                    </span>
                </div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-2 line-clamp-1">
                    {task.description}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                    <CategoryBadge category={task.category} />
                    {task.dueDate && (
                        <span className="text-xs text-surface-400 dark:text-surface-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function TasksSkeleton() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="space-y-2">
                    <div className="h-4 w-20 bg-surface-200 dark:bg-velvet-700 rounded" />
                    <div className="h-7 w-48 bg-surface-200 dark:bg-velvet-700 rounded" />
                    <div className="h-4 w-64 bg-surface-200 dark:bg-velvet-700 rounded" />
                </div>
                <div className="h-9 w-36 bg-surface-200 dark:bg-velvet-700 rounded" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <Card key={i} padding="sm" className="text-center">
                        <div className="h-8 w-12 bg-surface-200 dark:bg-velvet-700 rounded mx-auto mb-1" />
                        <div className="h-3 w-16 bg-surface-200 dark:bg-velvet-700 rounded mx-auto" />
                    </Card>
                ))}
            </div>
            <div className="h-20 bg-surface-200 dark:bg-velvet-700 rounded-xl" />
            <Card padding="none">
                <div className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-surface-200 dark:border-velvet-700">
                            <div className="w-6 h-6 rounded-full bg-surface-200 dark:bg-velvet-700" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-36 bg-surface-200 dark:bg-velvet-700 rounded" />
                                <div className="h-3 w-48 bg-surface-200 dark:bg-velvet-700 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
            <Card>
                <div className="h-6 w-32 bg-surface-200 dark:bg-velvet-700 rounded mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-surface-200 dark:border-velvet-700">
                            <div className="w-12 h-12 rounded-full bg-surface-200 dark:bg-velvet-700" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-24 bg-surface-200 dark:bg-velvet-700 rounded" />
                                <div className="h-3 w-32 bg-surface-200 dark:bg-velvet-700 rounded" />
                                <div className="h-2 w-full bg-surface-200 dark:bg-velvet-700 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapApiTaskToSupportTask(apiTask: ApiTask): SupportTask {
    const typeName = apiTask.type || '';
    const category = TYPE_TO_CATEGORY[typeName] || 'preparation';

    const priority: 'high' | 'medium' | 'low' = category === 'health' ? 'high'
        : category === 'nutrition' ? 'high'
            : category === 'logistics' ? 'high'
                : category === 'preparation' ? 'medium'
                    : 'low';

    return {
        id: apiTask.id,
        title: apiTask.title,
        description: apiTask.description || '',
        category,
        completed: apiTask.status === 'done',
        dueDate: apiTask.dueAt || undefined,
        priority,
    };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PartnerTasksPage() {
    const t = useTranslations('partner');
    const { user, isPostpartum } = useAuth();

    const [tasks, setTasks] = useState<SupportTask[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<TaskCategory>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [motherPhase, setMotherPhase] = useState<'pregnancy' | 'postpartum' | null>(null);
    const [postpartumWeek, setPostpartumWeek] = useState(0);

    // ─── Fetch Tasks ───
    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [tasksRes, motherHealthRes] = await Promise.all([
                api.get<ApiTasksResponse>('/tasks?limit=50'),
                api.get<{ phase?: string; postpartumWeek?: number }>('/partner/mother-health').catch(() => ({ phase: undefined, postpartumWeek: 0 })),
            ]);

            const mapped = (tasksRes.tasks || []).map(mapApiTaskToSupportTask);
            setTasks(mapped);

            setMotherPhase((motherHealthRes.phase as 'pregnancy' | 'postpartum' | null) || null);
            setPostpartumWeek(motherHealthRes.postpartumWeek || 0);
        } catch (err: any) {
            console.error('Failed to fetch partner tasks:', err);
            setError(err?.message || 'Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // ─── Filters ───
    const filteredTasks = tasks.filter(t => {
        if (categoryFilter === 'all') return true;
        return t.category === categoryFilter;
    });

    const stats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;
        return { total, completed, highPriority };
    }, [tasks]);

    // ─── Achievements (derived from tasks) ───
    const achievements: Achievement[] = useMemo(() => {
        const base: Achievement[] = [
            {
                id: 'a1',
                title: t('achievementTaskMaster') || 'Task Master',
                description: t('achievementTaskMasterDesc') || 'Complete 10 support tasks',
                progress: Math.min(stats.completed, 10),
                total: 10,
                icon: CheckCircle2,
                unlocked: stats.completed >= 10,
            },
            {
                id: 'a2',
                title: t('achievementHealthGuardian') || 'Health Guardian',
                description: t('achievementHealthGuardianDesc') || 'Complete all health-related tasks',
                progress: tasks.filter(t => t.category === 'health' && t.completed).length,
                total: Math.max(tasks.filter(t => t.category === 'health').length, 1),
                icon: Star,
                unlocked: tasks.filter(t => t.category === 'health').length > 0 &&
                    tasks.filter(t => t.category === 'health').every(t => t.completed),
            },
            {
                id: 'a3',
                title: t('achievementHomeHero') || 'Home Hero',
                description: t('achievementHomeHeroDesc') || 'Complete all home setup tasks',
                progress: tasks.filter(t => t.category === 'home' && t.completed).length,
                total: Math.max(tasks.filter(t => t.category === 'home').length, 1),
                icon: Trophy,
                unlocked: tasks.filter(t => t.category === 'home').length > 0 &&
                    tasks.filter(t => t.category === 'home').every(t => t.completed),
            },
            {
                id: 'a4',
                title: t('achievementConsistentPartner') || 'Consistent Partner',
                description: t('achievementConsistentPartnerDesc') || 'Stay active for 7 consecutive days',
                progress: Math.min(stats.completed, 7),
                total: 7,
                icon: Clock,
                unlocked: stats.completed >= 7,
            },
        ];

        // Postpartum-specific achievements
        if (motherPhase === 'postpartum') {
            base.push(
                {
                    id: 'a5',
                    title: t('achievementBabyExpert') || 'Baby Expert',
                    description: t('achievementBabyExpertDesc') || 'Complete all baby care tasks',
                    progress: tasks.filter(t => t.category === 'babycare' && t.completed).length,
                    total: Math.max(tasks.filter(t => t.category === 'babycare').length, 1),
                    icon: Baby,
                    unlocked: tasks.filter(t => t.category === 'babycare').length > 0 &&
                        tasks.filter(t => t.category === 'babycare').every(t => t.completed),
                },
                {
                    id: 'a6',
                    title: t('achievementRecoveryChampion') || 'Recovery Champion',
                    description: t('achievementRecoveryChampionDesc') || 'Complete all recovery support tasks',
                    progress: tasks.filter(t => t.category === 'recovery' && t.completed).length,
                    total: Math.max(tasks.filter(t => t.category === 'recovery').length, 1),
                    icon: Heart,
                    unlocked: tasks.filter(t => t.category === 'recovery').length > 0 &&
                        tasks.filter(t => t.category === 'recovery').every(t => t.completed),
                },
            );
        }

        return base;
    }, [tasks, stats, t, motherPhase]);

    const allCategoryFilters: { key: TaskCategory; label: string; icon: string; postpartum?: boolean }[] = [
        { key: 'all', label: t('allTasks'), icon: '📋' },
        { key: 'health', label: t('categoryHealth'), icon: '💊' },
        { key: 'nutrition', label: t('nutrition'), icon: '🥗' },
        { key: 'preparation', label: t('categoryPrep'), icon: '📦' },
        { key: 'home', label: t('categoryHome'), icon: '🏠' },
        { key: 'logistics', label: t('logistics'), icon: '🚗' },
        { key: 'learning', label: t('categoryLearn'), icon: '📚' },
        { key: 'babycare', label: t('categoryBabycare') || 'Baby Care', icon: '👶', postpartum: true },
        { key: 'recovery', label: t('categoryRecovery') || 'Recovery', icon: '🩹', postpartum: true },
    ];

    // Filter out postpartum-only categories during pregnancy
    const categoryFilters = allCategoryFilters.filter(cat => !cat.postpartum || motherPhase === 'postpartum');

    // ─── Loading State ───
    if (loading) {
        return (
            <AuthenticatedShell>
                <TasksSkeleton />
            </AuthenticatedShell>
        );
    }

    // ─── Render ───
    return (
        <AuthenticatedShell>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                        <Link
                            href="/partner"
                            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 mb-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('tasksBack')}
                        </Link>
                        <h1 className="text-2xl lg:text-3xl font-display font-bold text-velvet-900 dark:text-surface-100">
                            {t('tasksTitle')}
                        </h1>
                        <p className="text-surface-500 dark:text-surface-400 mt-1">
                            {motherPhase === 'postpartum'
                                ? t('tasksSubtitlePostpartum', { week: postpartumWeek })
                                : t('tasksSubtitle')
                            }
                        </p>
                    </div>
                    <Link href="/chat?mode=partner" className="btn-primary btn-sm flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        {t('askForAdvice')}
                    </Link>
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
                                onClick={fetchTasks}
                                className="text-sm text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 font-medium underline flex-shrink-0"
                            >
                                {t('retry')}
                            </button>
                        </div>
                    </Card>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Card padding="sm" className="text-center">
                        <p className="text-3xl font-bold text-primary-600">{stats.total}</p>
                        <p className="text-xs text-surface-500 mt-1">{t('totalTasks')}</p>
                    </Card>
                    <Card padding="sm" className="text-center">
                        <p className="text-3xl font-bold text-primary-600">{stats.completed}</p>
                        <p className="text-xs text-surface-500 mt-1">{t('completedTasks')}</p>
                    </Card>
                    <Card padding="sm" className="text-center">
                        <p className="text-3xl font-bold text-warning-600">{stats.highPriority}</p>
                        <p className="text-xs text-surface-500 mt-1">{t('highPriority')}</p>
                    </Card>
                    <Card padding="sm" className="text-center">
                        <p className="text-3xl font-bold text-primary-600">
                            {tasks.length > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                        </p>
                        <p className="text-xs text-surface-500 mt-1">{t('progressStat')}</p>
                    </Card>
                </div>

                {/* Category Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Filter className="w-4 h-4 text-surface-400" />
                    {categoryFilters.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setCategoryFilter(cat.key)}
                            className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-all
                ${categoryFilter === cat.key
                                    ? 'bg-primary-500 text-white shadow-glow'
                                    : 'bg-surface-100 dark:bg-velvet-800 text-surface-600 dark:text-surface-400 hover:bg-primary-100 dark:hover:bg-primary-900/30'
                                }
              `}
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>

                {/* Promotion Banner */}
                <Card className="bg-gradient-to-r from-primary-50 to-gold-50 dark:from-primary-900/20 dark:to-gold-900/20 border-primary-200 dark:border-primary-800">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center flex-shrink-0">
                            <Trophy className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-velvet-900 dark:text-surface-100">
                                {t('doingGreat')}
                            </h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400">
                                {t('doingGreatDesc')}
                            </p>
                        </div>
                        <ProgressBar
                            value={stats.completed}
                            max={stats.total || 1}
                            variant="primary"
                            className="hidden sm:block w-32"
                        />
                    </div>
                </Card>

                {/* Task List */}
                <Card padding="none">
                    <div className="divide-y divide-surface-200 dark:divide-velvet-700">
                        {filteredTasks.length === 0 ? (
                            <div className="py-12">
                                <EmptyState
                                    icon={<ListTodo className="w-12 h-12" />}
                                    title={t('noTasks')}
                                    description={t('noTasksFoundDesc')}
                                />
                            </div>
                        ) : (
                            <div className="p-4 space-y-3">
                                {filteredTasks.map((task) => (
                                    <TaskRow
                                        key={task.id}
                                        task={task}
                                        t={t}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Achievements */}
                <Card>
                    <h2 className="text-lg font-display font-bold text-velvet-900 dark:text-surface-100 mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-gold-500" />
                        {t('achievements')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {achievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className={`
                  flex items-start gap-4 p-4 rounded-xl border transition-all
                  ${achievement.unlocked
                                        ? 'border-primary-200 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/20'
                                        : 'border-surface-200 dark:border-velvet-700 bg-surface-50 dark:bg-velvet-800/50'
                                    }
                `}
                            >
                                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                  ${achievement.unlocked
                                        ? 'bg-primary-100 dark:bg-primary-800 text-primary-600'
                                        : 'bg-surface-200 dark:bg-velvet-700 text-surface-400'
                                    }
                `}>
                                    <achievement.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm text-velvet-900 dark:text-surface-100">
                                        {achievement.title}
                                    </h4>
                                    <p className="text-xs text-surface-500 dark:text-surface-400 mb-2">
                                        {achievement.description}
                                    </p>
                                    <ProgressBar
                                        value={achievement.progress}
                                        max={achievement.total}
                                        variant="primary"
                                        className="w-full"
                                    />
                                    <p className="text-xs text-surface-400 mt-1">
                                        {achievement.progress}/{achievement.total}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </AuthenticatedShell>
    );
}