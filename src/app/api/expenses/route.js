import sql from '../../../lib/db';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    const expenses = await sql`SELECT * FROM expenses ORDER BY date DESC`;
    return NextResponse.json(expenses);
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
      INSERT INTO expenses (id, description, amount, date, category)
      VALUES (${id}, ${description}, ${amount}, ${date}, ${category})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json({ error: 'Failed to add expense' }, { status: 500 });
  }
}
