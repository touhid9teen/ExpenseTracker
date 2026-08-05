import sql from '../../../../lib/db';
import { NextResponse } from 'next/server';
import { authenticateAdmin } from '../../../../lib/jwt';
import { adminUserRoleSchema, adminIdSchema } from '../../../../lib/validations';
import { withApiLog } from '../../../../utils/apiLogger';

export const runtime = 'edge';

// Shared guard: only authenticated admins may touch these endpoints.
async function requireAdmin(request) {
  const admin = await authenticateAdmin(request);
  if (!admin) {
    return { admin: null, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  if (!sql) {
    return { admin, error: NextResponse.json({ error: 'Database is not configured' }, { status: 503 }) };
  }
  return { admin, error: null };
}

// GET /api/admin/users — list every user with their expense count.
async function getHandler(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const users = await sql`
      SELECT u.id, u.username, u.email, u.is_admin, u.created_at,
             COUNT(e.id) AS expense_count
      FROM users u
      LEFT JOIN expenses e ON e.user_id = u.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `;
    return NextResponse.json(users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email || '',
      isAdmin: !!user.is_admin,
      expenseCount: Number(user.expense_count || 0),
      createdAt: user.created_at,
    })));
  } catch (error) {
    console.error('Error listing users:', error);
    return NextResponse.json({ error: 'Failed to list users' }, { status: 500 });
  }
}

// PATCH /api/admin/users — grant or revoke the admin role.
async function patchHandler(request) {
  const { admin, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = adminUserRoleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { id, isAdmin } = parsed.data;

    // Never allow an admin to revoke their own role — that would risk locking
    // the platform out of admin access entirely.
    if (id === admin.id) {
      return NextResponse.json({ error: 'You cannot change your own admin role' }, { status: 400 });
    }

    const result = await sql`
      UPDATE users
      SET is_admin = ${isAdmin}
      WHERE id = ${id}
      RETURNING id, username, email, is_admin, created_at
    `;
    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const user = result[0];
    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email || '',
      isAdmin: !!user.is_admin,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}

// DELETE /api/admin/users — delete a user (their expenses cascade).
async function deleteHandler(request) {
  const { admin, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = adminIdSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { id } = parsed.data;

    if (id === admin.id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }

    const result = await sql`DELETE FROM users WHERE id = ${id} RETURNING id`;
    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

export const GET = withApiLog(getHandler);
export const PATCH = withApiLog(patchHandler);
export const DELETE = withApiLog(deleteHandler);
