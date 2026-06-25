'use client';

import { useState, useEffect, FormEvent, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { Button, Input, Card, Select, Checkbox, Spinner } from '@/components/ui';
import { apiFetch } from '@/lib/api-client';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Baby, ChevronRight, Heart, User } from 'lucide-react';
import { AuthenticatedShell } from '@/components/authenticated-shell';

// ─── Constants ───
const BLOOD_GROUPS = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
];

const MEDICAL_CONDITIONS = [
    { key: 'diabetes', label: 'Diabetes' },
    { key: 'highBP', label: 'High Blood Pressure (Hypertension)' },
    { key: 'lowBP', label: 'Low Blood Pressure (Hypotension)' },
    { key: 'thyroidDisorder', label: 'Thyroid Disorder' },
    { key: 'pcos', label: 'PCOS (Polycystic Ovary Syndrome)' },
    { key: 'asthma', label: 'Asthma' },
    { key: 'heartDisease', label: 'Heart Disease' },
    { key: 'kidneyIssues', label: 'Kidney Issues' },
    { key: 'epilepsy', label: 'Epilepsy' },
    { key: 'anemia', label: 'Anemia' },
    { key: 'depressionAnxiety', label: 'Depression / Anxiety' },
];

const PREVIOUS_HISTORY = [
    { key: 'previousMiscarriage', label: 'Previous Miscarriage' },
    { key: 'previousCSection', label: 'Previous C-Section Delivery' },
    { key: 'previousPrematureDelivery', label: 'Previous Premature Delivery' },
    { key: 'previousStillBirth', label: 'Previous Still Birth' },
];

interface FormData {
    height: string;
    weight: string;
    city: string;
    age: string;
    isFirstPregnancy: boolean;
    numberOfChildren: string;
    lmpDate: string;
    dueDate: string;
    bloodGroup: string;
    allergies: string;
    medications: string;
    diet: string;
    husbandName: string;
    emergencyContact: string;
    phoneNumber: string;
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
    previousMiscarriage: boolean;
    previousCSection: boolean;
    previousPrematureDelivery: boolean;
    previousStillBirth: boolean;
    pregnancyComplications: string;
    smokingExposure: boolean;
    alcoholExposure: boolean;
    // Postpartum-specific
    deliveryType: string;
    deliveryDate: string;
    breastfeedingStatus: string;
    babyBirthWeight: string;
    babyGender: string;
    deliveryComplications: string;
    babyCount: string;
    nicuStay: boolean;
    nicuStayDuration: string;
    postpartumSupport: string;
}

const EMPTY_FORM: FormData = {
    height: '', weight: '', city: '', age: '',
    isFirstPregnancy: true, numberOfChildren: '', lmpDate: '', dueDate: '',
    bloodGroup: '', allergies: '', medications: '', diet: '', husbandName: '',
    emergencyContact: '', phoneNumber: '',
    diabetes: false, highBP: false, lowBP: false, thyroidDisorder: false,
    pcos: false, asthma: false, heartDisease: false, kidneyIssues: false,
    epilepsy: false, anemia: false, depressionAnxiety: false,
    previousMiscarriage: false, previousCSection: false,
    previousPrematureDelivery: false, previousStillBirth: false,
    pregnancyComplications: '', smokingExposure: false, alcoholExposure: false,
    deliveryType: '', deliveryDate: '', breastfeedingStatus: '', babyBirthWeight: '',
    babyGender: '', deliveryComplications: '', babyCount: '1',
    nicuStay: false, nicuStayDuration: '', postpartumSupport: '',
};

interface ProfileData {
    id: string;
    height: number;
    weight: number;
    bmi: number;
    bmiCategory: string;
    city: string;
    age: number;
    isFirstPregnancy: boolean;
    numberOfChildren: number | null;
    lmpDate: string | null;
    dueDate: string | null;
    bloodGroup: string;
    allergies: string;
    medications: string;
    diet: string;
    husbandName: string;
    emergencyContact: string;
    phoneNumber: string;
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
    previousMiscarriage: boolean | null;
    previousCSection: boolean | null;
    previousPrematureDelivery: boolean | null;
    previousStillBirth: boolean | null;
    pregnancyComplications: string | null;
    smokingExposure: boolean;
    alcoholExposure: boolean;
    profileCompleted: boolean;
    createdAt: string;
    updatedAt: string;
}

function formatDateForInput(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
}

// ─── Postpartum Options ───
const DELIVERY_TYPE_OPTIONS = [
    { value: 'vaginal', label: 'Vaginal Delivery' },
    { value: 'c-section', label: 'C-Section' },
    { value: 'assisted', label: 'Assisted (Forceps/Vacuum)' },
];

const BREASTFEEDING_OPTIONS = [
    { value: 'exclusive', label: 'Exclusive Breastfeeding' },
    { value: 'mixed', label: 'Mixed Feeding' },
    { value: 'formula', label: 'Formula Feeding' },
];

const BABY_GENDER_OPTIONS = [
    { value: 'boy', label: 'Boy' },
    { value: 'girl', label: 'Girl' },
    { value: 'prefer-not-say', label: 'Prefer Not to Say' },
];

const DELIVERY_COMPLICATIONS_OPTIONS = [
    { value: 'none', label: 'None' },
    { value: 'hemorrhage', label: 'Postpartum Hemorrhage' },
    { value: 'infection', label: 'Infection' },
    { value: 'preeclampsia', label: 'Preeclampsia' },
    { value: 'tear', label: 'Perineal Tear (3rd/4th degree)' },
    { value: 'placenta_issues', label: 'Placenta Issues' },
    { value: 'other', label: 'Other' },
];

const BABY_COUNT_OPTIONS = [
    { value: '1', label: '1 Baby (Singleton)' },
    { value: '2', label: '2 Babies (Twins)' },
    { value: '3', label: '3 Babies (Triplets)' },
    { value: '4', label: '4+ Babies' },
];

const POSTPARTUM_SUPPORT_OPTIONS = [
    { value: 'family', label: 'Family Support' },
    { value: 'partner', label: 'Partner Support' },
    { value: 'doula', label: 'Doula' },
    { value: 'nurse', label: 'Postpartum Nurse' },
    { value: 'none', label: 'No Support' },
    { value: 'other', label: 'Other' },
];

// ─── Component ───
export default function ProfilePage() {
    const { user, getDashboardUrl, isPostpartum: authIsPostpartum } = useAuth();
    const router = useRouter();
    const t = useTranslations('profile');
    const sharedT = useTranslations('shared');
    const [dashboardUrl, setDashboardUrl] = useState<string>('/mother');

    // Fetch dashboard URL
    useEffect(() => {
        if (user?.roles) {
            getDashboardUrl(user.roles).then(setDashboardUrl);
        }
    }, [user?.roles, getDashboardUrl]);

    // ── Translated option arrays ──
    const DIET_OPTIONS = useMemo(() => [
        { value: 'veg', label: t('dietVeg') },
        { value: 'non-veg', label: t('dietNonVeg') },
    ], [t]);

    const [detectedPhase, setDetectedPhase] = useState<'pregnancy' | 'postpartum' | null>(null);
    const [form, setForm] = useState<FormData>(EMPTY_FORM);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [bmiResult, setBmiResult] = useState<{ value: number; catKey: string; msgKey: string } | null>(null);
    const [calculatedDueDate, setCalculatedDueDate] = useState('');

    // Fetch existing profile
    const fetchProfile = useCallback(async () => {
        try {
            const res = await apiFetch<ProfileData>('/profile/mother-health');
            if (res && res.id) {
                setForm({
                    height: String(res.height),
                    weight: String(res.weight),
                    city: res.city,
                    age: String(res.age),
                    isFirstPregnancy: res.isFirstPregnancy,
                    numberOfChildren: res.numberOfChildren !== null ? String(res.numberOfChildren) : '',
                    lmpDate: formatDateForInput(res.lmpDate),
                    dueDate: formatDateForInput(res.dueDate),
                    bloodGroup: res.bloodGroup,
                    allergies: res.allergies || '',
                    medications: res.medications || '',
                    diet: res.diet,
                    husbandName: res.husbandName,
                    emergencyContact: res.emergencyContact,
                    phoneNumber: res.phoneNumber,
                    diabetes: res.diabetes,
                    highBP: res.highBP,
                    lowBP: res.lowBP,
                    thyroidDisorder: res.thyroidDisorder,
                    pcos: res.pcos,
                    asthma: res.asthma,
                    heartDisease: res.heartDisease,
                    kidneyIssues: res.kidneyIssues,
                    epilepsy: res.epilepsy,
                    anemia: res.anemia,
                    depressionAnxiety: res.depressionAnxiety,
                    previousMiscarriage: res.previousMiscarriage ?? false,
                    previousCSection: res.previousCSection ?? false,
                    previousPrematureDelivery: res.previousPrematureDelivery ?? false,
                    previousStillBirth: res.previousStillBirth ?? false,
                    pregnancyComplications: res.pregnancyComplications || '',
                    smokingExposure: res.smokingExposure,
                    alcoholExposure: res.alcoholExposure,
                    // Postpartum-specific
                    deliveryType: (res as any).deliveryType || '',
                    deliveryDate: formatDateForInput((res as any).deliveryDate),
                    breastfeedingStatus: (res as any).breastfeedingStatus || '',
                    babyBirthWeight: (res as any).babyBirthWeight != null ? String((res as any).babyBirthWeight) : '',
                    babyGender: (res as any).babyGender || '',
                    deliveryComplications: (res as any).deliveryComplications || '',
                    babyCount: (res as any).babyCount != null ? String((res as any).babyCount) : '1',
                    nicuStay: (res as any).nicuStay ?? false,
                    nicuStayDuration: (res as any).nicuStayDuration != null ? String((res as any).nicuStayDuration) : '',
                    postpartumSupport: (res as any).postpartumSupport || '',
                });
            }
        } catch {
            // Profile not found — redirect to completion page
            router.replace('/profile/complete');
        }
        setFetching(false);
    }, [router]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Phase detection: use API phase first, fall back to mother-health profile, then auth context
    useEffect(() => {
        if (!user?.id) return;
        let cancelled = false;
        // First check pregnancy profile API
        apiFetch<{ phase?: string; dueDate?: string; deliveryDate?: string; exists?: boolean }>('/profile/pregnancy')
            .then(data => {
                if (cancelled) return;
                if (data?.phase === 'postpartum') {
                    setDetectedPhase('postpartum');
                } else if (data?.phase === 'pregnancy') {
                    setDetectedPhase('pregnancy');
                } else if (data?.deliveryDate) {
                    setDetectedPhase('postpartum');
                } else if (data?.dueDate) {
                    // Auto-detect phase from due date
                    const now = new Date();
                    const due = new Date(data.dueDate);
                    due.setHours(0, 0, 0, 0);
                    now.setHours(0, 0, 0, 0);
                    setDetectedPhase(due < now ? 'postpartum' : 'pregnancy');
                } else {
                    // No explicit phase from pregnancy profile — check mother-health
                    checkMotherHealthPhase(cancelled);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    checkMotherHealthPhase(cancelled);
                }
            });

        function checkMotherHealthPhase(cancelled: boolean) {
            apiFetch<{ deliveryDate?: string; lmpDate?: string; dueDate?: string }>('/profile/mother-health')
                .then(mhData => {
                    if (cancelled) return;
                    if (mhData?.deliveryDate) {
                        const delDate = new Date(mhData.deliveryDate);
                        if (delDate <= new Date()) {
                            setDetectedPhase('postpartum');
                            return;
                        }
                    }
                    if (mhData?.lmpDate || mhData?.dueDate) {
                        // Check if dueDate has passed — if so, it's postpartum
                        if (mhData?.dueDate) {
                            const now = new Date();
                            const due = new Date(mhData.dueDate);
                            due.setHours(0, 0, 0, 0);
                            now.setHours(0, 0, 0, 0);
                            if (due < now) {
                                setDetectedPhase('postpartum');
                                return;
                            }
                        }
                        setDetectedPhase('pregnancy');
                        return;
                    }
                    setDetectedPhase(authIsPostpartum ? 'postpartum' : 'pregnancy');
                })
                .catch(() => {
                    if (!cancelled) {
                        setDetectedPhase(authIsPostpartum ? 'postpartum' : 'pregnancy');
                    }
                });
        }

        return () => { cancelled = true; };
    }, [user?.id, authIsPostpartum]);

    const isPostpartum = detectedPhase === 'postpartum' || (detectedPhase === null && authIsPostpartum);

    // Calculate BMI on height/weight change
    useEffect(() => {
        const h = parseFloat(form.height);
        const w = parseFloat(form.weight);
        if (h > 0 && w > 0) {
            const bmi = Math.round((w / ((h / 100) * (h / 100))) * 10) / 10;
            let catKey: string;
            let msgKey: string;
            if (bmi < 18.5) {
                catKey = 'bmiUnderweight';
                msgKey = 'bmiUnderweightMsg';
            } else if (bmi < 25) {
                catKey = 'bmiHealthy';
                msgKey = 'bmiHealthyMsg';
            } else if (bmi < 30) {
                catKey = 'bmiOverweight';
                msgKey = 'bmiOverweightMsg';
            } else {
                catKey = 'bmiObese';
                msgKey = 'bmiObeseMsg';
            }
            setBmiResult({ value: bmi, catKey, msgKey });
        } else {
            setBmiResult(null);
        }
    }, [form.height, form.weight, t]);

    // Auto-calculate due date from LMP (like BMI is calculated dynamically)
    useEffect(() => {
        if (form.lmpDate) {
            const lmp = new Date(form.lmpDate);
            if (!isNaN(lmp.getTime())) {
                const expectedDue = new Date(lmp.getTime() + 280 * 86400000);
                setCalculatedDueDate(expectedDue.toISOString().split('T')[0]);
            }
        } else {
            setCalculatedDueDate('');
        }
    }, [form.lmpDate]);

    const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const getBool = (key: string): boolean => {
        const val = (form as unknown as Record<string, boolean | string>)[key];
        return typeof val === 'boolean' ? val : false;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!form.height || !form.weight || !form.city || !form.age || !form.bloodGroup || !form.diet || !form.husbandName || !form.emergencyContact || !form.phoneNumber) {
            setError(t('fillRequiredFields'));
            return;
        }

        setIsLoading(true);
        try {
            const height = parseFloat(form.height);
            const weight = parseFloat(form.weight);
            const age = parseInt(form.age, 10);

            await apiFetch('/profile/mother-health', {
                method: 'PUT',
                body: JSON.stringify({
                    height,
                    weight,
                    city: form.city,
                    age,
                    isFirstPregnancy: form.isFirstPregnancy,
                    numberOfChildren: form.isFirstPregnancy ? 0 : (parseInt(form.numberOfChildren, 10) || 0),
                    lmpDate: form.lmpDate || undefined,
                    dueDate: form.lmpDate ? calculatedDueDate : (form.dueDate || undefined),
                    bloodGroup: form.bloodGroup,
                    allergies: form.allergies,
                    medications: form.medications,
                    diet: form.diet,
                    husbandName: form.husbandName,
                    emergencyContact: form.emergencyContact,
                    phoneNumber: form.phoneNumber,
                    diabetes: form.diabetes,
                    highBP: form.highBP,
                    lowBP: form.lowBP,
                    thyroidDisorder: form.thyroidDisorder,
                    pcos: form.pcos,
                    asthma: form.asthma,
                    heartDisease: form.heartDisease,
                    kidneyIssues: form.kidneyIssues,
                    epilepsy: form.epilepsy,
                    anemia: form.anemia,
                    depressionAnxiety: form.depressionAnxiety,
                    previousMiscarriage: !form.isFirstPregnancy ? form.previousMiscarriage : undefined,
                    previousCSection: !form.isFirstPregnancy ? form.previousCSection : undefined,
                    previousPrematureDelivery: !form.isFirstPregnancy ? form.previousPrematureDelivery : undefined,
                    previousStillBirth: !form.isFirstPregnancy ? form.previousStillBirth : undefined,
                    pregnancyComplications: !form.isFirstPregnancy ? form.pregnancyComplications || undefined : undefined,
                    smokingExposure: form.smokingExposure,
                    alcoholExposure: form.alcoholExposure,
                    // Postpartum-specific
                    deliveryType: form.deliveryType || undefined,
                    deliveryDate: form.deliveryDate || undefined,
                    breastfeedingStatus: form.breastfeedingStatus || undefined,
                    babyBirthWeight: form.babyBirthWeight ? parseFloat(form.babyBirthWeight) : undefined,
                    babyGender: form.babyGender || undefined,
                    deliveryComplications: form.deliveryComplications || undefined,
                    babyCount: form.babyCount ? parseInt(form.babyCount, 10) : undefined,
                    nicuStay: form.nicuStay,
                    nicuStayDuration: form.nicuStay ? (parseInt(form.nicuStayDuration, 10) || undefined) : undefined,
                    postpartumSupport: form.postpartumSupport || undefined,
                }),
            });

            // Sync auto-calculated due date to pregnancy profile for phase detection.
            // If LMP is provided, the due date is auto-calculated and stored in the
            // pregnancy profile so the API can dynamically re-evaluate the phase.
            if (form.lmpDate && calculatedDueDate) {
                try {
                    // Try to update existing pregnancy profile
                    await apiFetch('/profile/pregnancy', {
                        method: 'PUT',
                        body: JSON.stringify({
                            lmpDate: form.lmpDate,
                            dueDate: calculatedDueDate,
                        }),
                    });
                } catch {
                    // If pregnancy profile doesn't exist yet, the transition API will
                    // create it when the mother transitions to postpartum.
                }
            }

            // Update pregnancy profile phase if postpartum
            if (isPostpartum && form.deliveryDate) {
                try {
                    await apiFetch('/profile/pregnancy', {
                        method: 'PUT',
                        body: JSON.stringify({
                            phase: 'postpartum',
                            deliveryDate: form.deliveryDate,
                        }),
                    });
                } catch {
                    // Profile may not exist yet — transition API handles creation
                }
            }

            setSuccessMsg(t('profileUpdated'));
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : t('updateFailed');
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (fetching) {
        return (
            <AuthenticatedShell>
                <div className="flex items-center justify-center py-20">
                    <Spinner />
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
                        <ArrowLeft className="w-4 h-4" />
                        {t('backToDashboard')}
                    </Link>
                    <h1 className="text-2xl font-display text-gradient-mandala">{t('myHealthProfile')}</h1>
                    <p className="text-velvet-600 dark:text-surface-400 mt-1">
                        {t('viewUpdateDesc')}
                    </p>
                </div>

                <Card className="bg-gradient-to-r from-razzmatazz-50 to-primary-50 dark:from-razzmatazz-900/20 dark:to-primary-900/20 border-razzmatazz-200 dark:border-razzmatazz-800">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-velvet-900 flex items-center justify-center shadow-soft">
                                <Baby className="w-5 h-5 text-razzmatazz-500" />
                            </div>
                            <div>
                                <h3 className="font-display text-lg text-surface-800 dark:text-surface-200">{sharedT('profileCardTitle')}</h3>
                                <p className="text-sm text-surface-500 dark:text-surface-400">{sharedT('profileCardDesc')}</p>
                            </div>
                        </div>
                        <Link href="/shared" className="btn-primary btn-sm flex items-center gap-2 whitespace-nowrap">
                            {sharedT('openSharedSpace')}
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </Card>

                {error && (
                    <Card className="border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/20">
                        <p className="text-danger-700 dark:text-danger-300 text-sm">{error}</p>
                    </Card>
                )}


                {successMsg && (
                    <Card className="border-success-200 dark:border-success-800 bg-success-50 dark:bg-success-900/20">
                        <p className="text-success-700 dark:text-success-300 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            {successMsg}
                        </p>
                    </Card>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Measurements */}
                    <Card>
                        <h2 className="text-lg font-semibold text-velvet-800 dark:text-surface-100 mb-4">{t('basicMeasurements')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label={t('heightLabel')}
                                type="number"
                                step="0.1"
                                value={form.height}
                                onChange={e => updateField('height', e.target.value)}
                                placeholder={t('heightPlaceholder')}
                                required
                            />
                            <Input
                                label={t('weightLabel')}
                                type="number"
                                step="0.1"
                                value={form.weight}
                                onChange={e => updateField('weight', e.target.value)}
                                placeholder={t('weightPlaceholder')}
                                required
                            />
                        </div>
                        {bmiResult && (
                            <div className={`mt-4 p-4 rounded-lg border ${bmiResult.catKey === 'bmiHealthy'
                                ? 'bg-success-50 border-success-200 dark:bg-success-900/20 dark:border-success-800'
                                : bmiResult.catKey === 'bmiUnderweight'
                                    ? 'bg-warning-50 border-warning-200 dark:bg-warning-900/20 dark:border-warning-800'
                                    : 'bg-danger-50 border-danger-200 dark:bg-danger-900/20 dark:border-danger-800'
                                }`}>
                                <p className="font-semibold text-sm">
                                    {t('yourBmi')} <span className="text-lg">{bmiResult.value}</span> — <span className="text-lg">{t(bmiResult.catKey)}</span>
                                </p>
                                <p className="text-xs mt-1 text-velvet-600 dark:text-surface-400">{t(bmiResult.msgKey)}</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <Input label={t('cityLabel')} type="text" value={form.city} onChange={e => updateField('city', e.target.value)} placeholder={t('cityPlaceholder')} required />
                            <Input label={t('ageLabel')} type="number" value={form.age} onChange={e => updateField('age', e.target.value)} placeholder={t('agePlaceholder')} required />
                        </div>
                    </Card>

                    {/* Pregnancy Details */}
                    <Card>
                        <h2 className="text-lg font-semibold text-velvet-800 dark:text-surface-100 mb-4">{t('pregnancyDetails')}</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-surface-100 dark:bg-surface-800 rounded-lg">
                                <Checkbox
                                    checked={form.isFirstPregnancy}
                                    onChange={v => updateField('isFirstPregnancy', v)}
                                    label={t('isFirstPregnancyLabel')}
                                />
                            </div>
                            {!form.isFirstPregnancy && (
                                <Input
                                    label={t('numberOfChildrenLabel')}
                                    type="number" min="1"
                                    value={form.numberOfChildren}
                                    onChange={e => updateField('numberOfChildren', e.target.value)}
                                    placeholder={t('numberOfChildrenPlaceholder')}
                                    required={!form.isFirstPregnancy}
                                />
                            )}
                            <Input label={t('lmpDateLabel')} type="date" value={form.lmpDate} onChange={e => updateField('lmpDate', e.target.value)} />
                            {calculatedDueDate && (
                                <div className="p-4 rounded-lg border bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800">
                                    <p className="font-semibold text-sm text-velvet-800 dark:text-surface-100">
                                        {t('calculatedDueDateLabel') || 'Auto-Calculated Due Date'}: <span className="text-lg">{calculatedDueDate}</span>
                                    </p>
                                    <p className="text-xs mt-1 text-velvet-600 dark:text-surface-400">{t('calculatedFromLmp') || 'Calculated from LMP date (LMP + 280 days / 40 weeks)'}</p>
                                </div>
                            )}
                            <Select
                                label={t('bloodGroupLabel')}
                                value={form.bloodGroup}
                                onChange={e => updateField('bloodGroup', e.target.value)}
                                options={[{ value: '', label: t('selectBloodGroup') }, ...BLOOD_GROUPS]}
                                required
                            />
                        </div>
                    </Card>

                    {/* Health & Lifestyle */}
                    <Card>
                        <h2 className="text-lg font-semibold text-velvet-800 dark:text-surface-100 mb-4">{t('healthLifestyle')}</h2>
                        <div className="space-y-4">
                            <Input label={t('allergiesLabel')} type="text" value={form.allergies} onChange={e => updateField('allergies', e.target.value)} placeholder={t('allergiesPlaceholder')} />
                            <Input label={t('medicationsLabel')} type="text" value={form.medications} onChange={e => updateField('medications', e.target.value)} placeholder={t('medicationsPlaceholder')} />
                            <Select
                                label={t('dietLabel')}
                                value={form.diet}
                                onChange={e => updateField('diet', e.target.value)}
                                options={[{ value: '', label: t('selectDiet') }, ...DIET_OPTIONS]}
                                required
                            />
                        </div>
                    </Card>

                    {/* Contact Info */}
                    <Card>
                        <h2 className="text-lg font-semibold text-velvet-800 dark:text-surface-100 mb-4">{t('contactInfo')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label={t('husbandNameLabel')} type="text" value={form.husbandName} onChange={e => updateField('husbandName', e.target.value)} placeholder={t('husbandNamePlaceholder')} required />
                            <Input label={t('emergencyContactLabel')} type="text" value={form.emergencyContact} onChange={e => updateField('emergencyContact', e.target.value)} placeholder={t('emergencyContactPlaceholder')} required />
                            <Input label={t('phoneNumberLabel')} type="tel" value={form.phoneNumber} onChange={e => updateField('phoneNumber', e.target.value)} placeholder={t('phoneNumberPlaceholder')} required />
                        </div>
                    </Card>

                    {/* Medical History */}
                    <Card>
                        <h2 className="text-lg font-semibold text-velvet-800 dark:text-surface-100 mb-4">{t('medicalHistory')}</h2>
                        <p className="text-sm text-velvet-500 mb-4">{t('medicalHistoryDesc')}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {MEDICAL_CONDITIONS.map(cond => (
                                <div key={cond.key} className="flex items-center gap-2 p-2 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                                    <Checkbox
                                        checked={getBool(cond.key)}
                                        onChange={v => updateField(cond.key as keyof FormData, v as boolean as FormData[keyof FormData])}
                                        label={cond.label}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Previous Pregnancy History (if not first) */}
                    {!form.isFirstPregnancy && (
                        <Card>
                            <h2 className="text-lg font-semibold text-velvet-800 dark:text-surface-100 mb-4">{t('previousPregnancyHistory')}</h2>
                            <p className="text-sm text-velvet-500 mb-4">{t('previousPregnancyHistoryDesc')}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {PREVIOUS_HISTORY.map(hist => (
                                    <div key={hist.key} className="flex items-center gap-2 p-2 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                                        <Checkbox
                                            checked={getBool(hist.key)}
                                            onChange={v => updateField(hist.key as keyof FormData, v as boolean as FormData[keyof FormData])}
                                            label={hist.label}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <Input
                                    label={t('pregnancyComplicationsLabel')}
                                    type="text"
                                    value={form.pregnancyComplications}
                                    onChange={e => updateField('pregnancyComplications', e.target.value)}
                                    placeholder={t('pregnancyComplicationsPlaceholder')}
                                />
                            </div>
                        </Card>
                    )}

                    {/* Lifestyle Factors */}
                    <Card>
                        <h2 className="text-lg font-semibold text-velvet-800 dark:text-surface-100 mb-4">{t('lifestyleFactors')}</h2>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex items-center gap-2 p-2 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                                <Checkbox
                                    checked={form.smokingExposure}
                                    onChange={v => updateField('smokingExposure', v)}
                                    label={t('smokingExposureLabel')}
                                />
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                                <Checkbox
                                    checked={form.alcoholExposure}
                                    onChange={v => updateField('alcoholExposure', v)}
                                    label={t('alcoholExposureLabel')}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Delivery & Baby Details (postpartum only) */}
                    {isPostpartum && (
                        <Card>
                            <h2 className="text-lg font-semibold text-velvet-800 dark:text-surface-100 mb-4 flex items-center gap-2">
                                <Baby className="w-5 h-5 text-razzmatazz-500" />
                                {t('deliveryBabyDetails') || 'Delivery & Baby Details'}
                            </h2>
                            <div className="space-y-4">
                                <Input
                                    label={t('deliveryDateLabel') || 'Delivery Date'}
                                    type="date"
                                    value={form.deliveryDate}
                                    onChange={e => updateField('deliveryDate', e.target.value)}
                                />
                                <Select
                                    label={t('deliveryTypeLabel') || 'Delivery Type'}
                                    value={form.deliveryType}
                                    onChange={e => updateField('deliveryType', e.target.value)}
                                    options={[{ value: '', label: t('deliveryTypePlaceholder') || 'Select delivery type' }, ...DELIVERY_TYPE_OPTIONS]}
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input
                                        label={t('babyBirthWeightLabel') || 'Baby Birth Weight (kg)'}
                                        type="number"
                                        step="0.01"
                                        value={form.babyBirthWeight}
                                        onChange={e => updateField('babyBirthWeight', e.target.value)}
                                        placeholder={t('babyBirthWeightPlaceholder') || 'e.g. 3.2'}
                                    />
                                    <Select
                                        label={t('babyGenderLabel') || 'Baby Gender'}
                                        value={form.babyGender}
                                        onChange={e => updateField('babyGender', e.target.value)}
                                        options={[{ value: '', label: t('babyGenderPlaceholder') || 'Select gender' }, ...BABY_GENDER_OPTIONS]}
                                    />
                                </div>
                                <Select
                                    label={t('breastfeedingStatusLabel') || 'Breastfeeding Status'}
                                    value={form.breastfeedingStatus}
                                    onChange={e => updateField('breastfeedingStatus', e.target.value)}
                                    options={[{ value: '', label: t('breastfeedingStatusPlaceholder') || 'Select feeding method' }, ...BREASTFEEDING_OPTIONS]}
                                />
                                <Select
                                    label={t('deliveryComplicationsLabel') || 'Delivery Complications'}
                                    value={form.deliveryComplications}
                                    onChange={e => updateField('deliveryComplications', e.target.value)}
                                    options={[{ value: '', label: t('deliveryComplicationsPlaceholder') || 'Select complications (if any)' }, ...DELIVERY_COMPLICATIONS_OPTIONS]}
                                />
                                <Select
                                    label={t('babyCountLabel') || 'Number of Babies'}
                                    value={form.babyCount}
                                    onChange={e => updateField('babyCount', e.target.value)}
                                    options={BABY_COUNT_OPTIONS}
                                />
                                <div className="flex items-center gap-3 p-3 bg-surface-100 dark:bg-surface-800 rounded-lg">
                                    <Checkbox
                                        checked={form.nicuStay}
                                        onChange={v => updateField('nicuStay', v)}
                                        label={t('nicuStayLabel') || 'Baby required NICU stay'}
                                    />
                                </div>
                                {form.nicuStay && (
                                    <Input
                                        label={t('nicuStayDurationLabel') || 'NICU Stay Duration (days)'}
                                        type="number"
                                        min="1"
                                        value={form.nicuStayDuration}
                                        onChange={e => updateField('nicuStayDuration', e.target.value)}
                                        placeholder={t('nicuStayDurationPlaceholder') || 'e.g. 7'}
                                    />
                                )}
                                <Select
                                    label={t('postpartumSupportLabel') || 'Postpartum Support'}
                                    value={form.postpartumSupport}
                                    onChange={e => updateField('postpartumSupport', e.target.value)}
                                    options={[{ value: '', label: t('postpartumSupportPlaceholder') || 'Select support type' }, ...POSTPARTUM_SUPPORT_OPTIONS]}
                                />
                            </div>
                        </Card>
                    )}

                    {/* Submit */}
                    <div className="flex justify-end">
                        <Button type="submit" loading={isLoading} size="lg" className="px-8">
                            {t('saveChanges')}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedShell>
    );
}