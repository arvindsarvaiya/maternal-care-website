'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button, Input, Card } from '@/components/ui';

type Step = 'email' | 'otp' | 'password';

export default function ForgotPasswordPage() {
    const t = useTranslations('forgotPassword');
    const n = useTranslations('nav');
    const c = useTranslations('common');

    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const handleSendOTP = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await fetch('/api/v1/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setStep('otp');
                setResendCooldown(60);
            } else {
                setError(data.error || 'Failed to send OTP');
            }
        } catch {
            setError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendCooldown > 0) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/v1/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                setResendCooldown(60);
            }
        } catch {
            // silent
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev <= 1) return 0;
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [resendCooldown]);

    const handleVerifyOTP = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (otp.length !== 6) {
            setError(t('invalidCode'));
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch('/api/v1/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();
            if (res.ok) {
                setStep('password');
            } else {
                setError(data.error || 'Invalid code');
            }
        } catch {
            setError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError(t('passwordsDoNotMatch'));
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch('/api/v1/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(t('passwordResetSuccess'));
            } else {
                setError(data.error || 'Failed to reset password');
            }
        } catch {
            setError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToEmail = () => {
        setStep('email');
        setError('');
    };

    return (
        <div className="min-h-screen bg-surface-50 mandala-pattern-dots">
            <header className="sticky top-0 z-50 bg-surface-50/90 backdrop-blur-md border-b border-surface-200">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/home" className="flex items-center gap-2 no-underline group">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-razzmatazz-500 flex items-center justify-center shadow-glow group-hover:shadow-glow-strong transition-shadow">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" opacity="0.6" />
                                    <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5" opacity="0.8" />
                                    <circle cx="12" cy="12" r="1.5" fill="white" />
                                </svg>
                            </div>
                            <span className="text-xl font-display text-gradient-mandala font-semibold">
                                {c('appName')}
                            </span>
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-md">
                    <Card className="p-8" variant="default">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-display text-gradient-mandala mb-2">
                                {t('title')}
                            </h1>
                            <p className="text-surface-500 text-sm">
                                {t('subtitle')}
                            </p>
                        </div>

                        {/* Steps indicator */}
                        <div className="flex items-center justify-center gap-2 mb-8">
                            {(['email', 'otp', 'password'] as Step[]).map((s, i) => (
                                <div key={s} className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${step === s
                                            ? 'bg-primary-500 text-white'
                                            : ['email', 'otp', 'password'].indexOf(step) > i
                                                ? 'bg-primary-100 text-primary-600'
                                                : 'bg-surface-200 text-surface-500'
                                        }`}>
                                        {['email', 'otp', 'password'].indexOf(step) > i ? '✓' : i + 1}
                                    </div>
                                    <span className={`text-xs ${step === s ? 'text-primary-600 font-medium' : 'text-surface-400'
                                        }`}>
                                        {s === 'email' ? t('stepEmail') : s === 'otp' ? t('stepOTP') : t('stepPassword')}
                                    </span>
                                    {i < 2 && <div className="w-6 h-px bg-surface-300" />}
                                </div>
                            ))}
                        </div>

                        {success ? (
                            <div className="text-center">
                                <div className="bg-primary-50 border border-primary-200 text-primary-700 text-sm rounded-lg px-4 py-3 mb-6">
                                    {success}
                                </div>
                                <Link href="/login" className="btn-primary text-sm no-underline">
                                    {t('backToLogin')}
                                </Link>
                            </div>
                        ) : step === 'email' ? (
                            <form onSubmit={handleSendOTP} className="space-y-5">
                                {error && (
                                    <div className="bg-danger-50 border border-danger-200 text-danger-700 text-sm rounded-lg px-4 py-3">
                                        {error}
                                    </div>
                                )}
                                <Input
                                    label={t('emailLabel')}
                                    type="email"
                                    placeholder={t('emailPlaceholder')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button type="submit" variant="primary" className="w-full" size="lg" loading={isLoading}>
                                    {t('sendCode')}
                                </Button>
                            </form>
                        ) : step === 'otp' ? (
                            <form onSubmit={handleVerifyOTP} className="space-y-5">
                                {error && (
                                    <div className="bg-danger-50 border border-danger-200 text-danger-700 text-sm rounded-lg px-4 py-3">
                                        {error}
                                    </div>
                                )}
                                <div>
                                    <Input
                                        label={t('otpLabel')}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        placeholder={t('otpPlaceholder')}
                                        value={otp}
                                        onChange={(e) => {
                                            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                                        }}
                                        required
                                    />
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-surface-400">
                                            {t('reSendIn', { time: `${resendCooldown}${t('seconds')}` })}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleResendOTP}
                                            disabled={resendCooldown > 0}
                                            className="text-xs text-primary-600 hover:text-primary-700 disabled:text-surface-400 disabled:cursor-not-allowed"
                                        >
                                            {t('resendCode')}
                                        </button>
                                    </div>
                                </div>
                                <Button type="submit" variant="primary" className="w-full" size="lg" loading={isLoading}>
                                    {t('verifyCode')}
                                </Button>
                                <button
                                    type="button"
                                    onClick={handleBackToEmail}
                                    className="w-full text-center text-sm text-surface-500 hover:text-primary-600 transition-colors"
                                >
                                    {c('back')}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                {error && (
                                    <div className="bg-danger-50 border border-danger-200 text-danger-700 text-sm rounded-lg px-4 py-3">
                                        {error}
                                    </div>
                                )}
                                <Input
                                    label={t('newPassword')}
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Input
                                    label={t('confirmPassword')}
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <Button type="submit" variant="primary" className="w-full" size="lg" loading={isLoading}>
                                    {t('resetPassword')}
                                </Button>
                            </form>
                        )}

                        {!success && (
                            <p className="mt-6 text-center text-sm text-surface-500">
                                <Link href="/login" className="text-primary-600 hover:text-primary-700 no-underline font-medium">
                                    {t('backToLogin')}
                                </Link>
                            </p>
                        )}
                    </Card>
                </div>
            </main>

            <footer className="border-t border-surface-200 py-8 relative z-10">
                <p className="text-center text-xs text-surface-400">{c('disclaimer')}</p>
            </footer>
        </div>
    );
}