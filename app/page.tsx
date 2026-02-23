import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center space-y-8 animate-slide-up">
                {/* Logo */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
                        Auth<span className="text-indigo-600">System</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-md mx-auto">
                        Production-grade secure authentication with JWT, Redis, and MongoDB.
                        Built for scale.
                    </p>
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap justify-center gap-2">
                    {['JWT Access Tokens', 'HttpOnly Cookies', 'Redis Session Store', 'bcrypt Hashing', 'Rate Limiting'].map((feature) => (
                        <span
                            key={feature}
                            className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-100"
                        >
                            {feature}
                        </span>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        Get Started — Register
                    </Link>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </main>
    );
}
