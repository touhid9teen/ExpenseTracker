import sql from '../../../../lib/db';
import { encrypt } from '../../../../lib/jwt';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientId } from '../../../../utils/rateLimiter';
import { registerSchema } from '../../../../lib/validations';

// bcryptjs uses setImmediate (a Node API) internally, which the Edge Runtime
// does not provide — so this route must run on the Node.js runtime.
export const runtime = 'nodejs';

export async function POST(request) {
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

    if (!sql) {
      // Mock registration for development
      const token = await encrypt({ id: 'mock-user-id', username });
      const response = NextResponse.json({
        success: true,
        user: { id: 'mock-user-id', username, email },
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
    }

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
    const token = await encrypt({ id: user.id, username: user.username });

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email },
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
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
