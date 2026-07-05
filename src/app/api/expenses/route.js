import sql from '../../../lib/db';
import { NextResponse } from 'next/server';
import { decrypt } from '../../../lib/jwt';
import { SEED_EXPENSES } from '../../../data/expenseData';

export const runtime = 'edge';

const normalizeAmount = (amount) => {
  if (typeof amount === 'number' && Number.isFinite(amount)) return amount;
  const parsedAmount = Number.parseFloat(amount);
  return Number.isFinite(parsedAmount) ? parsedAmount : 0;
};

export async function GET(request) {
  const token = request.cookies.get('auth_token')?.value;
  let user = null;
  if (token) {  
    user = await decrypt(token);
  } else if (process.env.APP_ENV === 'development') {
    user = { id: 'dev-user-id', username: 'dev-user' };
  }

  if (!sql || !user) {
    return NextResponse.json(SEED_EXPENSES, { status: 200 });
  }

  try {
    const expenses = await sql`SELECT * FROM expenses WHERE user_id = ${user.id} ORDER BY date DESC`;
    return NextResponse.json(expenses.map((expense) => ({
      ...expense,
      amount: normalizeAmount(expense.amount)
    })));
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(SEED_EXPENSES, { status: 200 });
  }
}

export async function POST(request) {
  const token = request.cookies.get('auth_token')?.value;
  let user = null;
  if (token) {
    user = await decrypt(token);
  } else if (process.env.APP_ENV === 'development') {
    user = { id: 'dev-user-id', username: 'dev-user' };
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!sql) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  try {
    const data = await request.json();
    const { id, description, amount, date, category } = data;

    const result = await sql`
      INSERT INTO expenses (id, user_id, item, description, amount, date, category)
      VALUES (${id}, ${user.id}, ${description}, ${description}, ${amount}, ${date}, ${category})
      RETURNING *
    `;

    return NextResponse.json({
      ...result[0],
      amount: normalizeAmount(result[0].amount)
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json({ error: 'Failed to add expense' }, { status: 500 });
  }
}
