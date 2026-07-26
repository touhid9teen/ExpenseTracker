import sql from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientId } from '../../../../utils/rateLimiter';
import { recoverRequestSchema, recoverVerifySchema } from '../../../../lib/validations';

export const runtime = 'edge';

// POST /api/auth/recover — request a password reset by email
export async function POST(request) {
  try {
    // Rate limit: 3 reset requests per minute per IP
    const clientId = getClientId(request);
    const rateLimited = checkRateLimit(request, `recover:${clientId}`, {
      maxRequests: 3,
      errorMessage: 'Too many password reset requests. Please try again later.'
    });
    if (rateLimited) return rateLimited;

    const body = await request.json();
    const parsed = recoverRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { email: normalizedEmail } = parsed.data;

    if (!sql) {
      // Dev mode: return a randomly generated mock token
      const devArray = new Uint8Array(3);
      crypto.getRandomValues(devArray);
      const devToken = String(100000 + ((devArray[0] << 16 | devArray[1] << 8 | devArray[2]) % 900000)).slice(0, 6);
      return NextResponse.json({
        success: true,
        message: 'If this email is registered, you will receive a reset link.',
        devToken,
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

    // Generate cryptographically secure 6-digit reset code
    const array = new Uint8Array(3);
    crypto.getRandomValues(array);
    // 3 random bytes → 0..16_777_215 → modulo 900_000 → add 100_000 → always exactly 6 digits
    const numericCode = 100000 + ((array[0] << 16 | array[1] << 8 | array[2]) % 900000);
    const resetCode = String(numericCode);
    const tokenHash = await bcrypt.hash(resetCode, 12);

    // Set expiry to 15 minutes from now
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Invalidate old tokens for this user
    await sql`UPDATE password_reset_tokens SET used = TRUE WHERE user_id = ${user.id} AND used = FALSE`;

    // Store new token
    await sql`
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (${user.id}, ${tokenHash}, ${expiresAt})
    `;

    const isDev = process.env.APP_ENV === 'development';

    return NextResponse.json({
      success: true,
      message: 'If this email is registered, you will receive a reset link.',
      ...(isDev ? { devToken: resetCode, devMode: true } : {}),
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/auth/recover — verify token and reset password
export async function PUT(request) {
  try {
    // Rate limit: 5 reset attempts per minute per IP
    const clientId = getClientId(request);
    const rateLimited = checkRateLimit(request, `recover-verify:${clientId}`, {
      maxRequests: 5,
      errorMessage: 'Too many reset attempts. Please try again later.'
    });
    if (rateLimited) return rateLimited;

    const body = await request.json();
    const parsed = recoverVerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { email: normalizedEmail, token, newPassword } = parsed.data;

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
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await sql`UPDATE users SET password_hash = ${hashedPassword} WHERE id = ${user.id}`;

    return NextResponse.json({ success: true, message: 'Password reset successfully!' });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
