import sql from '../../../../lib/db';
import { NextResponse } from 'next/server';
import { decrypt } from '../../../../lib/jwt';

export const runtime = 'edge';

const normalizeAmount = (amount) => {
  if (typeof amount === 'number' && Number.isFinite(amount)) return amount;
  const parsedAmount = Number.parseFloat(amount);
  return Number.isFinite(parsedAmount) ? parsedAmount : 0;
};

export async function PUT(request, props) {
  const params = await props.params;
  const token = request.cookies.get('auth_token')?.value;
  let user = null;
  if (token) {
    user = await decrypt(token);
  } else if (process.env.APP_ENV === 'development' || process.env.NODE_ENV === 'development') {
    user = { id: 'dev-user-id', username: 'dev-user' };
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  if (!sql) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }
  
  try {
    const data = await request.json();
    const { description, amount, date, category } = data;

    const result = await sql`
      UPDATE expenses
      SET description = ${description}, amount = ${amount}, date = ${date}, category = ${category}
      WHERE id = ${id} AND user_id = ${user.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...result[0],
      amount: normalizeAmount(result[0].amount)
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(request, props) {
  const params = await props.params;
  const token = request.cookies.get('auth_token')?.value;
  let user = null;
  if (token) {
    user = await decrypt(token);
  } else if (process.env.APP_ENV === 'development' || process.env.NODE_ENV === 'development') {
    user = { id: 'dev-user-id', username: 'dev-user' };
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  if (!sql) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }
  
  try {
    const result = await sql`
      DELETE FROM expenses
      WHERE id = ${id} AND user_id = ${user.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: result[0] });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
