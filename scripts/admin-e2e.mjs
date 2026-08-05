// End-to-end verification for the admin feature. Creates two throwaway users,
// verifies the admin API surface, then removes every trace via direct SQL.
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const dbUrl = env.match(/DATABASE_URL="([^"]+)"/)?.[1] || env.match(/DATABASE_URL=([^\s]+)/)?.[1] || '';
const sql = neon(dbUrl);

const BASE = 'http://localhost:3000';
const results = [];
const check = (name, cond, extra = '') => {
  results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`);
  if (!cond) process.exitCode = 1;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// The Neon connection from this machine is flaky, so retry every request and
// never let a hung fetch stall the run.
const request = async (path, { method = 'GET', body, cookie } = {}) => {
  for (let attempt = 1; attempt <= 12; attempt += 1) {
    try {
      const res = await fetch(BASE + path, {
        method,
        signal: AbortSignal.timeout(20000),
        headers: {
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(cookie ? { Cookie: cookie } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch { /* ignore */ }
      return {
        status: res.status,
        data,
        setCookie: res.headers.get('set-cookie')?.split(';')[0] || null,
      };
    } catch {
      if (attempt === 12) return { status: -1, data: null, setCookie: null };
      await sleep(3000);
    }
  }
  return { status: -1, data: null, setCookie: null };
};

const sqlWithRetry = async (label, fn) => {
  for (let i = 1; i <= 10; i++) {
    try {
      return await fn();
    } catch {
      if (i === 10) throw new Error(`${label}: connection never recovered`);
      await sleep(4000);
    }
  }
};

const ts = Date.now().toString(36);
const usernameA = `admtest_${ts}`;
const usernameB = `admtest_${ts}_b`;
const password = 'AdminTest123!';

try {
  // ── Wait for a STABLE Edge→Neon connection before asserting ──
  let stable = 0;
  for (let i = 0; i < 60 && stable < 3; i += 1) {
    const r = await request('/api/expenses');
    if (r.status === 200) stable += 1;
    else stable = 0;
    await sleep(3000);
  }
  console.log(`  (connection stability: ${stable}/3 consecutive DB hits)`);
  if (stable < 3) {
    throw new Error('Neon connection too unstable to run the full flow');
  }

  // ── 1. Register two throwaway users ──
  const regA = await request('/api/auth/register', {
    method: 'POST', body: { username: usernameA, email: `${usernameA}@example.com`, password },
  });
  check('register A', regA.status === 200 || regA.status === 201, `status=${regA.status}`);
  const regB = await request('/api/auth/register', {
    method: 'POST', body: { username: usernameB, email: `${usernameB}@example.com`, password },
  });
  check('register B', regB.status === 200 || regB.status === 201, `status=${regB.status}`);

  // ── 2. Non-admin must be blocked from all admin routes ──
  for (const path of ['/api/admin/users', '/api/admin/expenses', '/api/admin/logs']) {
    const r = await request(path, { cookie: regA.setCookie });
    check(`non-admin blocked from ${path}`, r.status === 403, `status=${r.status}`);
  }

  // ── 3. Promote A via SQL, then re-login to get an admin JWT ──
  await sqlWithRetry('promote A', () =>
    sql`UPDATE users SET is_admin = TRUE WHERE username = ${usernameA}`
  );
  const loginA = await request('/api/auth/login', {
    method: 'POST', body: { username: usernameA, password },
  });
  check('login A', loginA.status === 200, `status=${loginA.status}`);
  check('A JWT carries isAdmin', loginA.data?.user?.isAdmin === true);
  const cookieA = loginA.setCookie;

  // ── 4. Admin list endpoints ──
  const usersR = await request('/api/admin/users', { cookie: cookieA });
  check('GET /admin/users 200', usersR.status === 200, `status=${usersR.status}`);
  const usersList = Array.isArray(usersR.data) ? usersR.data : [];
  const aRow = usersList.find((u) => u.username === usernameA);
  const bRow = usersList.find((u) => u.username === usernameB);
  check('users list contains A+B', Boolean(aRow && bRow));
  check('A shows isAdmin true', aRow?.isAdmin === true);

  const expR = await request('/api/admin/expenses?limit=10', { cookie: cookieA });
  check('GET /admin/expenses 200', expR.status === 200, `status=${expR.status}`);

  const logsR = await request('/api/admin/logs?limit=10', { cookie: cookieA });
  check('GET /admin/logs 200', logsR.status === 200, `status=${logsR.status}`);
  check('logs table has rows', Array.isArray(logsR.data) && logsR.data.length > 0, `rows=${logsR.data?.length}`);

  // ── 5. Role management ──
  const patchB = await request('/api/admin/users', {
    method: 'PATCH', cookie: cookieA, body: { id: bRow.id, isAdmin: true },
  });
  check('grant admin to B', patchB.status === 200 && patchB.data?.isAdmin === true, `status=${patchB.status}`);

  const patchSelf = await request('/api/admin/users', {
    method: 'PATCH', cookie: cookieA, body: { id: aRow.id, isAdmin: false },
  });
  check('self-demotion blocked (400)', patchSelf.status === 400, `status=${patchSelf.status}`);

  // ── 6. Expense delete via admin route ──
  const expId = `exp-e2e-${ts}`;
  const addExp = await request('/api/expenses', {
    method: 'POST', cookie: cookieA,
    body: { id: expId, description: 'E2E test expense', amount: 100, date: '2026-08-05', category: 'Food' },
  });
  check('A adds an expense', addExp.status === 201 || addExp.status === 200, `status=${addExp.status}`);
  const delExp = await request('/api/admin/expenses', {
    method: 'DELETE', cookie: cookieA, body: { id: expId },
  });
  check('admin deletes any expense', delExp.status === 200, `status=${delExp.status}`);
  const missingExp = await request('/api/admin/expenses', {
    method: 'DELETE', cookie: cookieA, body: { id: expId },
  });
  check('deleting missing expense → 404', missingExp.status === 404, `status=${missingExp.status}`);

  // ── 7. User delete via admin route ──
  const delB = await request('/api/admin/users', {
    method: 'DELETE', cookie: cookieA, body: { id: bRow.id },
  });
  check('admin deletes user B', delB.status === 200, `status=${delB.status}`);
  const afterDel = await request('/api/admin/users', { cookie: cookieA });
  check('B gone from users list', !(Array.isArray(afterDel.data) && afterDel.data.some((u) => u.id === bRow.id)));

  const delSelf = await request('/api/admin/users', {
    method: 'DELETE', cookie: cookieA, body: { id: aRow.id },
  });
  check('self-delete blocked (400)', delSelf.status === 400, `status=${delSelf.status}`);

  // ── 8. Clear logs ──
  const clearLogs = await request('/api/admin/logs', { method: 'DELETE', cookie: cookieA });
  check('clear logs', clearLogs.status === 200, `status=${clearLogs.status}`);
} catch (error) {
  console.error('E2E script crashed:', error?.message);
  process.exitCode = 1;
} finally {
  // ── Cleanup: remove all traces from the database ──
  try {
    await sqlWithRetry('cleanup', async () => {
      await sql`DELETE FROM users WHERE username IN (${usernameA}, ${usernameB})`;
      await sql`DELETE FROM api_logs WHERE username LIKE 'admtest_%'`;
    });
    console.log('  (cleanup complete)');
  } catch (error) {
    console.error('Cleanup failed:', error?.message);
  }
  console.log(results.join('\n'));
}
