'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { Button, Input, Card, Select, Checkbox, Spinner } from '@/components/ui';
import { apiFetch } from '@/lib/api-client';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Heart, Baby } from 'lucide-react';

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

const DIET_OPTIONS = [
    { value: 'veg', label: 'Vegetarian' },
    { value: 'non-veg', label: 'Non-Vegetarian' },
];

const DELIVERY_TYPE_OPTIONS = [
    { value: 'vaginal', label: 'Vaginal Delivery' },
    { value: 'c-section', label: 'C-Section (Caesarean)' },
    { value: 'assisted', label: 'Assisted Delivery (Forceps/Vacuum)' },
];

const BREASTFEEDING_OPTIONS = [
    { value: 'exclusive', label: 'Exclusive Breastfeeding' },
    { value: 'mixed', label: 'Mixed (Breast + Formula)' },
    { value: 'formula', label: 'Formula Feeding' },
];

const BABY_GENDER_OPTIONS = [
    { value: 'boy', label: 'Boy' },
    { value: 'girl', label: 'Girl' },
    { value: 'prefer-not-say', label: 'Prefer Not to Say' },
];

const DELIVERY_COMPLICATIONS_OPTIONS = [
    { value: 'none', label: 'No Complications' },
    { value: 'hemorrhage', label: 'Postpartum Hemorrhage' },
    { value: 'tears', label: 'Perineal Tears (Grade 3-4)' },
    { value: 'infection', label: 'Postpartum Infection' },
    { value: 'preeclampsia', label: 'Postpartum Preeclampsia' },
    { value: 'other', label: 'Other Complications' },
];

const BABY_COUNT_OPTIONS = [
    { value: '1', label: '1 (Singleton)' },
    { value: '2', label: '2 (Twins)' },
    { value: '3', label: '3 (Triplets)' },
    { value: '4', label: '4+ (Multiples)' },
];

const POSTPARTUM_SUPPORT_OPTIONS = [
    { value: 'family', label: 'Family Support' },
    { value: 'doula', label: 'Doula / Postpartum Caregiver' },
    { value: 'none', label: 'No Dedicated Support' },
    { value: 'other', label: 'Other' },
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
    // Previous pregnancy
    previousMiscarriage: boolean;
    previousCSection: boolean;
    previousPrematureDelivery: boolean;
    previousStillBirth: boolean;
    pregnancyComplications: string;
    // Lifestyle
    smokingExposure: boolean;
    alcoholExposure: boolean;
    // Postpartum
    deliveryType: string;
    deliveryDate: string;
    breastfeedingStatus: string;
    babyBirthWeight: string;
    babyGender: string;
    deliveryComplications: string;
    babyCount: string;
    nicuStay: boolean;
    postpartumSupport: string;
}

const EMPTY_FORM: FormData = {
    height: '',
    weight: '',
    city: '',
    age: '',
    isFirstPregnancy: true,
    numberOfChildren: '',
    lmpDate: '',
    dueDate: '',
    bloodGroup: '',
    allergies: '',
    medications: '',
    diet: '',
    husbandName: '',
    emergencyContact: '',
    phoneNumber: '',
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
    previousMiscarriage: false,
    previousCSection: false,
    previousPrematureDelivery: false,
    previousStillBirth: false,
    pregnancyComplications: '',
    smokingExposure: false,
    alcoholExposure: false,
    deliveryType: '',
    deliveryDate: '',
    breastfeedingStatus: '',
    babyBirthWeight: '',
    babyGender: '',
    deliveryComplications: '',
    babyCount: '1',
    nicuStay: false,
    postpartumSupport: '',
};

// ─── Component ───
export default function ProfileCompletePage() {
    const { user, getDashboardUrl, isPostpartum: authIsPostpartum, isMother } = useAuth();
    const router = useRouter();
    const t = useTranslations('profile');
    const [form, setForm] = useState<FormData>(EMPTY_FORM);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [checkingProfile, setCheckingProfile] = useState(true);
    const [bmiResult, setBmiResult] = useState<{ value: number; category: string; message: string } | null>(null);
    const [detectedPhase, setDetectedPhase] = useState<'pregnancy' | 'postpartum' | null>(null);
    const [dateValidationError, setDateValidationError] = useState('');

    // Detect actual phase from pregnancy profile API (authoritative source)
    // Auth context's isPostpartum only checks roles, not the profile's phase field
    useEffect(() => {
        if (!user?.id || !isMother) return;
        let cancelled = false;
        apiFetch<{ phase?: string }>('/profile/pregnancy')
            .then(data => {
                if (!cancelled && data?.phase) {
                    setDetectedPhase(data.phase as 'pregnancy' | 'postpartum');
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setDetectedPhase(authIsPostpartum ? 'postpartum' : 'pregnancy');
                }
            });
        return () => { cancelled = true; };
    }, [user?.id, isMother, authIsPostpartum]);

    // Use API-detected phase first, fall back to auth context for new postpartum-role users
    const isPostpartum = detectedPhase === 'postpartum' || (detectedPhase === null && authIsPostpartum);

    // Check if profile already exists
    useEffect(() => {
        async function checkProfile() {
            try {
                const res = await apiFetch<{ id: string; deliveryType?: string | null }>('/profile/mother-health');
                if (res && res.id) {
                    // If transitioning to postpartum and postpartum fields not yet filled, stay on completion page
                    if (isPostpartum && !res.deliveryType) {
                        setCheckingProfile(false);
                        return;
                    }
                    // Profile already exists and is complete, redirect to dashboard
                    const dashboardUrl = await getDashboardUrl(user?.roles || []);
                    router.replace(dashboardUrl);
                    return;
                }
            } catch {
                // Profile not found, stay on completion page
            }
            setCheckingProfile(false);
        }
        checkProfile();
    }, [router, isPostpartum]);

    // Calculate BMI on height/weight change
    useEffect(() => {
        const h = parseFloat(form.height);
        const w = parseFloat(form.weight);
        if (h > 0 && w > 0) {
            const bmi = Math.round((w / ((h / 100) * (h / 100))) * 10) / 10;
            let category: string;
            let message: string;
            if (bmi < 18.5) {
                category = 'Underweight';
                message = 'Your BMI indicates you are underweight. Please consult your doctor about healthy weight gain during pregnancy.';
            } else if (bmi < 25) {
                category = 'Healthy Weight';
                message = 'Your BMI is in the healthy range. Maintain a balanced diet and stay active as recommended by your doctor.';
            } else if (bmi < 30) {
                category = 'Overweight';
                message = 'Your BMI indicates you are overweight. Your doctor may recommend a managed diet and safe exercise routine during pregnancy.';
            } else {
                category = 'Obese';
                message = 'Your BMI indicates obesity. Please work closely with your healthcare provider for a safe pregnancy journey.';
            }
            setBmiResult({ value: bmi, category, message });
        } else {
            setBmiResult(null);
        }
    }, [form.height, form.weight]);

    // Validate LMP/Due date consistency in real-time
    useEffect(() => {
        if (!isPostpartum && form.lmpDate && form.dueDate) {
            const lmp = new Date(form.lmpDate);
            const due = new Date(form.dueDate);
            if (!isNaN(lmp.getTime()) && !isNaN(due.getTime())) {
                const expectedDue = new Date(lmp.getTime() + 280 * 86400000);
                const diffDays = Math.abs((due.getTime() - expectedDue.getTime()) / 86400000);
                if (diffDays > 21) {
                    const expectedDate = expectedDue.toISOString().split('T')[0];
                    setDateValidationError(
                        `Due date is inconsistent with LMP date. Based on your LMP (${form.lmpDate}), your expected due date should be around ${expectedDate} (40 weeks / 280 days). Your entered due date (${form.dueDate}) is ${Math.round(diffDays)} days different.`
                    );
                } else {
                    setDateValidationError('');
                }
            }
        } else {
            setDateValidationError('');
        }
    }, [form.lmpDate, form.dueDate, isPostpartum]);

    // Check if due date is past current date and auto-switch to postpartum mode
    useEffect(() => {
        if (form.dueDate && !isPostpartum) {
            const due = new Date(form.dueDate);
            const now = new Date();
            // Reset time to compare dates only
            due.setHours(0, 0, 0, 0);
            now.setHours(0, 0, 0, 0);
            
            if (due < now) {
                // Due date is in the past, switch to postpartum mode
                setDetectedPhase('postpartum');
                // Auto-set delivery date to today if not set
                if (!form.deliveryDate) {
                    setForm(prev => ({ ...prev, deliveryDate: now.toISOString().split('T')[0] }));
                }
            }
        }
    }, [form.dueDate, isPostpartum]);

    const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    /** Safely read a boolean field from the form by string key — used for checkbox arrays */
    const getBool = (key: string): boolean => {
        const val = (form as unknown as Record<string, boolean | string>)[key];
        return typeof val === 'boolean' ? val : false;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate required fields
        const baseRequired = !form.height || !form.weight || !form.city || !form.age || !form.bloodGroup || !form.diet || !form.husbandName || !form.emergencyContact || !form.phoneNumber;
        const postpartumRequired = isPostpartum && (!form.deliveryType || !form.breastfeedingStatus || !form.babyBirthWeight || !form.babyGender);
        if (baseRequired || postpartumRequired) {
            setError('Please fill in all required fields.');
            return;
        }

        // Validate LMP/Due date consistency (±21 day tolerance)
        if (!isPostpartum && form.lmpDate && form.dueDate) {
            const lmp = new Date(form.lmpDate);
            const due = new Date(form.dueDate);
            if (!isNaN(lmp.getTime()) && !isNaN(due.getTime())) {
                const expectedDue = new Date(lmp.getTime() + 280 * 86400000);
                const diffDays = Math.abs((due.getTime() - expectedDue.getTime()) / 86400000);
                if (diffDays > 21) {
                    setError('Due date is inconsistent with LMP date. Expected due date should be approximately 280 days (40 weeks) after LMP.');
                    return;
                }
            }
        }

        // Prevent submission if date validation error exists
        if (dateValidationError) {
            setError(dateValidationError);
            return;
        }

        setIsLoading(true);
        try {
            const height = parseFloat(form.height);
            const weight = parseFloat(form.weight);
            const age = parseInt(form.age, 10);
            const babyBirthWeight = isPostpartum ? parseFloat(form.babyBirthWeight) : undefined;

            await apiFetch('/profile/mother-health', {
                method: 'POST',
                body: JSON.stringify({
                    height,
                    weight,
                    city: form.city,
                    age,
                    isFirstPregnancy: isPostpartum ? false : form.isFirstPregnancy,
                    numberOfChildren: (!isPostpartum && !form.isFirstPregnancy) ? (parseInt(form.numberOfChildren, 10) || 0) : undefined,
                    lmpDate: isPostpartum ? undefined : (form.lmpDate || undefined),
                    dueDate: isPostpartum ? undefined : (form.dueDate || undefined),
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
                    previousMiscarriage: (!isPostpartum && !form.isFirstPregnancy) ? form.previousMiscarriage : undefined,
                    previousCSection: (!isPostpartum && !form.isFirstPregnancy) ? form.previousCSection : undefined,
                    previousPrematureDelivery: (!isPostpartum && !form.isFirstPregnancy) ? form.previousPrematureDelivery : undefined,
                    previousStillBirth: (!isPostpartum && !form.isFirstPregnancy) ? form.previousStillBirth : undefined,
                    pregnancyComplications: (!isPostpartum && !form.isFirstPregnancy) ? form.pregnancyComplications || undefined : undefined,
                    smokingExposure: form.smokingExposure,
                    alcoholExposure: form.alcoholExposure,
                    // Postpartum fields
                    deliveryType: isPostpartum ? form.deliveryType : undefined,
                    deliveryDate: isPostpartum ? form.deliveryDate : undefined,
                    breastfeedingStatus: isPostpartum ? form.breastfeedingStatus : undefined,
                    babyBirthWeight: isPostpartum ? babyBirthWeight : undefined,
                    babyGender: isPostpartum ? form.babyGender : undefined,
                    deliveryComplications: isPostpartum ? (form.deliveryComplications || undefined) : undefined,
                    babyCount: isPostpartum ? (parseInt(form.babyCount, 10) || 1) : undefined,
                    nicuStay: isPostpartum ? form.nicuStay : undefined,
                    postpartumSupport: isPostpartum ? (form.postpartumSupport || undefined) : undefined,
                }),
            });

            // Update pregnancy profile phase if postpartum
            if (isPostpartum) {
                await apiFetch('/profile/pregnancy', {
                    method: 'PUT',
                    body: JSON.stringify({
                        phase: 'postpartum',
                        deliveryDate: form.deliveryDate,
                    }),
                });
            }

            const dashboardUrl = isPostpartum ? '/postpartum' : await getDashboardUrl(user?.roles || []);
            router.push(dashboardUrl);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to save profile. Please try again.';
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
                    <h1 className="text-2xl font-display text-gradient-mandala mb-2">
                        {isPostpartum ? t('completeTitlePostpartum') || t('completeTitle') : t('completeTitle')}
                    </h1>
                    <p className="text-velvet-600 dark:text-surface-400">
                        {isPostpartum
                            ? (t('completeWelcomePostpartum', { name: user.firstName }) || t('completeWelcome', { name: user.firstName }))
                            : t('completeWelcome', { name: user.firstName })}
                    </p>
                </div>

                {error && (
                    <Card className="mb-6 border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/20">
                        <p className="text-danger-700 dark:text-danger-300 text-sm">{error}</p>
                    </Card>
                )}

                {dateValidationError && (
                    <Card className="mb-6 border-warning-200 dark:border-warning-800 bg-warning-50 dark:bg-warning-900/20">
                        <p className="text-warning-700 dark:text-warning-300 text-sm">{dateValidationError}</p>
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
                            <div className={`mt-4 p-4 rounded-lg border ${bmiResult.category === 'Healthy Weight'
                                ? 'bg-success-50 border-success-200 dark:bg-success-900/20 dark:border-success-800'
                                : bmiResult.category === 'Underweight'
                                    ? 'bg-warning-50 border-warning-200 dark:bg-warning-900/20 dark:border-warning-800'
                                    : 'bg-danger-50 border-danger-200 dark:bg-danger-900/20 dark:border-danger-800'
                                }`}>
                                <p className="font-semibold text-sm">
                                    {t('yourBmi')} <span className="text-lg">{bmiResult.value}</span> — <span className="text-lg">{bmiResult.category}</span>
                                </p>
                                <p className="text-xs mt-1 text-velvet-600 dark:text-surface-400">{bmiResult.message}</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <Input
                                label={t('cityLabel')}
                                type="text"
                                value={form.city}
                                onChange={e => updateField('city', e.target.value)}
                                placeholder={t('cityPlaceholder')}
                                required
                            />
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

                    {/* Pregnancy Details (hidden for postpartum) */}
                    {!isPostpartum && (
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
                                        type="number"
                                        min="1"
                                        value={form.numberOfChildren}
                                        onChange={e => updateField('numberOfChildren', e.target.value)}
                                        placeholder={t('numberOfChildrenPlaceholder')}
                                        required={!form.isFirstPregnancy}
                                    />
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input
                                        label={t('lmpDateLabel')}
                                        type="date"
                                        value={form.lmpDate}
                                        onChange={e => updateField('lmpDate', e.target.value)}
                                    />
                                    <Input
                                        label={t('dueDateLabel')}
                                        type="date"
                                        value={form.dueDate}
                                        onChange={e => updateField('dueDate', e.target.value)}
                                    />
                                </div>
                                <Select
                                    label={t('bloodGroupLabel')}
                                    value={form.bloodGroup}
                                    onChange={e => updateField('bloodGroup', e.target.value)}
                                    options={[{ value: '', label: t('selectBloodGroup') }, ...BLOOD_GROUPS]}
                                    required
                                />
                            </div>
                        </Card>
                    )}

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
                                    required
                                />
                                <Select
                                    label={t('deliveryTypeLabel') || 'Delivery Type'}
                                    value={form.deliveryType}
                                    onChange={e => updateField('deliveryType', e.target.value)}
                                    options={[{ value: '', label: t('deliveryTypePlaceholder') || 'Select delivery type' }, ...DELIVERY_TYPE_OPTIONS]}
                                    required
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input
                                        label={t('babyBirthWeightLabel') || 'Baby Birth Weight (kg)'}
                                        type="number"
                                        step="0.01"
                                        value={form.babyBirthWeight}
                                        onChange={e => updateField('babyBirthWeight', e.target.value)}
                                        placeholder={t('babyBirthWeightPlaceholder') || 'e.g. 3.2'}
                                        required
                                    />
                                    <Select
                                        label={t('babyGenderLabel') || 'Baby Gender'}
                                        value={form.babyGender}
                                        onChange={e => updateField('babyGender', e.target.value)}
                                        options={[{ value: '', label: t('babyGenderPlaceholder') || 'Select gender' }, ...BABY_GENDER_OPTIONS]}
                                        required
                                    />
                                </div>
                                <Select
                                    label={t('breastfeedingStatusLabel') || 'Breastfeeding Status'}
                                    value={form.breastfeedingStatus}
                                    onChange={e => updateField('breastfeedingStatus', e.target.value)}
                                    options={[{ value: '', label: t('breastfeedingStatusPlaceholder') || 'Select feeding method' }, ...BREASTFEEDING_OPTIONS]}
                                    required
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
                                <Select
                                    label={t('postpartumSupportLabel') || 'Postpartum Support'}
                                    value={form.postpartumSupport}
                                    onChange={e => updateField('postpartumSupport', e.target.value)}
                                    options={[{ value: '', label: t('postpartumSupportPlaceholder') || 'Select support type' }, ...POSTPARTUM_SUPPORT_OPTIONS]}
                                />
                                <Select
                                    label={t('bloodGroupLabel')}
                                    value={form.bloodGroup}
                                    onChange={e => updateField('bloodGroup', e.target.value)}
                                    options={[{ value: '', label: t('selectBloodGroup') }, ...BLOOD_GROUPS]}
                                    required
                                />
                            </div>
                        </Card>
                    )}

                    {/* Health & Lifestyle */}
                    <Card>
                        <h2 className="text-lg font-semibold text-velvet-800 dark:text-surface-100 mb-4">{t('healthLifestyle')}</h2>
                        <div className="space-y-4">
                            <Input
                                label={t('allergiesLabel')}
                                type="text"
                                value={form.allergies}
                                onChange={e => updateField('allergies', e.target.value)}
                                placeholder={t('allergiesPlaceholder')}
                            />
                            <Input
                                label={t('medicationsLabel')}
                                type="text"
                                value={form.medications}
                                onChange={e => updateField('medications', e.target.value)}
                                placeholder={t('medicationsPlaceholder')}
                            />
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
                            <Input
                                label={t('husbandNameLabel')}
                                type="text"
                                value={form.husbandName}
                                onChange={e => updateField('husbandName', e.target.value)}
                                placeholder={t('husbandNamePlaceholder')}
                                required
                            />
                            <Input
                                label={t('emergencyContactLabel')}
                                type="text"
                                value={form.emergencyContact}
                                onChange={e => updateField('emergencyContact', e.target.value)}
                                placeholder={t('emergencyContactPlaceholder')}
                                required
                            />
                            <Input
                                label={t('phoneNumberLabel')}
                                type="tel"
                                value={form.phoneNumber}
                                onChange={e => updateField('phoneNumber', e.target.value)}
                                placeholder={t('phoneNumberPlaceholder')}
                                required
                            />
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

                    {/* Previous Pregnancy History (if not first and not postpartum) */}
                    {!isPostpartum && !form.isFirstPregnancy && (
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