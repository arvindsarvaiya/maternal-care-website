'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { useAuth } from '@/components/auth-provider';
import { api } from '@/lib/api-client';
import {
    Card,
    Badge,
    Button,
    Input,
    Textarea,
    Select,
    EmptyState,
} from '@/components/ui';
import {
    ArrowLeft,
    Plus,
    StickyNote,
    Trash2,
    Search,
    Filter,
    User,
    Clock,
    Globe,
    Loader2,
    AlertCircle,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type NoteCategory = 'journal' | 'questions' | 'milestones' | 'tips' | 'preparation' | 'all';
type Visibility = 'partner' | 'shared' | 'private';

interface SharedNote {
    id: string;
    title: string;
    content: string;
    category: Exclude<NoteCategory, 'all'>;
    author: 'mother' | 'partner';
    visibility: Visibility;
    createdAt: string;
    updatedAt: string;
}

// ─── API Types ────────────────────────────────────────────────────────────────

interface ApiCreatedBy {
    id: string;
    firstName: string;
    lastName: string;
}

interface ApiNote {
    id: string;
    title: string;
    body: string;
    visibility: string;
    createdBy: ApiCreatedBy;
    createdAt: string;
    updatedAt: string;
}

interface NotesApiResponse {
    notes: ApiNote[];
    total: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<Exclude<NoteCategory, 'all'>, { variant: 'primary' | 'gold' | 'razzmatazz' | 'wine' | 'ochre'; key: string }> = {
    journal: { variant: 'primary', key: 'journal' },
    questions: { variant: 'razzmatazz', key: 'questions' },
    milestones: { variant: 'gold', key: 'milestones' },
    tips: { variant: 'primary', key: 'tips' },
    preparation: { variant: 'wine', key: 'preparation' },
};

const VISIBILITY_CONFIG: Record<Visibility, { icon: React.ElementType; color: string; key: string }> = {
    partner: { icon: User, color: 'text-gold-500', key: 'partnerOnly' },
    shared: { icon: Globe, color: 'text-primary-500', key: 'sharedVisibility' },
    private: { icon: User, color: 'text-surface-400', key: 'privateVisibility' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapApiNote(apiNote: ApiNote, currentUserId: string): SharedNote {
    return {
        id: apiNote.id,
        title: apiNote.title,
        content: apiNote.body || '',
        category: 'journal' as Exclude<NoteCategory, 'all'>,
        author: apiNote.createdBy?.id === currentUserId ? 'mother' : 'partner',
        visibility: (apiNote.visibility || 'shared') as Visibility,
        createdAt: apiNote.createdAt,
        updatedAt: apiNote.updatedAt,
    };
}

// ─── Components ──────────────────────────────────────────────────────────────

function NoteCard({ note, onDelete, deleting, t }: { note: SharedNote; onDelete: (id: string) => void; deleting: boolean; t: ReturnType<typeof import('next-intl').useTranslations<string>> }) {
    const cat = CATEGORY_CONFIG[note.category] || CATEGORY_CONFIG.journal;
    const vis = VISIBILITY_CONFIG[note.visibility] || VISIBILITY_CONFIG.shared;
    const VisIcon = vis.icon;

    return (
        <div className="p-5 rounded-xl border transition-all hover:shadow-soft bg-white dark:bg-velvet-900 border-surface-200 dark:border-velvet-700">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={cat.variant}>{t(cat.key as any)}</Badge>
                    <span className={`flex items-center gap-1 text-xs ${vis.color}`}>
                        <VisIcon className="w-3 h-3" />
                        {t(vis.key as any)}
                    </span>
                </div>
                <button
                    onClick={() => onDelete(note.id)}
                    disabled={deleting}
                    className="text-surface-400 hover:text-danger-500 transition-colors disabled:opacity-50"
                >
                    {deleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Trash2 className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Content */}
            <h3 className="font-semibold text-velvet-900 dark:text-surface-100 mb-2">
                {note.title}
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-3 whitespace-pre-line mb-3">
                {note.content}
            </p>

            {/* Footer */}
            <div className="flex items-center gap-3 text-xs text-surface-400">
                <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
            ${note.author === 'mother'
                            ? 'bg-primary-100 dark:bg-primary-800 text-primary-600'
                            : 'bg-gold-100 dark:bg-gold-800 text-gold-600'
                        }`}
                    >
                        {note.author === 'mother' ? 'M' : 'P'}
                    </div>
                    {note.author === 'mother' ? t('mom') : t('partner')}
                </div>
                <Clock className="w-3 h-3" />
                <span>
                    {new Date(note.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
            </div>
        </div>
    );
}

function NotesSkeleton() {
    return (
        <div className="space-y-6">
            {/* Stats skeleton */}
            <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                    <Card key={i} padding="sm" className="text-center">
                        <div className="space-y-2">
                            <div className="h-8 bg-surface-200 dark:bg-velvet-700 rounded animate-pulse w-12 mx-auto" />
                            <div className="h-3 bg-surface-200 dark:bg-velvet-700 rounded animate-pulse w-16 mx-auto" />
                        </div>
                    </Card>
                ))}
            </div>
            {/* Notes grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-5 rounded-xl border border-surface-200 dark:border-velvet-700 space-y-3">
                        <div className="flex gap-2">
                            <div className="h-4 w-14 bg-surface-200 dark:bg-velvet-700 rounded-full animate-pulse" />
                            <div className="h-4 w-16 bg-surface-200 dark:bg-velvet-700 rounded-full animate-pulse" />
                        </div>
                        <div className="h-5 bg-surface-200 dark:bg-velvet-700 rounded animate-pulse w-2/3" />
                        <div className="space-y-1.5">
                            <div className="h-3 bg-surface-100 dark:bg-velvet-800 rounded animate-pulse" />
                            <div className="h-3 bg-surface-100 dark:bg-velvet-800 rounded animate-pulse w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SharedNotesPage() {
    const t = useTranslations('shared');
    const { user } = useAuth();
    const [notes, setNotes] = useState<SharedNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<NoteCategory>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [newNote, setNewNote] = useState({
        title: '',
        content: '',
        visibility: 'shared' as Visibility,
    });

    // ── Fetch notes ──
    const fetchNotes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.get<NotesApiResponse>('/notes');
            const mapped = (data.notes || []).map(apiNote =>
                mapApiNote(apiNote, user?.id || '')
            );
            setNotes(mapped);
        } catch (err: any) {
            console.error('Failed to fetch notes:', err);
            setError(err.message || 'Failed to load notes');
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    // ── Filters ──
    const filteredNotes = notes.filter(n => {
        if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                n.title.toLowerCase().includes(q) ||
                n.content.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const sortedNotes = [...filteredNotes].sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    // ── Add note ──
    const handleAddNote = async () => {
        if (!newNote.title.trim() || !newNote.content.trim()) return;
        setSaving(true);
        try {
            await api.post('/notes', {
                title: newNote.title.trim(),
                body: newNote.content.trim(),
                visibility: newNote.visibility,
            });
            setNewNote({ title: '', content: '', visibility: 'shared' });
            setShowAddForm(false);
            await fetchNotes();
        } catch (err) {
            console.error('Failed to create note:', err);
        } finally {
            setSaving(false);
        }
    };

    // ── Delete note ──
    const handleDelete = useCallback(async (id: string) => {
        setDeletingId(id);
        try {
            await api.delete(`/notes/${id}`);
            setNotes(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error('Failed to delete note:', err);
        } finally {
            setDeletingId(null);
        }
    }, []);

    const categoryFilters: { key: NoteCategory; labelKey: string }[] = [
        { key: 'all', labelKey: 'all' },
        { key: 'journal', labelKey: 'journal' },
        { key: 'questions', labelKey: 'questions' },
        { key: 'milestones', labelKey: 'milestones' },
        { key: 'tips', labelKey: 'tips' },
        { key: 'preparation', labelKey: 'preparation' },
    ];

    const stats = {
        total: notes.length,
        shared: notes.filter(n => n.visibility === 'shared').length,
        partner: notes.filter(n => n.visibility === 'partner').length,
    };

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
                            {t('notesBack')}
                        </Link>
                        <h1 className="text-2xl lg:text-3xl font-display font-bold text-velvet-900 dark:text-surface-100">
                            {t('notesTitle')}
                        </h1>
                    </div>
                    <NotesSkeleton />
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
                            {t('notesBack')}
                        </Link>
                        <h1 className="text-2xl lg:text-3xl font-display font-bold text-velvet-900 dark:text-surface-100">
                            {t('notesTitle')}
                        </h1>
                        <p className="text-surface-500 dark:text-surface-400 mt-1">
                            {t('notesSubtitle')}
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {t('newNote')}
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
                                    onClick={fetchNotes}
                                    className="text-xs text-danger-600 dark:text-danger-400 underline mt-1 hover:no-underline"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <Card padding="sm" className="text-center">
                        <p className="text-2xl font-bold text-primary-600">{stats.total}</p>
                        <p className="text-xs text-surface-500">{t('totalNotes')}</p>
                    </Card>
                    <Card padding="sm" className="text-center">
                        <p className="text-2xl font-bold text-gold-600">{stats.shared}</p>
                        <p className="text-xs text-surface-500">{t('sharedVisibility')}</p>
                    </Card>
                    <Card padding="sm" className="text-center">
                        <p className="text-2xl font-bold text-primary-600">{stats.partner}</p>
                        <p className="text-xs text-surface-500">{t('partner')}</p>
                    </Card>
                </div>

                {/* Add Note Form */}
                {showAddForm && (
                    <Card variant="primary">
                        <div className="space-y-4">
                            <Input
                                label={t('titleLabel')}
                                placeholder={t('noteTitlePlaceholder')}
                                value={newNote.title}
                                onChange={e => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                            />
                            <Textarea
                                label={t('contentLabel')}
                                placeholder={t('noteContentPlaceholder')}
                                value={newNote.content}
                                onChange={e => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                                rows={4}
                            />
                            <Select
                                label={t('visibilityLabel')}
                                value={newNote.visibility}
                                onChange={e => setNewNote(prev => ({ ...prev, visibility: e.target.value as Visibility }))}
                                options={[
                                    { value: 'shared', label: t('sharedVisibility') },
                                    { value: 'partner', label: t('partnerOnly') },
                                    { value: 'private', label: t('privateVisibility') },
                                ]}
                            />
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setShowAddForm(false)} size="sm">
                                    {t('cancel')}
                                </Button>
                                <Button onClick={handleAddNote} size="sm" disabled={!newNote.title.trim() || saving}>
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                            {t('saveNote')}
                                        </>
                                    ) : (
                                        t('saveNote')
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Filters & Search */}
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
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input
                            type="text"
                            placeholder={t('searchNotes')}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm border border-surface-200 dark:border-velvet-700 bg-white dark:bg-velvet-900 text-velvet-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                        />
                    </div>
                </div>

                {/* Notes Grid */}
                {sortedNotes.length === 0 ? (
                    <EmptyState
                        icon={<StickyNote className="w-12 h-12" />}
                        title={t('noNotesFound')}
                        description={t('noNotesFoundDesc')}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sortedNotes.map(note => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onDelete={handleDelete}
                                deleting={deletingId === note.id}
                                t={t}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedShell>
    );
}
