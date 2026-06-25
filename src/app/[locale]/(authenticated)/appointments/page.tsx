'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/auth-provider';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { Card, Badge, Button, Input, Select } from '@/components/ui';
import { api } from '@/lib/api-client';
import { LocaleLink as Link } from '@/i18n/locale-link';
import {
    Calendar,
    ChevronLeft,
    Plus,
    Clock,
    MapPin,
    Stethoscope,
    Phone,
    X,
    ChevronRight,
    Bell,
    Video,
    User,
    CalendarDays,
} from 'lucide-react';

// ─── Types ───

interface Appointment {
    id: string;
    type: string;
    provider: string | null;
    date: string;
    time: string;
    location: string | null;
    status: string;
    notes: string | null;
    scheduledAt: string;
}

type FilterTab = 'all' | 'upcoming' | 'completed' | 'cancelled';

const APPOINTMENT_TYPES = [
    'Antenatal Checkup', 'Ultrasound Scan', 'Blood Test', 'Glucose Screening',
    'Nutrition Consultation', 'Vaccination', 'Physiotherapy', 'Mental Health Consultation',
    'Prenatal Class', 'Other',
];

// ─── Helper Components ───

function ModeBadge({ mode }: { mode: string }) {
    const config: Record<string, { icon: React.ElementType; label: string; color: string }> = {
        'in-person': { icon: MapPin, label: 'In-Person', color: 'text-gold-500 bg-gold-50 dark:bg-gold-900/20' },
        'video': { icon: Video, label: 'Video Call', color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' },
        'phone': { icon: Phone, label: 'Phone', color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' },
    };
    const c = config[mode] || config['in-person'];
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.color}`}>
            <c.icon className="w-3 h-3" />
            {c.label}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { label: string; variant: 'primary' | 'gold' | 'warning' }> = {
        upcoming: { label: 'Upcoming', variant: 'primary' },
        completed: { label: 'Completed', variant: 'gold' },
        cancelled: { label: 'Cancelled', variant: 'warning' },
    };
    const c = config[status] || { label: status, variant: 'primary' as const };
    return <Badge variant={c.variant}>{c.label}</Badge>;
}

// ─── Appointments Page ───

export default function AppointmentsPage() {
    const { user, getDashboardUrl } = useAuth();
    const t = useTranslations('appointments');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filter, setFilter] = useState<FilterTab>('all');
    const [dashboardUrl, setDashboardUrl] = useState<string>('/mother');

    // Fetch dashboard URL
    useEffect(() => {
        if (user?.roles) {
            getDashboardUrl(user.roles).then(setDashboardUrl);
        }
    }, [user?.roles, getDashboardUrl]);
    const [showNewForm, setShowNewForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        type: '', provider: '', date: '', time: '',
        location: '', mode: 'in-person' as 'in-person' | 'video' | 'phone',
        notes: '',
    });

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.get<{ appointments: Appointment[] }>('/appointments?limit=50');
            setAppointments(data.appointments || []);
        } catch (err) {
            console.error('Failed to fetch appointments:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleAddAppointment = async () => {
        if (!newAppointment.type || !newAppointment.date) return;
        setSaving(true);
        try {
            const scheduledAt = newAppointment.time
                ? `${newAppointment.date}T${newAppointment.time}:00`
                : newAppointment.date;
            await api.post('/appointments', {
                type: newAppointment.type,
                providerName: newAppointment.provider || undefined,
                locationText: newAppointment.location || undefined,
                scheduledAt,
                notes: newAppointment.notes || undefined,
            });
            setShowNewForm(false);
            setNewAppointment({ type: '', provider: '', date: '', time: '', location: '', mode: 'in-person', notes: '' });
            await fetchAppointments();
        } catch (err: any) {
            console.error('Failed to create appointment:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAppointment = async (id: string) => {
        try {
            await api.delete(`/appointments/${id}`);
            setAppointments(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error('Failed to delete appointment:', err);
        }
    };

    const filteredApps = appointments.filter(a => filter === 'all' || a.status === filter);
    const upcomingApps = appointments
        .filter(a => a.status === 'upcoming')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <AuthenticatedShell>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                        <Link href={dashboardUrl} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-2">
                            <ChevronLeft className="w-4 h-4" />
                            {t('backToDashboard')}
                        </Link>
                        <h2 className="text-2xl font-display text-surface-800 dark:text-surface-200">{t('title')}</h2>
                        <p className="text-sm text-surface-500 mt-1">{t('manageAppointments')}</p>
                    </div>
                    <Button onClick={() => setShowNewForm(!showNewForm)} size="sm" className="flex items-center gap-2">
                        {showNewForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {showNewForm ? t('cancel') : t('addAppointment')}
                    </Button>
                </div>

                {/* New Appointment Form */}
                {showNewForm && (
                    <Card>
                        <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-4">{t('scheduleNew')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Select
                                label={t('appointmentType')}
                                value={newAppointment.type}
                                onChange={e => setNewAppointment({ ...newAppointment, type: e.target.value })}
                                options={[{ value: '', label: t('selectType') }, ...APPOINTMENT_TYPES.map(typ => ({ value: typ, label: typ }))]}
                            />
                            <Input
                                label={t('providerName')}
                                value={newAppointment.provider}
                                onChange={e => setNewAppointment({ ...newAppointment, provider: e.target.value })}
                                placeholder={t('providerPlaceholder')}
                            />
                            <Input
                                label={t('date')}
                                type="date"
                                value={newAppointment.date}
                                onChange={e => setNewAppointment({ ...newAppointment, date: e.target.value })}
                            />
                            <Input
                                label={t('time')}
                                type="time"
                                value={newAppointment.time}
                                onChange={e => setNewAppointment({ ...newAppointment, time: e.target.value })}
                            />
                            <Input
                                label={t('location')}
                                value={newAppointment.location}
                                onChange={e => setNewAppointment({ ...newAppointment, location: e.target.value })}
                                placeholder={t('locationPlaceholder')}
                            />
                            <Select
                                label={t('mode')}
                                value={newAppointment.mode}
                                onChange={e => setNewAppointment({ ...newAppointment, mode: e.target.value as any })}
                                options={[
                                    { value: 'in-person', label: t('inPerson') },
                                    { value: 'video', label: t('videoCall') },
                                    { value: 'phone', label: t('phone') },
                                ]}
                            />
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">{t('notes')}</label>
                                <textarea
                                    className="input min-h-[60px]"
                                    value={newAppointment.notes}
                                    onChange={e => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                                    placeholder={t('notesPlaceholder')}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <Button variant="secondary" onClick={() => setShowNewForm(false)} size="sm">{t('cancel')}</Button>
                            <Button
                                size="sm"
                                onClick={handleAddAppointment}
                                disabled={saving || !newAppointment.type || !newAppointment.date}
                                className="flex items-center gap-2"
                            >
                                <Calendar className="w-4 h-4" />
                                {saving ? (t('saving') || 'Saving...') : t('schedule')}
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Filter Tabs */}
                <div className="flex gap-2 border-b border-surface-200 dark:border-surface-700 pb-1">
                    {(['all', 'upcoming', 'completed', 'cancelled'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all border-b-2 -mb-[2px] ${filter === f
                                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-surface-500 hover:text-surface-700'
                                }`}
                        >
                            {t(f)}
                        </button>
                    ))}
                </div>

                {/* Next Appointment Highlight */}
                {upcomingApps.length > 0 && filter === 'all' && (
                    <Card variant="calm" className="border-primary-200 dark:border-primary-700">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{t('nextAppointment')}</p>
                                <p className="text-xs text-surface-500">
                                    {new Date(upcomingApps[0].date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    {' · '}
                                    {Math.ceil((new Date(upcomingApps[0].date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} {t('daysAway')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white dark:bg-surface-800/50 rounded-lg">
                            <Stethoscope className="w-5 h-5 text-primary-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-medium text-surface-800 dark:text-surface-200">{upcomingApps[0].type}</p>
                                {upcomingApps[0].provider && (
                                    <p className="text-sm text-surface-600 dark:text-surface-400 mt-0.5">{upcomingApps[0].provider}</p>
                                )}
                                <div className="flex flex-wrap gap-3 mt-2 text-xs text-surface-500">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{upcomingApps[0].time}</span>
                                    {upcomingApps[0].location && (
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{upcomingApps[0].location}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Appointments List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <Card key={i}>
                                    <div className="animate-pulse flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-surface-200 dark:bg-surface-700" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/3" />
                                            <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-2/3" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : filteredApps.length === 0 ? (
                        <Card>
                            <p className="text-sm text-surface-500 text-center py-8">{t('noAppointments')}</p>
                        </Card>
                    ) : (
                        filteredApps.map(a => (
                            <Card key={a.id} className="hover:shadow-soft transition-shadow">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${a.status === 'upcoming' ? 'bg-primary-100 dark:bg-primary-800' :
                                            a.status === 'completed' ? 'bg-gold-100 dark:bg-gold-800' :
                                                'bg-surface-100 dark:bg-surface-700'
                                            }`}>
                                            <CalendarDays className={`w-5 h-5 ${a.status === 'upcoming' ? 'text-primary-600' :
                                                a.status === 'completed' ? 'text-gold-600' :
                                                    'text-surface-400'
                                                }`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-medium text-surface-800 dark:text-surface-200">{a.type}</h4>
                                                <StatusBadge status={a.status} />
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-surface-500">
                                                {a.provider && (
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        {a.provider}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(a.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {a.time}
                                                </span>
                                            </div>
                                            {a.location && (
                                                <p className="text-xs text-surface-400 mt-1 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {a.location}
                                                </p>
                                            )}
                                            {a.notes && (
                                                <p className="text-xs text-surface-400 mt-1 italic">{a.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                                        {a.status === 'upcoming' && (
                                            <button
                                                onClick={() => handleDeleteAppointment(a.id)}
                                                className="text-xs text-razzmatazz-500 hover:text-razzmatazz-600 flex items-center gap-1"
                                            >
                                                <X className="w-3 h-3" />
                                                {t('cancel') || 'Cancel'}
                                            </button>
                                        )}
                                        <button className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-surface-600 transition-colors">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AuthenticatedShell>
    );
}