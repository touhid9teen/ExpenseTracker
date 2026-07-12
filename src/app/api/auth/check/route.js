import sql from '../../../../lib/db';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const email = searchParams.get('email');

    if (!username && !email) {
      return NextResponse.json({ error: 'Username or email is required' }, { status: 400 });
    }

    if (!sql) {
      return NextResponse.json({ exists: false });
    }

    if (username) {
      const users = await sql`SELECT id, email FROM users WHERE username = ${username}`;
      const exists = users.length > 0;
      return NextResponse.json({ 
        exists,
        user: exists ? { username, email: users[0].email } : null
      });
    }

    if (email) {
      const users = await sql`SELECT id, username FROM users WHERE email = ${email}`;
      const exists = users.length > 0;
      return NextResponse.json({ 
        exists,
        user: exists ? { username: users[0].username, email } : null
      });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
