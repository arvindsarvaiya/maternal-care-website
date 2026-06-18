'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/components/auth-provider';
import { api } from '@/lib/api-client';
import { Bell, X } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

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

interface PopupNotification {
    id: string;
    title: string;
    message: string;
    type: string;
    actionUrl?: string;
    timestamp: string;
}

interface NotificationContextType {
    unreadCount: number;
    popups: PopupNotification[];
    dismissPopup: (id: string) => void;
    browserPermission: NotificationPermission;
    requestBrowserPermission: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
    unreadCount: 0,
    popups: [],
    dismissPopup: () => { },
    browserPermission: 'default',
    requestBrowserPermission: async () => { },
});

export function useNotifications() {
    return useContext(NotificationContext);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapPopup(api: ApiNotification): PopupNotification {
    const payload = api.payload || {};
    return {
        id: api.id,
        title: (payload.title as string) || api.type.replace(/_/g, ' '),
        message: (payload.message as string) || (payload.body as string) || '',
        type: api.type,
        actionUrl: payload.actionUrl as string | undefined,
        timestamp: api.createdAt || api.scheduledFor,
    };
}

function getCategoryIcon(type: string): string {
    switch (type) {
        case 'appointment': return '📅';
        case 'medication': return '💊';
        case 'weekly_update': return '📖';
        case 'partner_activity': return '💑';
        case 'rule_triggered': return '⚠️';
        case 'system': return '⚙️';
        default: return '🔔';
    }
}

// ─── Toast Component ──────────────────────────────────────────────────────────

const TOAST_DURATION_MS = 12_000; // 12 seconds — enough time to read

function NotificationToast({ popup, onDismiss, isActive }: { popup: PopupNotification; onDismiss: () => void; isActive: boolean }) {
    const [visible, setVisible] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!isActive) return;

        // Trigger enter animation
        requestAnimationFrame(() => setVisible(true));

        // Auto-dismiss after TOAST_DURATION
        timerRef.current = setTimeout(() => handleDismiss(), TOAST_DURATION_MS);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive]);

    const handleDismiss = () => {
        if (leaving) return; // prevent double-dismiss
        setLeaving(true);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setTimeout(() => onDismiss(), 400);
    };

    const icon = getCategoryIcon(popup.type);

    const handleClick = () => {
        if (popup.actionUrl) {
            window.location.href = popup.actionUrl;
        } else {
            window.location.href = '/notifications';
        }
        handleDismiss();
    };

    return (
        <div
            onClick={handleClick}
            className={`
                max-w-sm w-full bg-white dark:bg-velvet-800 rounded-xl shadow-elevated border border-surface-200 
                dark:border-velvet-700 cursor-pointer overflow-hidden
                transition-all duration-400 ease-out
                ${visible && !leaving
                    ? 'translate-y-0 opacity-100 scale-100'
                    : 'translate-y-4 opacity-0 scale-95'
                }
            `}
            role="alert"
        >
            <div className="p-4">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-lg">
                        {icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                            <p className="text-sm font-semibold text-velvet-900 dark:text-surface-100 truncate">
                                {popup.title}
                            </p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDismiss();
                                }}
                                className="flex-shrink-0 p-1 rounded-md text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-velvet-700 transition-colors"
                                aria-label="Dismiss"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 leading-relaxed">
                            {popup.message}
                        </p>
                        <p className="text-[10px] text-surface-400 mt-1.5">
                            {new Date(popup.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress bar for auto-dismiss */}
            {isActive && (
                <div className="h-0.5 bg-surface-100 dark:bg-velvet-700">
                    <div
                        className="h-full bg-gradient-to-r from-primary-400 to-razzmatazz-400 animate-shrink-width"
                        style={{ animationDuration: `${TOAST_DURATION_MS}ms` }}
                    />
                </div>
            )}
        </div>
    );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [activePopup, setActivePopup] = useState<PopupNotification | null>(null);
    const [queue, setQueue] = useState<PopupNotification[]>([]);
    const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default');
    const seenIds = useRef<Set<string>>(new Set());
    const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Browser Notification Permission ──

    const requestBrowserPermission = useCallback(async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) return;
        const perm = await Notification.requestPermission();
        setBrowserPermission(perm);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setBrowserPermission(Notification.permission);
        }
    }, []);

    // ── Show browser notification ──

    const showBrowserNotification = useCallback((popup: PopupNotification) => {
        if (typeof window === 'undefined' || !('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;

        const icon = getCategoryIcon(popup.type);
        try {
            const notif = new Notification(`${icon} ${popup.title}`, {
                body: popup.message,
                icon: '/favicon.ico',
                tag: popup.id,
                requireInteraction: false,
            });

            notif.onclick = () => {
                window.focus();
                if (popup.actionUrl) {
                    window.location.href = popup.actionUrl;
                } else {
                    window.location.href = '/notifications';
                }
                notif.close();
            };

            // Auto-close after 12 seconds
            setTimeout(() => notif.close(), 12_000);
        } catch {
            // Browser notification failed silently
        }
    }, []);

    // ── Advance queue: show next popup when current one dismisses ──

    const advanceQueue = useCallback(() => {
        setQueue(prev => {
            if (prev.length === 0) {
                setActivePopup(null);
                return prev;
            }
            const [next, ...rest] = prev;
            setActivePopup(next);
            return rest;
        });
    }, []);

    // ── Dismiss current active popup ──

    const dismissPopup = useCallback(async (id: string) => {
        setActivePopup(prev => {
            if (prev && prev.id === id) {
                // Trigger advance after a brief delay (exit animation)
                setTimeout(() => advanceQueue(), 50);
                return null;
            }
            return prev;
        });

        // Mark notification as read in database to prevent re-showing
        try {
            await api.patch('/notifications', { ids: [id] });
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    }, [advanceQueue]);

    // ── Poll for new notifications ──

    const pollNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const data = await api.get<{ notifications: ApiNotification[] }>('/notifications?status=unread&limit=50');
            const notifications = data.notifications || [];

            // Update unread count
            setUnreadCount(notifications.length);

            // Find new notifications (not seen before)
            const newPopups: PopupNotification[] = [];
            for (const apiNotif of notifications) {
                if (!seenIds.current.has(apiNotif.id)) {
                    seenIds.current.add(apiNotif.id);
                    const popup = mapPopup(apiNotif);
                    newPopups.push(popup);
                }
            }

            if (newPopups.length > 0) {
                // Enqueue new popups
                setQueue(prev => [...prev, ...newPopups]);

                // If no active popup, start showing the first one
                setActivePopup(prev => {
                    if (prev === null && newPopups.length > 0) {
                        // The first new popup becomes active; rest go to queue
                        const [first, ...rest] = newPopups;
                        setQueue(prevQueue => [...rest, ...prevQueue]);
                        return first;
                    }
                    return prev;
                });

                // Show browser notifications for all new ones
                newPopups.forEach(popup => {
                    showBrowserNotification(popup);
                });
            }
        } catch {
            // Polling failed silently
        }
    }, [user, showBrowserNotification]);

    // Start polling when user is authenticated
    useEffect(() => {
        if (authLoading || !user) return;

        // Initial poll
        pollNotifications();

        // Poll every 30 seconds
        pollInterval.current = setInterval(pollNotifications, 30_000);

        return () => {
            if (pollInterval.current) {
                clearInterval(pollInterval.current);
                pollInterval.current = null;
            }
        };
    }, [authLoading, user, pollNotifications]);

    // ── Context value ──

    const value = React.useMemo(() => ({
        unreadCount,
        popups: activePopup ? [activePopup] : [], // keep compat; only expose the active one
        dismissPopup,
        browserPermission,
        requestBrowserPermission,
    }), [unreadCount, activePopup, dismissPopup, browserPermission, requestBrowserPermission]);

    return (
        <NotificationContext.Provider value={value}>
            {children}

            {/* Toast Container — fixed position bottom-right, one at a time */}
            {activePopup && (
                <div className="fixed bottom-4 right-4 z-[100] pointer-events-none">
                    <div className="pointer-events-auto">
                        <NotificationToast
                            popup={activePopup}
                            onDismiss={() => dismissPopup(activePopup.id)}
                            isActive={true}
                        />
                    </div>
                </div>
            )}

            {/* Permission request banner */}
            {browserPermission === 'default' && typeof window !== 'undefined' && 'Notification' in window && (
                <div className="fixed bottom-4 left-4 z-[99] max-w-xs bg-white dark:bg-velvet-800 rounded-xl shadow-elevated border border-primary-200 dark:border-primary-700 p-4 animate-slide-up">
                    <div className="flex items-start gap-3">
                        <Bell className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-velvet-900 dark:text-surface-100 mb-1">
                                Enable notifications
                            </p>
                            <p className="text-xs text-surface-500 dark:text-surface-400 mb-3">
                                Get instant alerts for appointments, medications, and partner updates.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={requestBrowserPermission}
                                    className="px-3 py-1.5 text-xs font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                                >
                                    Enable
                                </button>
                                <button
                                    onClick={() => setBrowserPermission('denied')}
                                    className="px-3 py-1.5 text-xs font-medium text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 rounded-lg hover:bg-surface-100 dark:hover:bg-velvet-700 transition-colors"
                                >
                                    Not now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
}