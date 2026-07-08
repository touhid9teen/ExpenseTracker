import sql from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

// GET — fetch the security question for a username
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    if (!sql) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const users = await sql`SELECT security_question FROM users WHERE username = ${username}`;

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];
    if (!user.security_question) {
      return NextResponse.json({ error: 'No security question set for this account' }, { status: 400 });
    }

    return NextResponse.json({ question: user.security_question });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — verify answer and reset password
export async function POST(request) {
  try {
    const { username, answer, newPassword } = await request.json();

    if (!username || !answer || !newPassword) {
      return NextResponse.json({ error: 'Username, answer, and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 3) {
      return NextResponse.json({ error: 'Password must be at least 3 characters' }, { status: 400 });
    }

    if (!sql) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const users = await sql`SELECT * FROM users WHERE username = ${username}`;

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];

    if (!user.security_answer_hash) {
      return NextResponse.json({ error: 'No security question set for this account' }, { status: 400 });
    }

    const isAnswerValid = await bcrypt.compare(
      answer.toLowerCase().trim(),
      user.security_answer_hash
    );

    if (!isAnswerValid) {
      return NextResponse.json({ error: 'Incorrect answer to security question' }, { status: 401 });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await sql`UPDATE users SET password_hash = ${hashedPassword} WHERE id = ${user.id}`;

    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
