import sql from '../../../../lib/db';
import { NextResponse } from 'next/server';
import { authenticateAdmin } from '../../../../lib/jwt';
import { withApiLog } from '../../../../utils/apiLogger';

export const runtime = 'edge';

// GET /api/admin/logs?limit= — the most recent request log rows, newest first.
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
    const limit = Math.min(Number(searchParams.get('limit')) || 150, 500);

    const logs = await sql`
      SELECT id, method, path, status, user_id, username, ip, duration_ms, created_at
      FROM api_logs
      ORDER BY id DESC
      LIMIT ${limit}
    `;
    return NextResponse.json(logs.map((log) => ({
      id: log.id,
      method: log.method,
      path: log.path,
      status: log.status,
      userId: log.user_id,
      username: log.username,
      ip: log.ip,
      durationMs: log.duration_ms,
      createdAt: log.created_at,
    })));
  } catch (error) {
    console.error('Error listing api logs:', error);
    return NextResponse.json({ error: 'Failed to list logs' }, { status: 500 });
  }
}

// DELETE /api/admin/logs — wipe the entire log table.
async function deleteHandler(request) {
  const admin = await authenticateAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!sql) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  try {
    await sql`DELETE FROM api_logs`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing api logs:', error);
    return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 });
  }
}

export const GET = withApiLog(getHandler);
export const DELETE = withApiLog(deleteHandler);
