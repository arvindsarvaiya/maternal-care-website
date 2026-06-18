'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { useAuth } from '@/components/auth-provider';
import { Card, Button, Input, Textarea, Select, Badge, EmptyState } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
    ChevronLeft,
    FileText,
    Plus,
    Search,
    Edit3,
    Trash2,
    Eye,
    Clock,
    Calendar,
    BookOpen,
    Save,
    X,
} from 'lucide-react';

// ─── Types ───

interface ContentItem {
    id: string;
    title: string;
    category: 'weekly_guidance' | 'article' | 'tip' | 'faq' | 'exercise' | 'nutrition';
    status: 'published' | 'draft' | 'archived';
    author: string;
    updatedAt: string;
    views: number;
    weekNumber?: number;
}

// ─── Mock Data ───

const MOCK_CONTENT: ContentItem[] = [
    { id: '1', title: 'Week 24: Glucose Screening & Baby\'s Lungs', category: 'weekly_guidance', status: 'published', author: 'Dr. Sharma', updatedAt: '2 days ago', views: 1240, weekNumber: 24 },
    { id: '2', title: 'Week 25: Baby\'s Sense of Balance', category: 'weekly_guidance', status: 'published', author: 'Dr. Sharma', updatedAt: '2 days ago', views: 980, weekNumber: 25 },
    { id: '3', title: 'Week 26: Baby Can Hear Voices', category: 'weekly_guidance', status: 'draft', author: 'Dr. Patel', updatedAt: '5 hours ago', views: 0, weekNumber: 26 },
    { id: '4', title: 'Iron-Rich Foods for the Second Trimester', category: 'nutrition', status: 'published', author: 'Nutrition Team', updatedAt: '1 week ago', views: 3200 },
    { id: '5', title: '10 Safe Prenatal Yoga Poses', category: 'exercise', status: 'published', author: 'Wellness Team', updatedAt: '3 days ago', views: 1890 },
    { id: '6', title: 'Understanding Your Ultrasound Report', category: 'article', status: 'published', author: 'Dr. Gupta', updatedAt: '1 week ago', views: 2560 },
    { id: '7', title: 'Partner Support: What She Really Needs', category: 'tip', status: 'published', author: 'Care Team', updatedAt: '5 days ago', views: 1420 },
    { id: '8', title: 'FAQ: Managing Morning Sickness', category: 'faq', status: 'published', author: 'Dr. Sharma', updatedAt: '2 weeks ago', views: 4100 },
    { id: '9', title: 'Week 27: Third Trimester Preparation', category: 'weekly_guidance', status: 'draft', author: 'Dr. Patel', updatedAt: '1 hour ago', views: 0, weekNumber: 27 },
    { id: '10', title: 'Postpartum Nutrition Planning', category: 'nutrition', status: 'draft', author: 'Nutrition Team', updatedAt: '12 hours ago', views: 0 },
];

const CATEGORY_CONFIG: Record<string, { labelKey: string; color: 'primary' | 'razzmatazz' | 'gold' | 'wine' | 'ochre' }> = {
    weekly_guidance: { labelKey: 'admin.content.categoryWeeklyGuidance', color: 'primary' },
    article: { labelKey: 'admin.content.categoryArticle', color: 'gold' },
    tip: { labelKey: 'admin.content.categoryTip', color: 'razzmatazz' },
    faq: { labelKey: 'admin.content.categoryFAQ', color: 'wine' },
    exercise: { labelKey: 'admin.content.categoryExercise', color: 'primary' },
    nutrition: { labelKey: 'admin.content.categoryNutrition', color: 'razzmatazz' },
};

const STATUS_CONFIG: Record<string, { labelKey: string; color: 'primary' | 'gold' | 'ochre' }> = {
    published: { labelKey: 'admin.content.statusPublished', color: 'primary' },
    draft: { labelKey: 'admin.content.statusDraft', color: 'gold' },
    archived: { labelKey: 'admin.content.statusArchived', color: 'ochre' },
};

// ─── Component ───

export default function ContentEditorPage() {
    const { user } = useAuth();
    const t = useTranslations();
    const [content, setContent] = useState<ContentItem[]>(MOCK_CONTENT);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showEditor, setShowEditor] = useState(false);
    const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

    const filteredContent = content.filter(c => {
        const matchesSearch = !search || c.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const handleDelete = (id: string) => {
        setContent(prev => prev.filter(c => c.id !== id));
    };

    const handleEdit = (item: ContentItem) => {
        setEditingItem(item);
        setShowEditor(true);
    };

    const handleNew = () => {
        setEditingItem(null);
        setShowEditor(true);
    };

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
                            <h1 className="text-2xl font-display text-velvet-800 dark:text-surface-200">{t('admin.content.title')}</h1>
                            <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
                                {t('admin.content.subtitle')}
                            </p>
                        </div>
                    </div>
                    <button onClick={handleNew} className="btn-primary btn-sm flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        {t('admin.content.newContent')}
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { labelKey: 'admin.content.total', value: content.length, color: 'text-surface-700 dark:text-surface-300' },
                        { labelKey: 'admin.content.published', value: content.filter(c => c.status === 'published').length, color: 'text-primary-600' },
                        { labelKey: 'admin.content.drafts', value: content.filter(c => c.status === 'draft').length, color: 'text-gold-600' },
                        { labelKey: 'admin.content.totalViews', value: content.reduce((s, c) => s + c.views, 0).toLocaleString(), color: 'text-razzmatazz-600' },
                    ].map((stat) => (
                        <Card key={stat.labelKey}>
                            <p className="text-xs text-surface-500">{t(stat.labelKey as any)}</p>
                            <p className={`text-xl font-display mt-0.5 ${stat.color}`}>{stat.value}</p>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input
                            type="text"
                            placeholder={t('admin.content.searchContent')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-9"
                        />
                    </div>
                    <Select
                        value={categoryFilter}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryFilter(e.target.value)}
                        options={[
                            { value: 'all', label: t('admin.content.allCategories') },
                            ...Object.entries(CATEGORY_CONFIG).map(([value, config]) => ({ value, label: t(config.labelKey as any) })),
                        ]}
                        className="w-full sm:w-48"
                    />
                    <Select
                        value={statusFilter}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                        options={[
                            { value: 'all', label: t('admin.content.allStatus') },
                            { value: 'published', label: t('admin.content.statusPublished') },
                            { value: 'draft', label: t('admin.content.statusDraft') },
                            { value: 'archived', label: t('admin.content.statusArchived') },
                        ]}
                        className="w-full sm:w-40"
                    />
                </div>

                {/* Content List or Editor */}
                {showEditor ? (
                    <ContentForm
                        item={editingItem}
                        t={t}
                        onSave={(item) => {
                            if (editingItem) {
                                setContent(prev => prev.map(c => c.id === item.id ? item : c));
                            } else {
                                setContent(prev => [{ ...item, id: String(Date.now()), views: 0, updatedAt: 'Just now' }, ...prev]);
                            }
                            setShowEditor(false);
                            setEditingItem(null);
                        }}
                        onCancel={() => {
                            setShowEditor(false);
                            setEditingItem(null);
                        }}
                    />
                ) : (
                    <Card padding="none">
                        {filteredContent.length === 0 ? (
                            <EmptyState
                                icon={<FileText className="w-10 h-10" />}
                                title={t('admin.content.noContent')}
                                description={t('admin.content.noContentDesc')}
                                action={<button onClick={handleNew} className="btn-primary btn-sm">{t('admin.content.createContent')}</button>}
                            />
                        ) : (
                            <div className="divide-y divide-surface-100 dark:divide-surface-800">
                                {filteredContent.map((item) => (
                                    <ContentRow
                                        key={item.id}
                                        item={item}
                                        t={t}
                                        onEdit={() => handleEdit(item)}
                                        onDelete={() => handleDelete(item.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </Card>
                )}
            </div>
        </AuthenticatedShell>
    );
}

// ─── Content Row ───

function ContentRow({
    item,
    onEdit,
    onDelete,
    t,
}: {
    item: ContentItem;
    onEdit: () => void;
    onDelete: () => void;
    t: ReturnType<typeof import('next-intl').useTranslations<string>>;
}) {
    const catConfig = CATEGORY_CONFIG[item.category];
    const statusConfig = STATUS_CONFIG[item.status];

    return (
        <div className="flex items-center gap-4 p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-velvet-800 dark:text-surface-200 truncate">
                        {item.title}
                    </p>
                    {item.weekNumber && (
                        <span className="text-[10px] bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 rounded-full font-medium">
                            {t('admin.content.week')} {item.weekNumber}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                    <Badge variant={catConfig.color}>{t(catConfig.labelKey as any)}</Badge>
                    <Badge variant={statusConfig.color}>{t(statusConfig.labelKey as any)}</Badge>
                    <span className="text-[11px] text-surface-400 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.views.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-surface-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.updatedAt}
                    </span>
                    <span className="text-[11px] text-surface-400">{t('admin.content.by')} {item.author}</span>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={onEdit}
                    className="p-2 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    title={t('admin.content.edit')}
                >
                    <Edit3 className="w-4 h-4" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                    title={t('admin.content.delete')}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ─── Content Form ───

function ContentForm({
    item,
    onSave,
    onCancel,
    t,
}: {
    item: ContentItem | null;
    onSave: (item: ContentItem) => void;
    onCancel: () => void;
    t: ReturnType<typeof import('next-intl').useTranslations<string>>;
}) {
    const [title, setTitle] = useState(item?.title || '');
    const [category, setCategory] = useState(item?.category || 'weekly_guidance');
    const [status, setStatus] = useState(item?.status || 'draft');
    const [weekNumber, setWeekNumber] = useState(item?.weekNumber?.toString() || '');
    const [body, setBody] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: item?.id || '',
            title,
            category: category as ContentItem['category'],
            status: status as ContentItem['status'],
            author: 'Admin',
            updatedAt: 'Just now',
            views: item?.views || 0,
            weekNumber: weekNumber ? parseInt(weekNumber) : undefined,
        });
    };

    return (
        <Card variant="calm">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-display text-velvet-800 dark:text-surface-200">
                        {item ? t('admin.content.editContent') : t('admin.content.newContentTitle')}
                    </h2>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                    >
                        <X className="w-5 h-5 text-surface-400" />
                    </button>
                </div>

                <Input
                    label={t('admin.content.title')}
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    placeholder={t('admin.content.titlePlaceholder')}
                    required
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Select
                        label={t('admin.content.category')}
                        value={category}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value as typeof category)}
                        options={Object.entries(CATEGORY_CONFIG).map(([value, config]) => ({ value, label: t(config.labelKey as any) }))}
                    />
                    <Select
                        label={t('admin.content.status')}
                        value={status}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as typeof status)}
                        options={[
                            { value: 'draft', label: t('admin.content.statusDraft') },
                            { value: 'published', label: t('admin.content.statusPublished') },
                            { value: 'archived', label: t('admin.content.statusArchived') },
                        ]}
                    />
                    {category === 'weekly_guidance' && (
                        <Input
                            label={t('admin.content.weekNumber')}
                            value={weekNumber}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeekNumber(e.target.value)}
                            placeholder={t('admin.content.weekNumberPlaceholder')}
                            type="number"
                        />
                    )}
                </div>

                <Textarea
                    label={t('admin.content.contentBody')}
                    value={body}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
                    placeholder={t('admin.content.contentBodyPlaceholder')}
                    rows={12}
                />

                <div className="flex items-center gap-3 justify-end pt-2">
                    <button type="button" onClick={onCancel} className="btn-secondary btn-sm">
                        {t('admin.content.cancel')}
                    </button>
                    <button type="submit" className="btn-primary btn-sm flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        {item ? t('admin.content.update') : t('admin.content.create')}
                    </button>
                </div>
            </form>
        </Card>
    );
}