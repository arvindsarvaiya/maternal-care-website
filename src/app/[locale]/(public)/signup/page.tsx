'use client';

import { useState, FormEvent } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/auth-provider';
import { Button, Input, Card } from '@/components/ui';
import { LanguageButton } from '@/components/language-selector';
import { Eye, EyeOff } from 'lucide-react';

type Role = 'mother' | 'partner' | 'postpartum';

interface RoleOption {
    role: Role;
    icon: string;
}

const ROLE_OPTIONS: RoleOption[] = [
    { role: 'mother', icon: '🤰' },
    { role: 'partner', icon: '💙' },
    { role: 'postpartum', icon: '👶' },
];

export default function SignupPage() {
    const t = useTranslations('signup');
    const n = useTranslations('nav');
    const c = useTranslations('common');
    const { signup } = useAuth();
    const router = useRouter();

    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [partnerCode, setPartnerCode] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRoleSelect = (role: Role) => {
        setSelectedRole(role);
        setError('');
    };

    const handleBack = () => {
        setSelectedRole(null);
        setError('');
    };

    const validateForm = (): string | null => {
        if (!selectedRole) return t('selectRoleError');
        if (!firstName || !lastName || !email || !password || !confirmPassword) return t('error');
        if (password !== confirmPassword) return t('passwordsDoNotMatch');
        if (selectedRole === 'postpartum' && !deliveryDate) return t('deliveryDateRequired') || 'Please enter your delivery date';
        return null;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await signup({
                firstName,
                lastName,
                email,
                phone: phone || undefined,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : undefined,
                password,
                role: selectedRole!,
                partnerCode: selectedRole === 'partner' && partnerCode ? partnerCode : undefined,
                deliveryDate: selectedRole === 'postpartum' && deliveryDate ? new Date(deliveryDate).toISOString() : undefined,
            });
            // Redirect mothers to profile completion, partners to father profile completion, postpartum to profile completion
            if (selectedRole === 'mother') {
                router.push('/profile/complete');
            } else if (selectedRole === 'partner') {
                router.push('/profile/complete-father');
            } else if (selectedRole === 'postpartum') {
                router.push('/profile/complete');
            } else {
                router.push('/partner');
            }
        } catch (err: any) {
            setError(err.message || t('error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative bg-[#F7EDFF]">
            {/* Background image overlay at 30% opacity */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
                style={{ backgroundImage: "url('/images/signup-bg.png')" }}
            />
            <div className="relative z-10">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-surface-200">
                    <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
                        <Link href="/home" className="no-underline shrink-0">
                            <span className="font-semibold text-[#9511F4] text-xl">MaternalCare</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-1">
                            <Link href="/home" className="px-3 py-1.5 text-sm text-[#9511F4] hover:text-[#7a0ed4] rounded-lg hover:bg-surface-50 transition-colors no-underline">
                                {n('home')}
                            </Link>
                            <Link href="/about" className="px-3 py-1.5 text-sm text-[#9511F4] hover:text-[#7a0ed4] rounded-lg hover:bg-surface-50 transition-colors no-underline">
                                {n('about')}
                            </Link>
                            <Link href="/faq" className="px-3 py-1.5 text-sm text-[#9511F4] hover:text-[#7a0ed4] rounded-lg hover:bg-surface-50 transition-colors no-underline">
                                {n('faq')}
                            </Link>
                            <Link href="/facts-and-myths" className="px-3 py-1.5 text-sm text-[#9511F4] hover:text-[#7a0ed4] rounded-lg hover:bg-surface-50 transition-colors no-underline">
                                {n('factsAndMyths')}
                            </Link>
                        </nav>
                        <div className="flex items-center gap-2">
                            <LanguageButton />
                            <div className="flex items-center gap-1 md:hidden">
                                <Link href="/home" className="px-2 py-1 text-xs text-[#9511F4] hover:text-[#7a0ed4] no-underline">
                                    {n('home')}
                                </Link>
                                <Link href="/about" className="px-2 py-1 text-xs text-[#9511F4] hover:text-[#7a0ed4] no-underline">
                                    {n('about')}
                                </Link>
                                <Link href="/faq" className="px-2 py-1 text-xs text-[#9511F4] hover:text-[#7a0ed4] no-underline">
                                    {n('faq')}
                                </Link>
                                <Link href="/facts-and-myths" className="px-2 py-1 text-xs text-[#9511F4] hover:text-[#7a0ed4] no-underline">
                                    {n('factsAndMyths')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex items-center justify-start px-8 sm:px-24 lg:px-40 py-16">
                    <div className="w-full max-w-md">
                        <Card className="p-8" variant="default">
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-display mb-2" style={{ background: 'linear-gradient(96.55deg, #9511F4 4.98%, #D6006D 101.86%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                    {t('title')}
                                </h1>
                                <p className="text-[#4A698F] text-sm">
                                    {t('subtitle')}
                                </p>
                            </div>

                            {!selectedRole ? (
                                <>
                                    <p className="text-sm text-[#4A698F] mb-4 font-medium">
                                        {t('selectRole')}
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                                        {ROLE_OPTIONS.map((option) => (
                                            <button
                                                key={option.role}
                                                type="button"
                                                onClick={() => handleRoleSelect(option.role)}
                                                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-surface-200 bg-white hover:border-[#9511F4]/30 hover:bg-[#9511F4]/5 transition-all duration-200"
                                            >
                                                <span className="text-3xl">{option.icon}</span>
                                                <span className="text-sm font-medium text-[#9511F4]">
                                                    {option.role === 'mother' ? t('roleMother') : option.role === 'partner' ? t('rolePartner') : (t('rolePostpartum') || 'Postpartum')}
                                                </span>
                                                <span className="text-xs text-surface-500">
                                                    {option.role === 'mother' ? t('roleMotherDesc') : option.role === 'partner' ? t('rolePartnerDesc') : (t('rolePostpartumDesc') || 'Already delivered')}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {error && (
                                        <div className="bg-danger-50 border border-danger-200 text-danger-700 text-sm rounded-lg px-4 py-3">
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label={t('firstName')}
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                        />
                                        <Input
                                            label={t('lastName')}
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Input
                                        label={t('email')}
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <Input
                                        label={t('phone')}
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    <Input
                                        label={t('dateOfBirth')}
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                    />
                                    <div className="relative">
                                        <Input
                                            label={t('password')}
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            helpText={t('passwordHint')}
                                        />
                                    </div>
                                    <div className="relative">
                                        <Input
                                            label={t('confirmPassword')}
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Partner code input — only shown when partner role is selected */}
                                    {selectedRole === 'partner' && (
                                        <div>
                                            <Input
                                                label={t('partnerCode') || 'Partner Code'}
                                                value={partnerCode}
                                                onChange={(e) => setPartnerCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                placeholder="Enter 6-digit partner code"
                                                maxLength={6}
                                                helpText={t('partnerCodeHelp') || 'Enter the code shared by the mother to link your accounts'}
                                            />
                                        </div>
                                    )}

                                    {/* Delivery date input — only shown when postpartum role is selected */}
                                    {selectedRole === 'postpartum' && (
                                        <div>
                                            <Input
                                                label={t('deliveryDate') || 'Delivery Date'}
                                                type="date"
                                                value={deliveryDate}
                                                onChange={(e) => setDeliveryDate(e.target.value)}
                                                required
                                                helpText={t('deliveryDateHelp') || 'When was your baby born?'}
                                            />
                                        </div>
                                    )}

                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-surface-600">
                                        <input
                                            type="checkbox"
                                            checked={showPassword}
                                            onChange={(e) => setShowPassword(e.target.checked)}
                                            className="rounded"
                                        />
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        Show password
                                    </label>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full"
                                        size="lg"
                                        loading={isLoading}
                                    >
                                        {t('createAccount')}
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="w-full text-center text-sm text-surface-500 hover:text-[#9511F4] transition-colors"
                                    >
                                        {c('back')}
                                    </button>
                                </form>
                            )}

                            <p className="mt-6 text-center text-sm text-surface-500">
                                {t('haveAccount')}{' '}
                                <Link href="/login" className="text-[#9511F4] hover:text-[#7a0ed4] no-underline font-medium">
                                    {t('signIn')}
                                </Link>
                            </p>
                        </Card>
                    </div>
                </main>


            </div>{/* close relative z-10 wrapper */}
        </div>
    );
}