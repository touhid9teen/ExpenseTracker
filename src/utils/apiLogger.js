import sql from '../lib/db';
import { authenticateUser } from '../lib/jwt';

// Persistent API request logging. Every wrapped route records one row in the
// `api_logs` table (method, path, status, user, ip, duration). The admin
// "Live Logs" panel polls these rows. Logging is best-effort: any failure here
// is swallowed so it can never break the underlying request.

/**
 * Extract the client IP from proxy headers, falling back to null.
 * @param {Request} request
 * @returns {string|null}
 */
export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim();
  if (ip) return ip;
  return request.headers.get('x-real-ip')?.trim() || null;
}

/**
 * Insert a single request record. No-op when the DB is not configured.
 */
export async function logApiRequest({ method, path, status, user, ip, durationMs }) {
  if (!sql) return;
  try {
    await sql`
      INSERT INTO api_logs (method, path, status, user_id, username, ip, duration_ms)
      VALUES (
        ${method || null},
        ${path ? path.slice(0, 512) : null},
        ${Number.isFinite(status) ? status : null},
        ${user?.id || null},
        ${user?.username || null},
        ${ip || null},
        ${Number.isFinite(durationMs) ? durationMs : null}
      )
    `;
  } catch (error) {
    // Never let logging break the request it is observing.
    console.error('Failed to write api_log:', error?.message);
  }
}

/**
 * Wrap a Next.js App Router route handler so each invocation is logged.
 * The log insert is awaited before returning because Edge functions may be
 * torn down immediately after the response resolves (no waitUntil available).
 *
 * @param {(request: Request, context?: any) => Promise<Response>} handler
 * @returns {(request: Request, context?: any) => Promise<Response>}
 */
export function withApiLog(handler) {
  return async (request, context) => {
    const start = Date.now();
    let response;
    try {
      response = await handler(request, context);
      return response;
    } finally {
      try {
        const user = await authenticateUser(request).catch(() => null);
        const { pathname } = new URL(request.url);
        await logApiRequest({
          method: request.method,
          path: pathname,
          status: response?.status,
          user,
          ip: getClientIp(request),
          durationMs: Date.now() - start,
        });
      } catch (error) {
        console.error('withApiLog error:', error?.message);
      }
    }
  };
}

export default withApiLog;
