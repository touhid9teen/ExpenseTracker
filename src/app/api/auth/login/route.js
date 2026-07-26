import sql from '../../../../lib/db';
import { encrypt } from '../../../../lib/jwt';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientId } from '../../../../utils/rateLimiter';

export const runtime = 'edge';

export async function POST(request) {
  try {
    // Rate limit: 10 login attempts per minute per IP
    const clientId = getClientId(request);
    const rateLimited = checkRateLimit(request, `login:${clientId}`, {
      maxRequests: 10,
      errorMessage: 'Too many login attempts. Please try again later.'
    });
    if (rateLimited) return rateLimited;

    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    if (!sql) {
      // Development mock: allow any login
      const token = await encrypt({ id: 'mock-user-id', username });
      const response = NextResponse.json({
        success: true,
        user: { id: 'mock-user-id', username },
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
    }

    const users = await sql`SELECT * FROM users WHERE username = ${username}`;

    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    // Create JWT
    const token = await encrypt({ id: user.id, username: user.username });

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email },
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
