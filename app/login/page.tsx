'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { authApi } from '@/lib/api';
import { AxiosError } from 'axios';

// ─── Types 
interface FieldError {
    email?: string;
    password?: string;
}

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setAccessToken, setUser, isAuthenticated } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldError>({});

    useEffect(() => {
        if (isAuthenticated()) router.replace('/dashboard');
    }, [isAuthenticated, router]);

    // ─── Validation 
    function validate(): boolean {
        const errors: FieldError = {};
        if (!email.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            errors.email = 'Please enter a valid email';
        if (!password) errors.password = 'Password is required';
        else if (password.length < 8)
            errors.password = 'Password must be at least 8 characters';
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }

    // ─── Submit 
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setServerError('');
        if (!validate()) return;

        setLoading(true);
        try {
            const { data } = await authApi.login({ email, password });

            setAccessToken(data.data.accessToken);

            setUser(data.data.user);

            
            const destination = searchParams.get('from') || '/dashboard';
            router.replace(destination);
        } catch (err) {
            const axiosErr = err as AxiosError<{ message: string }>;
            setServerError(
                axiosErr.response?.data?.message ||
                'Login failed. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 mb-4">
                            <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                        <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
                    </div>

                    {/* Server error */}
                    {serverError && (
                        <div className="mb-5 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-red-400 text-sm">{serverError}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setFieldErrors((p) => ({ ...p, email: undefined }));
                                }}
                                className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border text-white placeholder-slate-500 text-sm
                  focus:outline-none focus:ring-2 transition-colors
                  ${fieldErrors.email
                                        ? 'border-red-500/60 focus:ring-red-500/40'
                                        : 'border-slate-600/50 focus:ring-indigo-500/40 focus:border-indigo-500/50'}`}
                                placeholder="you@example.com"
                            />
                            {fieldErrors.email && (
                                <p className="mt-1.5 text-xs text-red-400">{fieldErrors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setFieldErrors((p) => ({ ...p, password: undefined }));
                                }}
                                className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border text-white placeholder-slate-500 text-sm
                  focus:outline-none focus:ring-2 transition-colors
                  ${fieldErrors.password
                                        ? 'border-red-500/60 focus:ring-red-500/40'
                                        : 'border-slate-600/50 focus:ring-indigo-500/40 focus:border-indigo-500/50'}`}
                                placeholder="••••••••"
                            />
                            {fieldErrors.password && (
                                <p className="mt-1.5 text-xs text-red-400">{fieldErrors.password}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in…
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-center text-sm text-slate-500">
                        Don&apos;t have an account?{' '}
                        <a href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                            Create one
                        </a>
                    </p>
                </div>

                {/* Security note */}
                {/* <p className="mt-4 text-center text-xs text-slate-600">
                     Access token stored in memory only. Refresh token in HttpOnly cookie.
                </p> */}
            </div>
        </main>
    );
}
