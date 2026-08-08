import dns from 'node:dns';
import sql, { isConnectionError } from '../../../../lib/db';
import { encrypt } from '../../../../lib/jwt';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientId } from '../../../../utils/rateLimiter';
import { loginSchema } from '../../../../lib/validations';
import { withApiLog } from '../../../../utils/apiLogger';

// bcryptjs uses setImmediate (a Node API) internally, which the Edge Runtime
// does not provide — so this route must run on the Node.js runtime.
export const runtime = 'nodejs';

// Neon's host resolves to IPv6 first on some networks, which fails — force
// IPv4-first lookups (same convention as the maintenance scripts).
dns.setDefaultResultOrder('ipv4first');

const isDev = process.env.APP_ENV === 'development';

// Development mock: sign in with any credentials. Used when the database is
// not configured OR unreachable (dev only) so local sessions keep working
// while Neon is down. The response mirrors the real login flow exactly.
const mockLogin = async (username) => {
  const token = await encrypt({ id: 'mock-user-id', username, isAdmin: false });
  const response = NextResponse.json({
    success: true,
    user: { id: 'mock-user-id', username, isAdmin: false },
  });
  response.cookies.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
  return response;
};

async function postHandler(request) {
  try {
    // Rate limit: 10 login attempts per minute per IP
    const clientId = getClientId(request);
    const rateLimited = checkRateLimit(request, `login:${clientId}`, {
      maxRequests: 10,
      errorMessage: 'Too many login attempts. Please try again later.'
    });
    if (rateLimited) return rateLimited;

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { username, password } = parsed.data;

    if (!sql) return mockLogin(username);

    let users;
    try {
      users = await sql`SELECT * FROM users WHERE username = ${username}`;
    } catch (error) {
      // Neon unreachable (IPv6 blackhole / cold start / flaky DNS) — in
      // development fall back to the mock login so the app stays usable;
      // in production fail loudly instead of faking authentication.
      if (isDev && isConnectionError(error)) return mockLogin(username);
      throw error;
    }

    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    // Create JWT
    const token = await encrypt({ id: user.id, username: user.username, isAdmin: !!user.is_admin });

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email, isAdmin: !!user.is_admin },
    });
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.APP_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const POST = withApiLog(postHandler);
