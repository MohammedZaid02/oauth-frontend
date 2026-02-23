import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from './auth-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';


// If `NEXT_PUBLIC_API_URL` is provided at build time, use it for browser requests
// so client-side calls go directly to the backend in production. Otherwise
// keep relative URLs so local dev rewrites (in `next.config.js`) work.
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ? API_URL : (typeof window !== 'undefined' ? '' : API_URL),
    withCredentials: true, 
    headers: { 'Content-Type': 'application/json' },
    timeout: 10_000,
});


api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
       
        const token = useAuthStore.getState().accessToken;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}> = [];

const drainQueue = (err: unknown, token: string | null = null) => {
    failedQueue.forEach((p) => (err ? p.reject(err) : p.resolve(token!)));
    failedQueue = [];
};

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const original = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (error.response?.status !== 401 || original._retry) {
            return Promise.reject(error);
        }

        
        if (original.url?.includes('/auth/refresh')) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            // Queue this request until the ongoing refresh resolves
            return new Promise<string>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    original.headers.Authorization = `Bearer ${token}`;
                    original._retry = true;
                    return api(original);
                })
                .catch(Promise.reject.bind(Promise));
        }

        original._retry = true;
        isRefreshing = true;

        try {
            const { data } = await api.post<{
                success: boolean;
                data: { accessToken: string };
            }>('/api/auth/refresh');

            const newToken = data.data.accessToken;

            // Persist new token in Zustand store
            useAuthStore.getState().setAccessToken(newToken);

            drainQueue(null, newToken);

            original.headers.Authorization = `Bearer ${newToken}`;
            return api(original);
        } catch (refreshErr) {
            drainQueue(refreshErr);
            useAuthStore.getState().logout();
            if (typeof window !== 'undefined') window.location.href = '/login';
            return Promise.reject(refreshErr);
        } finally {
            isRefreshing = false;
        }
    }
);

// ─── Typed API Methods 
export interface ApiUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export const authApi = {
    register: (body: { name: string; email: string; password: string }) =>
        api.post<{ success: boolean; message: string }>('/api/auth/register', body),

    login: (body: { email: string; password: string }) =>
        api.post<{
            success: boolean;
            data: { accessToken: string; user: ApiUser };
        }>('/api/auth/login', body),

    me: () =>
        api.get<{ success: boolean; data: { user: ApiUser } }>('/api/auth/me'),

    refresh: () =>
        api.post<{ success: boolean; data: { accessToken: string } }>(
            '/api/auth/refresh'
        ),

    logout: () => api.post<{ success: boolean; message: string }>('/api/auth/logout'),
};
