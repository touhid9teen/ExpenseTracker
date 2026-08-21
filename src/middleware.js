import { NextResponse } from 'next/server';
import { decrypt, encrypt } from './lib/jwt';

/**
 * Route protection: every page and API route requires a valid session except
 * the auth flow itself (/api/auth/*, first-run /api/init-db) and the two
 * public pages (/login, /terms). Unauthenticated page requests are redirected
 * to /login; unauthenticated API requests get a 401 JSON response.
 *
 * Admin bypass: setting the ADMIN_SECRET env var enables passwordless admin
 * access. Send the secret via the x-admin-secret header on any request, or
 * visit /admin-login?secret=<SECRET> to get an admin session cookie set
 * automatically and be redirected to the dashboard.
 */

// Public pages — reachable without an account.
const PUBLIC_PAGES = ['/login', '/terms'];

async function createAdminSessionCookie(response) {
  const token = await encrypt({
    id: 'admin-bypass',
    username: 'admin',
    isAdmin: true,
  });
  response.cookies.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: process.env.APP_ENV === 'production', // eslint-disable-line no-undef
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
  return response;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const adminSecret = process.env.ADMIN_SECRET; // eslint-disable-line no-undef

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

  // Admin bypass via x-admin-secret header (works for pages and APIs).
  const headerSecret = request.headers.get('x-admin-secret');
  if (adminSecret && headerSecret && headerSecret === adminSecret) {
    if (isApi) return NextResponse.next();
    const res = NextResponse.redirect(new URL('/', request.url));
    return createAdminSessionCookie(res);
  }

  // Admin bypass via /admin-login?secret=<SECRET> (one-click browser access).
  if (pathname === '/admin-login' && adminSecret) {
    const urlSecret = request.nextUrl.searchParams.get('secret');
    if (urlSecret && urlSecret === adminSecret) {
      const res = NextResponse.redirect(new URL('/', request.url));
      return createAdminSessionCookie(res);
    }
    // Invalid or missing secret — send to login.
    return NextResponse.redirect(new URL('/login', request.url));
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
