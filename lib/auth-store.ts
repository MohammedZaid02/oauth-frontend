import { create } from 'zustand';

// ─── Types 
export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
   
    accessToken: string | null;
    user: AuthUser | null;

    // ─── Actions 
    setAccessToken: (token: string) => void;
    setUser: (user: AuthUser) => void;
    logout: () => void;

    isAuthenticated: () => boolean;
}

// ─── Store 
export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,

    setAccessToken: (token) => set({ accessToken: token }),

    setUser: (user) => set({ user }),

    logout: () =>
        set({
            accessToken: null,
            user: null,
        }),

    
    isAuthenticated: () => get().accessToken !== null,
}));

// ─── Selector helpers (use these in components for performance) 
export const selectUser = (s: AuthState) => s.user;
export const selectToken = (s: AuthState) => s.accessToken;
export const selectIsAuthenticated = (s: AuthState) => s.accessToken !== null;
