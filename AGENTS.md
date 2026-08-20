# AGENTS.md

Guidance for AI coding agents working in this repository. See also `CLAUDE.md` (detailed architecture reference), `knowledge.md` (conventions & gotchas), `PROJECT_STRUCTURE.md`, `ENTITY_RELATIONSHIP.md`, `API_DOCUMENTATION.md`.

## Commands

- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — production build (works standalone; does not run lint)
- `npm run lint` — ESLint (flat config `eslint.config.js`); currently passes clean, run it after any change
- `node scripts/init-db.mjs` — apply/migrate schema (reads `DATABASE_URL` from `.env.local`, executes `src/lib/schema.sql`)
- No test suite.

Env vars in `.env.local`: `DATABASE_URL` (Neon Postgres), `JWT_SECRET`, `APP_ENV` (`development`|`production`), `GEMINI_API_KEY` (+ optional `DEEPSEEK_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY` for chat fallbacks). Also `CRON_SECRET` for the notifications cron endpoint.

## Architecture

**FinVue** — Next.js 16 App Router expense tracker, **JavaScript only (no TypeScript)**. Path alias `@/*` → `./src/*`, though most files use relative imports. Currency is BDT (৳).

### Auth middleware (all routes are protected)

`src/middleware.js` runs on every request (Edge runtime). It decrypts the `auth_token` cookie and **blocks unauthenticated access everywhere** — pages redirect to `/login`, APIs return 401. Public exceptions: `/login`, `/terms`, `/api/auth/*`, `/api/init-db`, and static assets. Authenticated users are bounced away from `/login` to `/`.

### Single-page client driven by hooks

Single client page: `src/app/page.js` → `ExpenseClipper` → hook composition layer `src/hooks/useExpenseClipper.js`, which spreads the merged return of sub-hooks into `<ExpenseClipperScreen {...clipper} />`. **Edit the owning sub-hook**, not the composition layer:

- `useAuth` — user session; caches to localStorage for offline reload
- `useTheme` — dark mode + category style resolution
- `useExpenses` — expense data + CRUD with optimistic updates + offline queue
- `useExpenseFilters` — filters, sorting, pagination, derived stats
- `useUIState` — tabs, modals, menus, chat overlay
- `useExpenseForm` — quick-add form fields
- `useOnlineStatus` — tracks `navigator.onLine`
- `useAdmin` — admin panel state & actions
- `useNotifications` — notification center state; polls `GET /api/notifications` every 60s for cron-generated summaries/alerts; provides `markRead`/`markAllRead`

`StatisticsView` keeps charts mounted across tab switches via CSS `hidden`, not conditional rendering.

### Component structure

Views under `src/components/`, grouped by feature bucket: `layout/` (app shell — `AppHeader`, `Sidebar/`, `AmbientBackground`), `ui/` (shared primitives — `Button`, `InputField`, `Icons`, `ModalShell`), `auth/`, `chat/` (AI assistant, command center, insights rail), `expense/` (`ExpenseClipper/` + `ExpenseModals/`), `ledger/`, `statistics/`, `admin/` (admin console), `about/`, `skeletons/`. Icons are inline SVGs in `src/components/ui/Icons.jsx` — one file, no icon library (though `lucide-react` is installed). Category chips use `getCategoryStyles(cat)` from `src/utils/categoryStyles.js` and `getCategoryIcon(cat)` from `src/components/ui/categoryIcons.jsx`.

### Derived data & offline

- Derived stats computed client-side in `src/utils/expenseCalculations/` (submodules + `index.js` barrel); the API returns only raw rows.
- All expense CRUD is **optimistic**: update state + cache first, then API call or queue-enqueue (`src/utils/offlineStore.js` — per-user localStorage + coalesced mutation queue, FIFO replay on reconnect).
- Dark mode is a `darkMode` prop, not Tailwind `dark:` classes. Theme persists via `src/utils/storageUtils.js`.

## API & backend

- Most routes declare `export const runtime = 'edge'` and use `@neondatabase/serverless` via `src/lib/db.js` (`sql` is `null` when `DATABASE_URL` unset). Keep Edge-compatible: no Node-only APIs in routes.
- **Exception:** the bcrypt routes `/api/auth/login|register|recover|security` must be `runtime = 'nodejs'` — `bcryptjs` relies on `setImmediate`, which Edge lacks.
- Auth: JWT via `jose` (HS256, 30-day) in `auth_token` httpOnly cookie. `authenticateUser`/`authenticateAdmin` in `src/lib/jwt.js`. **No dev-user fallback** — with no DB/auth, auth returns `null` and `GET /api/expenses` returns `SEED_EXPENSES`.
- Dev-mode DB-failure fallback: the Node-runtime auth routes fall back to mock responses on *connection* errors (`isConnectionError()` in `src/lib/db.js`) only when `APP_ENV=development`. In production a DB failure returns 500.
- All handlers wrapped in `withApiLog` (`src/utils/apiLogger.js`) → writes `api_logs` rows for the admin Live Logs panel.
- Rate limiting: `src/utils/rateLimiter.js` (in-memory sliding window per instance); on register/login/recover/chat.
- Zod validation in `src/lib/validations.js`; routes use `schema.safeParse(body)` → 400 with `parsed.error.errors[0].message`.
- Categories (`src/data/expenseData.js`, validated by Zod): Food, Transport, Utilities, Entertainment, Healthcare, Shopping, Education, Others.
- Expense IDs are client-generated: `exp-<12hexchars>` from `crypto.randomUUID()` (see `generateExpenseId()` in `src/hooks/useExpenses.js`).

### Notifications & cron

- `GET /api/notifications` — returns user's notifications (up to 50, unread first) + `unreadCount`.
- `POST /api/notifications/read` — marks notification(s) as read (`{ id }` or `{ all: true }`).
- `GET/POST /api/notifications/generate` — triggers cron generation of period summaries/alerts. Authenticated by `CRON_SECRET` header or admin JWT. Runs daily at 18:00 UTC (midnight Dhaka) via Vercel Cron (`0 18 * * *`).
- Generation logic: `src/lib/notifications/generate.js` + `src/lib/notifications/periods.js`. Computes completed day/week/month/year periods, compares to previous period, alerts when spend > trailing average × 1.25. Idempotent via `ON CONFLICT DO NOTHING`.

## Schema & migrations

- Canonical schema: `src/lib/schema.mjs` (used by `GET /api/init-db`) and mirrored in `src/lib/schema.sql` (used by `scripts/init-db.mjs`). **These two files must stay in sync manually.** No migration framework — new tables/columns go in both, applied via `node scripts/init-db.mjs` or `GET /api/init-db`. Routes never run inline migrations.
- Tables: `users` (has `is_admin`, `security_question`, `security_answer_hash`), `expenses` (client-generated string PK), `password_reset_tokens`, `api_logs`, `notifications` (cron-generated period summaries/alerts; dedupe via `(user_id, period, period_key, type)`).

## Conventions & gotchas

- **`sql.unsafe()` is NOT an execution method** in `@neondatabase/serverless` — it returns an interpolation token. Use `` sql`${sql.unsafe(stmt)}` `` and split multi-statement strings into individual statements, or SQL silently no-ops. Don't "simplify" the init scripts back to direct calls.
- **Neon connection is flaky** (IPv6 unreachable / free-tier cold starts). Node scripts set `dns.setDefaultResultOrder('ipv4first')` and retry — don't remove.
- `animate-fadeIn` is used app-wide but is **a no-op**: no `@keyframes fadeIn` exists in `globals.css` nor an animation entry in `tailwind.config.js`. Available keyframes: `shimmer`, `float`, `fadeSlideUp`, `auroraDrift`, `shineSweep`. Inner scroll areas use the `.no-scrollbar` helper (`globals.css`).
- **Design language:** the app uses a clean SaaS look — `rounded-2xl`/`rounded-xl` surfaces, slate borders (`border-slate-700/70` dark / `border-slate-200` light), violet→indigo gradient CTAs (`from-violet-500 via-purple-500 to-indigo-500`), ghost buttons, danger = rose. The legacy `cyber-*` classes (cyan neon, `cyber-cut`, `cyber-3d`) still exist in `globals.css` but are deprecated — do not use them in new UI. Shared modal shell/tokens: `src/components/ui/ModalShell.jsx` (`fieldClass`, `ghostBtnClass`, `primaryBtnClass`).
- **File-write hazard:** this repo has previously had files corrupted during agent file writes (stray junk text appended). After writing a file, verify content before linting.
- Commit style in git log: conventional-ish lowercase summaries (e.g. `feat: ...`, `fix: ...`).
- **Version auto-bump:** `prebuild` hook runs `node scripts/update-version.mjs` (patch bump). `predev` runs it with `--no-bump`. The version is exposed as `NEXT_PUBLIC_APP_VERSION` via `next.config.mjs` and displayed in the sidebar `VersionFooter`. Don't manually bump version — the script handles it.
- **Login page:** standalone light-only page at `src/app/login/page.js` rendering `AuthView`. Desktop layout is a centered two-column card (image + form, `max-w-5xl`) over a light lavender page background — keep it centered/elevated, don't revert to a full-bleed 50/50 split.
