

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { LocaleLink as Link } from '@/i18n/locale-link';
import { useTranslations } from 'next-intl';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { useAuth } from '@/components/auth-provider';
import { api } from '@/lib/api-client';
import {
    Card,
    Badge,
    ProgressBar,
    Button,
    Input,
    Textarea,
    Select,
    EmptyState,
} from '@/components/ui';
import {
    ArrowLeft,
    Plus,
    CheckSquare,
    Filter,
    Clock,
    User,
    Users,
    AlertCircle,
    CheckCircle2,
    Circle,
    Loader2,
    Trash2,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type TaskCategory = 'health' | 'nutrition' | 'preparation' | 'home' | 'logistics' | 'learning' | 'all';
type TaskPriority = 'high' | 'medium' | 'low';
type TaskStatus = 'todo' | 'in_progress' | 'done';
type Assignee = 'mother' | 'partner' | 'both';

interface SharedTask {
    id: string;
    title: string;
    description: string;
    category: Exclude<TaskCategory, 'all'>;
    priority: TaskPriority;
    status: TaskStatus;
    assignee: Assignee;
    dueDate?: string;
    createdAt: string;
}

interface TaskStats {
    total: number;
    done: number;
    inProgress: number;
    todo: number;
}

// ─── API Types ────────────────────────────────────────────────────────────────

interface ApiAssignedUser {
    id: string;
    firstName: string;
    lastName: string;
}

interface ApiAssignment {
    id: string;
    assignedTo: ApiAssignedUser;
    completedAt: string | null;
}

interface ApiTask {
    id: string;
    type: string;
    status: string;
    title: string;
    description: string | null;
    dueAt: string | null;
    createdBy: ApiAssignedUser;
    assignments: ApiAssignment[];
    createdAt: string;
    updatedAt: string;
}

interface TasksApiResponse {
    tasks: ApiTask[];
    total: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<Exclude<TaskCategory, 'all'>, { variant: 'primary' | 'razzmatazz' | 'gold' | 'wine' | 'ochre'; key: string }> = {
    health: { variant: 'razzmatazz', key: 'health' },
    nutrition: { variant: 'primary', key: 'nutrition' },
    preparation: { variant: 'gold', key: 'preparation' },
    home: { variant: 'wine', key: 'home' },
    logistics: { variant: 'gold', key: 'logistics' },
    learning: { variant: 'wine', key: 'learning' },
};

const PRIORITY_CONFIG: Record<TaskPriority, { variant: 'danger' | 'warning' | 'primary'; key: string }> = {
    high: { variant: 'danger', key: 'high' },
    medium: { variant: 'warning', key: 'medium' },
    low: { variant: 'primary', key: 'low' },
};

const ASSIGNEE_CONFIG: Record<Assignee, { bg: string; key: string }> = {
    mother: { bg: 'bg-razzmatazz-50 dark:bg-razzmatazz-900/30 text-razzmatazz-600 dark:text-razzmatazz-400', key: 'mom' },
    partner: { bg: 'bg-gold-50 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400', key: 'partner' },
    both: { bg: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400', key: 'both' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapApiStatus(apiStatus: string): TaskStatus {
    if (apiStatus === 'pending') return 'todo';
    if (apiStatus === 'in_progress') return 'in_progress';
    if (apiStatus === 'done') return 'done';
    return 'todo'; // safe fallback for unknown statuses
}

function mapUiStatusToApi(uiStatus: TaskStatus): string {
    return uiStatus === 'todo' ? 'pending' : uiStatus;
}

function deriveAssignee(apiTask: ApiTask, currentUserId: string): Assignee {
    const assignmentUserIds = apiTask.assignments.map(a => a.assignedTo.id);
    if (assignmentUserIds.length >= 2) return 'both';
    if (assignmentUserIds.length === 0) return 'both';
    if (assignmentUserIds[0] === currentUserId) return 'mother';
    return 'partner';
}

function mapApiTask(apiTask: ApiTask, currentUserId: string): SharedTask {
    // Validate that the type from the API is a known category; fallback to 'health' if not
    const validCategories = Object.keys(CATEGORY_CONFIG) as Exclude<TaskCategory, 'all'>[];
    const category: Exclude<TaskCategory, 'all'> = validCategories.includes(apiTask.type as any)
        ? (apiTask.type as Exclude<TaskCategory, 'all'>)
        : 'health';

    return {
        id: apiTask.id,
        title: apiTask.title,
        description: apiTask.description || '',
        category,
        priority: 'medium',
        status: mapApiStatus(apiTask.status),
        assignee: deriveAssignee(apiTask, currentUserId),
        dueDate: apiTask.dueAt || undefined,
        createdAt: apiTask.createdAt,
    };
}

// ─── Components ──────────────────────────────────────────────────────────────

function CategoryBadgeRow({ category, t }: { category: Exclude<TaskCategory, 'all'>; t: ReturnType<typeof import('next-intl').useTranslations<string>> }) {
    const c = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.health;
    return (
        <Badge variant={c.variant}>
            {t(c.key as any)}
        </Badge>
    );
}

function PriorityBadge({ priority, t }: { priority: TaskPriority; t: ReturnType<typeof import('next-intl').useTranslations<string>> }) {
    const c = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.medium;
    return (
        <Badge variant={c.variant}>
            {t(c.key as any)}
        </Badge>
    );
}

function TaskRow({ task, onStatusChange, onDelete, t }: { task: SharedTask; onStatusChange: (id: string, status: TaskStatus) => void; onDelete: (id: string) => void; t: ReturnType<typeof import('next-intl').useTranslations<string>> }) {
    const assignee = ASSIGNEE_CONFIG[task.assignee];

    const statusIcon = {
        done: <CheckCircle2 className="w-5 h-5 text-primary-500" />,
        in_progress: <Loader2 className="w-5 h-5 text-warning-500 animate-spin" />,
        todo: <Circle className="w-5 h-5 text-surface-300" />,
    };

    const nextStatus: Record<TaskStatus, TaskStatus> = {
        todo: 'in_progress',
        in_progress: 'done',
        done: 'todo',
    };

    return (
        <div
            className={`
        flex items-start gap-4 p-4 rounded-xl border transition-all duration-200
        ${task.status === 'done'
                    ? 'bg-primary-50/30 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800'
                    : 'bg-white dark:bg-velvet-900 border-surface-200 dark:border-velvet-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-soft'
                }
      `}
        >
            {/* Status button */}
            <button
                onClick={() => onStatusChange(task.id, nextStatus[task.status])}
                className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
            >
                {statusIcon[task.status]}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4
                        className={`text-sm font-semibold ${task.status === 'done'
                            ? 'text-surface-500 dark:text-surface-400 line-through'
                            : 'text-velvet-900 dark:text-surface-100'
                            }`}
                    >
                        {task.title}
                    </h4>
                </div>
                {task.description && (
                    <p className="text-xs text-surface-500 dark:text-surface-400 mb-2 line-clamp-1">
                        {task.description}
                    </p>
                )}
                <div className="flex items-center gap-3 flex-wrap">
                    <CategoryBadgeRow category={task.category} t={t} />
                    <span className={`text-xs px-2 py-0.5 rounded-full ${assignee.bg}`}>
                        {t(assignee.key as any)}
                    </span>
                    {task.dueDate && (
                        <span className="text-xs text-surface-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {t('dueLabel')} {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                    )}
                </div>
            </div>

            {/* Delete button */}
            <button
                onClick={() => onDelete(task.id)}
                className="text-surface-400 hover:text-danger-500 transition-colors flex-shrink-0"
                title={t('cancel')}
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}

function TasksSkeleton() {
    return (
        <div className="space-y-4">
            {/* Stats skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <Card key={i} padding="sm" className="text-center">
                        <div className="space-y-2">
                            <div className="h-8 bg-surface-200 dark:bg-velvet-700 rounded animate-pulse w-12 mx-auto" />
                            <div className="h-3 bg-surface-200 dark:bg-velvet-700 rounded animate-pulse w-16 mx-auto" />
                        </div>
                    </Card>
                ))}
            </div>
            {/* Progress skeleton */}
            <Card>
                <div className="space-y-2">
                    <div className="h-4 bg-surface-200 dark:bg-velvet-700 rounded animate-pulse w-1/3" />
                    <div className="h-2 bg-surface-200 dark:bg-velvet-700 rounded-full animate-pulse" />
                </div>
            </Card>
            {/* Task list skeleton */}
            <Card padding="none">
                <div className="p-4 space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-surface-200 dark:border-velvet-700">
                            <div className="w-5 h-5 rounded-full bg-surface-200 dark:bg-velvet-700 animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-surface-200 dark:bg-velvet-700 rounded animate-pulse w-3/4" />
                                <div className="h-3 bg-surface-100 dark:bg-velvet-800 rounded animate-pulse w-1/2" />
                                <div className="flex gap-2">
                                    <div className="h-4 w-16 bg-surface-200 dark:bg-velvet-700 rounded-full animate-pulse" />
                                    <div className="h-4 w-12 bg-surface-200 dark:bg-velvet-700 rounded-full animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SharedTaskBoardPage() {
    const t = useTranslations('shared');
    const { user } = useAuth();
    const [tasks, setTasks] = useState<SharedTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<TaskCategory>('all');
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        category: 'health' as Exclude<TaskCategory, 'all'>,
        dueDate: '',
    });

    // ── Fetch tasks ──
    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.get<TasksApiResponse>('/tasks');
            const mapped = (data.tasks || []).map(apiTask =>
                mapApiTask(apiTask, user?.id || '')
            );
            setTasks(mapped);
        } catch (err: any) {
            console.error('Failed to fetch tasks:', err);
            setError(err.message || 'Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // ── Filters ──
    const filteredTasks = tasks.filter(tk => {
        if (categoryFilter !== 'all' && tk.category !== categoryFilter) return false;
        if (statusFilter !== 'all' && tk.status !== statusFilter) return false;
        return true;
    });

    const stats: TaskStats = useMemo(() => ({
        total: tasks.length,
        done: tasks.filter(tk => tk.status === 'done').length,
        inProgress: tasks.filter(tk => tk.status === 'in_progress').length,
        todo: tasks.filter(tk => tk.status === 'todo').length,
    }), [tasks]);

    // ── Status change ──
    const handleStatusChange = useCallback(async (id: string, newStatus: TaskStatus) => {
        // Optimistic update
        setTasks(prev =>
            prev.map(tk => (tk.id === id ? { ...tk, status: newStatus } : tk))
        );
        try {
            await api.put(`/tasks/${id}`, { status: mapUiStatusToApi(newStatus) });
        } catch (err) {
            console.error('Failed to update task status:', err);
            // Revert on failure
            fetchTasks();
        }
    }, [fetchTasks]);

    // ── Add task ──
    const handleAddTask = async () => {
        if (!newTask.title.trim()) return;
        setSaving(true);
        try {
            await api.post('/tasks', {
                type: newTask.category,
                title: newTask.title.trim(),
                description: newTask.description.trim() || undefined,
                dueAt: newTask.dueDate || undefined,
            });
            setNewTask({ title: '', description: '', category: 'health', dueDate: '' });
            setShowAddForm(false);
            await fetchTasks();
        } catch (err) {
            console.error('Failed to create task:', err);
        } finally {
            setSaving(false);
        }
    };

    // ── Delete task ──
    const handleDelete = useCallback(async (id: string) => {
        setDeletingId(id);
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(prev => prev.filter(tk => tk.id !== id));
        } catch (err) {
            console.error('Failed to delete task:', err);
        } finally {
            setDeletingId(null);
        }
    }, []);

    const categoryFilters: { key: TaskCategory; labelKey: string }[] = [
        { key: 'all', labelKey: 'all' },
        { key: 'health', labelKey: 'health' },
        { key: 'nutrition', labelKey: 'nutrition' },
        { key: 'preparation', labelKey: 'prep' },
        { key: 'home', labelKey: 'home' },
        { key: 'logistics', labelKey: 'logistics' },
        { key: 'learning', labelKey: 'learn' },
    ];

    if (loading) {
        return (
            <AuthenticatedShell>
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header */}
                    <div>
                        <Link
                            href="/shared"
                            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 mb-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('tasksBack')}
                        </Link>
                        <h1 className="text-2xl lg:text-3xl font-display font-bold text-velvet-900 dark:text-surface-100">
                            {t('sharedTaskBoard')}
                        </h1>
                    </div>
                    <TasksSkeleton />
                </div>
            </AuthenticatedShell>
        );
    }

    return (
        <AuthenticatedShell>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                        <Link
                            href="/shared"
                            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 mb-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('tasksBack')}
                        </Link>
                        <h1 className="text-2xl lg:text-3xl font-display font-bold text-velvet-900 dark:text-surface-100">
                            {t('sharedTaskBoard')}
                        </h1>
                        <p className="text-surface-500 dark:text-surface-400 mt-1">
                            {t('tasksSubtitle')}
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {t('addSharedTask')}
                    </Button>
                </div>

                {/* Error state */}
                {error && (
                    <Card className="border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/20">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-danger-500" />
                            <div>
                                <p className="text-sm font-medium text-danger-700 dark:text-danger-400">{error}</p>
                                <button
                                    onClick={fetchTasks}
                                    className="text-xs text-danger-600 dark:text-danger-400 underline mt-1 hover:no-underline"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Card padding="sm" className="text-center">
                        <p className="text-2xl font-bold text-velvet-900 dark:text-surface-100">{stats.total}</p>
                        <p className="text-xs text-surface-500">{t('totalTasks')}</p>
                    </Card>
                    <Card padding="sm" className="text-center bg-primary-50 dark:bg-primary-900/20">
                        <p className="text-2xl font-bold text-primary-600">{stats.todo}</p>
                        <p className="text-xs text-surface-500">{t('todo')}</p>
                    </Card>
                    <Card padding="sm" className="text-center bg-gold-50 dark:bg-gold-900/20">
                        <p className="text-2xl font-bold text-gold-600">{stats.inProgress}</p>
                        <p className="text-xs text-surface-500">{t('inProgress')}</p>
                    </Card>
                    <Card padding="sm" className="text-center bg-razzmatazz-50 dark:bg-razzmatazz-900/20">
                        <p className="text-2xl font-bold text-razzmatazz-600">{stats.done}</p>
                        <p className="text-xs text-surface-500">{t('done')}</p>
                    </Card>
                </div>

                {/* Progress Bar */}
                <Card>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-velvet-900 dark:text-surface-100">{t('overallProgress')}</span>
                        <span className="text-sm text-surface-500">
                            {stats.total > 0
                                ? t('completedCount', { done: stats.done, total: stats.total })
                                : '0/0 completed'
                            }
                        </span>
                    </div>
                    <ProgressBar value={stats.done} max={stats.total || 1} variant="primary" />
                </Card>

                {/* Add Task Form */}
                {showAddForm && (
                    <Card variant="primary">
                        <div className="space-y-4">
                            <Input
                                label={t('taskTitleLabel')}
                                placeholder={t('taskTitlePlaceholder')}
                                value={newTask.title}
                                onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Select
                                    label={t('categoryLabel')}
                                    value={newTask.category}
                                    onChange={e => setNewTask(prev => ({ ...prev, category: e.target.value as Exclude<TaskCategory, 'all'> }))}
                                    options={Object.entries(CATEGORY_CONFIG).map(([k, v]) => ({ value: k, label: t(v.key as any) }))}
                                />
                                <Input
                                    label={t('dueDateLabel')}
                                    type="date"
                                    value={newTask.dueDate}
                                    onChange={e => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                                />
                            </div>
                            <Textarea
                                label={t('descriptionLabel')}
                                placeholder={t('descriptionPlaceholder')}
                                value={newTask.description}
                                onChange={e => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                                rows={2}
                            />
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setShowAddForm(false)} size="sm">
                                    {t('cancel')}
                                </Button>
                                <Button onClick={handleAddTask} size="sm" disabled={!newTask.title.trim() || saving}>
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                            {t('addSharedTask')}
                                        </>
                                    ) : (
                                        t('addSharedTask')
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
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
                                {t(cat.labelKey as any)}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-surface-400">{t('statusLabel')}</span>
                        <Select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value as TaskStatus | 'all')}
                            options={[
                                { value: 'all', label: t('all') },
                                { value: 'todo', label: t('todo') },
                                { value: 'in_progress', label: t('inProgress') },
                                { value: 'done', label: t('done') },
                            ]}
                        />
                    </div>
                </div>

                {/* Task List */}
                <Card padding="none">
                    <div className="divide-y divide-surface-200 dark:divide-velvet-700">
                        {filteredTasks.length === 0 ? (
                            <div className="py-12">
                                <EmptyState
                                    icon={<CheckSquare className="w-12 h-12" />}
                                    title={t('noTasksFound')}
                                    description={t('noTasksFoundDesc')}
                                />
                            </div>
                        ) : (
                            <div className="p-4 space-y-3">
                                {filteredTasks.map(task => (
                                    <TaskRow
                                        key={task.id}
                                        task={task}
                                        onStatusChange={handleStatusChange}
                                        onDelete={handleDelete}
                                        t={t}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </AuthenticatedShell>
    );
}
