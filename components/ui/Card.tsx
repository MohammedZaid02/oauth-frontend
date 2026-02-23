'use client';

import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
    <div
        className={`bg-white rounded-2xl shadow-xl border border-gray-100 ${className}`}
    >
        {children}
    </div>
);

interface AlertProps {
    type: 'error' | 'success' | 'info' | 'warning';
    message: string;
    onClose?: () => void;
}

const alertConfig = {
    error: {
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-700',
        icon: (
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        ),
    },
    success: {
        bg: 'bg-green-50 border-green-200',
        text: 'text-green-700',
        icon: (
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
    },
    info: {
        bg: 'bg-blue-50 border-blue-200',
        text: 'text-blue-700',
        icon: (
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-.5V9H9z" clipRule="evenodd" />
            </svg>
        ),
    },
    warning: {
        bg: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-700',
        icon: (
            <svg className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        ),
    },
};

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
    const config = alertConfig[type];
    return (
        <div className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${config.bg} ${config.text} animate-fade-in`}>
            {config.icon}
            <p className="flex-1">{message}</p>
            {onClose && (
                <button onClick={onClose} className="text-current opacity-60 hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};
