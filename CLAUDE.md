# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server at http://localhost:3000
- `npm run build` — production build
- `npm run lint` — ESLint
- `node scripts/init-db.mjs` — initialize/migrate the database (reads `DATABASE_URL` from `.env.local`, applies `src/lib/schema.sql`)

There is no test suite.

Required env vars in `.env.local`: `DATABASE_URL` (Neon Postgres), `JWT_SECRET`, `APP_ENV` (`development` or `production`), `GEMINI_API_KEY` (plus optional `DEEPSEEK_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY` for chat fallbacks).

## Architecture

"FinVue" — a Next.js 16 App Router expense tracker (JavaScript, no TypeScript). Path alias `@/*` → `./src/*`, though many files use relative imports.

### Single-page client app driven by one hook

The whole UI is a single client-side page: [src/app/page.js](src/app/page.js) renders `ExpenseClipper`, which calls the central hook [src/hooks/useExpenseClipper.js](src/hooks/useExpenseClipper.js). That hook owns virtually all app state (auth, expenses, filters, pagination, theme, modals, chat) and passes it down via prop-spreading (`<ExpenseClipperScreen {...clipper} />`). `ExpenseClipperScreen` switches between tab views: `StatisticsView`, `LedgerView`, `AboutView`, plus `AuthView` when logged out and the `ChatBot` overlay.

- Derived data (summary cards, category breakdown, daily trend, filtered/paginated lists) is computed client-side in [src/utils/expenseCalculations.js](src/utils/expenseCalculations.js) — the API only returns raw rows.
- Component folders under [src/Components/](src/Components/) group by view (`LedgerView/`, `StatisticsView/`, `AuthView/`, `ChatBot/`, `ExpenseClipper/`, `Skeleton/`, `common/`). Icons come from [src/Components/common/Icons.jsx](src/Components/common/Icons.jsx).
- Currency is BDT (৳). Theme preference persists via [src/utils/storageUtils.js](src/utils/storageUtils.js); dark mode is a state flag passed to components, not a Tailwind `dark:` class strategy.

### API routes (all Edge runtime)

Every route under [src/app/api/](src/app/api/) declares `export const runtime = 'edge'` and uses `@neondatabase/serverless` via [src/lib/db.js](src/lib/db.js) (tagged-template `sql`). Keep Edge-compatible: no Node-only APIs in routes.

- **Auth**: JWT (`jose`, HS256, 30-day expiry) stored in an `auth_token` cookie — see [src/lib/jwt.js](src/lib/jwt.js). `authenticateUser(request)` reads the cookie; **in `APP_ENV=development` it falls back to a fake `dev-user`**, so auth-gated routes work without logging in locally. Passwords and security answers are bcrypt-hashed. Password recovery uses email + reset codes (`password_reset_tokens` table) and a security-question flow (`/api/auth/security`, `/api/auth/recover`).
- **Expenses**: `GET/POST /api/expenses`, `PUT/DELETE /api/expenses/[id]`, all scoped by `user_id`. When there's no DB or auth, `GET` returns `SEED_EXPENSES` from [src/data/expenseData.js](src/data/expenseData.js) as demo data.
- **Chat**: `POST /api/chat` tries providers in order from [src/config/aiModels.js](src/config/aiModels.js) (Gemini → DeepSeek → Groq → OpenAI), falling through on failure; provider calling/parsing lives in [src/utils/aiProviders.js](src/utils/aiProviders.js), system prompt in [src/utils/promptBuilder.js](src/utils/promptBuilder.js). The client sends the user's expenses in the request body so the AI can answer about them.

### Database schema & migrations

Canonical schema is [src/lib/schema.sql](src/lib/schema.sql): `users`, `expenses` (id is a client-generated `exp-<timestamp>-<rand>` string, not a UUID), `password_reset_tokens`. There is no migration framework — routes like `register` run idempotent `ALTER TABLE ... IF NOT EXISTS` / `CREATE ... IF NOT EXISTS` statements inline at request time ("auto-migrate"). If you change the schema, update `schema.sql` **and** add matching idempotent migrations where relevant. `POST /api/init-db` and `scripts/init-db.mjs` also create tables.

`ENTITY_RELATIONSHIP.md` and `PROJECT_STRUCTURE.md` document the data model and file layout in detail (they may lag the code slightly — the code wins).
