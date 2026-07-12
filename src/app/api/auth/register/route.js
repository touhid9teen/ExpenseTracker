import sql from '../../../../lib/db';
import { encrypt } from '../../../../lib/jwt';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Username, email, and password are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    if (password.length < 3) {
      return NextResponse.json({ error: 'Password must be at least 3 characters' }, { status: 400 });
    }

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

    // Check if email already exists
    const existingEmail = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingEmail.length > 0) {
      return NextResponse.json({ error: 'This email is already registered' }, { status: 409 });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const inserted = await sql`
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, ${hashedPassword})
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
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
