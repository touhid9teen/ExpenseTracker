import { authenticateUser } from '../../../../lib/jwt';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
  const user = await authenticateUser(request);
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user: { id: user.id, username: user.username } });
}
