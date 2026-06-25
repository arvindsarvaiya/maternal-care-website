'use client';

import { useState, FormEvent } from 'react';
import { LocaleLink as Link, useLocaleRouter } from '@/i18n/locale-link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/auth-provider';
import { Button, Input, Card } from '@/components/ui';
import { LanguageButton } from '@/components/language-selector';

// Valid local paths that are safe to redirect to after login.
// All authenticated routes are prefixed with the locale and path.
const SAFE_REDIRECT_PATHS = [
  '/mother',
  '/partner',
  '/shared',
  '/chat',
  '/appointments',
  '/wellness',
  '/symptoms',
  '/weekly-journey',
  '/vaccinations',
  '/notifications',
  '/settings',
  '/admin',
  '/profile',
  '/meal-planner',
];

function isValidRedirect(target: string): boolean {
  // Must be a local path (starts with /) to prevent open redirect attacks
  if (!target.startsWith('/')) return false;
  return SAFE_REDIRECT_PATHS.some(p => target.startsWith(p));
}

export default function LoginPage() {
  const t = useTranslations('login');
  const n = useTranslations('nav');
  const c = useTranslations('common');
  const { login, verify2FA, getDashboardUrl } = useAuth();
  const router = useLocaleRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  // Validate redirect target to prevent open redirect attacks
  const redirectParam = rawRedirect && isValidRedirect(rawRedirect) ? rawRedirect : null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2FA state
  const [show2FA, setShow2FA] = useState(false);
  const [intermediateToken, setIntermediateToken] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.requires2FA) {
        setIntermediateToken(result.intermediateToken!);
        setShow2FA(true);
      } else {
        const dashboardUrl = await getDashboardUrl(result.user?.roles || []);
        router.push(redirectParam || dashboardUrl);
      }
    } catch (err: any) {
      setError(err.message || t('invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToCredentials = () => {
    setShow2FA(false);
    setTotpCode('');
    setTwoFactorError('');
  };

  const handle2FAVerify = async (e: FormEvent) => {
    e.preventDefault();
    setTwoFactorError('');
    if (!totpCode || totpCode.length !== 6) {
      setTwoFactorError(t('invalidCode'));
      return;
    }
    try {
      const user = await verify2FA(intermediateToken, totpCode);
      const dashboardUrl = await getDashboardUrl(user.roles);
      router.push(redirectParam || dashboardUrl);
    } catch (err: any) {
      setTwoFactorError(err.message || t('twoFactorFailed'));
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col font-yatra bg-[#F7EDFF]">
      {/* Background image overlay at 30% opacity */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{ backgroundImage: "url('/images/signup-bg.png')" }}
      />

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
            {/* Mobile nav links */}
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

      <main className="flex-1 flex items-center justify-start px-8 sm:px-24 lg:px-40 py-16 relative z-10">
        <div className="w-full max-w-md">
          <Card className="p-8" variant="default">
            {!show2FA ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-yatra mb-2" style={{ background: 'linear-gradient(96.55deg, #9511F4 4.98%, #D6006D 101.86%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {t('title')}
                  </h1>
                  <p className="text-[#4A698F] text-sm">
                    {t('subtitle')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-danger-50 border border-danger-200 text-danger-700 text-sm rounded-lg px-4 py-3">
                      {error}
                    </div>
                  )}

                  <Input
                    label={t('emailOrPhone')}
                    type="text"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    label={t('password')}
                    type="password"
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <div className="text-right">
                    <Link href="/forgot-password" className="text-sm text-[#9511F4] hover:text-[#7a0ed4] no-underline">
                      {t('forgotPassword')}
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    size="lg"
                    loading={isLoading}
                  >
                    {t('signIn')}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-surface-500">
                  {t('noAccount')}{' '}
                  <Link href="/signup" className="text-[#9511F4] hover:text-[#7a0ed4] no-underline font-medium">
                    {t('createOne')}
                  </Link>
                </p>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-yatra mb-2" style={{ background: 'linear-gradient(96.55deg, #9511F4 4.98%, #D6006D 101.86%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {t('twoFactorTitle')}
                  </h1>
                  <p className="text-[#4A698F] text-sm">
                    {t('twoFactorSubtitle')}
                  </p>
                </div>

                <form onSubmit={handle2FAVerify} className="space-y-5">
                  {twoFactorError && (
                    <div className="bg-danger-50 border border-danger-200 text-danger-700 text-sm rounded-lg px-4 py-3">
                      {twoFactorError}
                    </div>
                  )}

                  <div>
                    <Input
                      label={t('authCode')}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                    />
                    <p className="text-xs text-surface-400 mt-2">
                      {t('authCodeHint')}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    size="lg"
                    loading={isLoading}
                  >
                    {t('verifyCode')}
                  </Button>
                </form>

                <button
                  onClick={handleBackToCredentials}
                  className="mt-6 w-full text-center text-sm text-surface-500 hover:text-[#9511F4] transition-colors"
                >
                  {t('backToSignIn')}
                </button>
              </>
            )}
          </Card>
        </div>
      </main>

    </div>
  );
}