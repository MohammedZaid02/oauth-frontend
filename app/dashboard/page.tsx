'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, selectUser, selectToken } from '@/lib/auth-store';
import { authApi } from '@/lib/api';


function useTokenExpiry(token: string | null) {
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!token) return setSecondsLeft(null);

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const update = () => {
                const diff = Math.floor(payload.exp - Date.now() / 1000);
                setSecondsLeft(diff > 0 ? diff : 0);
            };
            update();
            const id = setInterval(update, 1000);
            return () => clearInterval(id);
        } catch {
            setSecondsLeft(null);
        }
    }, [token]);

    if (secondsLeft === null) return null;
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
}

// ─── Loading Skeleton 
function Skeleton() {
    return (
        <div className="animate-pulse space-y-3">
            <div className="h-7 bg-slate-700/50 rounded-lg w-48" />
            <div className="h-4 bg-slate-700/50 rounded w-64" />
            <div className="h-4 bg-slate-700/50 rounded w-40" />
        </div>
    );
}

// ─── Dashboard Page 
export default function DashboardPage() {
    const router = useRouter();
    const user = useAuthStore(selectUser);
    const token = useAuthStore(selectToken);
    const { setUser, logout } = useAuthStore();

    const [fetching, setFetching] = useState(!user); // skip fetch if Zustand already has user
    const [loadingLogout, setLoadingLogout] = useState(false);
    const tokenExpiry = useTokenExpiry(token);

   
    useEffect(() => {
        if (user) return; 

        (async () => {
            try {
                const {
                    data: {
                        data: { user: fetchedUser },
                    },
                } = await authApi.me();
                setUser(fetchedUser);
            } catch {
                
                router.replace('/login');
            } finally {
                setFetching(false);
            }
        })();
    }, [user, setUser, router]);

    // ─── Logout 
    const handleLogout = useCallback(async () => {
        setLoadingLogout(true);
        try {
            await authApi.logout();
        } finally {
            logout();          // Clear Zustand store
            router.push('/login');
        }
    }, [logout, router]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-lg space-y-4">

                {/* Profile Card */}
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <p className="text-slate-400 text-xs uppercase tracking-widest font-medium mb-1">
                                Dashboard
                            </p>
                            {fetching ? (
                                <div className="h-7 bg-slate-700/50 animate-pulse rounded-lg w-36" />
                            ) : (
                                <h1 className="text-2xl font-bold text-white">
                                    Welcome, {user?.name?.split(' ')[0]} 👋
                                </h1>
                            )}
                        </div>

                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg flex-shrink-0 uppercase">
                            {user?.name?.[0] ?? '?'}
                        </div>
                    </div>

                    {/* User info */}
                    {fetching ? (
                        <Skeleton />
                    ) : (
                        <div className="space-y-3 mb-6">
                            <InfoRow
                                label="Email"
                                value={user?.email ?? '—'}
                                icon={
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                }
                            />
                            <InfoRow
                                label="Role"
                                value={
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize">
                                        {user?.role ?? '—'}
                                    </span>
                                }
                                icon={
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                }
                            />
                        </div>
                    )}

                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        disabled={loadingLogout || fetching}
                        className="w-full py-2.5 px-4 rounded-xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20
              text-red-400 hover:text-red-300 font-semibold text-sm transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loadingLogout ? (
                            <>
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Signing out…
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign out
                            </>
                        )}
                    </button>
                </div>

                {/* Token info card */}
                <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-slate-400 text-sm">Session active</span>
                    </div>
                    {tokenExpiry ? (
                        <span className="text-xs font-mono text-slate-400 bg-slate-900/50 px-2.5 py-1 rounded-lg border border-slate-700/50">
                            Token expires in{' '}
                            <span className="text-emerald-400 font-semibold">{tokenExpiry}</span>
                        </span>
                    ) : (
                        <span className="text-xs text-slate-600">Calculating…</span>
                    )}
                </div>

                {/* Security note */}
                <p className="text-center text-xs text-slate-600">
                     Token in memory · Refresh cookie is HttpOnly · SameSite=Strict
                </p>
            </div>
        </main>
    );
}

// ─── InfoRow sub-component 
function InfoRow({
    label,
    value,
    icon,
}: {
    label: string;
    value: React.ReactNode;
    icon: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/30 border border-slate-700/30">
            <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {icon}
            </svg>
            <span className="text-slate-400 text-sm w-12 flex-shrink-0">{label}</span>
            <span className="text-white text-sm">{value}</span>
        </div>
    );
}
