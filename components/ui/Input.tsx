'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, className = '', id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="space-y-1">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
            block w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900
            placeholder-gray-400 shadow-sm transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${error
                            ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500'
                        }
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p className="text-xs text-gray-500">{hint}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
