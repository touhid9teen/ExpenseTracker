import sql from '../../../../lib/db';
import { authenticateUser } from '../../../../lib/jwt';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { securityQuestionSchema } from '../../../../lib/validations';
import { withApiLog } from '../../../../utils/apiLogger';

// bcryptjs uses setImmediate (a Node API) internally, which the Edge Runtime
// does not provide — so this route must run on the Node.js runtime.
export const runtime = 'nodejs';

async function postHandler(request) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = securityQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { securityQuestion, securityAnswer } = parsed.data;

    if (!sql) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const hashedAnswer = await bcrypt.hash(securityAnswer, 12);

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

export const POST = withApiLog(postHandler);
