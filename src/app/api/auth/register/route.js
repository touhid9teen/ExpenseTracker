import dns from 'node:dns';
import sql, { isConnectionError } from '../../../../lib/db';
import { encrypt } from '../../../../lib/jwt';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientId } from '../../../../utils/rateLimiter';
import { registerSchema } from '../../../../lib/validations';
import { withApiLog } from '../../../../utils/apiLogger';

// bcryptjs uses setImmediate (a Node API) internally, which the Edge Runtime
// does not provide — so this route must run on the Node.js runtime.
export const runtime = 'nodejs';

// Neon's host resolves to IPv6 first on some networks, which fails — force
// IPv4-first lookups (same convention as the maintenance scripts).
dns.setDefaultResultOrder('ipv4first');

const isDev = process.env.APP_ENV === 'development';

// Development mock: create a session without a real account. Used when the
// database is not configured OR unreachable (dev only) so registration keeps
// working while Neon is down.
const mockRegister = async (username, email) => {
  const token = await encrypt({ id: 'mock-user-id', username, isAdmin: false });
  const response = NextResponse.json({
    success: true,
    user: { id: 'mock-user-id', username, email, isAdmin: false },
    isNewUser: true,
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
    // Rate limit: 5 registrations per minute per IP
    const clientId = getClientId(request);
    const rateLimited = checkRateLimit(request, `register:${clientId}`, {
      maxRequests: 5,
      errorMessage: 'Too many registration attempts. Please try again later.'
    });
    if (rateLimited) return rateLimited;

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { username, email: normalizedEmail, password } = parsed.data;

    if (!sql) return mockRegister(username, normalizedEmail);

    try {
      // Check if username already exists
      const existingUsername = await sql`SELECT id FROM users WHERE username = ${username}`;
      if (existingUsername.length > 0) {
        return NextResponse.json({ error: 'This username is already taken' }, { status: 409 });
      }

      // Check if email already exists (using the registered email, ignoring empty defaults)
      const existingEmail = await sql`SELECT id FROM users WHERE email = ${normalizedEmail} AND email != ''`;
      if (existingEmail.length > 0) {
        return NextResponse.json({ error: 'This email is already registered' }, { status: 409 });
      }

      // Create user
      const hashedPassword = await bcrypt.hash(password, 12);
      const inserted = await sql`
        INSERT INTO users (username, email, password_hash)
        VALUES (${username}, ${normalizedEmail}, ${hashedPassword})
        RETURNING id, username, email, created_at
      `;

      const user = inserted[0];

      // Create JWT
      const token = await encrypt({ id: user.id, username: user.username, isAdmin: false });

      // Set cookie
      const response = NextResponse.json({
        success: true,
        user: { id: user.id, username: user.username, email: user.email, isAdmin: false },
        isNewUser: true,
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
      // Neon unreachable (IPv6 blackhole / cold start / flaky DNS) — in
      // development fall back to the mock registration; otherwise rethrow so
      // the outer handler returns a clean 500.
      if (isDev && isConnectionError(error)) return mockRegister(username, normalizedEmail);
      throw error;
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const POST = withApiLog(postHandler);
