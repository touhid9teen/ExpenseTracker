import sql from '../../../../lib/db';
import { NextResponse } from 'next/server';
import { authenticateAdmin } from '../../../../lib/jwt';
import { adminExpenseIdSchema } from '../../../../lib/validations';
import { withApiLog } from '../../../../utils/apiLogger';

export const runtime = 'edge';

const normalizeAmount = (amount) => {
  if (typeof amount === 'number' && Number.isFinite(amount)) return amount;
  const parsedAmount = Number.parseFloat(amount);
  return Number.isFinite(parsedAmount) ? parsedAmount : 0;
};

// GET /api/admin/expenses?userId=&limit= — every expense with its owner.
async function getHandler(request) {
  const admin = await authenticateAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!sql) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || null;
    const limit = Math.min(Number(searchParams.get('limit')) || 500, 2000);

    const expenses = userId
      ? await sql`
          SELECT e.*, u.username
          FROM expenses e
          JOIN users u ON u.id = e.user_id
          WHERE e.user_id = ${userId}
          ORDER BY e.date DESC
          LIMIT ${limit}
        `
      : await sql`
          SELECT e.*, u.username
          FROM expenses e
          JOIN users u ON u.id = e.user_id
          ORDER BY e.date DESC
          LIMIT ${limit}
        `;

    return NextResponse.json(expenses.map((expense) => ({
      id: expense.id,
      userId: expense.user_id,
      username: expense.username,
      description: expense.description,
      amount: normalizeAmount(expense.amount),
      date: expense.date ? String(expense.date).slice(0, 10) : null,
      category: expense.category,
      createdAt: expense.created_at,
    })));
  } catch (error) {
    console.error('Error listing all expenses:', error);
    return NextResponse.json({ error: 'Failed to list expenses' }, { status: 500 });
  }
}

// DELETE /api/admin/expenses — remove any expense by id.
async function deleteHandler(request) {
  const admin = await authenticateAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!sql) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const parsed = adminExpenseIdSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { id } = parsed.data;

    const result = await sql`DELETE FROM expenses WHERE id = ${id} RETURNING id`;
    if (result.length === 0) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}

export const GET = withApiLog(getHandler);
export const DELETE = withApiLog(deleteHandler);
