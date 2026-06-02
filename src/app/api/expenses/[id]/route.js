import sql from '../../../../lib/db';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function PUT(request, { params }) {
  const { id } = params;
  
  try {
    const data = await request.json();
    const { description, amount, date, category } = data;

    const result = await sql`
      UPDATE expenses
      SET description = ${description}, amount = ${amount}, date = ${date}, category = ${category}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  
  try {
    const result = await sql`
      DELETE FROM expenses
      WHERE id = ${id}
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
