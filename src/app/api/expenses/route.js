import sql from '../../../lib/db';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const normalizeAmount = (amount) => {
  if (typeof amount === 'number' && Number.isFinite(amount)) return amount;
  const parsedAmount = Number.parseFloat(amount);
  return Number.isFinite(parsedAmount) ? parsedAmount : 0;
};

export async function GET() {
  try {
    const expenses = await sql`SELECT * FROM expenses ORDER BY date DESC`;
    return NextResponse.json(expenses.map((expense) => ({
      ...expense,
      amount: normalizeAmount(expense.amount)
    })));
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { id, description, amount, date, category } = data;

    const result = await sql`
      INSERT INTO expenses (id, item, description, amount, date, category)
      VALUES (${id}, ${description}, ${description}, ${amount}, ${date}, ${category})
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
