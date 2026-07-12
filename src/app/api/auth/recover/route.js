import sql from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

// POST /api/auth/recover — request a password reset by email
export async function POST(request) {
  try {
    const { email } = await request.json();
    const normalizedEmail = email?.toLowerCase().trim() || '';

    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    if (!sql) {
      // Dev mode: return a mock token
      return NextResponse.json({
        success: true,
        message: 'If this email is registered, you will receive a reset link.',
        // In dev mode, return a demo token so the UI can proceed
        devToken: 'dev-reset-token-123',
        devMode: true,
      });
    }

    // Find user by email (case-insensitive matching using normalized email)
    const users = await sql`SELECT id, username, email FROM users WHERE LOWER(email) = ${normalizedEmail}`;

    // Always return success to prevent email enumeration
    if (users.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'If this email is registered, you will receive a reset link.',
      });
    }

    const user = users[0];

    // Generate reset token (6-digit code for simplicity)
    const array = new Uint8Array(4);
    crypto.getRandomValues(array);
    const resetCode = String(100000 + (array[0] * 256 + array[1]) % 900000).slice(0, 6);
    const tokenHash = await bcrypt.hash(resetCode, 10);

    // Set expiry to 15 minutes from now
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Invalidate old tokens for this user
    await sql`UPDATE password_reset_tokens SET used = TRUE WHERE user_id = ${user.id} AND used = FALSE`;

    // Store new token
    await sql`
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (${user.id}, ${tokenHash}, ${expiresAt})
    `;

    // In development mode, return the reset code so the UI can use it
    const isDev = process.env.APP_ENV === 'development';

    return NextResponse.json({
      success: true,
      message: 'If this email is registered, you will receive a reset link.',
      ...(isDev ? { devToken: resetCode, devMode: true, userId: user.id } : {}),
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/auth/recover — verify token and reset password
export async function PUT(request) {
  try {
    const { email, token, newPassword } = await request.json();
    const normalizedEmail = email?.toLowerCase().trim() || '';

    if (!normalizedEmail || !token || !newPassword) {
      return NextResponse.json({ error: 'Email, reset code, and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 3) {
      return NextResponse.json({ error: 'Password must be at least 3 characters' }, { status: 400 });
    }

    if (!sql) {
      // Dev mode: accept any valid-looking token
      return NextResponse.json({
        success: true,
        message: 'Password reset successfully!',
      });
    }

    // Find user by email (case-insensitive matching)
    const users = await sql`SELECT id, username FROM users WHERE LOWER(email) = ${normalizedEmail}`;
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];

    // Get all non-expired, unused tokens for this user
    const tokens = await sql`
      SELECT * FROM password_reset_tokens
      WHERE user_id = ${user.id}
        AND used = FALSE
        AND expires_at > NOW()
      ORDER BY created_at DESC
    `;

    if (tokens.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired reset code. Please request a new one.' }, { status: 400 });
    }

    // Try to match the token against any stored hash
    let validToken = false;
    for (const storedToken of tokens) {
      const match = await bcrypt.compare(token, storedToken.token);
      if (match) {
        validToken = true;
        // Mark token as used
        await sql`UPDATE password_reset_tokens SET used = TRUE WHERE id = ${storedToken.id}`;
        break;
      }
    }

    if (!validToken) {
      return NextResponse.json({ error: 'Invalid reset code. Please try again.' }, { status: 401 });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await sql`UPDATE users SET password_hash = ${hashedPassword} WHERE id = ${user.id}`;

    return NextResponse.json({ success: true, message: 'Password reset successfully!' });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
