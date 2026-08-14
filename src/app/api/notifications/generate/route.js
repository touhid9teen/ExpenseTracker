import { NextResponse } from "next/server";
import { authenticateAdmin } from "../../../../lib/jwt";
import { generateNotifications } from "../../../../lib/notifications/generate";
import { withApiLog } from "../../../../utils/apiLogger";

export const runtime = "edge";

// Only callable by an admin or by the scheduler (Vercel Cron sends the
// secret as `Authorization: Bearer <CRON_SECRET>`; a plain `x-cron-secret`
// header is also accepted for self-hosted schedulers).
const isAuthorized = async (request) => {
  const secret = process.env.CRON_SECRET;
  const headerSecret = request.headers.get("x-cron-secret");
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (secret && (headerSecret === secret || bearer === secret)) return true;
  const admin = await authenticateAdmin(request);
  return admin !== null;
};

async function handler() {
  const result = await generateNotifications();
  return NextResponse.json(result);
}

export const GET = withApiLog(async (request) => {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handler();
});

export const POST = withApiLog(async (request) => {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handler();
});
