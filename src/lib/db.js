import { neon } from '@neondatabase/serverless';

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

/**
 * True when a thrown database error is a *connectivity* failure (Neon
 * unreachable — flaky IPv6, cold starts, DNS) rather than a SQL or
 * validation error. The Node-runtime auth routes use this to fall back to
 * their dev-mode mock responses when the database can't be reached,
 * mirroring the historical `if (!sql)` demo behavior.
 */
export const isConnectionError = (error) =>
  /Error connecting to database|fetch failed|ETIMEDOUT|ECONNREFUSED|ECONNRESET|ENOTFOUND|EAI_AGAIN|UND_ERR|socket hang up/i.test(
    error?.message || ''
  );

export default sql;
