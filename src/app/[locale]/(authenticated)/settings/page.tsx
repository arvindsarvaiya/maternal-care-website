'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/auth-provider';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { Card, Button, Input, Toggle, Select, Spinner } from '@/components/ui';
import { api } from '@/lib/api-client';
import Link from 'next/link';
import {
    ChevronLeft,
    User,
    Settings,
    Bell,
    Shield,
    Key,
    Smartphone,
    Mail,
    Globe,
    Moon,
    Eye,
    EyeOff,
    Lock,
    Trash2,
    Save,
    Loader2,
    Copy,
    Check,
    Users,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface SettingsData {
    id: string;
    language: { code: string; name: string } | null;
    timeZone: string;
    theme: 'light' | 'dark' | 'system';
    consentDataProcessing: boolean;
    consentNotifications: boolean;
    reminderChannels: { channel: string; enabled: boolean }[];
    updatedAt: string;
}

// ─── Settings Page ───────────────────────────────────────────────────────

export default function SettingsPage() {
    const t = useTranslations('settings');
    const tc = useTranslations('common');
    const { user, getDashboardUrl } = useAuth();

    // Settings from API
    const [settings, setSettings] = useState<SettingsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [dashboardUrl, setDashboardUrl] = useState<string>('/mother');

    // Fetch dashboard URL
    useEffect(() => {
        if (user?.roles) {
            getDashboardUrl(user.roles).then(setDashboardUrl);
        }
    }, [user?.roles, getDashboardUrl]);

    // Editable form state
    const [languageCode, setLanguageCode] = useState('en');
    const [timeZone, setTimeZone] = useState('Asia/Kolkata');
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
    const [consentDataProcessing, setConsentDataProcessing] = useState(false);
    const [consentNotifications, setConsentNotifications] = useState(false);
    const [reminderChannels, setReminderChannels] = useState<{ channel: string; enabled: boolean }[]>([]);

    // Partner Code
    const [partnerCode, setPartnerCode] = useState<string | null>(null);
    const [partnerCodeLoading, setPartnerCodeLoading] = useState(false);
    const [partnerCodeCopied, setPartnerCodeCopied] = useState(false);
    const [linkedPartner, setLinkedPartner] = useState<{ id: string; firstName: string; lastName: string } | null>(null);

    // Security
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

    // ─── Fetch settings ────────────────────────────────────────────────────

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.get<SettingsData>('/settings');
            setSettings(data);
            setLanguageCode(data.language?.code || 'en');
            setTimeZone(data.timeZone || 'Asia/Kolkata');
            setTheme(data.theme || 'light');
            setConsentDataProcessing(data.consentDataProcessing ?? false);
            setConsentNotifications(data.consentNotifications ?? false);
            setReminderChannels(data.reminderChannels || []);
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // ─── Fetch partner code (for mothers) ──────────────────────────────────
    const fetchPartnerCode = useCallback(async () => {
        if (!user?.roles.includes('mother')) return;
        setPartnerCodeLoading(true);
        try {
            const data = await api.get<{
                partnerCode: string | null;
                linked: boolean;
                partner: { id: string; firstName: string; lastName: string } | null;
            }>('/profile/partner-code');
            setPartnerCode(data.partnerCode);
            setLinkedPartner(data.partner);
        } catch (err) {
            console.error('Failed to fetch partner code:', err);
        } finally {
            setPartnerCodeLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user?.roles.includes('mother')) {
            fetchPartnerCode();
        }
    }, [user, fetchPartnerCode]);

    const handleCopyPartnerCode = async () => {
        if (!partnerCode) return;
        try {
            await navigator.clipboard.writeText(partnerCode);
            setPartnerCodeCopied(true);
            setTimeout(() => setPartnerCodeCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const input = document.createElement('input');
            input.value = partnerCode;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setPartnerCodeCopied(true);
            setTimeout(() => setPartnerCodeCopied(false), 2000);
        }
    };

    // ─── Save settings ─────────────────────────────────────────────────────

    const handleSave = async () => {
        setSaving(true);
        setSaveSuccess(false);
        try {
            const data = await api.put<SettingsData>('/settings', {
                languageCode,
                timeZone,
                theme,
                consentDataProcessing,
                consentNotifications,
                reminderChannels,
            });
            setSettings(data);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        } catch (err) {
            console.error('Failed to save settings:', err);
        } finally {
            setSaving(false);
        }
    };

    // ─── Helper: toggle a reminder channel ─────────────────────────────────

    const toggleChannel = (channel: string, enabled: boolean) => {
        setReminderChannels(prev => {
            const existing = prev.find(c => c.channel === channel);
            if (existing) {
                return prev.map(c => c.channel === channel ? { ...c, enabled } : c);
            }
            return [...prev, { channel, enabled }];
        });
    };

    const isChannelEnabled = (channel: string) => {
        return reminderChannels.find(c => c.channel === channel)?.enabled ?? false;
    };

    // ─── Loading state ─────────────────────────────────────────────────────

    if (loading) {
        return (
            <AuthenticatedShell>
                <div className="max-w-3xl mx-auto space-y-6">
                    <div>
                        <Link href={dashboardUrl} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-2">
                            <ChevronLeft className="w-4 h-4" />
                            {t('backToDashboard')}
                        </Link>
                        <h2 className="text-2xl font-display text-surface-800 dark:text-surface-200">{t('title')}</h2>
                        <p className="text-sm text-surface-500 mt-1">{t('subtitle')}</p>
                    </div>
                    <SettingsSkeleton />
                </div>
            </AuthenticatedShell>
        );
    }

    return (
        <AuthenticatedShell>
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <Link href={dashboardUrl} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-2">
                        <ChevronLeft className="w-4 h-4" />
                        {t('backToDashboard')}
                    </Link>
                    <h2 className="text-2xl font-display text-surface-800 dark:text-surface-200">{t('title')}</h2>
                    <p className="text-sm text-surface-500 mt-1">{t('subtitle')}</p>
                </div>

                {/* Profile Section */}
                <Card>
                    <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary-500" />
                        {t('profileInfo')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label={t('firstName')}
                            value={user?.firstName || ''}
                            disabled
                        />
                        <Input
                            label={t('lastName')}
                            value={user?.lastName || ''}
                            disabled
                        />
                        <Input
                            label={t('email')}
                            type="email"
                            value={user?.email || ''}
                            disabled
                            icon={<Mail className="w-4 h-4" />}
                        />
                        <Select
                            label={t('language')}
                            value={languageCode}
                            onChange={e => setLanguageCode(e.target.value)}
                            options={[
                                { value: 'en', label: 'English' },
                                { value: 'hi', label: 'Hindi (हिन्दी)' },
                                { value: 'bn', label: 'Bengali (বাংলা)' },
                                { value: 'te', label: 'Telugu (తెలుగు)' },
                                { value: 'ta', label: 'Tamil (தமிழ்)' },
                                { value: 'gu', label: 'Gujarati (ગુજરાતી)' },
                                { value: 'mr', label: 'Marathi (मराठी)' },
                            ]}
                        />
                        <Select
                            label={t('timezone')}
                            value={timeZone}
                            onChange={e => setTimeZone(e.target.value)}
                            options={[
                                { value: 'Asia/Kolkata', label: 'India (GMT+5:30)' },
                                { value: 'America/New_York', label: 'Eastern US (GMT-5)' },
                                { value: 'America/Los_Angeles', label: 'Pacific US (GMT-8)' },
                                { value: 'Europe/London', label: 'UK (GMT+0)' },
                            ]}
                        />
                        <Select
                            label={t('theme')}
                            value={theme}
                            onChange={e => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                            options={[
                                { value: 'light', label: t('themeLight') },
                                { value: 'dark', label: t('themeDark') },
                                { value: 'system', label: t('themeSystem') },
                            ]}
                        />
                    </div>
                </Card>

                {/* Partner Code Section (Mother only) */}
                {user?.roles.includes('mother') && (
                    <Card>
                        <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-razzmatazz-500" />
                            {t('partnerCodeTitle') || 'Partner Code'}
                        </h3>
                        {partnerCodeLoading ? (
                            <div className="flex items-center gap-3 py-4">
                                <Spinner />
                                <span className="text-sm text-surface-500">{tc('loading')}</span>
                            </div>
                        ) : partnerCode ? (
                            <div className="space-y-4">
                                <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-6 text-center">
                                    <p className="text-sm text-surface-500 mb-2">
                                        {t('partnerCodeDescription') || 'Share this code with your partner to link your accounts'}
                                    </p>
                                    <div className="flex items-center justify-center gap-4">
                                        <span className="text-4xl font-mono font-bold tracking-[0.3em] text-primary-600 dark:text-primary-400">
                                            {partnerCode}
                                        </span>
                                        <button
                                            onClick={handleCopyPartnerCode}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
                                            title={t('copyCode') || 'Copy code'}
                                        >
                                            {partnerCodeCopied ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    {t('copied') || 'Copied!'}
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    {t('copyCode') || 'Copy'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {linkedPartner && (
                                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                                {t('partnerLinked') || 'Partner Linked'}
                                            </p>
                                            <p className="text-sm text-green-600 dark:text-green-400">
                                                {linkedPartner.firstName} {linkedPartner.lastName}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-surface-500">
                                    {t('noPartnerCode') || 'No partner code generated yet. Please try refreshing.'}
                                </p>
                            </div>
                        )}
                    </Card>
                )}

                {/* Notification Preferences */}
                <Card>
                    <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-gold-500" />
                        {t('notificationsTitle')}
                    </h3>

                    <div className="border-t border-surface-200 dark:border-surface-700 my-4 pt-4">
                        <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">{t('notificationChannels')}</p>
                        <Toggle
                            checked={isChannelEnabled('push')}
                            onChange={v => toggleChannel('push', v)}
                            label={t('pushNotifs')}
                        />
                        <div className="mt-2">
                            <Toggle
                                checked={isChannelEnabled('email')}
                                onChange={v => toggleChannel('email', v)}
                                label={t('emailNotifs')}
                            />
                        </div>
                        <div className="mt-2">
                            <Toggle
                                checked={isChannelEnabled('sms')}
                                onChange={v => toggleChannel('sms', v)}
                                label={t('smsNotifs')}
                            />
                        </div>
                    </div>

                    <div className="border-t border-surface-200 dark:border-surface-700 my-4 pt-4">
                        <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">{t('consentTitle')}</p>
                        <Toggle
                            checked={consentDataProcessing}
                            onChange={setConsentDataProcessing}
                            label={t('consentDataProcessing')}
                        />
                        <div className="mt-2">
                            <Toggle
                                checked={consentNotifications}
                                onChange={setConsentNotifications}
                                label={t('consentNotifications')}
                            />
                        </div>
                    </div>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button
                        size="lg"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2"
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {saveSuccess ? t('saved') : t('saveSettings')}
                    </Button>
                </div>

                {/* Security */}
                <Card>
                    <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-surface-600" />
                        {t('securityTitle')}
                    </h3>

                    {!showPasswordForm ? (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="btn-secondary btn-sm flex items-center gap-2"
                        >
                            <Key className="w-4 h-4" />
                            {t('changePassword')}
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <Input
                                label={t('currentPassword')}
                                type="password"
                                value={password.current}
                                onChange={e => setPassword({ ...password, current: e.target.value })}
                            />
                            <Input
                                label={t('newPassword')}
                                type="password"
                                value={password.new}
                                onChange={e => setPassword({ ...password, new: e.target.value })}
                                helpText={t('passwordHint')}
                            />
                            <Input
                                label={t('confirmPassword')}
                                type="password"
                                value={password.confirm}
                                onChange={e => setPassword({ ...password, confirm: e.target.value })}
                            />
                            <div className="flex gap-2 justify-end">
                                <Button variant="secondary" size="sm" onClick={() => setShowPasswordForm(false)}>
                                    {t('cancel')}
                                </Button>
                                <Button size="sm" className="flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    {t('updatePassword')}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Danger Zone */}
                <Card className="border-danger-200 dark:border-danger-800">
                    <h3 className="font-display text-lg text-danger-600 dark:text-danger-400 mb-4 flex items-center gap-2">
                        <Trash2 className="w-5 h-5" />
                        {t('dangerZone')}
                    </h3>
                    <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
                        {t('dangerDesc')}
                    </p>
                    <div className="space-y-3">
                        <button className="btn-secondary btn-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            {t('deleteData')}
                        </button>
                    </div>
                </Card>

                {/* Account Info */}
                {settings && (
                    <div className="text-center text-xs text-surface-400 py-2">
                        <p>{t('lastUpdated')}: {new Date(settings.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                )}
            </div>
        </AuthenticatedShell>
    );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SettingsSkeleton() {
    return (
        <>
            <Card>
                <div className="animate-pulse space-y-4">
                    <div className="h-5 bg-surface-200 dark:bg-velvet-700 rounded w-32" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-surface-200 dark:bg-velvet-700 rounded w-20" />
                                <div className="h-10 bg-surface-200 dark:bg-velvet-700 rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
            <Card>
                <div className="animate-pulse space-y-4">
                    <div className="h-5 bg-surface-200 dark:bg-velvet-700 rounded w-40" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="h-4 bg-surface-200 dark:bg-velvet-700 rounded w-48" />
                            <div className="h-6 w-10 bg-surface-200 dark:bg-velvet-700 rounded-full" />
                        </div>
                    ))}
                </div>
            </Card>
        </>
    );
}