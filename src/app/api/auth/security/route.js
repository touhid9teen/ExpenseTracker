import sql from '../../../../lib/db';
import { authenticateUser } from '../../../../lib/jwt';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { securityQuestion, securityAnswer } = await request.json();

    if (!securityQuestion || !securityAnswer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    if (!sql) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), 10);

    await sql`
      UPDATE users
      SET security_question = ${securityQuestion}, security_answer_hash = ${hashedAnswer}
      WHERE id = ${user.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Security question error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
