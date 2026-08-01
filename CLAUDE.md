# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server at http://localhost:3000
- `npm run build` — production build
- `npm run lint` — ESLint
- `node scripts/init-db.mjs` — initialize/migrate the database (reads `DATABASE_URL` from `.env.local`, executes `src/lib/schema.sql`)

There is no test suite.

Required env vars in `.env.local`: `DATABASE_URL` (Neon Postgres), `JWT_SECRET`, `APP_ENV` (`development` or `production`), `GEMINI_API_KEY` (plus optional `DEEPSEEK_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY` for chat fallbacks).

## Architecture

"FinVue" — a Next.js 16 App Router expense tracker (JavaScript, no TypeScript). Path alias `@/*` → `./src/*`, though most files use relative imports.

### Offline-first single-page client app driven by one hook

The whole UI is a single client-side page: [src/app/page.js](src/app/page.js) renders `ExpenseClipper`, which calls the central hook [src/hooks/useExpenseClipper.js](src/hooks/useExpenseClipper.js). That hook is a thin **composition layer** — it doesn't own state directly but wires together seven focused sub-hooks and merges their return values (via object-spread) into one props object that's passed down by prop-spreading (`<ExpenseClipperScreen {...clipper} />`). Each sub-hook owns one slice of state:

- [useAuth](src/hooks/useAuth.js) — user session; caches to localStorage for offline reload; its `onLogout` clears expenses
- [useTheme](src/hooks/useTheme.js) — dark mode + category style resolution
- [useExpenses](src/hooks/useExpenses.js) — expense data + CRUD with **offline-first optimistic updates** (hydrates from localStorage instantly, then refreshes from API; keyed off `auth.user`)
- [useExpenseFilters](src/hooks/useExpenseFilters.js) — filters, sorting, pagination, derived stats
- [useUIState](src/hooks/useUIState.js) — tabs, modals, menus, chat overlay
- [useExpenseForm](src/hooks/useExpenseForm.js) — quick-add form fields
- [useOnlineStatus](src/hooks/useOnlineStatus.js) — tracks `navigator.onLine`, gating network vs. offline mutation paths

When changing behavior, edit the relevant sub-hook, not the composition layer. `ExpenseClipperScreen` switches between tab views: `StatisticsView`, `LedgerView`, `AboutView`, plus `AuthView` when logged out and the `ChatBot` overlay.

**StatisticsView preserves chart state** across tab switches — it uses CSS `hidden` instead of conditional rendering to keep the DOM and chart instances mounted.

- Derived data (summary cards, category breakdown, daily trend, filtered/paginated lists) is computed client-side in [src/utils/expenseCalculations.js](src/utils/expenseCalculations.js) — the API only returns raw rows.
- Component folders under [src/Components/](src/Components/) group by view (`LedgerView/`, `StatisticsView/`, `AuthView/`, `ChatBot/`, `ExpenseClipper/`, `Skeleton/`, `common/`). Icons come from [src/Components/common/Icons.jsx](src/Components/common/Icons.jsx) — a single file of inline SVG components, not an icon library.
- Currency is BDT (৳). Theme preference persists via [src/utils/storageUtils.js](src/utils/storageUtils.js); dark mode is a state flag passed to components, not a Tailwind `dark:` class strategy.

### Offline persistence & sync queue

[src/utils/offlineStore.js](src/utils/offlineStore.js) manages per-user localStorage: cached user, cached expenses, and a coalesced mutation queue. On reconnect, `useExpenses` replays queued operations in FIFO order against the API. The queue coalesces ops for the same entity:

- update after a pending add → merged into the add payload
- delete of a never-synced add → drops all pending ops (net no-op)
- delete otherwise → drops pending updates for the same id, then pushes delete

All CRUD in `useExpenses` is **optimistic**: state + cache are updated immediately, then the API call or queue-enqueue happens asynchronously. Failed network requests automatically enqueue.

The app is PWA-capable with a service worker ([public/sw.js](public/sw.js)) and manifest ([public/manifest.json](public/manifest.json)).

### API routes (all Edge runtime)

Every route under [src/app/api/](src/app/api/) declares `export const runtime = 'edge'` and uses `@neondatabase/serverless` via [src/lib/db.js](src/lib/db.js) (a tagged-template `sql` — `null` when `DATABASE_URL` is unset). Keep Edge-compatible: no Node-only APIs in routes.

- **Auth**: JWT via `jose` (HS256, 30-day expiry) stored in an `auth_token` httpOnly cookie — see [src/lib/jwt.js](src/lib/jwt.js). `authenticateUser(request)` reads the cookie and returns the decoded payload or `null`. There is **no dev-user fallback** — when the DB is unavailable, auth returns `null` and the expenses API falls back to returning `SEED_EXPENSES` as demo data. Passwords and security answers are bcrypt-hashed (cost factor 12). Password recovery uses email + 6-digit reset codes (`password_reset_tokens` table) and a security-question flow (`/api/auth/security`, `/api/auth/recover`). Registration validates with Zod then checks username/email uniqueness server-side (returns 409 on conflict).
- **Rate limiting**: [src/utils/rateLimiter.js](src/utils/rateLimiter.js) — in-memory sliding window per Edge instance. Applied on `/api/auth/register` (5 req/min per IP), `/api/auth/login`, and `/api/auth/recover`. `checkRateLimit(request, key, config)` returns `null` on pass or a 429 `NextResponse` when exceeded.
- **Expenses**: `GET/POST /api/expenses`, `PUT/DELETE /api/expenses/[id]`, all scoped by `user_id`. When there's no DB or auth, `GET` returns `SEED_EXPENSES` from [src/data/expenseData.js](src/data/expenseData.js). All request bodies are validated with Zod schemas via `safeParse()`.
- **Chat**: `POST /api/chat` tries AI providers in order from [src/config/aiModels.js](src/config/aiModels.js) (Gemini → DeepSeek → Groq → OpenAI), falling through on failure. Provider calling/parsing lives in [src/utils/aiProviders.js](src/utils/aiProviders.js), system prompt in [src/utils/promptBuilder.js](src/utils/promptBuilder.js). The client sends the user's expenses in the request body so the AI can answer about them.
- **DB init**: `GET /api/init-db` executes the canonical schema from [src/lib/schema.mjs](src/lib/schema.mjs) as idempotent `CREATE ... IF NOT EXISTS` statements.

### Database schema & migrations

Schema is defined in [src/lib/schema.mjs](src/lib/schema.mjs) (canonical, imported by the init-db route) and mirrored in [src/lib/schema.sql](src/lib/schema.sql) (used by `scripts/init-db.mjs`). These two files must stay in sync manually. Tables: `users` (UUID primary key), `expenses` (client-generated string primary key — see Expense IDs below), `password_reset_tokens`. There is no migration framework — new tables/columns go into both schema files and are applied via `node scripts/init-db.mjs` or `GET /api/init-db`. Routes do **not** run inline migrations at request time.

### Validation

[src/lib/validations.js](src/lib/validations.js) — Zod schemas for all user-input boundaries: `loginSchema`, `registerSchema`, `securityQuestionSchema`, `recoverRequestSchema`, `recoverVerifySchema`, `createExpenseSchema`, `updateExpenseSchema`. Routes use `schema.safeParse(body)` and return 400 with `parsed.error.errors[0].message` on failure.

### Expense IDs

Client-generated by `generateExpenseId()` in [src/hooks/useExpenses.js](src/hooks/useExpenses.js): the first three segments of `crypto.randomUUID()` concatenated with no separator and prefixed, giving `exp-<12hexchars>` (collision-resistant, non-predictable). Falls back to a timestamp + `Math.random()` string when `crypto.randomUUID` is unavailable.

### Categories

Defined in [src/data/expenseData.js](src/data/expenseData.js) as `CATEGORIES`: Food, Transport, Utilities, Entertainment, Healthcare, Shopping, Education, Others. The Zod `categorySchema` in `validations.js` imports this list and validates against it.
