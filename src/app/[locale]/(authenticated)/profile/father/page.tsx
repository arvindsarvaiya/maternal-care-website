'use client';

import { useState, useEffect, FormEvent, useCallback, useMemo } from 'react';
import { LocaleLink as Link, useLocaleRouter } from '@/i18n/locale-link';
import { useAuth } from '@/components/auth-provider';
import { Button, Input, Card, Select, Checkbox, Spinner } from '@/components/ui';
import { apiFetch } from '@/lib/api-client';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Heart } from 'lucide-react';
import { AuthenticatedShell } from '@/components/authenticated-shell';

// ─── Constants ───
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

interface FormData {
    height: string;
    weight: string;
    age: string;
    occupation: string;
    workingHours: string;
    livingWithMother: boolean;
    isFirstTimeFather: boolean;
    // Medical
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
    // Lifestyle
    smokingStatus: string;
    tobaccoConsumption: boolean;
    drugExposure: boolean;
    physicalActivity: string;
}

const EMPTY_FORM: FormData = {
    height: '', weight: '', age: '', occupation: '', workingHours: '',
    livingWithMother: true, isFirstTimeFather: true,
    diabetes: false, highBP: false, lowBP: false, thyroidDisorder: false,
    pcos: false, asthma: false, heartDisease: false, kidneyIssues: false,
    epilepsy: false, anemia: false, depressionAnxiety: false,
    smokingStatus: 'never', tobaccoConsumption: false, drugExposure: false,
    physicalActivity: 'sedentary',
};

interface ProfileData {
    id: string;
    height: number;
    weight: number;
    bmi: number;
    bmiCategory: string;
    age: number;
    occupation: string;
    workingHours: number;
    livingWithMother: boolean;
    isFirstTimeFather: boolean;
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
    smokingStatus: string;
    tobaccoConsumption: boolean;
    drugExposure: boolean;
    physicalActivity: string;
    profileCompleted: boolean;
    createdAt: string;
    updatedAt: string;
}

// ─── Component ───
export default function FatherProfilePage() {
    const { user } = useAuth();
    const router = useLocaleRouter();
    const t = useTranslations('fatherProfile');

    // ── Translated option arrays ──
    const SMOKING_STATUS_OPTIONS = useMemo(() => [
        { value: 'never', label: t('smokingStatusNever') },
        { value: 'former', label: t('smokingStatusFormer') },
        { value: 'current', label: t('smokingStatusCurrent') },
    ], [t]);

    const PHYSICAL_ACTIVITY_OPTIONS = useMemo(() => [
        { value: 'sedentary', label: t('physicalActivitySedentary') },
        { value: 'lightly_active', label: t('physicalActivityLightlyActive') },
        { value: 'moderately_active', label: t('physicalActivityModeratelyActive') },
        { value: 'very_active', label: t('physicalActivityVeryActive') },
    ], [t]);

    const [form, setForm] = useState<FormData>(EMPTY_FORM);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [bmiResult, setBmiResult] = useState<{ value: number; catKey: string; msgKey: string } | null>(null);

    // Fetch existing profile
    const fetchProfile = useCallback(async () => {
        try {
            const res = await apiFetch<ProfileData>('/profile/father-health');
            if (res && res.id) {
                setForm({
                    height: String(res.height),
                    weight: String(res.weight),
                    age: String(res.age),
                    occupation: res.occupation,
                    workingHours: String(res.workingHours),
                    livingWithMother: res.livingWithMother,
                    isFirstTimeFather: res.isFirstTimeFather,
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
                    smokingStatus: res.smokingStatus,
                    tobaccoConsumption: res.tobaccoConsumption,
                    drugExposure: res.drugExposure,
                    physicalActivity: res.physicalActivity,
                });
            }
        } catch {
            // Profile not found — redirect to completion page
            router.replace('/profile/complete-father');
        }
        setFetching(false);
    }, [router]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

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

        if (!form.height || !form.weight || !form.age || !form.occupation) {
            setError(t('fillRequiredFields'));
            return;
        }

        setIsLoading(true);
        try {
            const height = parseFloat(form.height);
            const weight = parseFloat(form.weight);
            const age = parseInt(form.age, 10);
            const workingHours = parseInt(form.workingHours, 10) || 0;

            await apiFetch('/profile/father-health', {
                method: 'PUT',
                body: JSON.stringify({
                    height,
                    weight,
                    age,
                    occupation: form.occupation,
                    workingHours,
                    livingWithMother: form.livingWithMother,
                    isFirstTimeFather: form.isFirstTimeFather,
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
                    smokingStatus: form.smokingStatus,
                    tobaccoConsumption: form.tobaccoConsumption,
                    drugExposure: form.drugExposure,
                    physicalActivity: form.physicalActivity,
                }),
            });

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
                    <Link href="/partner" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-2">
                        <ArrowLeft className="w-4 h-4" />
                        {t('backToDashboard')}
                    </Link>
                    <h1 className="text-2xl font-display text-gradient-mandala">{t('myHealthProfile')}</h1>
                    <p className="text-velvet-600 dark:text-surface-400 mt-1">
                        {t('viewUpdateDesc')}
                    </p>
                </div>

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
                            <Input label={t('ageLabel')} type="number" value={form.age} onChange={e => updateField('age', e.target.value)} placeholder={t('agePlaceholder')} required />
                        </div>
                    </Card>

                    {/* Personal Information */}
                    <Card>
                        <h2 className="text-lg font-semibold text-velvet-800 dark:text-surface-100 mb-4">{t('personalInfo')}</h2>
                        <div className="space-y-4">
                            <Input
                                label={t('occupationLabel')}
                                type="text"
                                value={form.occupation}
                                onChange={e => updateField('occupation', e.target.value)}
                                placeholder={t('occupationPlaceholder')}
                                required
                            />
                            <Input
                                label={t('workingHoursLabel')}
                                type="number"
                                min="0"
                                max="24"
                                value={form.workingHours}
                                onChange={e => updateField('workingHours', e.target.value)}
                                placeholder={t('workingHoursPlaceholder')}
                            />
                            <div className="flex items-center gap-3 p-3 bg-surface-100 dark:bg-surface-800 rounded-lg">
                                <Checkbox
                                    checked={form.livingWithMother}
                                    onChange={v => updateField('livingWithMother', v)}
                                    label={t('livingWithMotherLabel')}
                                />
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-surface-100 dark:bg-surface-800 rounded-lg">
                                <Checkbox
                                    checked={form.isFirstTimeFather}
                                    onChange={v => updateField('isFirstTimeFather', v)}
                                    label={t('isFirstTimeFatherLabel')}
                                />
                            </div>
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

                    {/* Lifestyle Factors */}
                    <Card>
                        <h2 className="text-lg font-semibold text-velvet-800 dark:text-surface-100 mb-4">{t('lifestyleFactors')}</h2>
                        <div className="space-y-4">
                            <Select
                                label={t('smokingStatusLabel')}
                                value={form.smokingStatus}
                                onChange={e => updateField('smokingStatus', e.target.value)}
                                options={SMOKING_STATUS_OPTIONS}
                            />
                            <div className="flex items-center gap-2 p-2 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                                <Checkbox
                                    checked={form.tobaccoConsumption}
                                    onChange={v => updateField('tobaccoConsumption', v)}
                                    label={t('tobaccoConsumptionLabel')}
                                />
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                                <Checkbox
                                    checked={form.drugExposure}
                                    onChange={v => updateField('drugExposure', v)}
                                    label={t('drugExposureLabel')}
                                />
                            </div>
                            <Select
                                label={t('physicalActivityLabel')}
                                value={form.physicalActivity}
                                onChange={e => updateField('physicalActivity', e.target.value)}
                                options={PHYSICAL_ACTIVITY_OPTIONS}
                            />
                        </div>
                    </Card>

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