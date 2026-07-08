import sql from '../../../../lib/db';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    if (!sql) {
      return NextResponse.json({ exists: false });
    }

    const users = await sql`SELECT id FROM users WHERE username = ${username}`;
    const exists = users.length > 0;

    return NextResponse.json({ exists });
  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
