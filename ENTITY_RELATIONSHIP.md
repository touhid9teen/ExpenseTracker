# ExpenseTracker — Entity-Relationship & Data Flow Document

> **Project:** FinVue Expense Tracker  
> **Stack:** Next.js 16 (App Router) + Neon (PostgreSQL) + JWT Auth  
> **Runtime:** Edge (Vercel) — auth/bcrypt routes on Node.js

---

## Table of Contents

1. [Entity Overview](#1-entity-overview)
2. [Entity-Relationship Step-by-Step Algorithm](#2-entity-relationship-step-by-step-algorithm)
3. [Database Schema Pseudocode](#3-database-schema-pseudocode)
4. [CRUD Operation Pseudocode](#4-crud-operation-pseudocode)
5. [Computed Data & Statistics Pseudocode](#5-computed-data--statistics-pseudocode)
6. [Authentication Flow Pseudocode](#6-authentication-flow-pseudocode)
7. [Data Validation & Constraints](#7-data-validation--constraints)
8. [Indexing Strategy](#8-indexing-strategy)

---

## 1. Entity Overview

### Entity 1: `users`

| Attribute               | Type                    | Constraints                              |
|-------------------------|-------------------------|------------------------------------------|
| `id`                    | UUID                    | PRIMARY KEY, DEFAULT gen_random_uuid()   |
| `username`              | VARCHAR(255)            | UNIQUE, NOT NULL                         |
| `email`                 | VARCHAR(255)            | NOT NULL, DEFAULT `''`, unique when set  |
| `password_hash`         | VARCHAR(255)            | NOT NULL (bcrypt)                        |
| `security_question`     | VARCHAR(255)            | NOT NULL, DEFAULT `''`                   |
| `security_answer_hash`  | VARCHAR(255)            | NOT NULL, DEFAULT `''` (bcrypt)          |
| `is_admin`              | BOOLEAN                 | NOT NULL, DEFAULT FALSE                  |
| `created_at`            | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP               |

**Description:** Represents an authenticated user. Includes identity fields (`username`, `email`), a bcrypt-hashed password, a recovery security question/answer pair, and an admin role flag. All expenses and reset tokens are scoped to a specific user.

### Entity 2: `password_reset_tokens`

| Attribute    | Type                     | Constraints                                       |
|--------------|--------------------------|---------------------------------------------------|
| `id`         | SERIAL (INTEGER)         | PRIMARY KEY                                      |
| `user_id`    | UUID                     | FOREIGN KEY → users(id) ON DELETE CASCADE, NOT NULL |
| `token`      | VARCHAR(255)             | UNIQUE, NOT NULL (bcrypt hash of the 6-digit code) |
| `expires_at` | TIMESTAMP WITH TIME ZONE | NOT NULL (15 minutes)                            |
| `used`       | BOOLEAN                  | DEFAULT FALSE                                    |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP                        |

**Description:** One-time password-reset codes. Only the bcrypt hash is stored; the plaintext 6-digit code is shown to the user (in dev) or delivered out-of-band. Tokens are single-use and expire after 15 minutes.

### Entity 3: `expenses`

| Attribute     | Type                     | Constraints                            |
|---------------|--------------------------|----------------------------------------|
| `id`          | VARCHAR(255)             | PRIMARY KEY (client-generated)         |
| `user_id`     | UUID                     | FOREIGN KEY → users(id) ON DELETE CASCADE |
| `item`        | VARCHAR(255)             | NULLABLE (falls back to `description`) |
| `description` | TEXT                     | NULLABLE                               |
| `amount`      | NUMERIC                  | NULLABLE (BDT/৳)                       |
| `date`        | DATE                     | NULLABLE                               |
| `category`    | VARCHAR(255)             | NULLABLE                               |
| `created_at`  | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP              |

**Description:** A single financial transaction — item name, description, amount (BDT), date, and spending category. Each expense is owned by exactly one user.

### Entity 4: `api_logs` (Audit Table)

| Attribute    | Type                     | Constraints                 |
|--------------|--------------------------|-----------------------------|
| `id`         | BIGSERIAL (BIGINT)       | PRIMARY KEY                 |
| `method`     | VARCHAR(10)              | NULLABLE (GET/POST/…)        |
| `path`       | VARCHAR(512)             | NULLABLE (request path)      |
| `status`     | INTEGER                  | NULLABLE (HTTP status)       |
| `user_id`    | UUID                     | NULLABLE (denormalized)      |
| `username`   | VARCHAR(255)             | NULLABLE (denormalized)      |
| `ip`         | VARCHAR(64)              | NULLABLE (client IP)         |
| `duration_ms`| INTEGER                  | NULLABLE (request time)      |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP    |

**Description:** Read-only audit trail written by `withApiLog` (`src/utils/apiLogger.js`) for every wrapped route. Powers the admin **Live Logs** panel. Deliberately denormalized (no FK) so log rows survive user deletion.

### Relationship Summary

```
users (1) ────────< (N) expenses
       one-to-many

users (1) ────────< (N) password_reset_tokens
       one-to-many

api_logs            (standalone audit table, no FK)
```

- A **User** can have **zero or many** Expenses.
- An **Expense** belongs to **exactly one** User.
- A **User** can have **zero or many** Password Reset Tokens (old ones are invalidated on each new request).
- Deleting a User **cascades** to delete their Expenses and Reset Tokens.
- **api_logs** is independent — rows are kept even if the user is later deleted.

### Category Enum (Application-Level)

```
CATEGORIES = [
    "Food", "Transport", "Utilities", "Entertainment",
    "Healthcare", "Shopping", "Education", "Others"
]
```

Defined as a JavaScript constant in `src/data/expenseData.js` and enforced by Zod in `src/lib/validations.js` — not a database-level ENUM.

---

## 2. Entity-Relationship Step-by-Step Algorithm

The following numbered steps describe how the ExpenseTracker system processes entities from the moment a user interacts with the application.

### Phase 1: Authentication & User Entity Resolution

```
Step 1  — User opens the application.
Step 2  — System checks for an existing auth_token cookie.
Step 3a — IF cookie exists:
             3a.1. Decrypt the JWT using jose (HS256 algorithm).
             3a.2. Extract { id, username, isAdmin } from the payload.
             3a.3. Set currentUser = decrypted payload.
Step 3b — IF cookie does NOT exist:
             3b.1. Show the AuthView to the user.
             3b.2. Prompt for { username, email, password }.
Step 4  — User submits the register form with { username, email, password }.
Step 5  — POST /api/auth/register → rate-limited (5/min/IP) → Zod-validated.
Step 6  — System queries the users table:
             SELECT id FROM users WHERE username = submitted_username.
Step 7a — IF username EXISTS → 409 "This username is already taken".
Step 7b — ELSE query: SELECT id FROM users WHERE email = submitted_email AND email != ''.
Step 8a — IF email EXISTS → 409 "This email is already registered".
Step 8b — ELSE:
             8b.1. Hash the password with bcrypt.hash(password, 12).
             8b.2. INSERT INTO users (username, email, password_hash)
                   VALUES (username, email, hashed_password)
                   RETURNING id, username, email, created_at.
Step 9  — Create JWT token: encrypt({ id, username, isAdmin: false }) — 30-day expiry.
Step 10 — Set httpOnly cookie: auth_token, path = "/", maxAge = 30 days.
Step 11 — Return { success: true, user, isNewUser: true }.
         (Dev fallback: when no DB or Neon unreachable, mockRegister issues a
          session with id "mock-user-id".)
```

### Phase 2: Expense Entity Loading

```
Step 12 — After authentication, the client triggers fetchExpenses().
Step 13 — GET /api/expenses with the auth_token cookie.
Step 14a — IF no user OR no database:
              14a.1. Return SEED_EXPENSES (mock records).
Step 14b — IF database exists AND user authenticated:
              14b.1. Query: SELECT * FROM expenses
                     WHERE user_id = currentUser.id
                     ORDER BY date DESC.
              14b.2. For each expense, normalize amount:
                     normalizeAmount(expense.amount).
Step 15 — Client stores the normalized expenses in React state.
Step 16 — React recomputes all derived statistics (see Phase 4).
```

### Phase 3: Expense CRUD Operations

#### Create Expense

```
Step 17 — User fills the Add/Daily expense modal or the quick-add form.
Step 18 — Build expense object:
             {
                 id: `exp-${crypto.randomUUID().slice(0, 12).replaceAll("-", "")}`,
                 description,
                 amount: parseFloat(input),
                 date: YYYY-MM-DD,
                 category: selected_category
             }
Step 19 — Optimistic update: prepend expense to local state + cache.
Step 20 — POST /api/expenses (Zod-validated via createExpenseSchema).
Step 21 — Server:
              21.1. authenticateUser(request) → user_id.
              21.2. INSERT INTO expenses (id, user_id, item, description,
                    amount, date, category)
                    VALUES (id, user.id, description, description,
                    amount, date, category) RETURNING *.
              21.3. Normalize amount, return 201.
Step 22 — On failure: roll back local state; if offline, enqueue into the
         mutation queue (src/utils/offlineStore.js) for FIFO replay on reconnect.
Step 23 — Toast notification: "Expense added successfully!"
```

#### Read (List) Expenses

```
Step 24 — GET /api/expenses (already covered in Phase 2).
Step 25 — Client-side filtering & sorting (no extra server calls):
              25a. Filter by search query (matches item/description).
              25b. Filter by category (exact match).
              25c. Filter by date (today/week/month/custom/specific).
              25d. Sort by date (asc/desc) or amount (asc/desc).
Step 26 — Client-side pagination: (currentPage - 1) * itemsPerPage to
         currentPage * itemsPerPage.
```

#### Update Expense

```
Step 27 — User clicks edit on a row → setEditingExpense(expense).
Step 28 — EditExpenseModal renders pre-filled { date, category, description, amount }.
Step 29 — User submits → optimistic in-place update of local state.
Step 30 — PUT/PATCH /api/expenses/[id] (updateExpenseSchema).
Step 31 — Server:
              31.1. authenticateUser(request) → user_id.
              31.2. UPDATE expenses SET description, amount, date, category
                    WHERE id = params.id AND user_id = user.id RETURNING *.
              31.3. If no rows → 404 "Expense not found".
Step 32 — On failure: rollback + queue if offline. Toast on success.
```

#### Delete Expense

```
Step 33 — User clicks delete → setDeletingExpense(expense).
Step 34 — DeleteExpenseModal shows confirmation.
Step 35 — User confirms → optimistic removal from local state.
Step 36 — DELETE /api/expenses/[id].
Step 37 — Server:
              37.1. authenticateUser(request) → user_id.
              37.2. DELETE FROM expenses
                    WHERE id = params.id AND user_id = user.id RETURNING *.
              37.3. If no rows → 404.
Step 38 — On failure: rollback + queue if offline. Toast on success.
```

### Phase 4: Statistics Computation (Derived Entities)

```
Step 39 — Client recomputes statistics whenever the filtered expense list changes.
Step 40 — calculateSummaryCards(filteredExpenses):
             40a. Initialize { total, today, week, month } = 0.
             40b. For each expense:
                  - total += amount
                  - IF isToday(date) → today += amount
                  - IF isThisWeek(date) → week += amount
                  - IF isThisMonth(date) → month += amount
             40c. Return { total, today, week, month }.
Step 41 — calculateCategoryBreakdown(filteredExpenses):
             41a. Initialize totals = {} and grandTotal = 0.
             41b. For each expense: totals[category] += amount; grandTotal += amount.
             41c. Map to [{ category, amount, percentage }], sort by amount desc.
Step 42 — Daily spending trend (last 7 days), with height percentage relative to max.
Step 43 — calculateQuickStats: highest/lowest spending day, most used category,
         average daily spend.
```

### Phase 5: AI Assistant & Chat Actions

```
Step 44 — User sends a natural language message via the ChatBot / AIAssistant.
Step 45 — POST /api/chat (rate-limited) → prompt built by promptBuilder.js.
Step 46 — Provider chain in aiProviders.js: Gemini → DeepSeek → Groq → OpenAI.
Step 47a — IF the AI returns a tool/action (e.g. "add expense"):
              47a.1. Client parses it and follows the relevant Phase 3 CRUD flow.
Step 47b — ELSE: the text reply is rendered as an insight.
Step 48 — AI insight cards in StatisticsView summarize trends without writing rows.
```

---

## 3. Database Schema Pseudocode

```sql
-- =====================================================
-- DATABASE SCHEMA — ExpenseTracker (PostgreSQL / Neon)
-- Canonical source: src/lib/schema.mjs (mirrored in src/lib/schema.sql)
-- =====================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================
-- TABLE: users
-- ====================
CREATE TABLE IF NOT EXISTS users (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username              VARCHAR(255) UNIQUE NOT NULL,
    email                 VARCHAR(255) NOT NULL DEFAULT '',
    password_hash         VARCHAR(255) NOT NULL,
    security_question     VARCHAR(255) NOT NULL DEFAULT '',
    security_answer_hash  VARCHAR(255) NOT NULL DEFAULT '',
    is_admin              BOOLEAN NOT NULL DEFAULT FALSE,
    created_at            TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Backfill columns on databases created before these features existed
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_question VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_answer_hash VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email) WHERE email != '';

-- ====================
-- TABLE: password_reset_tokens
-- ====================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id         SERIAL PRIMARY KEY,
    user_id    UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    token      VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used       BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_user_id ON password_reset_tokens(user_id);

-- ====================
-- TABLE: expenses
-- ====================
CREATE TABLE IF NOT EXISTS expenses (
    id          VARCHAR(255) PRIMARY KEY,
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    item        VARCHAR(255),
    description TEXT,
    amount      NUMERIC,
    date        DATE,
    category    VARCHAR(255),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id_date ON expenses(user_id, date DESC);

-- ====================
-- TABLE: api_logs
-- ====================
CREATE TABLE IF NOT EXISTS api_logs (
    id          BIGSERIAL PRIMARY KEY,
    method      VARCHAR(10),
    path        VARCHAR(512),
    status      INTEGER,
    user_id     UUID,
    username    VARCHAR(255),
    ip          VARCHAR(64),
    duration_ms INTEGER,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_api_logs_id_desc ON api_logs(id DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at DESC);

-- Seed the platform owner as an administrator (idempotent)
UPDATE users SET is_admin = TRUE WHERE username = 'touhid';
```

---

## 4. CRUD Operation Pseudocode

### Create Expense (Server — Edge Runtime)

```
FUNCTION POST /api/expenses(request):
    user ← authenticateUser(request)      // JWT via jose

    IF user is null:
        RETURN 401 { error: "Unauthorized" }

    IF database is not configured:
        RETURN 503 { error: "Database is not configured" }

    data ← request.json()                 // { id, description, amount, date, category }
    parsed ← createExpenseSchema.safeParse(data)
    IF NOT parsed.success:
        RETURN 400 { error: parsed.error.errors[0].message }

    result ← SQL.INSERT INTO expenses (id, user_id, item, description, amount, date, category)
                   VALUES (parsed.data.id, user.id, parsed.data.description, parsed.data.description,
                           parsed.data.amount, parsed.data.date, parsed.data.category)
                   RETURNING *

    RETURN 201 { ...result[0], amount: normalizeAmount(result[0].amount) }
```

### Read Expenses (Server — Edge Runtime)

```
FUNCTION GET /api/expenses(request):
    user ← authenticateUser(request)

    IF NOT sql OR user is null:
        RETURN 200 SEED_EXPENSES

    expenses ← SQL.SELECT * FROM expenses
                WHERE user_id = user.id
                ORDER BY date DESC

    RETURN 200 expenses.map(e → { ...e, amount: normalizeAmount(e.amount) })
```

### Update Expense (Server — Edge Runtime)

```
FUNCTION PATCH /api/expenses/[id](request, { params }):
    user ← authenticateUser(request)
    IF user is null: RETURN 401 { error: "Unauthorized" }

    data ← request.json()                 // { description, amount, date, category }
    parsed ← updateExpenseSchema.safeParse(data)
    IF NOT parsed.success: RETURN 400 { error: ... }

    result ← SQL.UPDATE expenses
                SET description = parsed.data.description,
                    amount = parsed.data.amount,
                    date = parsed.data.date,
                    category = parsed.data.category
                WHERE id = params.id AND user_id = user.id
                RETURNING *

    IF result.length == 0: RETURN 404 { error: "Expense not found" }

    RETURN 200 { ...result[0], amount: normalizeAmount(result[0].amount) }
```

### Delete Expense (Server — Edge Runtime)

```
FUNCTION DELETE /api/expenses/[id](request, { params }):
    user ← authenticateUser(request)
    IF user is null: RETURN 401 { error: "Unauthorized" }

    result ← SQL.DELETE FROM expenses
                WHERE id = params.id AND user_id = user.id
                RETURNING *

    IF result.length == 0: RETURN 404 { error: "Expense not found" }

    RETURN 200 { success: true, deleted: result[0] }
```

### API Logging Wrapper (applied to every route)

```
FUNCTION withApiLog(handler):
    RETURN async (request, context):
        start ← Date.now()
        response ← handler(request, context)
        user ← authenticateUser(request)
        logApiRequest({
            method: request.method,
            path: new URL(request.url).pathname,
            status: response.status,
            user,
            ip: getClientIp(request),          // x-forwarded-for / x-real-ip
            durationMs: Date.now() - start
        })
        RETURN response
        // Best-effort: log failures are swallowed, never break the request.
```

---

## 5. Computed Data & Statistics Pseudocode

### Amount Normalization

```
FUNCTION normalizeAmount(amount):
    IF typeof amount == "number" AND isFinite(amount):
        RETURN amount
    parsed ← parseFloat(amount)
    RETURN isFinite(parsed) ? parsed : 0
```

### Filter & Sort Engine

```
FUNCTION filterAndSortExpenses({ expenses, searchQuery, categoryFilter,
                                 activeDateFilter, appliedCustomRange,
                                 specificDate, sortBy, sortOrder }):
    result ← expenses.map(normalizeExpenseRecord)

    IF searchQuery.trim() != "":
        query ← searchQuery.toLowerCase()
        result ← result.filter(exp →
            exp.description.toLowerCase().includes(query) OR
            exp.item.toLowerCase().includes(query))

    IF categoryFilter != "All":
        result ← result.filter(exp → exp.category == categoryFilter)

    SWITCH activeDateFilter:
        CASE "today":    result ← result.filter(isToday)
        CASE "week":     result ← result.filter(isThisWeek)
        CASE "month":    result ← result.filter(isThisMonth)
        CASE "specific": result ← result.filter(exp → exp.date == specificDate)
        CASE "custom":   result ← result.filter(exp →
                             exp.date >= appliedCustomRange.start AND
                             exp.date <= appliedCustomRange.end)

    IF sortBy == "date":
        result.sort(date asc/desc)
    ELSE IF sortBy == "amount":
        result.sort(amount asc/desc)

    RETURN result
```

### Summary Cards Calculation

```
FUNCTION calculateSummaryCards(expenses):
    total ← 0; today ← 0; week ← 0; month ← 0
    FOR EACH expense IN expenses:
        amount ← normalizeExpenseAmount(expense.amount)
        total += amount
        IF isToday(expense.date):   today += amount
        IF isThisWeek(expense.date): week += amount
        IF isThisMonth(expense.date): month += amount
    RETURN { total, today, week, month }
```

### Category Breakdown Calculation

```
FUNCTION calculateCategoryBreakdown(expenses):
    IF expenses.length == 0: RETURN []

    totals ← {}; grandTotal ← 0
    FOR EACH expense IN expenses:
        amount ← normalizeExpenseAmount(expense.amount)
        totals[expense.category] += amount
        grandTotal += amount

    breakdown ← MAP totals TO { category, amount,
                                percentage: ROUND(value / grandTotal * 100) }
    RETURN breakdown SORTED BY amount DESC
```

### Daily Spending Trend Calculation

```
FUNCTION calculateDailySpendingTrend(expenses):
    trendDays ← last 7 date strings
    dateValues ← map initialized to 0 per day
    FOR EACH expense IN expenses:
        IF expense.date IN dateValues:
            dateValues[expense.date] += amount

    maxSpent ← MAX(1, MAX(dateValues.values))
    RETURN trendDays.map(date → { date, label, amount,
                                  heightPct: ROUND(value / maxSpent * 100) })
```

### Quick Stats Calculation

```
FUNCTION calculateQuickStats(expenses):
    dateGroups ← {}; categoryCounts ← {}
    FOR EACH expense:
        dateGroups[date] += amount
        categoryCounts[category] += 1

    highest ← { date, amount } with max date total
    lowest  ← { date, amount } with min date total
    mostUsedCategory ← category with max count
    avgDaily ← totalAmount / dateGroups.length

    RETURN { highest, lowest, mostUsedCategory, avgDaily }
```

### Pagination

```
FUNCTION paginateExpenses(expenses, currentPage, itemsPerPage):
    startIndex ← (currentPage - 1) * itemsPerPage
    RETURN expenses.slice(startIndex, startIndex + itemsPerPage)
```

---

## 6. Authentication Flow Pseudocode

### Register

```
FUNCTION POST /api/auth/register(request):        // runtime = 'nodejs'
    rateLimit check (5/min/IP)
    { username, email, password } ← request.json()
    parsed ← registerSchema.safeParse(body)
    IF NOT parsed.success: RETURN 400

    IF NOT sql: RETURN mockRegister(username, email)

    IF username exists:     RETURN 409 "This username is already taken"
    IF email already used:  RETURN 409 "This email is already registered"

    hashedPassword ← bcrypt.hash(password, 12)
    inserted ← SQL.INSERT INTO users (username, email, password_hash)
                  VALUES (username, email, hashedPassword)
                  RETURNING id, username, email, created_at

    token ← encrypt({ id, username, isAdmin: false })   // HS256, 30 days
    SET cookie auth_token (httpOnly, sameSite lax, maxAge 30d, secure in prod)
    RETURN { success: true, user, isNewUser: true }
```

### Login

```
FUNCTION POST /api/auth/login(request):           // runtime = 'nodejs'
    rateLimit check (10/min/IP)
    { username, password } ← request.json()

    users ← SQL.SELECT * FROM users WHERE username = username
    IF users.length == 0: RETURN 401 "Invalid username or password."

    user ← users[0]
    valid ← bcrypt.compare(password, user.password_hash)
    IF NOT valid: RETURN 401 "Invalid username or password."

    token ← encrypt({ id, username, isAdmin: !!user.is_admin })
    SET cookie auth_token
    RETURN { success: true, user: { id, username, email, isAdmin } }
```

### Logout

```
FUNCTION POST /api/auth/logout():
    CLEAR cookie auth_token
    RETURN { success: true }
```

### Get Current User (Profile)

```
FUNCTION GET /api/auth/profile(request):
    user ← authenticateUser(request)
    IF NOT user: RETURN 401
    RETURN { user }
```

### Request Password Reset

```
FUNCTION POST /api/auth/recover(request):         // runtime = 'nodejs'
    rateLimit check (3/min/IP)
    { email } ← request.json()

    users ← SQL.SELECT id, username, email FROM users WHERE LOWER(email) = email
    // Always return success (prevents email enumeration)
    IF users.length == 0: RETURN { success: true, message: "..." }

    resetCode ← 6-digit crypto.random value
    tokenHash ← bcrypt.hash(resetCode, 12)
    expiresAt ← now + 15 minutes

    SQL.UPDATE password_reset_tokens SET used = TRUE WHERE user_id = user.id AND used = FALSE
    SQL.INSERT INTO password_reset_tokens (user_id, token, expires_at)
        VALUES (user.id, tokenHash, expiresAt)

    RETURN { success: true, ...(dev ? { devToken: resetCode, devMode: true } : {}) }
```

### Verify Reset Code & Set New Password

```
FUNCTION PUT /api/auth/recover(request):          // runtime = 'nodejs'
    rateLimit check (5/min/IP)
    { email, token, newPassword } ← request.json()

    users ← SQL.SELECT id, username FROM users WHERE LOWER(email) = email
    IF users.length == 0: RETURN 404 "User not found"

    tokens ← SQL.SELECT * FROM password_reset_tokens
              WHERE user_id = user.id AND used = FALSE AND expires_at > NOW()
              ORDER BY created_at DESC
    IF tokens.length == 0: RETURN 400 "Invalid or expired reset code."

    FOR each stored token:
        IF bcrypt.compare(token, stored.token):
            SQL.UPDATE password_reset_tokens SET used = TRUE WHERE id = stored.id
            hashedPassword ← bcrypt.hash(newPassword, 12)
            SQL.UPDATE users SET password_hash = hashedPassword WHERE id = user.id
            RETURN { success: true, message: "Password reset successfully!" }

    RETURN 401 "Invalid reset code."
```

### Set Security Question

```
FUNCTION POST /api/auth/security(request):        // runtime = 'nodejs'
    user ← authenticateUser(request)
    IF NOT user: RETURN 401

    { securityQuestion, securityAnswer } ← request.json()
    hashedAnswer ← bcrypt.hash(securityAnswer, 12)
    SQL.UPDATE users SET security_question = question, security_answer_hash = hashedAnswer
        WHERE id = user.id
    RETURN { success: true }
```

### JWT Helper Pseudocode

```
IMPORT { SignJWT, jwtVerify } from "jose"

CONST secret ← Encode(process.env.JWT_SECRET) AS Uint8Array
// Module-eval guard: throws unless JWT_SECRET is set and ≥ 16 chars

FUNCTION encrypt(payload):
    RETURN SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(secret)

FUNCTION decrypt(input):
    TRY:
        { payload } ← jwtVerify(input, secret, { algorithms: ["HS256"] })
        RETURN payload
    CATCH error:
        RETURN null
```

---

## 7. Data Validation & Constraints

### Database-Level Constraints

| Constraint               | Entity                 | Rule                                       |
|--------------------------|------------------------|--------------------------------------------|
| Primary Key              | users                  | `id` UUID, auto-generated                  |
| Primary Key              | password_reset_tokens  | `id` SERIAL                                |
| Primary Key              | expenses               | `id` VARCHAR(255), client-generated        |
| Primary Key              | api_logs               | `id` BIGSERIAL                             |
| Unique                   | users                  | `username` unique across all users         |
| Unique (partial)         | users                  | `email` unique when non-empty              |
| Unique                   | password_reset_tokens  | `token` unique                             |
| NOT NULL                 | users                  | `username`, `password_hash` required       |
| Foreign Key              | expenses               | `user_id` REFERENCES `users(id)`           |
| Foreign Key              | password_reset_tokens  | `user_id` REFERENCES `users(id)`           |
| Cascade Delete           | expenses / reset tokens | Deleting a User deletes their children     |
| Default Value            | users                  | `is_admin` = FALSE, `created_at` = now     |

### Application-Level Constraints (Zod — `src/lib/validations.js`)

| Schema                 | Rule                                                      | Route(s)               |
|------------------------|-----------------------------------------------------------|------------------------|
| `registerSchema`       | username 3–50 chars; email valid; password ≥ 8 with upper + lower + digit | register |
| `loginSchema`          | username & password non-empty                            | login                 |
| `securityQuestionSchema` | question & answer non-empty                            | security              |
| `recoverRequestSchema` | valid email                                              | recover (POST)        |
| `recoverVerifySchema`  | valid email; token exactly 6 chars; password strength rules | recover (PUT)       |
| `createExpenseSchema`  | id non-empty; description 1–500 chars; amount positive & finite (≤ 2 decimals); date `YYYY-MM-DD`; category in whitelist | expenses (POST) |
| `updateExpenseSchema`  | same as create minus `id`                                | expenses (PATCH)      |
| `adminUserRoleSchema`  | `{ id, isAdmin }`                                        | admin/users (PATCH)   |
| `adminIdSchema`        | `{ id }`                                                 | admin/users (DELETE)  |
| `adminExpenseIdSchema` | `{ id }`                                                 | admin/expenses (DELETE) |

### Rate Limiting (in-memory sliding window — `src/utils/rateLimiter.js`)

| Endpoint               | Limit                |
|------------------------|----------------------|
| `/api/auth/register`   | 5 / minute / IP      |
| `/api/auth/login`      | 10 / minute / IP     |
| `/api/auth/recover` (POST) | 3 / minute / IP  |
| `/api/auth/recover` (PUT)  | 5 / minute / IP  |
| `/api/chat`            | per-instance sliding window |

### Edge Cases Handled

| Scenario                              | Handling Strategy                                |
|---------------------------------------|--------------------------------------------------|
| No database configured                | Auth → dev mock session; expenses → SEED_EXPENSES |
| Neon unreachable in development       | `isConnectionError()` → fall back to dev mocks   |
| Duplicate username / email            | 409 conflict with user-friendly message          |
| Missing `item` field on expense       | Falls back to `description` field                |
| Non-numeric or NaN amount             | `normalizeAmount()` returns 0                    |
| Invalid/expired JWT                   | `decrypt()` returns null → re-auth               |
| Admin revoking/deleting self          | Blocked server-side (400)                        |
| Reset token expired / already used    | 400 "Invalid or expired reset code."             |
| API log insert failure                | Swallowed by `withApiLog` (never breaks request) |
| Offline mutation                      | Queued in `offlineStore.js`, FIFO replay on reconnect |

---

## 8. Indexing Strategy

```sql
-- Index 1: Fast username lookup during login
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Index 2: Fast email lookup during register / recover
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email) WHERE email != '';

-- Index 3: Fast token lookup during password reset verification
CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);

-- Index 4: Fast "pending tokens per user" scan
CREATE INDEX IF NOT EXISTS idx_reset_tokens_user_id ON password_reset_tokens(user_id);

-- Index 5: Fast expense retrieval per user, ordered by date (most recent first)
CREATE INDEX IF NOT EXISTS idx_expenses_user_id_date ON expenses(user_id, date DESC);

-- Index 6: Admin Live Logs newest-first feed
CREATE INDEX IF NOT EXISTS idx_api_logs_id_desc ON api_logs(id DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at DESC);
```

**Rationale:**

| Index                               | Purpose                                                         |
|-------------------------------------|-----------------------------------------------------------------|
| `idx_users_username`                | O(1) lookup for unique username during login/register          |
| `idx_users_email` / `idx_users_email_unique` | Case-insensitive email lookup for register and recover  |
| `idx_reset_tokens_token`            | Lookup reset token during verification                         |
| `idx_reset_tokens_user_id`          | Scan active (unused, unexpired) tokens per user               |
| `idx_expenses_user_id_date`         | Composite index for `WHERE user_id = ? ORDER BY date DESC` — the primary expense-fetching query |
| `idx_api_logs_id_desc` / `idx_api_logs_created_at` | Newest-first pagination of the admin logs feed |

---

> **Document Version:** 2.0  
> **Last Updated:** August 2026  
> **Project:** ExpenseTracker (FinVue)
