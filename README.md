# Auth Frontend — Next.js 14 / TypeScript / TailwindCSS

Secure authentication frontend with silent token refresh and HttpOnly cookie handling.

## Prerequisites

- Node.js 18+
- Backend running on port 5000

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy and configure environment
cp .env.example .env.local

# 3. Start development server
npm run dev
# → http://localhost:3000
```

## Pages

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/register` | Public (redirects if logged in) | Create account |
| `/login` | Public (redirects if logged in) | Sign in |
| `/dashboard` | Protected | User profile + session info |

## Key Architecture Decisions

### Token Storage
- **Access token** → JavaScript memory (module variable in `token-service.ts`)
  - Never stored in localStorage/sessionStorage — immune to XSS
  - Lost on page refresh, but silently restored via refresh cookie
- **Refresh token** → HttpOnly cookie (set by backend)
  - Never accessible to JavaScript
  - `SameSite=Strict` prevents CSRF attacks

### Silent Token Refresh
On every page load, `auth-context.tsx` calls `/api/auth/refresh`. If the
refresh cookie is valid, a new access token is issued transparently — the user
is never redirected to login just because they refreshed the page.

### Axios Interceptors (`lib/api.ts`)
- **Request**: Attaches `Authorization: Bearer <token>` to every call
- **Response**: On 401 → silently calls `/refresh` → retries original request
  - Concurrent 401s are queued — only ONE refresh call is made

### Route Protection (`middleware.ts`)
Next.js Edge middleware checks for the refresh cookie as a session proxy.
Unauthenticated users are redirected to `/login`; authenticated users are
redirected away from `/login` and `/register`.

## Project Structure

```
frontend/
├── app/
│   ├── globals.css
│   ├── layout.tsx          # Root layout with AuthProvider
│   ├── page.tsx            # Landing page
│   ├── login/page.tsx      # Login form
│   ├── register/page.tsx   # Register form + password strength
│   └── dashboard/page.tsx  # Protected dashboard
├── components/ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx            # Card + Alert components
├── lib/
│   ├── api.ts              # Axios instance + interceptors
│   ├── auth-context.tsx    # Auth state + actions + session rehydration
│   └── token-service.ts    # In-memory access token storage
├── middleware.ts            # Edge middleware for route protection
├── next.config.js
├── tailwind.config.js
└── .env.example
```
