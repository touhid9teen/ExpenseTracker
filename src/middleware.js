import { NextResponse } from 'next/server';
import { decrypt } from './lib/jwt';

/**
 * Route protection: every page and API route requires a valid session except
 * the auth flow itself (/api/auth/*, first-run /api/init-db) and the two
 * public pages (/login, /terms). Unauthenticated page requests are redirected
 * to /login; unauthenticated API requests get a 401 JSON response.
 *
 * Note: this relies on the same HS256 JWT + `auth_token` cookie that the API
 * routes use (see src/lib/jwt.js), so the client-side guest/demo mode no
 * longer applies — visitors must sign in first.
 */

// Public pages — reachable without an account.
const PUBLIC_PAGES = ['/login', '/terms'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public APIs: the auth flow (login/register/recover/profile/security)
  // plus the first-run database setup endpoint.
  const isApi = pathname.startsWith('/api/');
  const isPublicApi = pathname.startsWith('/api/auth/') || pathname === '/api/init-db';
  const isPublicPage = PUBLIC_PAGES.includes(pathname);

  const token = request.cookies.get('auth_token')?.value;
  const user = token ? await decrypt(token) : null;

  // Authenticated: allowed everywhere, but bounce away from the login page.
  if (user) {
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Unauthenticated.
  if (isApi) {
    if (isPublicApi) return NextResponse.next();
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isPublicPage) return NextResponse.next();
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: [
    // Protect every route except Next.js internals and public static files.
    '/((?!_next/static|_next/image|favicon\\.svg|manifest\\.json|sw\\.js|vite\\.svg|.*\\.(?:svg|png|jpg|jpeg|webp|ico|txt|woff2?)$).*)',
  ],
};
