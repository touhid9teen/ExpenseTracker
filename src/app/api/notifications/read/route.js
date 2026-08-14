import sql from "../../../../lib/db";
import { NextResponse } from "next/server";
import { authenticateUser } from "../../../../lib/jwt";
import { withApiLog } from "../../../../utils/apiLogger";

export const runtime = "edge";

async function postHandler(request) {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!sql) {
    return NextResponse.json({ ok: true });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const id = Number(body?.id);
    const markAll = body?.all === true;

    if (markAll) {
      await sql`
        UPDATE notifications
        SET is_read = TRUE
        WHERE user_id = ${user.id} AND is_read = FALSE
      `;
    } else if (Number.isFinite(id) && id > 0) {
      await sql`
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = ${id} AND user_id = ${user.id}
      `;
    } else {
      return NextResponse.json({ error: "Missing id or all flag" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}

export const POST = withApiLog(postHandler);
