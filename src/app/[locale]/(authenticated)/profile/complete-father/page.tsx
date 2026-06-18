'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { Button, Input, Card, Select, Checkbox, Spinner } from '@/components/ui';
import { apiFetch } from '@/lib/api-client';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Heart } from 'lucide-react';

// ─── Constants ───
const SMOKING_STATUS_OPTIONS = [
    { value: 'never', label: 'Never smoked' },
    { value: 'former', label: 'Former smoker' },
    { value: 'current', label: 'Current smoker' },
];

const PHYSICAL_ACTIVITY_OPTIONS = [
    { value: 'sedentary', label: 'Sedentary' },
    { value: 'lightly_active', label: 'Lightly Active' },
    { value: 'moderately_active', label: 'Moderately Active' },
    { value: 'very_active', label: 'Very Active' },
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
    height: '',
    weight: '',
    age: '',
    occupation: '',
    workingHours: '',
    livingWithMother: true,
    isFirstTimeFather: true,
    diabetes: false,
    highBP: false,
    lowBP: false,
    thyroidDisorder: false,
    pcos: false,
    asthma: false,
    heartDisease: false,
    kidneyIssues: false,
    epilepsy: false,
    anemia: false,
    depressionAnxiety: false,
    smokingStatus: 'never',
    tobaccoConsumption: false,
    drugExposure: false,
    physicalActivity: 'sedentary',
};

// ─── Component ───
export default function FatherProfileCompletePage() {
    const { user } = useAuth();
    const router = useRouter();
    const t = useTranslations('fatherProfile');
    const [form, setForm] = useState<FormData>(EMPTY_FORM);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [checkingProfile, setCheckingProfile] = useState(true);
    const [bmiResult, setBmiResult] = useState<{ value: number; catKey: string; msgKey: string } | null>(null);

    // Check if profile already exists
    useEffect(() => {
        async function checkProfile() {
            try {
                const res = await apiFetch<{ id: string }>('/profile/father-health');
                if (res && res.id) {
                    router.replace('/partner');
                    return;
                }
            } catch {
                // Profile not found, stay on completion page
            }
            setCheckingProfile(false);
        }
        checkProfile();
    }, [router]);

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
    }, [form.height, form.weight]);

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
                method: 'POST',
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

            router.push('/partner');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : t('fillRequiredFields');
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (checkingProfile) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-surface-50 mandala-pattern-dots">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-surface-50/90 backdrop-blur-md border-b border-surface-200">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/home" className="flex items-center gap-2 no-underline group">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-razzmatazz-500 flex items-center justify-center shadow-glow">
                                <Heart className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-display text-velvet-800 dark:text-surface-100">MaternalCare</span>
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-velvet-600">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-razzmatazz-400 flex items-center justify-center">
                                <span className="text-xs font-medium text-white">
                                    {user.firstName[0]}{user.lastName[0]}
                                </span>
                            </div>
                            <span>{user.firstName} {user.lastName}</span>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-display text-gradient-mandala mb-2">{t('completeTitle')}</h1>
                    <p className="text-velvet-600 dark:text-surface-400">
                        {t('completeWelcome', { name: user.firstName })}
                    </p>
                </div>

                {error && (
                    <Card className="mb-6 border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/20">
                        <p className="text-danger-700 dark:text-danger-300 text-sm">{error}</p>
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
                            <Input
                                label={t('ageLabel')}
                                type="number"
                                value={form.age}
                                onChange={e => updateField('age', e.target.value)}
                                placeholder={t('agePlaceholder')}
                                required
                            />
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
                                options={[
                                    { value: 'never', label: t('smokingStatusNever') },
                                    { value: 'former', label: t('smokingStatusFormer') },
                                    { value: 'current', label: t('smokingStatusCurrent') },
                                ]}
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
                                options={[
                                    { value: 'sedentary', label: t('physicalActivitySedentary') },
                                    { value: 'lightly_active', label: t('physicalActivityLightlyActive') },
                                    { value: 'moderately_active', label: t('physicalActivityModeratelyActive') },
                                    { value: 'very_active', label: t('physicalActivityVeryActive') },
                                ]}
                            />
                        </div>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <Button type="submit" loading={isLoading} size="lg" className="px-8">
                            {t('saveProfile')}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}