# knowledge.md — FinVue Expense Tracker

## What this is

**FinVue** — a Next.js 16 App Router expense tracker (JavaScript, no TypeScript, no test suite). Offline-first single-page client app backed by Neon Postgres. Currency is BDT (৳). PWA-capable (service worker in `public/`).

Key code locations:
- `src/app/page.js` → `ExpenseClipper` → `src/hooks/useExpenseClipper.js` — the **composition layer** that wires 7 sub-hooks (`useAuth`, `useTheme`, `useExpenses`, `useExpenseFilters`, `useUIState`, `useExpenseForm`, `useOnlineStatus`, plus `useAdmin`) and spreads their merged return into `<ExpenseClipperScreen {...clipper} />`. Edit the sub-hook owning a slice of state, not this file.
- Views under `src/Components/`: `StatisticsView/`, `LedgerView/`, `AboutView/`, `AuthView/`, `AdminView/` (admin console: Users/Expenses/Logs tabs), `ChatBot/`, `ExpenseClipper/` (incl. `ExpenseModals/` with shared `ModalShell.jsx`), `Skeleton/`, `common/`.
- Icons: `src/Components/common/Icons.jsx` — one file of inline SVG components (no icon library, though `lucide-react` is installed).
- Derived stats computed client-side in `src/utils/expenseCalculations.js`; API returns raw rows only.
- Offline persistence & coalesced mutation queue: `src/utils/offlineStore.js` (per-user localStorage; FIFO replay on reconnect).
- `src/lib/schema.mjs` (canonical) + `src/lib/schema.sql` (mirror for scripts) — **must stay in sync manually**. Tables: `users` (has `is_admin`, `security_question`, `security_answer_hash`), `expenses` (client-generated string PK), `password_reset_tokens`, `api_logs`.

## Commands

- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — production build (works; lint issues don't block it)
- `npm run start` — serve production build
- `npm run lint` — ESLint (flat config `eslint.config.js`; the whole repo has many pre-existing errors, so lint new files with `npx eslint <paths>`)
- `node scripts/init-db.mjs` — apply/migrate the schema (reads `DATABASE_URL` from `.env.local`)
- `node scripts/db-inspect.mjs` — diagnostic: prints current `users` columns, table existence, admins
- `node scripts/admin-e2e.mjs` — end-to-end check of admin API flow

Env vars in `.env.local`: `DATABASE_URL` (Neon Postgres), `JWT_SECRET`, `APP_ENV` (`development`|`production`), `GEMINI_API_KEY` (+ optional `DEEPSEEK_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY` for chat fallbacks).

## Conventions & gotchas

- **Runtime split**: most API routes declare `export const runtime = 'edge'` and use `@neondatabase/serverless` via `src/lib/db.js` (`sql` is `null` when `DATABASE_URL` unset). Keep them Edge-compatible. **Exception:** the bcrypt routes (`/api/auth/login|register|recover|security`) must be `runtime = 'nodejs'` — bcryptjs relies on `setImmediate`, absent on Edge.
- **`sql.unsafe()` is NOT an execution method** in `@neondatabase/serverless` — it returns an interpolation token. Use `` sql`${sql.unsafe(stmt)}` `` and split multi-statement strings into individual statements, or the SQL silently no-ops. All init paths (`scripts/init-db.mjs`, `GET /api/init-db`, legacy `initDB.js`) follow this pattern now — don't "simplify" it back.
- **Neon connection is flaky** from some networks (IPv6 issues / cold-started free-tier compute). Node scripts set `dns.setDefaultResultOrder('ipv4first')` and use retry loops. Don't remove those. The Node-runtime auth routes (`/api/auth/login|register|recover|security`) also call `dns.setDefaultResultOrder('ipv4first')` at module scope for the same reason — keep that import (`node:dns`) only in Node-runtime files, never in files bundled for Edge.
- No dev-user fallback: without DB/auth, auth returns `null` and `GET /api/expenses` returns `SEED_EXPENSES` demo data. **Dev-mode DB-failure fallback:** the Node-runtime auth routes (`/api/auth/login|register|recover`) fall back to their existing mock responses when a query throws a *connection* error (see `isConnectionError()` in `src/lib/db.js`) — but **only when `APP_ENV=development`**. So a local session (any credentials / mock reset codes) works while Neon is unreachable; in production a DB failure still returns 500 instead of faking auth. **All routes are now protected by `src/middleware.js`** — it verifies the `auth_token` cookie (same `decrypt()` from `src/lib/jwt.js`) and redirects unauthenticated page requests to `/login` (401 JSON for APIs). Public exceptions: `/login`, `/terms`, `/api/auth/*`, `/api/init-db`, and static assets (matcher).
- Auth: JWT (jose, HS256, 30-day) in `auth_token` httpOnly cookie. `authenticateUser(request)` / `authenticateAdmin(request)` in `src/lib/jwt.js`. All API handlers wrapped in `withApiLog` from `src/utils/apiLogger.js` (writes to `api_logs`).
- Login UI: standalone **light-only** page at `src/app/login/page.js` rendering `AuthView` (violet/indigo design flow); `AuthView` is also used as an in-app overlay. Logout redirects to `/login`.
- Admin API: `/api/admin/users` (list/role/delete), `/api/admin/expenses` (list/delete), `/api/admin/logs` — all Edge runtime, guarded by `authenticateAdmin`; admins can't change/delete their own account.
- Rate limiting: `src/utils/rateLimiter.js` (in-memory sliding window per instance); applied to auth register/login/recover and chat.
- Zod validation: `src/lib/validations.js`; routes use `schema.safeParse(body)` → 400 with `parsed.error.errors[0].message`.
- Expense IDs: `exp-<12hexchars>` from `crypto.randomUUID()` (see `generateExpenseId()` in `src/hooks/useExpenses.js`).
- Categories (in `src/data/expenseData.js`, validated by Zod): Food, Transport, Utilities, Entertainment, Healthcare, Shopping, Education, Others.
- All CRUD is **optimistic** — update local state + cache first, then API call or queue-enqueue. Failed network requests auto-enqueue.
- `StatisticsView` preserves chart state across tab switches via CSS `hidden` instead of conditional rendering (keep DOM mounted).
- Dark mode is a state flag passed via props, not Tailwind `dark:` classes. Theme persists via `src/utils/storageUtils.js`.
