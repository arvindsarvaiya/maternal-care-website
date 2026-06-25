'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { setTokenGetter } from '@/lib/api-client';

// ─── Types ───

interface User {
    id: string;
    email: string | null;
    firstName: string;
    lastName: string;
    roles: string[];
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<LoginResult>;
    verify2FA: (intermediateToken: string, totpCode: string) => Promise<User>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => void;
    isMother: boolean;
    isPartner: boolean;
    isAdmin: boolean;
    isPostpartum: boolean;
    getDashboardUrl: (roles: string[]) => Promise<string>;
}

interface SignupData {
    email?: string;
    phone?: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'mother' | 'partner' | 'caregiver' | 'family' | 'postpartum';
    dateOfBirth?: string;
    partnerCode?: string;
    deliveryDate?: string;
}

interface LoginResult {
    requires2FA: boolean;
    intermediateToken?: string;
    user?: User;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ───

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Check for stored token on mount
    useEffect(() => {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;
        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                setTokenGetter(() => storedToken);
            } catch {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
            }
        }
        setLoading(false);
    }, []);

    const persistAuth = useCallback((tkn: string, usr: User) => {
        setToken(tkn);
        setUser(usr);
        localStorage.setItem('auth_token', tkn);
        localStorage.setItem('auth_user', JSON.stringify(usr));
        document.cookie = `auth_token=${tkn}; path=/; max-age=86400; SameSite=Lax; Secure`;
        setTokenGetter(() => tkn);
    }, []);

    /**
     * Step 1: Submit credentials.
     * Returns { requires2FA: false } on success (user is already logged in).
     * Returns { requires2FA: true, intermediateToken } when 2FA is needed.
     * Throws on error.
     */
    const loginFn = useCallback(async (email: string, password: string): Promise<LoginResult> => {
        const res = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Login failed');
        }

        const data = await res.json();

        // If 2FA is required, return the intermediate token without storing a full session
        if (data.requires2FA) {
            return {
                requires2FA: true,
                intermediateToken: data.intermediateToken,
            };
        }

        // No 2FA — log in immediately
        const { token: tkn, user: usr } = data;
        persistAuth(tkn, usr);
        return { requires2FA: false, user: usr };
    }, [persistAuth]);

    /**
     * Step 2 (only when 2FA is enabled): Verify the TOTP code.
     * On success, stores the full session and returns.
     */
    const verify2FAFn = useCallback(async (intermediateToken: string, totpCode: string): Promise<User> => {
        const res = await fetch('/api/v1/auth/login/verify-2fa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ intermediateToken, totpCode }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || '2FA verification failed');
        }

        const data = await res.json();
        const { token: tkn, user: usr } = data;
        persistAuth(tkn, usr);
        return usr;
    }, [persistAuth]);

    const signupFn = useCallback(async (data: SignupData) => {
        const res = await fetch('/api/v1/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Signup failed');
        }

        const resp = await res.json();
        const { token: tkn, user: usr } = resp.data || resp;
        persistAuth(tkn, usr);
    }, [persistAuth]);

    const logoutFn = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        document.cookie = 'auth_token=; path=/; max-age=0';
        router.push('/login');
    }, [router]);

    const isMother = user?.roles.includes('mother') ?? false;
    const isPartner = user?.roles.includes('partner') ?? false;
    const isAdmin = user?.roles.includes('admin') ?? false;
    const isPostpartum = user?.roles.includes('postpartum') ?? false;

    const getDashboardUrl = useCallback(async (roles: string[]): Promise<string> => {
        if (roles.includes('mother')) {
            try {
                // Check if user is in postpartum phase by fetching pregnancy profile
                const res = await fetch('/api/v1/profile/pregnancy', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (res.ok) {
                    const profile = await res.json();
                    if (profile.phase === 'postpartum') {
                        return '/postpartum';
                    }
                }
            } catch {
                // If fetching fails, fall back to mother dashboard
            }
            return '/mother';
        }
        if (roles.includes('partner')) return '/partner';
        if (roles.includes('admin')) return '/admin';
        return '/home';
    }, [token]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login: loginFn,
                verify2FA: verify2FAFn,
                signup: signupFn,
                logout: logoutFn,
                isMother,
                isPartner,
                isAdmin,
                isPostpartum,
                getDashboardUrl,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}