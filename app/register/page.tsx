'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { AxiosError } from 'axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, Alert } from '@/components/ui/Card';

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validate = (): boolean => {
        const errors: FormErrors = {};
        if (!name || name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
        if (!email) errors.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Invalid email address';
        if (!password) errors.password = 'Password is required';
        else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
            errors.password = 'Must contain uppercase, lowercase, and a number';
        if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setServerError('');
        setSuccessMessage('');
        if (!validate()) return;

        setIsLoading(true);
        try {
            await authApi.register({ name: name.trim(), email, password });
            setSuccessMessage('Account created! Redirecting to login...');
            setTimeout(() => router.push('/login'), 2000);
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setServerError(
                axiosErr.response?.data?.message || 'Registration failed. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Password strength indicator
    const getPasswordStrength = (): { label: string; color: string; width: string } => {
        if (!password) return { label: '', color: 'bg-gray-200', width: 'w-0' };
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        if (score <= 2) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/4' };
        if (score === 3) return { label: 'Fair', color: 'bg-yellow-400', width: 'w-2/4' };
        if (score === 4) return { label: 'Good', color: 'bg-blue-400', width: 'w-3/4' };
        return { label: 'Strong', color: 'bg-green-400', width: 'w-full' };
    };

    const strength = getPasswordStrength();

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8 space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
                    <p className="text-gray-500">Join us — it only takes a minute</p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {serverError && (
                            <Alert type="error" message={serverError} onClose={() => setServerError('')} />
                        )}
                        {successMessage && (
                            <Alert type="success" message={successMessage} />
                        )}

                        <Input
                            label="Full name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={formErrors.name}
                            autoComplete="name"
                            disabled={isLoading}
                        />

                        <Input
                            label="Email address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={formErrors.email}
                            autoComplete="email"
                            disabled={isLoading}
                        />

                        <div className="space-y-1">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Min. 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={formErrors.password}
                                autoComplete="new-password"
                                disabled={isLoading}
                            />
                            {password && (
                                <div className="space-y-1">
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div className={`h-1.5 rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Strength: <span className="font-medium">{strength.label}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        <Input
                            label="Confirm password"
                            type="password"
                            placeholder="Repeat your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={formErrors.confirmPassword}
                            autoComplete="new-password"
                            disabled={isLoading}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={isLoading}
                            className="w-full"
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline">
                            Sign in
                        </Link>
                    </div>
                </Card>
            </div>
        </main>
    );
}
