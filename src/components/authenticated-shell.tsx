'use client';

import React from 'react';
import { LocaleLink as Link } from '@/i18n/locale-link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/auth-provider';
import { useNotifications } from '@/components/notification-provider';
import { LanguageSelector } from '@/components/language-selector';
import { cn } from '@/lib/utils';
import { apiFetch } from '@/lib/api-client';
import {
    Home,
    Heart,
    Users,
    Calendar,
    MessageCircle,
    ClipboardList,
    BookOpen,
    Bell,
    Settings,
    LogOut,
    Activity,
    Stethoscope,
    ShieldAlert,
    ChevronLeft,
    ChevronRight,
    Baby,
    Sparkles,
    FlaskConical,
    UtensilsCrossed,
    Dumbbell,
    Timer,
} from 'lucide-react';

// ─── Navigation Items ───

interface NavItem {
    labelKey: string;
    href: string;
    icon: React.ElementType;
    roles: string[];
    phases?: ('pregnancy' | 'postpartum')[]; // undefined = shown in all phases
    badge?: string;
}

function useNavItems(): NavItem[] {
    const n = useTranslations('nav');
    return React.useMemo(() => [
        // Mother — shown in both pregnancy & postpartum
        { labelKey: 'myDashboard', href: '/mother', icon: Heart, roles: ['mother'], phases: ['pregnancy', 'postpartum'] },
        { labelKey: 'weeklyJourney', href: '/weekly-journey', icon: BookOpen, roles: ['mother'], phases: ['pregnancy', 'postpartum'] },
        { labelKey: 'mealPlanner', href: '/meal-planner', icon: UtensilsCrossed, roles: ['mother'], phases: ['pregnancy', 'postpartum'] },
        { labelKey: 'symptomLog', href: '/symptoms', icon: Activity, roles: ['mother'], phases: ['pregnancy', 'postpartum'] },
        { labelKey: 'wellness', href: '/wellness', icon: Sparkles, roles: ['mother'], phases: ['pregnancy', 'postpartum'] },
        { labelKey: 'appointments', href: '/appointments', icon: Calendar, roles: ['mother', 'partner'], phases: ['pregnancy', 'postpartum'] },
        { labelKey: 'vaccinations', href: '/vaccinations', icon: ShieldAlert, roles: ['mother'], phases: ['pregnancy', 'postpartum'] },
        { labelKey: 'taskBoard', href: '/shared/tasks', icon: ClipboardList, roles: ['mother'], phases: ['pregnancy', 'postpartum'] },
        // Mother — postpartum only
        { labelKey: 'postpartumRecovery', href: '/postpartum-recovery', icon: Timer, roles: ['mother'], phases: ['postpartum'] },
        { labelKey: 'babyTracker', href: '/baby-tracker', icon: Baby, roles: ['mother'], phases: ['postpartum'] },
        { labelKey: 'pelvicFloor', href: '/pelvic-floor', icon: Dumbbell, roles: ['mother'], phases: ['postpartum'] },
        // Partner
        { labelKey: 'supportActions', href: '/partner/tasks', icon: ClipboardList, roles: ['partner'] },
        // Shared
        { labelKey: 'sharedSpace', href: '/shared', icon: Users, roles: ['mother', 'partner', 'caregiver', 'family'] },
        { labelKey: 'chatAssistant', href: '/chat', icon: MessageCircle, roles: ['mother', 'partner', 'caregiver', 'family'] },
        { labelKey: 'notifications', href: '/notifications', icon: Bell, roles: ['mother', 'partner', 'caregiver', 'family'] },
        { labelKey: 'settings', href: '/settings', icon: Settings, roles: ['mother', 'partner', 'caregiver', 'family'] },
        // Admin
        { labelKey: 'adminDashboard', href: '/admin', icon: FlaskConical, roles: ['admin'] },
        { labelKey: 'contentEditor', href: '/admin/content', icon: BookOpen, roles: ['admin'] },
        { labelKey: 'ruleEngine', href: '/admin/rules', icon: Settings, roles: ['admin'] },
        { labelKey: 'userOverview', href: '/admin/users', icon: Users, roles: ['admin'] },
        { labelKey: 'auditLog', href: '/admin/audit', icon: ClipboardList, roles: ['admin'] },
    ] as NavItem[], []); // eslint-disable-line react-hooks/exhaustive-deps
}

// ─── Sidebar ───

export function AuthenticatedShell({ children }: { children: React.ReactNode }) {
    const { user, isMother, isPartner, isAdmin, isPostpartum: authIsPostpartum, logout } = useAuth();
    const { unreadCount } = useNotifications();
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [detectedPhase, setDetectedPhase] = React.useState<'pregnancy' | 'postpartum' | null>(null);
    const n = useTranslations('nav');
    const navItems = useNavItems();

    // Fetch pregnancy profile to detect actual phase (authoritative source)
    // Auth context's isPostpartum only checks roles, not the profile's phase field
    React.useEffect(() => {
        if (!user?.id || !isMother) return;
        let cancelled = false;
        apiFetch<{ phase?: string }>('/profile/pregnancy')
            .then(data => {
                if (!cancelled && data?.phase) {
                    setDetectedPhase(data.phase as 'pregnancy' | 'postpartum');
                }
            })
            .catch(() => {
                // Profile not found or error — fall back to auth-based detection
                if (!cancelled) {
                    setDetectedPhase(authIsPostpartum ? 'postpartum' : 'pregnancy');
                }
            });
        return () => { cancelled = true; };
    }, [user?.id, isMother, authIsPostpartum]);

    const userRoles = user?.roles || [];
    // Use API-detected phase first, fall back to auth context for new postpartum-role users
    const isPostpartum = detectedPhase === 'postpartum' || (detectedPhase === null && authIsPostpartum);
    const userPhase: 'pregnancy' | 'postpartum' | undefined = isPostpartum ? 'postpartum' : isMother ? 'pregnancy' : undefined;
    const filteredNav = navItems.filter(item => {
        // Must match a role
        const roleMatch = item.roles.some(r => userRoles.includes(r));
        if (!roleMatch) return false;
        // If item has phases restriction, must match current phase
        if (item.phases && userPhase) {
            return item.phases.includes(userPhase);
        }
        return true;
    });

    const getGreeting = () => {
        if (isMother) {
            if (isPostpartum) return n('postpartumRecovery') || 'Postpartum Recovery';
            return n('motherDashboard');
        }
        if (isPartner) return n('partnerDashboard');
        if (isAdmin) return n('adminPanel');
        return n('dashboard');
    };

    // Determine the active nav item — prefer the longest matching href so that
    // nested routes (e.g. /shared/tasks) don't also highlight their parent (/shared).
    const activeHref = filteredNav
        .filter(item => pathname === item.href || pathname.startsWith(item.href + '/'))
        .sort((a, b) => b.href.length - a.href.length)[0]?.href;

    const navContent = (
        <div className="flex flex-col h-full">
            {/* Logo with mandala motif */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-surface-200 dark:border-velvet-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-razzmatazz-500 flex items-center justify-center flex-shrink-0 shadow-glow">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" opacity="0.6" />
                        <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="1.5" opacity="0.8" />
                        <circle cx="12" cy="12" r="2" fill="white" />
                        <line x1="12" y1="2" x2="12" y2="7" stroke="white" strokeWidth="1" opacity="0.7" />
                        <line x1="12" y1="17" x2="12" y2="22" stroke="white" strokeWidth="1" opacity="0.7" />
                        <line x1="2" y1="12" x2="7" y2="12" stroke="white" strokeWidth="1" opacity="0.7" />
                        <line x1="17" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1" opacity="0.7" />
                        <line x1="5" y1="5" x2="8.5" y2="8.5" stroke="white" strokeWidth="1" opacity="0.5" />
                        <line x1="15.5" y1="15.5" x2="19" y2="19" stroke="white" strokeWidth="1" opacity="0.5" />
                        <line x1="19" y1="5" x2="15.5" y2="8.5" stroke="white" strokeWidth="1" opacity="0.5" />
                        <line x1="8.5" y1="15.5" x2="5" y2="19" stroke="white" strokeWidth="1" opacity="0.5" />
                    </svg>
                </div>
                {!collapsed && (
                    <span className="font-display text-lg text-gradient-mandala whitespace-nowrap font-semibold">
                        MaternalCare
                    </span>
                )}
            </div>

            {/* Nav Links */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
                {filteredNav.map((item) => {
                    const isActive = item.href === activeHref;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative',
                                isActive
                                    ? 'bg-gradient-to-r from-primary-50 to-razzmatazz-50 text-primary-700 dark:from-primary-900/30 dark:to-razzmatazz-900/20 dark:text-primary-300 shadow-soft'
                                    : 'text-surface-600 hover:text-velvet-800 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-200 dark:hover:bg-velvet-800/50'
                            )}
                            onClick={() => setMobileOpen(false)}
                        >
                            {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-primary-500 to-razzmatazz-500" />
                            )}
                            <Icon className={cn(
                                'w-5 h-5 flex-shrink-0',
                                isActive
                                    ? 'text-primary-600 dark:text-primary-400'
                                    : 'text-surface-400 dark:text-surface-500 group-hover:text-velvet-600'
                            )} />
                            {!collapsed && (
                                <span className="whitespace-nowrap">{n(item.labelKey as any)}</span>
                            )}
                            {item.labelKey === 'notifications' && unreadCount > 0 && (
                                <span className={cn(
                                    'ml-auto bg-razzmatazz-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full font-bold',
                                    collapsed && 'absolute -top-1 -right-1 min-w-[18px] h-[18px] text-[10px]'
                                )}>
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Language Selector */}
            <div className="px-3 py-2 border-t border-surface-200 dark:border-velvet-800">
                <LanguageSelector />
            </div>

            {/* User & Logout */}
            <div className="border-t border-surface-200 dark:border-velvet-800 px-3 py-4">
                {!collapsed && user && (
                    <div className="mb-3 px-3">
                        <p className="text-sm font-medium text-velvet-800 dark:text-surface-200 truncate">
                            {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-surface-500 dark:text-surface-400 truncate capitalize">
                            {user.roles.join(' · ')}
                        </p>
                    </div>
                )}
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-surface-500 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span>{n('signOut')}</span>}
                </button>
            </div>

            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex items-center justify-center h-10 border-t border-surface-200 dark:border-velvet-800 text-surface-400 hover:text-primary-500 transition-colors"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
        </div>
    );

    return (
        <div className="h-screen overflow-hidden bg-surface-50 dark:bg-velvet-950 flex">
            {/* Background mandala pattern */}
            <div className="fixed inset-0 mandala-pattern-dots pointer-events-none z-0" />

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    'hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0 bg-white/90 dark:bg-velvet-900/90 backdrop-blur-md border-r border-surface-200 dark:border-velvet-800 transition-all duration-300 relative z-10',
                    collapsed ? 'w-[72px]' : 'w-[260px]'
                )}
            >
                {navContent}
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute left-0 top-0 h-full w-[280px] bg-white dark:bg-velvet-900 border-r border-surface-200 dark:border-velvet-800 z-50 shadow-elevated animate-slide-up">
                        {navContent}
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-y-auto">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 glass-panel rounded-none border-b border-surface-200/50 dark:border-velvet-800/50 px-4 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-velvet-600 hover:text-velvet-800 rounded-lg"
                            aria-label="Open menu"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-lg font-display text-gradient-mandala">
                                {getGreeting()}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/chat"
                            className="p-2 text-surface-500 hover:text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors relative"
                        >
                            <MessageCircle className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/notifications"
                            className="p-2 text-surface-500 hover:text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors relative"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-razzmatazz-500 text-white text-[10px] font-bold rounded-full px-1 shadow-glow">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </Link>
                        {user && (
                            <Link href={user.roles?.includes('partner') ? '/profile/father' : '/profile'} className="hidden sm:flex items-center gap-2 text-sm text-velvet-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-razzmatazz-400 flex items-center justify-center shadow-glow">
                                    <span className="text-xs font-medium text-white">
                                        {user.firstName[0]}{user.lastName[0]}
                                    </span>
                                </div>
                            </Link>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 px-4 lg:px-8 py-6">
                    {children}
                </main>
            </div>
        </div>
    );
}