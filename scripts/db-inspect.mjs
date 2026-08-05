// Temporary diagnostic: print the DB host/database (masked) and check whether
// the users.is_admin column and api_logs table exist in that database.
import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');

const quoted = env.match(/DATABASE_URL="([^"]+)"/);
const bare = env.match(/DATABASE_URL=([^\s]+)/);
const raw = (quoted ? quoted[1] : bare?.[1]) || '';
const masked = raw.replace(/:[^:@/]+@/, ':***@');
console.log('DATABASE_URL (masked):', masked || 'NOT FOUND');

const sql = neon(raw);
try {
  const cols = await sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'users' ORDER BY ordinal_position
  `;
  console.log('users columns:', cols.map((c) => c.column_name).join(', '));

  const tbl = await sql`
    SELECT to_regclass('api_logs') AS api_logs,
           to_regclass('password_reset_tokens') AS reset_tokens
  `;
  console.log('api_logs exists:', tbl[0]?.api_logs, '| reset_tokens exists:', tbl[0]?.reset_tokens);

  const admins = await sql`SELECT username, is_admin FROM users WHERE is_admin = TRUE LIMIT 5`;
  console.log('admins:', JSON.stringify(admins));
} catch (error) {
  console.error('Inspect failed:', error?.message);
}
