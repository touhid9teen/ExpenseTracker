import sql from "../../../lib/db";
import { NextResponse } from "next/server";
import { authenticateUser } from "../../../lib/jwt";
import { withApiLog } from "../../../utils/apiLogger";

export const runtime = "edge";

async function getHandler(request) {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!sql) {
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }

  try {
    const notifications = await sql`
      SELECT id, period, type, title, message, is_read, created_at
      FROM notifications
      WHERE user_id = ${user.id}
      ORDER BY is_read ASC, created_at DESC
      LIMIT 50
    `;
    const unread = await sql`
      SELECT COUNT(*)::int AS count
      FROM notifications
      WHERE user_id = ${user.id} AND is_read = FALSE
    `;

    return NextResponse.json({
      notifications,
      unreadCount: unread[0]?.count ?? 0,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export const GET = withApiLog(getHandler);
