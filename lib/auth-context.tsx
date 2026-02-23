'use client';

import { useEffect } from 'react';
import { useAuthStore } from './auth-store';
import { authApi } from './api';


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setAccessToken, setUser, logout } = useAuthStore();

    useEffect(() => {
        let cancelled = false;

        async function rehydrate() {
            try {
                
                const {
                    data: {
                        data: { accessToken },
                    },
                } = await authApi.refresh();

                if (cancelled) return;
                setAccessToken(accessToken);

                const {
                    data: {
                        data: { user },
                    },
                } = await authApi.me();

                if (!cancelled) setUser(user);
            } catch {
                
                if (!cancelled) logout();
            }
        }

        rehydrate();
        return () => {
            cancelled = true;
        };
    }, [setAccessToken, setUser, logout]);

    return <>{children}</>;
}
