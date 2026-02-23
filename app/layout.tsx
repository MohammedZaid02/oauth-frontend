import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: {
        default: 'AuthSystem — Secure Authentication',
        template: '%s | AuthSystem',
    },
    description: 'Production-grade secure authentication system',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="h-full">
            <body className={`${inter.className} h-full bg-slate-900 text-white`}>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
