import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authRoutes = ['/login', '/register'];

/**
 * Middleware only handles one UX case:
 * redirect already-authenticated users AWAY from /login and /register.
 *
 * Route PROTECTION for /dashboard is handled by the dashboard page itself
 * (it calls GET /me on mount — if that fails, it redirects to /login).
 * We do NOT check for refreshToken here because the HttpOnly cookie set by
 * the backend through the Next.js dev proxy is not reliably visible to
 * Next.js Edge middleware in all environments.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasRefreshToken = request.cookies.has('refreshToken');

    // If user already has a session, send them to dashboard
    if (authRoutes.some((r) => pathname.startsWith(r)) && hasRefreshToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/register', '/dashboard/:path*'],
};
