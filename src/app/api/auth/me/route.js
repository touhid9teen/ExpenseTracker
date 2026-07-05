import { decrypt } from '../../../../lib/jwt';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    const isDevelopment = process.env.APP_ENV === 'development';
    if (isDevelopment) {
      return NextResponse.json({ user: { id: 'dev-user-id', username: 'dev-user' } });
    }
    return NextResponse.json({ user: null });
  }
  
  const payload = await decrypt(token);
  if (!payload) {
    return NextResponse.json({ user: null });
  }
  
  return NextResponse.json({ user: { id: payload.id, username: payload.username } });
}
