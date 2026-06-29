'use client';

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { Badge, Card, ProgressBar } from '@/components/ui';
import { api } from '@/lib/api-client';
import {
    Baby,
    Camera,
    Check,
    Edit3,
    Gift,
    Heart,
    ImagePlus,
    Loader2,
    MessageSquare,
    Plus,
    Sparkles,
    Trash2,
    Trophy,
    X,
} from 'lucide-react';

interface BabyNameOption {
    id: string;
    name: string;
    meaning: string;
    votes: number;
    liked: boolean;
    createdBy: {
        id: string;
        firstName: string;
        lastName: string;
    };
}

interface BabyNamesResponse {
    names: BabyNameOption[];
}

interface WishlistItem {
    id: string;
    title: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    done: boolean;
    createdBy: {
        id: string;
        firstName: string;
        lastName: string;
    };
}

interface WishlistResponse {
    items: WishlistItem[];
}

interface MemoryItem {
    id: string;
    title: string;
    caption: string;
    imageData: string | null;
    imageMimeType: string | null;
    createdAt: string;
    createdBy: {
        id: string;
        firstName: string;
        lastName: string;
    };
}

interface MemoriesResponse {
    memories: MemoryItem[];
}

interface SharedNote {
    id: string;
    title: string;
    body: string;
    visibility: 'private' | 'shared' | 'partner';
    createdAt: string;
    updatedAt: string;
    createdBy: {
        id: string;
        firstName: string;
        lastName: string;
    };
}

interface NotesResponse {
    notes: SharedNote[];
}

const MAX_MEMORY_IMAGE_WIDTH = 1000;
const MAX_MEMORY_IMAGE_HEIGHT = 1000;
const MEMORY_IMAGE_QUALITY = 0.72;

async function compressMemoryImage(file: File): Promise<{ imageData: string; imageMimeType: string }> {
    const imageUrl = URL.createObjectURL(file);

    try {
        const image = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = imageUrl;
        });

        const scale = Math.min(MAX_MEMORY_IMAGE_WIDTH / image.width, MAX_MEMORY_IMAGE_HEIGHT / image.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext('2d');
        if (!context) throw new Error('Could not compress image');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        return {
            imageData: canvas.toDataURL('image/jpeg', MEMORY_IMAGE_QUALITY),
            imageMimeType: 'image/jpeg',
        };
    } finally {
        URL.revokeObjectURL(imageUrl);
    }
}

export default function SharedSpacePage() {
    const t = useTranslations('shared');
    const [names, setNames] = useState<BabyNameOption[]>([]);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [memories, setMemories] = useState<MemoryItem[]>([]);
    const [memoryTitle, setMemoryTitle] = useState('');
    const [memoryCaption, setMemoryCaption] = useState('');
    const [memoryImageData, setMemoryImageData] = useState<string | null>(null);
    const [memoryImageMimeType, setMemoryImageMimeType] = useState<string | null>(null);
    const [memoryImageName, setMemoryImageName] = useState('');
    const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
    const [removeCurrentMemoryImage, setRemoveCurrentMemoryImage] = useState(false);
    const [newName, setNewName] = useState('');
    const [newMeaning, setNewMeaning] = useState('');
    const [newWishlistTitle, setNewWishlistTitle] = useState('');
    const [newWishlistCategory, setNewWishlistCategory] = useState('');
    const [newWishlistPriority, setNewWishlistPriority] = useState<'high' | 'medium' | 'low'>('medium');
    const [namesLoading, setNamesLoading] = useState(true);
    const [namesSaving, setNamesSaving] = useState(false);
    const [namesError, setNamesError] = useState<string | null>(null);
    const [wishlistLoading, setWishlistLoading] = useState(true);
    const [wishlistSaving, setWishlistSaving] = useState(false);
    const [wishlistError, setWishlistError] = useState<string | null>(null);
    const [memoriesLoading, setMemoriesLoading] = useState(true);
    const [memorySaving, setMemorySaving] = useState(false);
    const [memoryCompressing, setMemoryCompressing] = useState(false);
    const [memoryError, setMemoryError] = useState<string | null>(null);
    const [notes, setNotes] = useState<SharedNote[]>([]);
    const [notesLoading, setNotesLoading] = useState(true);
    const [notesError, setNotesError] = useState<string | null>(null);
    const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

    /**
     * Fetches data with a single retry on 401.
     *
     * On the very first render, a child component's useEffect can fire
     * before the AuthProvider's useEffect has registered the token
     * getter, causing a spurious 401.  Waiting 300ms and retrying once
     * gives the auth provider time to initialise, after which the
     * request succeeds.
     */
    const fetchWithAuthRetry = useCallback(async <T,>(path: string): Promise<T> => {
        try {
            return await api.get<T>(path);
        } catch (err: any) {
            if (err?.status === 401) {
                await new Promise(resolve => setTimeout(resolve, 300));
                return api.get<T>(path);
            }
            throw err;
        }
    }, []);

    const fetchNames = useCallback(async () => {
        try {
            setNamesError(null);
            const data = await fetchWithAuthRetry<BabyNamesResponse>('/shared/baby-names');
            setNames(data.names || []);
        } catch {
            setNamesError(t('nameLoadError'));
        } finally {
            setNamesLoading(false);
        }
    }, [t, fetchWithAuthRetry]);

    const fetchWishlist = useCallback(async () => {
        try {
            setWishlistError(null);
            const data = await fetchWithAuthRetry<WishlistResponse>('/shared/baby-wishlist');
            setWishlist(data.items || []);
        } catch {
            setWishlistError(t('wishlistLoadError'));
        } finally {
            setWishlistLoading(false);
        }
    }, [t, fetchWithAuthRetry]);

    const fetchMemories = useCallback(async () => {
        try {
            setMemoryError(null);
            const data = await fetchWithAuthRetry<MemoriesResponse>('/shared/memories');
            setMemories(data.memories || []);
        } catch {
            setMemoryError(t('memoryLoadError'));
        } finally {
            setMemoriesLoading(false);
        }
    }, [t, fetchWithAuthRetry]);

    const fetchNotes = useCallback(async () => {
        try {
            setNotesError(null);
            const data = await fetchWithAuthRetry<NotesResponse>('/notes');
            setNotes((data.notes || []).filter(note => note.visibility !== 'private'));
        } catch {
            setNotesError('Could not load shared notes. Please try again.');
        } finally {
            setNotesLoading(false);
        }
    }, [fetchWithAuthRetry]);

    useEffect(() => {
        fetchNames();
        fetchWishlist();
        fetchMemories();
        fetchNotes();
    }, [fetchNames, fetchWishlist, fetchMemories, fetchNotes]);

    const completedWishlist = wishlist.filter(item => item.done).length;
    const likedNames = names.filter(name => name.liked).length;
    const totalVotes = names.reduce((sum, name) => sum + name.votes, 0);
    const wishlistProgress = wishlist.length > 0 ? Math.round((completedWishlist / wishlist.length) * 100) : 0;
    const memoryProgress = Math.min(memories.length * 25, 100);
    const nameProgress = Math.min(likedNames * 25, 100);

    const overallProgress = useMemo(() => {
        return Math.round((wishlistProgress + memoryProgress + nameProgress) / 3);
    }, [wishlistProgress, memoryProgress, nameProgress]);

    const topName = useMemo(() => {
        return names.length > 0 ? [...names].sort((a, b) => b.votes - a.votes)[0] : null;
    }, [names]);

    const resetMemoryForm = () => {
        setMemoryTitle('');
        setMemoryCaption('');
        setMemoryImageData(null);
        setMemoryImageMimeType(null);
        setMemoryImageName('');
        setEditingMemoryId(null);
        setRemoveCurrentMemoryImage(false);
    };

    const handleAddName = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!newName.trim()) return;

        try {
            setNamesSaving(true);
            setNamesError(null);
            const data = await api.post<BabyNamesResponse>('/shared/baby-names', {
                name: newName.trim(),
                meaning: newMeaning.trim(),
            });
            setNames(data.names || []);
            setNewName('');
            setNewMeaning('');
        } catch {
            setNamesError(t('nameSaveError'));
        } finally {
            setNamesSaving(false);
        }
    };

    const toggleName = async (id: string) => {
        const previousNames = names;
        setNames(prev => prev.map(name => {
            if (name.id !== id) return name;
            return {
                ...name,
                liked: !name.liked,
                votes: Math.max(0, name.votes + (name.liked ? -1 : 1)),
            };
        }));

        try {
            setNamesError(null);
            await api.patch(`/shared/baby-names/${id}`);
            await fetchNames();
        } catch {
            setNames(previousNames);
            setNamesError(t('nameSaveError'));
        }
    };

    const deleteName = async (id: string) => {
        const previousNames = names;
        setNames(prev => prev.filter(name => name.id !== id));

        try {
            setNamesError(null);
            await api.delete(`/shared/baby-names/${id}`);
        } catch {
            setNames(previousNames);
            setNamesError(t('nameDeleteError'));
        }
    };

    const handleAddWishlistItem = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!newWishlistTitle.trim()) return;

        try {
            setWishlistSaving(true);
            setWishlistError(null);
            const data = await api.post<WishlistResponse>('/shared/baby-wishlist', {
                title: newWishlistTitle.trim(),
                category: newWishlistCategory.trim(),
                priority: newWishlistPriority,
            });
            setWishlist(data.items || []);
            setNewWishlistTitle('');
            setNewWishlistCategory('');
            setNewWishlistPriority('medium');
        } catch {
            setWishlistError(t('wishlistSaveError'));
        } finally {
            setWishlistSaving(false);
        }
    };

    const toggleWishlist = async (id: string) => {
        const previousWishlist = wishlist;
        setWishlist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));

        try {
            setWishlistError(null);
            await api.patch(`/shared/baby-wishlist/${id}`);
            await fetchWishlist();
        } catch {
            setWishlist(previousWishlist);
            setWishlistError(t('wishlistSaveError'));
        }
    };

    const deleteWishlistItem = async (id: string) => {
        const previousWishlist = wishlist;
        setWishlist(prev => prev.filter(item => item.id !== id));

        try {
            setWishlistError(null);
            await api.delete(`/shared/baby-wishlist/${id}`);
        } catch {
            setWishlist(previousWishlist);
            setWishlistError(t('wishlistDeleteError'));
        }
    };

    const handleMemoryImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setMemoryCompressing(true);
            setMemoryError(null);
            const compressed = await compressMemoryImage(file);
            setMemoryImageData(compressed.imageData);
            setMemoryImageMimeType(compressed.imageMimeType);
            setMemoryImageName(file.name);
            setRemoveCurrentMemoryImage(false);
        } catch {
            setMemoryError(t('memoryImageError'));
        } finally {
            setMemoryCompressing(false);
            event.target.value = '';
        }
    };

    const handleSaveMemory = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!memoryTitle.trim() && !memoryCaption.trim() && !memoryImageData && !editingMemoryId) return;
        if (!memoryTitle.trim() && !memoryCaption.trim() && !memoryImageData && editingMemoryId && !removeCurrentMemoryImage) return;

        try {
            setMemorySaving(true);
            setMemoryError(null);
            const payload = {
                title: memoryTitle.trim(),
                caption: memoryCaption.trim(),
                imageData: memoryImageData,
                imageMimeType: memoryImageMimeType,
                removeImage: removeCurrentMemoryImage,
            };

            if (editingMemoryId) {
                await api.patch(`/shared/memories/${editingMemoryId}`, payload);
                await fetchMemories();
            } else {
                const data = await api.post<MemoriesResponse>('/shared/memories', payload);
                setMemories(data.memories || []);
            }
            resetMemoryForm();
        } catch {
            setMemoryError(t('memorySaveError'));
        } finally {
            setMemorySaving(false);
        }
    };

    const editMemory = (memory: MemoryItem) => {
        setEditingMemoryId(memory.id);
        setMemoryTitle(memory.title);
        setMemoryCaption(memory.caption);
        setMemoryImageData(null);
        setMemoryImageMimeType(null);
        setMemoryImageName('');
        setRemoveCurrentMemoryImage(false);
    };

    const deleteMemory = async (id: string) => {
        const previousMemories = memories;
        setMemories(prev => prev.filter(memory => memory.id !== id));

        try {
            setMemoryError(null);
            await api.delete(`/shared/memories/${id}`);
            if (editingMemoryId === id) resetMemoryForm();
        } catch {
            setMemories(previousMemories);
            setMemoryError(t('memoryDeleteError'));
        }
    };

    const deleteNote = async (id: string) => {
        const previousNotes = notes;
        setDeletingNoteId(id);
        setNotes(prev => prev.filter(note => note.id !== id));

        try {
            setNotesError(null);
            await api.delete(`/notes/${id}`);
        } catch {
            setNotes(previousNotes);
            setNotesError('Could not delete this shared note. Please try again.');
        } finally {
            setDeletingNoteId(null);
        }
    };

    return (
        <AuthenticatedShell>
            <div className="max-w-6xl mx-auto space-y-6">
                <Card className="overflow-hidden bg-gradient-to-br from-primary-50 via-white to-razzmatazz-50 dark:from-primary-900/20 dark:via-velvet-900 dark:to-razzmatazz-900/20 border-primary-100 dark:border-primary-800">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
                        <div className="max-w-2xl">
                            <Badge variant="razzmatazz" className="mb-3">{t('familyHub')}</Badge>
                            <h1 className="text-3xl lg:text-4xl font-display font-bold text-velvet-900 dark:text-surface-100">
                                {t('title')}
                            </h1>
                            <p className="text-surface-600 dark:text-surface-300 mt-3 leading-relaxed">
                                {t('subtitle')}
                            </p>
                        </div>
                        <div className="w-full lg:w-72 rounded-3xl bg-white/80 dark:bg-velvet-900/70 border border-white dark:border-velvet-700 p-5 shadow-soft">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-razzmatazz-100 dark:bg-razzmatazz-900/40 flex items-center justify-center">
                                    <Trophy className="w-6 h-6 text-razzmatazz-600 dark:text-razzmatazz-300" />
                                </div>
                                <div>
                                    <p className="text-sm text-surface-500 dark:text-surface-400">{t('overallProgress')}</p>
                                    <p className="text-2xl font-display font-bold text-velvet-900 dark:text-surface-100">{overallProgress}%</p>
                                </div>
                            </div>
                            <ProgressBar value={overallProgress} max={100} variant="accent" showLabel size="md" />
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card padding="sm" className="bg-white dark:bg-velvet-900">
                        <div className="flex items-center gap-3">
                            <Baby className="w-8 h-8 text-primary-500" />
                            <div>
                                <p className="text-2xl font-bold text-velvet-900 dark:text-surface-100">{likedNames}</p>
                                <p className="text-xs text-surface-500 dark:text-surface-400">{t('favoriteNames')}</p>
                            </div>
                        </div>
                    </Card>
                    <Card padding="sm" className="bg-white dark:bg-velvet-900">
                        <div className="flex items-center gap-3">
                            <Gift className="w-8 h-8 text-gold-500" />
                            <div>
                                <p className="text-2xl font-bold text-velvet-900 dark:text-surface-100">{completedWishlist}/{wishlist.length}</p>
                                <p className="text-xs text-surface-500 dark:text-surface-400">{t('wishlistReady')}</p>
                            </div>
                        </div>
                    </Card>
                    <Card padding="sm" className="bg-white dark:bg-velvet-900">
                        <div className="flex items-center gap-3">
                            <Camera className="w-8 h-8 text-razzmatazz-500" />
                            <div>
                                <p className="text-2xl font-bold text-velvet-900 dark:text-surface-100">{memories.length}</p>
                                <p className="text-xs text-surface-500 dark:text-surface-400">{t('memoriesSaved')}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card>
                    <div className="flex items-start justify-between gap-4 mb-5">
                        <div>
                            <h2 className="text-xl font-display font-bold text-velvet-900 dark:text-surface-100 flex items-center gap-2">
                                <ImagePlus className="w-5 h-5 text-razzmatazz-500" />
                                {t('memoryWall')}
                            </h2>
                            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{t('memoryWallDesc')}</p>
                        </div>
                        <Badge variant="razzmatazz">{memoryProgress}%</Badge>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
                        <form onSubmit={handleSaveMemory} className="rounded-2xl border border-dashed border-razzmatazz-300 dark:border-razzmatazz-700 bg-razzmatazz-50/60 dark:bg-razzmatazz-900/10 p-4">
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <p className="text-sm font-semibold text-velvet-900 dark:text-surface-100">{editingMemoryId ? t('updateMemory') : t('addMemory')}</p>
                                {editingMemoryId && (
                                    <button type="button" onClick={resetMemoryForm} className="text-xs text-surface-500 hover:text-danger-500 flex items-center gap-1">
                                        <X className="w-3 h-3" />
                                        {t('cancelEdit')}
                                    </button>
                                )}
                            </div>
                            <input
                                value={memoryTitle}
                                onChange={(event) => setMemoryTitle(event.target.value)}
                                placeholder={t('memoryTitlePlaceholder')}
                                className="w-full rounded-xl border border-surface-200 dark:border-velvet-700 bg-white dark:bg-velvet-900 px-3 py-2 text-sm text-velvet-900 dark:text-surface-100 mb-3"
                            />
                            <textarea
                                value={memoryCaption}
                                onChange={(event) => setMemoryCaption(event.target.value)}
                                placeholder={t('memoryCaptionPlaceholder')}
                                className="w-full rounded-xl border border-surface-200 dark:border-velvet-700 bg-white dark:bg-velvet-900 px-3 py-2 text-sm text-velvet-900 dark:text-surface-100 mb-3 min-h-[96px] resize-none"
                            />
                            <label className="btn-secondary w-full justify-center cursor-pointer flex items-center gap-2 mb-3">
                                {memoryCompressing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                                {memoryCompressing ? t('compressingImage') : t('chooseMemoryImage')}
                                <input type="file" accept="image/*" className="hidden" onChange={handleMemoryImageChange} disabled={memoryCompressing || memorySaving} />
                            </label>
                            {memoryImageName && <p className="text-xs text-success-600 dark:text-success-400 mb-3">{t('imageReady', { name: memoryImageName })}</p>}
                            {editingMemoryId && memories.find(memory => memory.id === editingMemoryId)?.imageData && !removeCurrentMemoryImage && (
                                <button type="button" onClick={() => setRemoveCurrentMemoryImage(true)} className="text-xs text-danger-500 hover:text-danger-600 mb-3">
                                    {t('removeCurrentImage')}
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={memorySaving || memoryCompressing || (!memoryTitle.trim() && !memoryCaption.trim() && !memoryImageData && !editingMemoryId)}
                                className="btn-primary w-full justify-center flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {memorySaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                {editingMemoryId ? t('saveMemoryUpdate') : t('saveMemory')}
                            </button>
                            <p className="text-xs text-surface-500 dark:text-surface-400 mt-3">{t('uploadHint')}</p>
                        </form>

                        <div>
                            {memoryError && <p className="text-sm text-danger-600 dark:text-danger-400 mb-3">{memoryError}</p>}
                            {memoriesLoading ? (
                                <div className="flex items-center justify-center py-12 text-surface-500 dark:text-surface-400">
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    {t('loadingMemories')}
                                </div>
                            ) : memories.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-surface-300 dark:border-velvet-700 p-8 text-center">
                                    <ImagePlus className="w-9 h-9 text-razzmatazz-400 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-velvet-900 dark:text-surface-100">{t('emptyMemoriesTitle')}</p>
                                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{t('emptyMemoriesDesc')}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {memories.map(memory => (
                                        <div key={memory.id} className="rounded-2xl overflow-hidden border border-surface-200 dark:border-velvet-700 bg-white dark:bg-velvet-800/60">
                                            {memory.imageData ? (
                                                <img src={memory.imageData} alt="" className="h-40 w-full object-cover" />
                                            ) : (
                                                <div className="h-32 w-full bg-razzmatazz-50 dark:bg-razzmatazz-900/20 flex items-center justify-center">
                                                    <ImagePlus className="w-8 h-8 text-razzmatazz-300" />
                                                </div>
                                            )}
                                            <div className="p-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-velvet-900 dark:text-surface-100">{memory.title}</p>
                                                        {memory.caption && <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{memory.caption}</p>}
                                                        <p className="text-[11px] text-surface-400 dark:text-surface-500 mt-2">{t('addedBy', { name: `${memory.createdBy.firstName} ${memory.createdBy.lastName}` })}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button type="button" onClick={() => editMemory(memory)} className="text-surface-400 hover:text-primary-500" aria-label={t('editMemory')}>
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button type="button" onClick={() => deleteMemory(memory.id)} className="text-surface-400 hover:text-danger-500" aria-label={t('removeMemory')}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-start justify-between gap-4 mb-5">
                        <div>
                            <h2 className="text-xl font-display font-bold text-velvet-900 dark:text-surface-100 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary-500" />
                                Shared Notes
                            </h2>
                            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Notes shared from the mother dashboard now live in this shared space.</p>
                        </div>
                        <Badge variant="primary">{notes.length}</Badge>
                    </div>

                    {notesError && <p className="text-sm text-danger-600 dark:text-danger-400 mb-3">{notesError}</p>}

                    {notesLoading ? (
                        <div className="flex items-center justify-center py-10 text-surface-500 dark:text-surface-400">
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Loading shared notes...
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-surface-300 dark:border-velvet-700 p-8 text-center">
                            <MessageSquare className="w-9 h-9 text-primary-400 mx-auto mb-3" />
                            <p className="text-sm font-medium text-velvet-900 dark:text-surface-100">No shared notes yet</p>
                            <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">When a private mother-dashboard note is shared, it will appear here for both profiles.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {notes.map(note => (
                                <div key={note.id} className="rounded-2xl border border-surface-200 dark:border-velvet-700 bg-white dark:bg-velvet-800/60 p-4">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="min-w-0">
                                            <Badge variant={note.visibility === 'partner' ? 'razzmatazz' : 'primary'} className="mb-2">
                                                {note.visibility === 'partner' ? 'Partner visible' : 'Shared'}
                                            </Badge>
                                            <h3 className="font-semibold text-velvet-900 dark:text-surface-100 break-words">{note.title}</h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => deleteNote(note.id)}
                                            disabled={deletingNoteId === note.id}
                                            className="text-surface-400 hover:text-danger-500 disabled:opacity-60"
                                            aria-label="Delete shared note"
                                        >
                                            {deletingNoteId === note.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {note.body && <p className="text-sm text-surface-600 dark:text-surface-300 whitespace-pre-wrap break-words">{note.body}</p>}
                                    <p className="text-[11px] text-surface-400 dark:text-surface-500 mt-3">
                                        {t('addedBy', { name: `${note.createdBy.firstName} ${note.createdBy.lastName}` })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <div className="flex items-start justify-between gap-4 mb-5">
                            <div>
                                <h2 className="text-xl font-display font-bold text-velvet-900 dark:text-surface-100 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary-500" />
                                    {t('babyNamePicker')}
                                </h2>
                                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{t('babyNamePickerDesc')}</p>
                            </div>
                            <Badge variant="primary">{t('topPick')}: {topName?.name || t('noNamesYet')}</Badge>
                        </div>

                        <form onSubmit={handleAddName} className="rounded-2xl border border-primary-100 dark:border-primary-800 bg-primary-50/60 dark:bg-primary-900/10 p-4 mb-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    value={newName}
                                    onChange={(event) => setNewName(event.target.value)}
                                    placeholder={t('namePlaceholder')}
                                    className="w-full rounded-xl border border-surface-200 dark:border-velvet-700 bg-white dark:bg-velvet-900 px-3 py-2 text-sm text-velvet-900 dark:text-surface-100"
                                />
                                <input
                                    value={newMeaning}
                                    onChange={(event) => setNewMeaning(event.target.value)}
                                    placeholder={t('meaningPlaceholder')}
                                    className="w-full rounded-xl border border-surface-200 dark:border-velvet-700 bg-white dark:bg-velvet-900 px-3 py-2 text-sm text-velvet-900 dark:text-surface-100"
                                />
                            </div>
                            <button type="submit" disabled={namesSaving || !newName.trim()} className="btn-primary btn-sm mt-3 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                                {namesSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                {t('addName')}
                            </button>
                        </form>

                        {namesError && <p className="text-sm text-danger-600 dark:text-danger-400 mb-3">{namesError}</p>}

                        <div className="space-y-3">
                            {namesLoading ? (
                                <div className="flex items-center justify-center py-10 text-surface-500 dark:text-surface-400">
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    {t('loadingNames')}
                                </div>
                            ) : names.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-surface-300 dark:border-velvet-700 p-6 text-center">
                                    <Baby className="w-8 h-8 text-primary-400 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-velvet-900 dark:text-surface-100">{t('emptyNamesTitle')}</p>
                                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{t('emptyNamesDesc')}</p>
                                </div>
                            ) : (
                                names.map(name => (
                                    <div
                                        key={name.id}
                                        className="p-4 rounded-2xl border border-surface-200 dark:border-velvet-700 bg-surface-50 dark:bg-velvet-800/60"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <button type="button" onClick={() => toggleName(name.id)} className="flex-1 text-left">
                                                <p className="font-semibold text-velvet-900 dark:text-surface-100">{name.name}</p>
                                                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{name.meaning || t('noMeaningAdded')}</p>
                                                <p className="text-[11px] text-surface-400 dark:text-surface-500 mt-2">{t('addedBy', { name: `${name.createdBy.firstName} ${name.createdBy.lastName}` })}</p>
                                            </button>
                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={() => toggleName(name.id)} className="flex items-center gap-1 text-sm text-surface-500 dark:text-surface-400 hover:text-razzmatazz-500">
                                                    <Heart className={`w-5 h-5 ${name.liked ? 'fill-razzmatazz-500 text-razzmatazz-500' : 'text-surface-400'}`} />
                                                    {name.votes}
                                                </button>
                                                <button type="button" onClick={() => deleteName(name.id)} className="text-surface-400 hover:text-danger-500" aria-label={t('deleteName')}>
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <p className="text-xs text-surface-400 dark:text-surface-500 mt-4">{t('nameVotesNote', { votes: totalVotes })}</p>
                    </Card>

                    <Card>
                        <div className="flex items-start justify-between gap-4 mb-5">
                            <div>
                                <h2 className="text-xl font-display font-bold text-velvet-900 dark:text-surface-100 flex items-center gap-2">
                                    <Gift className="w-5 h-5 text-gold-500" />
                                    {t('babyWishlist')}
                                </h2>
                                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{t('babyWishlistDesc')}</p>
                            </div>
                            <Badge variant="gold">{wishlistProgress}%</Badge>
                        </div>

                        <div className="mb-5">
                            <ProgressBar value={completedWishlist} max={Math.max(wishlist.length, 1)} variant="gold" showLabel size="md" />
                        </div>

                        <form onSubmit={handleAddWishlistItem} className="rounded-2xl border border-gold-100 dark:border-gold-800 bg-gold-50/60 dark:bg-gold-900/10 p-4 mb-4">
                            <input
                                value={newWishlistTitle}
                                onChange={(event) => setNewWishlistTitle(event.target.value)}
                                placeholder={t('wishlistItemPlaceholder')}
                                className="w-full rounded-xl border border-surface-200 dark:border-velvet-700 bg-white dark:bg-velvet-900 px-3 py-2 text-sm text-velvet-900 dark:text-surface-100 mb-3"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    value={newWishlistCategory}
                                    onChange={(event) => setNewWishlistCategory(event.target.value)}
                                    placeholder={t('wishlistCategoryPlaceholder')}
                                    className="w-full rounded-xl border border-surface-200 dark:border-velvet-700 bg-white dark:bg-velvet-900 px-3 py-2 text-sm text-velvet-900 dark:text-surface-100"
                                />
                                <select
                                    value={newWishlistPriority}
                                    onChange={(event) => setNewWishlistPriority(event.target.value as 'high' | 'medium' | 'low')}
                                    className="w-full rounded-xl border border-surface-200 dark:border-velvet-700 bg-white dark:bg-velvet-900 px-3 py-2 text-sm text-velvet-900 dark:text-surface-100"
                                >
                                    <option value="high">{t('priorityHigh')}</option>
                                    <option value="medium">{t('priorityMedium')}</option>
                                    <option value="low">{t('priorityLow')}</option>
                                </select>
                            </div>
                            <button type="submit" disabled={wishlistSaving || !newWishlistTitle.trim()} className="btn-primary btn-sm mt-3 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                                {wishlistSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                {t('addWishlistItem')}
                            </button>
                        </form>

                        {wishlistError && <p className="text-sm text-danger-600 dark:text-danger-400 mb-3">{wishlistError}</p>}

                        <div className="space-y-3">
                            {wishlistLoading ? (
                                <div className="flex items-center justify-center py-10 text-surface-500 dark:text-surface-400">
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    {t('loadingWishlist')}
                                </div>
                            ) : wishlist.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-surface-300 dark:border-velvet-700 p-6 text-center">
                                    <Gift className="w-8 h-8 text-gold-400 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-velvet-900 dark:text-surface-100">{t('emptyWishlistTitle')}</p>
                                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{t('emptyWishlistDesc')}</p>
                                </div>
                            ) : (
                                wishlist.map(item => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 p-3 rounded-2xl border border-surface-200 dark:border-velvet-700 bg-white dark:bg-velvet-800/60 hover:border-gold-300 dark:hover:border-gold-600 transition-colors"
                                    >
                                        <button type="button" onClick={() => toggleWishlist(item.id)} className={`w-9 h-9 rounded-full flex items-center justify-center border ${item.done ? 'bg-success-100 border-success-200 text-success-600' : 'bg-surface-50 border-surface-200 text-surface-400'}`}>
                                            {item.done ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                        </button>
                                        <button type="button" onClick={() => toggleWishlist(item.id)} className="flex-1 min-w-0 text-left">
                                            <span className={`block text-sm font-medium ${item.done ? 'line-through text-surface-400' : 'text-velvet-900 dark:text-surface-100'}`}>
                                                {item.title}
                                            </span>
                                            <span className="text-xs text-surface-500 dark:text-surface-400">
                                                {item.category || t('uncategorizedWishlist')} · {t(`priority${item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}` as any)}
                                            </span>
                                            <span className="block text-[11px] text-surface-400 dark:text-surface-500 mt-1">{t('addedBy', { name: `${item.createdBy.firstName} ${item.createdBy.lastName}` })}</span>
                                        </button>
                                        <button type="button" onClick={() => deleteWishlistItem(item.id)} className="text-surface-400 hover:text-danger-500" aria-label={t('deleteWishlistItem')}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedShell>
    );
}
