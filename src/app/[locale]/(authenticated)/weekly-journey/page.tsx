'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/components/auth-provider';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { Card, Badge, Button, ProgressBar } from '@/components/ui';
import { api } from '@/lib/api-client';
import { formatWeekKnowledgeForJourneyForLocale, formatPersonalizedWeekKnowledgeForJourneyForLocale, type PersonalizationFactors } from '@/lib/pregnancy-knowledge-i18n';
import { calcPregnancyWeek } from '@/lib/pregnancy-calculator';
import { calcPostpartumWeek, getRecoveryPhase, getRecoveryPhaseLabel, RECOVERY_PHASE_BADGES, getRecoveryPhase as getRecoveryPhaseFn } from '@/lib/postpartum-calculator';
import { formatSourceLegend, getSourceAbbreviations } from '@/lib/source-abbreviations';
import { formatPostpartumWeekKnowledgeForJourneyForLocale } from '@/lib/postpartum-knowledge-i18n';
import { Link } from '@/i18n/navigation';
import {
    ChevronLeft,
    ChevronRight,
    Baby,
    BookOpen,
    Heart,
    Activity,
    Droplets,
    AlertTriangle,
    Brain,
    Calendar,
    Ruler,
    Dumbbell,
    ClipboardList,
    Loader2,
    Timer,
    Stethoscope,
    Smile,
    Info,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

// ─── Types ───

interface WeekContent {
    id: string;
    weekNumber: number;
    title: string;
    summary: string;
    bodyMarkdown: string | null;
    dietNotes: string | null;
    activityNotes: string | null;
    warningSigns: string | null;
    // Postpartum-specific fields
    recoveryNotes?: string | null;
    babyCareNotes?: string | null;
    mentalHealthNotes?: string | null;
}

type ContentType = 'pregnancy' | 'postpartum';

interface MotherHealthProfile {
    id: string;
    diabetes: boolean;
    highBP: boolean;
    lowBP: boolean;
    thyroidDisorder: boolean;
    pcos: boolean;
    asthma: boolean;
    heartDisease: boolean;
    kidneyIssues: boolean;
    epilepsy: boolean;
    anemia: boolean;
    depressionAnxiety: boolean;
    bmi: number;
    diet: string;
    allergies: string;
    lmpDate?: string | null;
    dueDate?: string | null;
}

function buildPersonalizationFactors(mh: MotherHealthProfile): PersonalizationFactors {
    return {
        bmi: mh.bmi ?? undefined,
        allergies: mh.allergies ? mh.allergies.split(',').map(a => a.trim()).filter(Boolean) : undefined,
        medicalConditions: {
            anemia: mh.anemia ?? false,
            diabetes: mh.diabetes ?? false,
            hypertension: mh.highBP ?? false,
            highBP: mh.highBP ?? false,
            lowBP: mh.lowBP ?? false,
            thyroidDisorder: mh.thyroidDisorder ?? false,
            pcos: mh.pcos ?? false,
            asthma: mh.asthma ?? false,
            heartDisease: mh.heartDisease ?? false,
            kidneyIssues: mh.kidneyIssues ?? false,
            epilepsy: mh.epilepsy ?? false,
            highRiskPregnancy: false,
        },
        diet: (mh.diet === 'veg' || mh.diet === 'non-veg') ? mh.diet : undefined,
    };
}

// ─── Helper: parse simple markdown bullet lists ───

function parseBulletList(md: string | null): string[] {
    if (!md) return [];
    return md
        .split('\n')
        .map(line => line.replace(/^[-*]\s+/, '').trim())
        .filter(Boolean);
}

function parseMarkdownSections(body: string | null): {
    babyDevelopment: string[];
    motherChanges: string[];
    checklist: string[];
    partnerTips: string[];
    babySize: string;
    babyWeight: string;
    babyLength: string;
} {
    const result = {
        babyDevelopment: [] as string[],
        motherChanges: [] as string[],
        checklist: [] as string[],
        partnerTips: [] as string[],
        babySize: '',
        babyWeight: '',
        babyLength: '',
    };

    if (!body) return result;

    const lines = body.split('\n');
    let currentSection: keyof typeof result | null = null;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Section headers
        const headerMatch = trimmed.match(/^##\s+(.+)/);
        if (headerMatch) {
            const h = headerMatch[1].toLowerCase();
            if (h.includes('baby') && h.includes('develop')) currentSection = 'babyDevelopment';
            else if (h.includes('mother') || h.includes('your body') || h.includes('changes')) currentSection = 'motherChanges';
            else if (h.includes('checklist')) currentSection = 'checklist';
            else if (h.includes('partner')) currentSection = 'partnerTips';
            else currentSection = null;
            continue;
        }

        // Metadata extraction
        if (trimmed.startsWith('Baby Size:')) result.babySize = trimmed.replace('Baby Size:', '').trim();
        if (trimmed.startsWith('Baby Weight:')) result.babyWeight = trimmed.replace('Baby Weight:', '').trim();
        if (trimmed.startsWith('Baby Length:')) result.babyLength = trimmed.replace('Baby Length:', '').trim();

        // Bullet points
        if (currentSection && trimmed.startsWith('-')) {
            const text = trimmed.replace(/^-\s+/, '');
            (result[currentSection] as string[]).push(text);
        }
    }

    return result;
}

// ─── Weekly Journey Page ───

export default function WeeklyJourneyPage() {
    const t = useTranslations('weeklyJourney');
    const locale = useLocale();
    const { user, getDashboardUrl } = useAuth();

    const [content, setContent] = useState<WeekContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [dashboardUrl, setDashboardUrl] = useState<string>('/mother');
    const [motherHealthProfile, setMotherHealthProfile] = useState<MotherHealthProfile | null>(null);

    // Fetch dashboard URL
    useEffect(() => {
        if (user?.roles) {
            getDashboardUrl(user.roles).then(setDashboardUrl);
        }
    }, [user?.roles, getDashboardUrl]);
    const [currentWeek, setCurrentWeek] = useState(24);
    const [selectedWeek, setSelectedWeek] = useState(24);
    const [contentType, setContentType] = useState<ContentType>('pregnancy');
    const [showSourceInfo, setShowSourceInfo] = useState(false);

    const totalWeeks = contentType === 'postpartum' ? 52 : 40;
    const weekNumbers = Array.from({ length: totalWeeks }, (_, i) => i + 1);

    const fetchContent = useCallback(async () => {
        try {
            setLoading(true);

            // Step 1: Fetch both pregnancy profile and mother-health profile in parallel
            // This mirrors the mother dashboard's fetchDashboard approach exactly
            const [pregnancyRes, motherHealthRes] = await Promise.allSettled([
                api.get<any>('/profile/pregnancy'),
                api.get<any>('/profile/mother-health'),
            ]);

            let localWeek: number | null = null;
            let ct: ContentType = 'pregnancy';

            // Detect phase and calculate week from pregnancy profile (authoritative source)
            if (pregnancyRes.status === 'fulfilled') {
                const profile = pregnancyRes.value;
                const profilePhase = profile.phase || 'pregnancy';
                ct = profilePhase === 'postpartum' ? 'postpartum' : 'pregnancy';

                if (ct === 'postpartum' && profile.deliveryDate) {
                    const info = calcPostpartumWeek(profile.deliveryDate);
                    if (info) {
                        localWeek = info.week;
                    }
                } else if (ct === 'pregnancy') {
                    const info = calcPregnancyWeek({
                        lmpDate: profile.lmpDate,
                        dueDate: profile.dueDate,
                    });
                    if (info) {
                        localWeek = info.week;
                    }
                }
            }

            // Fallback: use mother-health profile for dates when pregnancy profile lacks them
            // (mirrors mother/page.tsx lines 247-260 exactly)
            if (localWeek === null && motherHealthRes.status === 'fulfilled') {
                const mhProfile = motherHealthRes.value;
                const info = calcPregnancyWeek({
                    lmpDate: mhProfile.lmpDate,
                    dueDate: mhProfile.dueDate,
                });
                if (info) {
                    localWeek = info.week;
                    // If we fell back to mother-health, we're in pregnancy phase
                    ct = 'pregnancy';
                }
            }

            // Save mother health profile for personalization
            if (motherHealthRes.status === 'fulfilled' && motherHealthRes.value) {
                setMotherHealthProfile(motherHealthRes.value as MotherHealthProfile);
            }

            setContentType(ct);
            const totalWks = ct === 'postpartum' ? 52 : 40;

            // Step 2: Fetch the correct content type based on the detected phase
            const weekRes = await api.get<any>(`/weekly-journey?limit=${totalWks}&contentType=${ct}`).catch(() => null);
            setContent(weekRes?.content ?? []);

            if (localWeek !== null) {
                const week = Math.max(1, Math.min(totalWks, localWeek));
                setCurrentWeek(week);
                setSelectedWeek(week);
            } else {
                setSelectedWeek(1);
                setCurrentWeek(1);
            }
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => { fetchContent(); }, [fetchContent]);

    // Get recovery phase badge for postpartum
    const recoveryPhase = contentType === 'postpartum'
        ? getRecoveryPhaseFn(selectedWeek)
        : null;
    const phaseBadge = recoveryPhase ? RECOVERY_PHASE_BADGES[recoveryPhase] : null;

    // Find week data — try API content first, fall back to local knowledge database
    const apiWeekData = content.find(c => c.weekNumber === selectedWeek);

    let weekData: {
        id: string;
        weekNumber: number;
        title: string;
        summary: string;
        bodyMarkdown: string | null;
        dietNotes: string | null;
        activityNotes: string | null;
        warningSigns: string | null;
        recoveryNotes?: string | null;
        babyCareNotes?: string | null;
        mentalHealthNotes?: string | null;
    } | null = null;

    if (apiWeekData) {
        weekData = apiWeekData;
    } else if (contentType === 'pregnancy') {
        const fallback = motherHealthProfile
            ? formatPersonalizedWeekKnowledgeForJourneyForLocale(selectedWeek, locale, buildPersonalizationFactors(motherHealthProfile))
            : formatWeekKnowledgeForJourneyForLocale(selectedWeek, locale);
        if (fallback) {
            weekData = {
                id: `fallback-week-${selectedWeek}`,
                weekNumber: fallback.weekNumber,
                title: fallback.title,
                summary: fallback.summary,
                bodyMarkdown: fallback.bodyMarkdown,
                dietNotes: fallback.dietNotes,
                activityNotes: fallback.activityNotes,
                warningSigns: fallback.warningSigns,
            };
        }
    } else if (contentType === 'postpartum') {
        const fallback = formatPostpartumWeekKnowledgeForJourneyForLocale(selectedWeek, locale);
        if (fallback) {
            weekData = {
                id: `fallback-pp-week-${selectedWeek}`,
                weekNumber: fallback.weekNumber,
                title: fallback.title,
                summary: fallback.summary,
                bodyMarkdown: null,
                dietNotes: null,
                activityNotes: fallback.activityNotes,
                warningSigns: fallback.warningSigns,
                recoveryNotes: fallback.recoveryNotes,
                babyCareNotes: fallback.babyCareNotes,
                mentalHealthNotes: fallback.mentalHealthNotes,
            };
        }
    }

    const sections = parseMarkdownSections(weekData?.bodyMarkdown ?? null);

    // Use API fields or markdown-parsed fields
    const babySize = weekData?.title || sections.babySize || '—';
    const babyWeight = sections.babyWeight || '—';
    const babyLength = sections.babyLength || '—';
    const summary = weekData?.summary || '';

    const activityTips = parseBulletList(weekData?.activityNotes ?? null);
    const warningSigns = parseBulletList(weekData?.warningSigns ?? null);

    // Postpartum-specific parsed fields
    const recoveryNotes = parseBulletList(weekData?.recoveryNotes ?? null);
    const babyCareNotes = parseBulletList(weekData?.babyCareNotes ?? null);
    const mentalHealthNotes = parseBulletList(weekData?.mentalHealthNotes ?? null);

    const isPostpartumContent = contentType === 'postpartum';

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
                        <p className="text-sm text-surface-500 mt-1">
                            {isPostpartumContent ? t('postpartumSubtitle') : t('subtitle')}
                        </p>
                    </div>
                </div>

                {/* Week Selector */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => selectedWeek > 1 && setSelectedWeek(selectedWeek - 1)}
                            disabled={selectedWeek <= 1}
                            className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-surface-600 dark:text-surface-400" />
                        </button>
                        <div className="text-center">
                            <div className="flex items-center gap-2 justify-center">
                                <h3 className="text-xl font-display text-surface-800 dark:text-surface-200">
                                    {t('week')} {selectedWeek}
                                </h3>
                                {phaseBadge && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${phaseBadge.color} font-medium`}>
                                        {phaseBadge.emoji} {phaseBadge.label}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-surface-500">
                                {selectedWeek === currentWeek
                                    ? t('currentWeek')
                                    : `${Math.abs(currentWeek - selectedWeek)} ${selectedWeek > currentWeek ? t('weeksAhead') : t('weeksAgo')}`}
                                {' '}&middot;{' '}
                                {selectedWeek} {t('weekOf')} {totalWeeks}
                            </p>
                            {isPostpartumContent && recoveryPhase && (
                                <p className="text-xs text-surface-400 mt-0.5">
                                    {getRecoveryPhaseLabel(recoveryPhase)}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => selectedWeek < totalWeeks && setSelectedWeek(selectedWeek + 1)}
                            disabled={selectedWeek >= totalWeeks}
                            className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-surface-600 dark:text-surface-400" />
                        </button>
                    </div>

                    {/* Progress */}
                    <ProgressBar value={selectedWeek} max={totalWeeks} variant={isPostpartumContent ? 'accent' : 'primary'} showLabel size="lg" />

                    {/* Quick Week Navigation */}
                    <div className="mt-4 flex flex-wrap gap-1">
                        {weekNumbers.slice(Math.max(0, selectedWeek - 3), selectedWeek + 4).map(w => (
                            <button
                                key={w}
                                onClick={() => setSelectedWeek(w)}
                                className={`w-9 h-9 rounded-lg text-xs font-medium transition-all ${w === selectedWeek
                                    ? 'bg-primary-500 text-white'
                                    : w === currentWeek
                                        ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 ring-1 ring-primary-300'
                                        : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600'
                                    }`}
                            >
                                {w}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Week Content */}
                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-6 rounded-xl border border-surface-200 dark:border-surface-700 animate-pulse space-y-3">
                                    <div className="h-5 w-40 bg-surface-200 dark:bg-surface-700 rounded" />
                                    <div className="h-4 w-full bg-surface-200 dark:bg-surface-700 rounded" />
                                    <div className="h-4 w-3/4 bg-surface-200 dark:bg-surface-700 rounded" />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-6 rounded-xl border border-surface-200 dark:border-surface-700 animate-pulse space-y-3">
                                    <div className="h-5 w-24 bg-surface-200 dark:bg-surface-700 rounded" />
                                    <div className="h-3 w-full bg-surface-200 dark:bg-surface-700 rounded" />
                                    <div className="h-3 w-2/3 bg-surface-200 dark:bg-surface-700 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : !weekData ? (
                    <Card>
                        <p className="text-sm text-surface-500 text-center py-12">{t('noContent')}</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Overview Card */}
                            <Card variant="calm">
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${isPostpartumContent
                                        ? 'bg-razzmatazz-100 dark:bg-razzmatazz-800'
                                        : 'bg-primary-100 dark:bg-primary-800'
                                        }`}>
                                        {isPostpartumContent ? (
                                            <Timer className={`w-7 h-7 text-razzmatazz-600 dark:text-razzmatazz-300`} />
                                        ) : (
                                            <Baby className="w-7 h-7 text-primary-600 dark:text-primary-300" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-1">{babySize}</h3>
                                        {summary && (
                                            <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{summary}</p>
                                        )}
                                        {!isPostpartumContent && (
                                            <div className="flex gap-4 mt-3">
                                                {babyWeight !== '—' && <Badge variant="primary">{babyWeight}</Badge>}
                                                {babyLength !== '—' && <Badge variant="gold">{babyLength}</Badge>}
                                            </div>
                                        )}
                                        {isPostpartumContent && phaseBadge && (
                                            <div className="flex gap-4 mt-3">
                                                <Badge variant="razzmatazz">{phaseBadge.emoji} {phaseBadge.label} Recovery</Badge>
                                                <Badge variant="primary">Week {selectedWeek} {t('weekOf')} 52</Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>

                            {/* ─── Postpartum Sections ─── */}
                            {isPostpartumContent && (
                                <>
                                    {/* Recovery Notes */}
                                    {recoveryNotes.length > 0 && (
                                        <Card>
                                            <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-3 flex items-center gap-2">
                                                <Stethoscope className="w-5 h-5 text-razzmatazz-500" />
                                                {t('recoveryNotes')}
                                            </h3>
                                            <ul className="space-y-2">
                                                {recoveryNotes.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-razzmatazz-400 mt-1.5 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Card>
                                    )}

                                    {/* Baby Care Notes */}
                                    {babyCareNotes.length > 0 && (
                                        <Card>
                                            <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-3 flex items-center gap-2">
                                                <Baby className="w-5 h-5 text-primary-500" />
                                                {t('babyCareNotes')}
                                            </h3>
                                            <ul className="space-y-2">
                                                {babyCareNotes.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Card>
                                    )}

                                    {/* Mental Health Notes */}
                                    {mentalHealthNotes.length > 0 && (
                                        <Card>
                                            <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-3 flex items-center gap-2">
                                                <Smile className="w-5 h-5 text-success-500" />
                                                {t('mentalHealthNotes')}
                                            </h3>
                                            <ul className="space-y-2">
                                                {mentalHealthNotes.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-success-400 mt-1.5 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Card>
                                    )}
                                </>
                            )}

                            {/* ─── Pregnancy Sections ─── */}
                            {!isPostpartumContent && (
                                <>
                                    {/* Baby Development */}
                                    {sections.babyDevelopment.length > 0 && (
                                        <Card>
                                            <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-3 flex items-center gap-2">
                                                <Baby className="w-5 h-5 text-primary-500" />
                                                {t('babyDevelopment')}
                                            </h3>
                                            <ul className="space-y-2">
                                                {sections.babyDevelopment.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Card>
                                    )}

                                    {/* Mother Changes */}
                                    {sections.motherChanges.length > 0 && (
                                        <Card>
                                            <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-3 flex items-center gap-2">
                                                <Heart className="w-5 h-5 text-razzmatazz-400" />
                                                {t('motherChanges')}
                                            </h3>
                                            <ul className="space-y-2">
                                                {sections.motherChanges.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-razzmatazz-400 mt-1.5 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Card>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Sidebar — Tips & Checklist */}
                        <div className="space-y-6">
                            {/* Activity Tips */}
                            {activityTips.length > 0 && (
                                <Card>
                                    <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-3 flex items-center gap-2">
                                        <Dumbbell className="w-5 h-5 text-gold-500" />
                                        {t('activityExercise')}
                                    </h3>
                                    <ul className="space-y-2">
                                        {activityTips.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            )}

                            {/* Checklist (pregnancy only) */}
                            {!isPostpartumContent && sections.checklist.length > 0 && (
                                <Card variant="calm">
                                    <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-3 flex items-center gap-2">
                                        <ClipboardList className="w-5 h-5 text-primary-600" />
                                        {t('checklist')}
                                    </h3>
                                    <ul className="space-y-2">
                                        {sections.checklist.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
                                                <input type="checkbox" className="mt-1 rounded border-surface-300 text-primary-500 focus:ring-primary-400" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            )}

                            {/* Warning Signs */}
                            {warningSigns.length > 0 && (
                                <Card className="border-warning-200 dark:border-warning-800 bg-warning-50/50 dark:bg-warning-900/10">
                                    <h3 className="font-display text-lg text-warning-700 dark:text-warning-300 mb-3 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-warning-500" />
                                        {t('warningSigns')}
                                    </h3>
                                    <ul className="space-y-2">
                                        {warningSigns.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-warning-700 dark:text-warning-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-warning-400 mt-1.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            )}

                            {/* Partner Tips (pregnancy only) */}
                            {!isPostpartumContent && sections.partnerTips.length > 0 && (
                                <Card>
                                    <h3 className="font-display text-lg text-surface-800 dark:text-surface-200 mb-3 flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-razzmatazz-400" />
                                        {t('tipsForPartner')}
                                    </h3>
                                    <ul className="space-y-2">
                                        {sections.partnerTips.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-razzmatazz-400 mt-1.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── Information Sources (Postpartum Only) ─── */}
                {isPostpartumContent && !loading && weekData && (
                    <div className="mt-6">
                        <button
                            onClick={() => setShowSourceInfo(!showSourceInfo)}
                            className="w-full flex items-center justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-primary-500" />
                                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                                    {locale === 'hi' ? '📚 जानकारी के स्रोत — इन संक्षिप्त नामों का क्या मतलब है?' : '📚 Information Sources — What Do These Abbreviations Mean?'}
                                </span>
                            </div>
                            {showSourceInfo ? (
                                <ChevronUp className="w-5 h-5 text-surface-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-surface-400" />
                            )}
                        </button>
                        {showSourceInfo && (
                            <Card className="mt-2">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Indian Organizations */}
                                        <div>
                                            <h4 className="font-display text-base text-surface-800 dark:text-surface-200 mb-3 flex items-center gap-1">
                                                🇮🇳 {locale === 'hi' ? 'भारतीय संस्थाएं' : 'Indian Organizations'}
                                            </h4>
                                            <ul className="space-y-2">
                                                {Object.entries(getSourceAbbreviations())
                                                    .filter(([_, info]) => info.isIndian)
                                                    .map(([abbr, info]) => (
                                                        <li key={abbr} className="text-sm text-surface-600 dark:text-surface-400">
                                                            <span className="font-semibold text-surface-800 dark:text-surface-200">{abbr}</span>
                                                            {' — '}
                                                            <span className="font-medium">{info.fullName}</span>
                                                            <br />
                                                            <span className="text-xs text-surface-500">
                                                                {locale === 'hi' ? info.descriptionHindi : info.description}
                                                            </span>
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                        {/* International Organizations */}
                                        <div>
                                            <h4 className="font-display text-base text-surface-800 dark:text-surface-200 mb-3 flex items-center gap-1">
                                                🌍 {locale === 'hi' ? 'अंतरराष्ट्रीय संस्थाएं' : 'International Organizations'}
                                            </h4>
                                            <ul className="space-y-2">
                                                {Object.entries(getSourceAbbreviations())
                                                    .filter(([_, info]) => !info.isIndian)
                                                    .map(([abbr, info]) => (
                                                        <li key={abbr} className="text-sm text-surface-600 dark:text-surface-400">
                                                            <span className="font-semibold text-surface-800 dark:text-surface-200">{abbr}</span>
                                                            {' — '}
                                                            <span className="font-medium">{info.fullName}</span>
                                                            <br />
                                                            <span className="text-xs text-surface-500">
                                                                {locale === 'hi' ? info.descriptionHindi : info.description}
                                                            </span>
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                                        <p className="text-xs text-surface-500 italic">
                                            {locale === 'hi'
                                                ? '💡 इस गाइड में दी गई हर जानकारी इन विश्वसनीय स्वास्थ्य संस्थानों द्वारा समर्थित है। जब आप किसी सलाह के पास (WHO, MOHFW) जैसे संक्षिप्त नाम देखें, तो इसका मतलब है कि यह मार्गदर्शन विश्व स्वास्थ्य संगठन और भारत के स्वास्थ्य मंत्रालय दोनों द्वारा समर्थित है।'
                                                : '💡 Every claim in this guide is backed by these trusted health authorities. When you see abbreviations like (WHO, MOHFW) next to health advice, it means the guidance is supported by both the World Health Organization and India\'s Ministry of Health & Family Welfare.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedShell>
    );
}