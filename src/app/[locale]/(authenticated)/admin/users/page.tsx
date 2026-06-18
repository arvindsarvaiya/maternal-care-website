'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { useAuth } from '@/components/auth-provider';
import { Card, Button, Input, Select, Badge, EmptyState } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
    ChevronLeft,
    Users,
    Search,
    Shield,
    UserCheck,
    UserX,
    Eye,
    MoreHorizontal,
    Mail,
    Calendar,
    Clock,
    Filter,
} from 'lucide-react';

// ─── Types ───

interface UserRecord {
    id: string;
    name: string;
    email: string;
    roles: string[];
    status: 'active' | 'inactive' | 'suspended';
    pregnancyWeek?: number;
    joinedAt: string;
    lastActive: string;
    symptomsLogged: number;
    appointmentsBooked: number;
    chatSessions: number;
    emergencyFlags: number;
}

// ─── Mock Data ───

const MOCK_USERS: UserRecord[] = [
    { id: '1', name: 'Priya Sharma', email: 'priya@example.com', roles: ['mother'], status: 'active', pregnancyWeek: 24, joinedAt: 'Jan 2026', lastActive: '5 min ago', symptomsLogged: 87, appointmentsBooked: 6, chatSessions: 42, emergencyFlags: 0 },
    { id: '2', name: 'Rahul Sharma', email: 'rahul@example.com', roles: ['partner'], status: 'active', joinedAt: 'Jan 2026', lastActive: '1 hour ago', symptomsLogged: 0, appointmentsBooked: 2, chatSessions: 18, emergencyFlags: 0 },
    { id: '3', name: 'Anita Desai', email: 'anita@example.com', roles: ['mother'], status: 'active', pregnancyWeek: 31, joinedAt: 'Dec 2025', lastActive: '30 min ago', symptomsLogged: 124, appointmentsBooked: 9, chatSessions: 67, emergencyFlags: 1 },
    { id: '4', name: 'Vikram Patel', email: 'vikram@example.com', roles: ['partner'], status: 'inactive', joinedAt: 'Feb 2026', lastActive: '5 days ago', symptomsLogged: 0, appointmentsBooked: 0, chatSessions: 3, emergencyFlags: 0 },
    { id: '5', name: 'Meera Joshi', email: 'meera@example.com', roles: ['mother', 'caregiver'], status: 'active', pregnancyWeek: 18, joinedAt: 'Mar 2026', lastActive: '2 hours ago', symptomsLogged: 45, appointmentsBooked: 4, chatSessions: 28, emergencyFlags: 0 },
    { id: '6', name: 'Suresh Kumar', email: 'suresh@example.com', roles: ['partner'], status: 'active', joinedAt: 'Mar 2026', lastActive: '3 hours ago', symptomsLogged: 0, appointmentsBooked: 1, chatSessions: 12, emergencyFlags: 0 },
    { id: '7', name: 'Dr. Neha Gupta', email: 'drneha@example.com', roles: ['admin'], status: 'active', joinedAt: 'Nov 2025', lastActive: '10 min ago', symptomsLogged: 0, appointmentsBooked: 0, chatSessions: 5, emergencyFlags: 0 },
    { id: '8', name: 'Lakshmi Nair', email: 'lakshmi@example.com', roles: ['mother'], status: 'suspended', pregnancyWeek: 12, joinedAt: 'Apr 2026', lastActive: '3 days ago', symptomsLogged: 12, appointmentsBooked: 1, chatSessions: 8, emergencyFlags: 2 },
    { id: '9', name: 'Arjun Reddy', email: 'arjun@example.com', roles: ['partner'], status: 'active', joinedAt: 'Feb 2026', lastActive: '1 day ago', symptomsLogged: 0, appointmentsBooked: 3, chatSessions: 15, emergencyFlags: 0 },
    { id: '10', name: 'Kavita Iyer', email: 'kavita@example.com', roles: ['mother'], status: 'active', pregnancyWeek: 36, joinedAt: 'Oct 2025', lastActive: '1 hour ago', symptomsLogged: 203, appointmentsBooked: 12, chatSessions: 94, emergencyFlags: 0 },
];

const ROLE_CONFIG: Record<string, { labelKey: string; color: 'primary' | 'razzmatazz' | 'gold' | 'wine' | 'danger' }> = {
    mother: { labelKey: 'admin.users.roleMother', color: 'razzmatazz' },
    partner: { labelKey: 'admin.users.rolePartner', color: 'gold' },
    caregiver: { labelKey: 'admin.users.roleCaregiver', color: 'primary' },
    family: { labelKey: 'admin.users.roleFamily', color: 'primary' },
    admin: { labelKey: 'admin.users.roleAdmin', color: 'danger' },
};

const STATUS_CONFIG: Record<string, { labelKey: string; color: 'primary' | 'gold' | 'danger' }> = {
    active: { labelKey: 'admin.users.statusActive', color: 'primary' },
    inactive: { labelKey: 'admin.users.statusInactive', color: 'gold' },
    suspended: { labelKey: 'admin.users.statusSuspended', color: 'danger' },
};

// ─── Component ───

export default function UserOverviewPage() {
    const { user } = useAuth();
    const [users] = useState<UserRecord[]>(MOCK_USERS);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
    const t = useTranslations();

    const filteredUsers = users.filter(u => {
        const matchesSearch = !search ||
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.roles.includes(roleFilter);
        const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const activeCount = users.filter(u => u.status === 'active').length;
    const mothersCount = users.filter(u => u.roles.includes('mother')).length;
    const partnersCount = users.filter(u => u.roles.includes('partner')).length;
    const flaggedCount = users.filter(u => u.emergencyFlags > 0).length;

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
                            <h1 className="text-2xl font-display text-velvet-800 dark:text-surface-200">{t('admin.users.title')}</h1>
                            <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
                                {t('admin.users.subtitle')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { labelKey: 'admin.users.totalUsers', value: users.length, icon: Users, color: 'text-surface-700' },
                        { labelKey: 'admin.users.active', value: activeCount, icon: UserCheck, color: 'text-primary-600' },
                        { labelKey: 'admin.users.mothers', value: mothersCount, icon: Shield, color: 'text-razzmatazz-600' },
                        { labelKey: 'admin.users.flagged', value: flaggedCount, icon: UserX, color: flaggedCount > 0 ? 'text-danger-600' : 'text-surface-400' },
                    ].map((stat) => (
                        <Card key={stat.labelKey}>
                            <div className="flex items-center gap-2">
                                <stat.icon className={cn('w-4 h-4', stat.color)} />
                                <p className="text-xs text-surface-500">{t(stat.labelKey as any)}</p>
                            </div>
                            <p className={cn('text-xl font-display mt-1', stat.color)}>{stat.value}</p>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input
                            type="text"
                            placeholder={t('admin.users.searchPlaceholder')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-9"
                        />
                    </div>
                    <Select
                        value={roleFilter}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRoleFilter(e.target.value)}
                        options={[
                            { value: 'all', label: t('admin.users.allRoles') },
                            ...Object.entries(ROLE_CONFIG).map(([value, config]) => ({ value, label: t(config.labelKey as any) })),
                        ]}
                        className="w-full sm:w-40"
                    />
                    <Select
                        value={statusFilter}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                        options={[
                            { value: 'all', label: t('admin.users.allStatus') },
                            { value: 'active', label: t('admin.users.statusActive') },
                            { value: 'inactive', label: t('admin.users.statusInactive') },
                            { value: 'suspended', label: t('admin.users.statusSuspended') },
                        ]}
                        className="w-full sm:w-40"
                    />
                </div>

                {/* Users Table */}
                <Card padding="none">
                    {filteredUsers.length === 0 ? (
                        <EmptyState
                            icon={<Users className="w-10 h-10" />}
                            title={t('admin.users.noUsers')}
                            description={t('admin.users.noUsersDesc')}
                        />
                    ) : (
                        <div className="divide-y divide-surface-100 dark:divide-surface-800">
                            {filteredUsers.map((u) => {
                                const statusConfig = STATUS_CONFIG[u.status];
                                return (
                                    <div
                                        key={u.id}
                                        className="flex items-center gap-4 p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                                    >
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-medium text-surface-600 dark:text-surface-400">
                                                {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </span>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-sm font-medium text-velvet-800 dark:text-surface-200">
                                                    {u.name}
                                                </p>
                                                <Badge variant={statusConfig.color}>{t(statusConfig.labelKey as any)}</Badge>
                                                {u.emergencyFlags > 0 && (
                                                    <Badge variant="danger">⚠ {u.emergencyFlags}</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[11px] text-surface-400 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {u.email}
                                                </span>
                                                <span className="text-[11px] text-surface-400 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {t('admin.users.joined')} {u.joinedAt}
                                                </span>
                                                <span className="text-[11px] text-surface-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {u.lastActive}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                {u.roles.map(role => {
                                                    const rc = ROLE_CONFIG[role];
                                                    return rc ? (
                                                        <Badge key={role} variant={rc.color}>{t(rc.labelKey as any)}</Badge>
                                                    ) : null;
                                                })}
                                                {u.pregnancyWeek && (
                                                    <span className="text-[10px] text-primary-600 dark:text-primary-400 font-medium">
                                                        {t('admin.users.week')} {u.pregnancyWeek}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                                            <div className="text-center">
                                                <p className="text-xs font-medium text-surface-700 dark:text-surface-300">{u.symptomsLogged}</p>
                                                <p className="text-[10px] text-surface-400">{t('admin.users.symptoms')}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-medium text-surface-700 dark:text-surface-300">{u.appointmentsBooked}</p>
                                                <p className="text-[10px] text-surface-400">{t('admin.users.appointments')}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-medium text-surface-700 dark:text-surface-300">{u.chatSessions}</p>
                                                <p className="text-[10px] text-surface-400">{t('admin.users.chats')}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <button
                                            onClick={() => setSelectedUser(selectedUser?.id === u.id ? null : u)}
                                            className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors flex-shrink-0"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>

                {/* Selected User Detail */}
                {selectedUser && (
                    <Card variant="calm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-velvet-800 dark:text-surface-200">
                                {t('admin.users.userDetails', { name: selectedUser.name })}
                            </h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="text-xs text-surface-400 hover:text-surface-600"
                            >
                                {t('admin.users.close')}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { labelKey: 'admin.users.symptomsLogged', value: selectedUser.symptomsLogged },
                                { labelKey: 'admin.users.appointmentsBooked', value: selectedUser.appointmentsBooked },
                                { labelKey: 'admin.users.chatSessions', value: selectedUser.chatSessions },
                                { labelKey: 'admin.users.emergencyFlags', value: selectedUser.emergencyFlags, color: selectedUser.emergencyFlags > 0 ? 'text-danger-600' : '' },
                            ].map(stat => (
                                <div key={stat.labelKey} className="text-center p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
                                    <p className={cn('text-lg font-display', stat.color || 'text-surface-700 dark:text-surface-200')}>{stat.value}</p>
                                    <p className="text-[10px] text-surface-400">{t(stat.labelKey as any)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-surface-100 dark:border-surface-700">
                            <button className="btn-secondary btn-sm">{t('admin.users.editRoles')}</button>
                            <button className="btn-secondary btn-sm text-danger-600 hover:bg-danger-50">
                                {selectedUser.status === 'active' ? t('admin.users.suspend') : t('admin.users.activate')}
                            </button>
                            <button className="btn-secondary btn-sm">{t('admin.users.viewActivity')}</button>
                        </div>
                    </Card>
                )}
            </div>
        </AuthenticatedShell>
    );
}