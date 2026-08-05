// Temporary diagnostic: verify the applied schema (with connection retries).
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const quoted = env.match(/DATABASE_URL="([^"]+)"/);
const bare = env.match(/DATABASE_URL=([^\s]+)/);
const raw = (quoted ? quoted[1] : bare?.[1]) || '';
const masked = raw.replace(/:[^:@/]+@/, ':***@');
console.log('DATABASE_URL (masked):', masked || 'NOT FOUND');

const sql = neon(raw);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withRetry(label, fn) {
  for (let i = 1; i <= 8; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === 8) throw error;
      await sleep(3000 * i);
    }
  }
}

try {
  const cols = await withRetry('users columns', () => sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'users' ORDER BY ordinal_position
  `);
  console.log('users columns:', cols.map((c) => c.column_name).join(', '));

  const tbl = await withRetry('tables', () => sql`
    SELECT to_regclass('api_logs') AS api_logs,
           to_regclass('password_reset_tokens') AS reset_tokens
  `);
  console.log('api_logs exists:', tbl[0]?.api_logs, '| reset_tokens exists:', tbl[0]?.reset_tokens);

  const admins = await withRetry('admins', () => sql`SELECT username, is_admin FROM users WHERE is_admin = TRUE LIMIT 5`);
  console.log('admins:', JSON.stringify(admins));
} catch (error) {
  console.error('Inspect failed:', error?.message);
}
