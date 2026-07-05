# ExpenseTracker — Entity-Relationship & Data Flow Document

> **Project:** FinVue Expense Tracker  
> **Stack:** Next.js (App Router) + Neon (PostgreSQL) + JWT Auth  
> **Runtime:** Edge (Vercel)

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

### Entity 1: `User`

| Attribute       | Type                    | Constraints                    |
|-----------------|-------------------------|--------------------------------|
| `id`            | UUID                    | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `username`      | VARCHAR(255)            | UNIQUE, NOT NULL               |
| `password_hash` | VARCHAR(255)            | NOT NULL                       |
| `created_at`    | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP      |

**Description:** Represents an authenticated user of the ExpenseTracker application. Each user has a unique username and a bcrypt-hashed password. All expense data is scoped to a specific user.

### Entity 2: `Expense`

| Attribute     | Type          | Constraints                              |
|---------------|---------------|------------------------------------------|
| `id`          | VARCHAR(255)  | PRIMARY KEY                              |
| `user_id`     | UUID          | FOREIGN KEY → users(id) ON DELETE CASCADE |
| `item`        | VARCHAR(255)  | NULLABLE (falls back to `description`)   |
| `description` | TEXT          | NULLABLE                                 |
| `amount`      | NUMERIC       | NULLABLE (later cast to DOUBLE PRECISION)|
| `date`        | DATE          | NULLABLE                                 |
| `category`    | VARCHAR(255)  | NULLABLE                                 |
| `created_at`  | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP     |

**Description:** Represents a single financial transaction. Tracks the item name, description, monetary amount (in BDT/৳), date of expense, and spending category. Each expense is owned by exactly one user.

### Relationship Summary

```
User (1) ────────< (N) Expense
       one-to-many
```

- A **User** can have **zero or many** Expenses.
- An **Expense** belongs to **exactly one** User.
- Deleting a User **cascades** to delete all their Expenses.

### Category Enum (Application-Level)

```
CATEGORIES = [
    "Food", "Transport", "Utilities", "Entertainment",
    "Healthcare", "Shopping", "Education", "Others"
]
```

This is defined as a JavaScript constant in `src/data/expenseData.js`, not as a database-level ENUM. The application validates against this list at the UI layer.

---

## 2. Entity-Relationship Step-by-Step Algorithm

The following numbered steps describe how the ExpenseTracker system processes entities from the moment a user interacts with the application.

### Phase 1: Authentication & User Entity Resolution

```
Step 1  — User opens the application.
Step 2  — System checks for an existing auth_token cookie.
Step 3a — IF cookie exists:
             3a.1. Decrypt the JWT using jose (HS256 algorithm).
             3a.2. Extract { id, username } from the payload.
             3a.3. Set currentUser = decrypted payload.
Step 3b — IF cookie does NOT exist AND environment is development:
             3b.1. Set currentUser = { id: "dev-user-id", username: "dev-user" }.
Step 3c — IF cookie does NOT exist AND environment is production:
             3c.1. Show AuthModal to the user.
             3c.2. Prompt for { username, password }.
Step 4  — User submits login form with { username, password }.
Step 5  — System queries the users table:
             SELECT * FROM users WHERE username = submitted_username.
Step 6a — IF user record EXISTS:
             6a.1. Compare submitted password with stored password_hash
                   using bcrypt.compare().
             6a.2. IF password matches → login successful.
             6a.3. IF password does NOT match → return "Invalid credentials".
             (Note: In development mode, password comparison is skipped.)
Step 6b — IF user record DOES NOT EXIST (auto-registration):
             6b.1. Hash the password with bcrypt.hash(password, 10).
             6b.2. INSERT INTO users (username, password_hash)
                   VALUES (submitted_username, hashed_password).
             6b.3. RETURN the newly created user record.
Step 7  — Create JWT token:
             token = encrypt({ id: user.id, username: user.username })
             with expiration: 30 days.
Step 8  — Set httpOnly cookie: auth_token = token,
             secure in production, path = "/", maxAge = 30 days.
Step 9  — Return { success: true, user } to the client.
Step 10 — Client stores user in React state (useState via useExpenseClipper hook).
```

### Phase 2: Expense Entity Loading

```
Step 11 — After authentication, system triggers fetchExpenses().
Step 12 — GET /api/expenses with auth_token cookie.
Step 13a — IF no database connection (DATABASE_URL not set):
              13a.1. Return SEED_EXPENSES array (12 mock records).
Step 13b — IF database connection exists:
              13b.1. Query: SELECT * FROM expenses
                     WHERE user_id = currentUser.id
                     ORDER BY date DESC.
              13b.2. For each expense, normalize amount:
                     normalizeAmount(expense.amount).
Step 14 — Client receives expense array.
Step 15 — For each expense record, normalize:
             normalizeExpenseRecord(expense) → {
                 ...expense,
                 item: expense.item ?? expense.description ?? "",
                 amount: normalizeExpenseAmount(expense.amount)
             }
Step 16 — Client stores normalized expenses in React state.
```

### Phase 3: Expense CRUD Operations

#### Create Expense

```
Step 17 — User fills QuickAdd form or ChatBot triggers addExpenseDirect().
Step 18 — Build expense object:
             {
                 id: `exp-${Date.now()}-${randomString}`,
                 description: user_input,
                 amount: parseFloat(user_input),
                 date: selected_date || today,
                 category: selected_category || "Other"
             }
Step 19 — POST /api/expenses with expense object as JSON body.
Step 20 — Server-side:
             20.1. Extract and decrypt auth_token → get user_id.
             20.2. INSERT INTO expenses (id, user_id, item, description,
                   amount, date, category)
                   VALUES (id, user.id, description, description,
                   amount, date, category) RETURNING *.
             20.3. Normalize amount in returned record.
             20.4. Return 201 with the saved expense.
Step 21 — Client prepends the new expense to the expenses array.
Step 22 — Toast notification: "Expense added successfully!"
```

#### Read (List) Expenses

```
Step 23 — GET /api/expenses (already covered in Phase 2).
Step 24 — Client-side filtering & sorting (no additional server calls):
             24a. Filter by search query (matches item/description).
             24b. Filter by category (exact match).
             24c. Filter by date range (today/week/month/custom/specific).
             24d. Sort by date (asc/desc) or amount (asc/desc).
Step 25 — Client-side pagination:
             25a. Slice filtered array: (currentPage - 1) * itemsPerPage
                  to currentPage * itemsPerPage.
             25b. itemsPerPage = 8.
```

#### Update Expense

```
Step 26 — User clicks edit on an expense row → setEditingExpense(expense).
Step 27 — EditExpenseModal renders with pre-filled { date, category, description, amount }.
Step 28 — User modifies fields and submits.
Step 29 — PUT /api/expenses/:id with updated fields as JSON body.
Step 30 — Server-side:
             30.1. Extract and decrypt auth_token → get user_id.
             30.2. Validate that expense belongs to user:
                   WHERE id = expense_id AND user_id = user.id.
             30.3. UPDATE expenses SET description = ..., amount = ...,
                   date = ..., category = ...
                   WHERE id = expense_id AND user_id = user.id
                   RETURNING *.
             30.4. If no rows returned → 404 Not Found.
             30.5. Normalize amount, return updated expense.
Step 31 — Client maps over expenses array, replacing the old record.
Step 32 — Toast notification: "Expense updated successfully!"
```

#### Delete Expense

```
Step 33 — User clicks delete → setDeletingExpense(expense).
Step 34 — DeleteExpenseModal shows confirmation dialog.
Step 35 — User confirms → DELETE /api/expenses/:id.
Step 36 — Server-side:
             36.1. Extract and decrypt auth_token → get user_id.
             36.2. DELETE FROM expenses
                   WHERE id = expense_id AND user_id = user.id
                   RETURNING *.
             36.3. If no rows returned → 404 Not Found.
             36.4. Return { success: true, deleted: record }.
Step 37 — Client filters out the deleted expense from the array.
Step 38 — Toast notification: "Expense deleted successfully!"
```

### Phase 4: Statistics Computation (Derived Entities)

```
Step 39 — Client recomputes statistics whenever filteredExpenses changes.
Step 40 — calculateSummaryCards(filteredExpenses):
             40a. Initialize { total, today, week, month } = 0.
             40b. For each expense:
                  - total += expense.amount
                  - IF isToday(expense.date) → today += amount
                  - IF isThisWeek(expense.date) → week += amount
                  - IF isThisMonth(expense.date) → month += amount
             40c. Return { total, today, week, month }.
Step 41 — calculateCategoryBreakdown(filteredExpenses):
             41a. Initialize totals = {} and grandTotal = 0.
             41b. For each expense:
                  - totals[category] += amount
                  - grandTotal += amount
             41c. Map entries to [{ category, amount, percentage }].
             41d. Sort by amount descending.
Step 42 — calculateDailySpendingTrend(filteredExpenses):
             42a. Generate last 7 days' date strings.
             42b. For each date, sum all expense amounts.
             42c. Calculate height percentage relative to max.
             42d. Return [{ date, label, amount, heightPct }].
Step 43 — calculateQuickStats(filteredExpenses):
             43a. Group expenses by date → sum amounts per date.
             43b. Find date with highest total and lowest total.
             43c. Count category occurrences → find most used category.
             43d. Calculate average daily spend = total / distinct_dates.
```

### Phase 5: ChatBot Expense Actions

```
Step 44 — User sends a natural language message via ChatBot.
Step 45 — POST /api/chat with { message }.
Step 46 — Server processes message with AI and returns structured action:
             { action: "add" | "edit" | "delete" | "query", ...data }
Step 47a — IF action is "add":
              47a.1. Client calls addExpenseDirect() → follows Phase 3 Create.
Step 47b — IF action is "edit":
              47b.1. Client identifies expense by description/amount match.
              47b.2. Client calls updateExpenseDirect() → follows Phase 3 Update.
Step 47c — IF action is "delete":
              47c.1. Client identifies expense by description/amount match.
              47c.2. Client calls deleteExpenseDirect() → follows Phase 3 Delete.
Step 47d — IF action is "query":
              47d.1. Client computes statistics from in-memory expenses.
              47d.2. Client returns a text summary to the user.
```

---

## 3. Database Schema Pseudocode

```sql
-- =====================================================
-- DATABASE SCHEMA — ExpenseTracker (PostgreSQL / Neon)
-- =====================================================

-- Enable UUID generation extension
EXTENSION "uuid-ossp"

-- ====================
-- TABLE: users
-- ====================
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username      VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

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

CREATE INDEX IF NOT EXISTS idx_expenses_user_id_date
    ON expenses(user_id, date DESC);
```

---

## 4. CRUD Operation Pseudocode

### Create Expense (Server — Edge Runtime)

```
FUNCTION POST /api/expenses(request):
    token ← request.cookies["auth_token"]
    user ← null

    IF token exists:
        user ← decrypt(token)           // JWT decode via jose
    ELSE IF development environment:
        user ← { id: "dev-user-id", username: "dev-user" }

    IF user is null:
        RETURN 401 { error: "Unauthorized" }

    IF database is not configured:
        RETURN 503 { error: "Database not configured" }

    data ← request.json()               // { id, description, amount, date, category }

    result ← SQL.INSERT INTO expenses (id, user_id, item, description, amount, date, category)
                   VALUES (data.id, user.id, data.description, data.description,
                           data.amount, data.date, data.category)
                   RETURNING *

    RETURN 201 { ...result[0], amount: normalizeAmount(result[0].amount) }
```

### Read Expenses (Server — Edge Runtime)

```
FUNCTION GET /api/expenses(request):
    token ← request.cookies["auth_token"]
    user ← null

    IF token exists:
        user ← decrypt(token)
    ELSE IF development environment:
        user ← { id: "dev-user-id", username: "dev-user" }

    IF no database OR no user:
        RETURN 200 SEED_EXPENSES

    expenses ← SQL.SELECT * FROM expenses
                WHERE user_id = user.id
                ORDER BY date DESC

    RETURN 200 expenses.map(e → { ...e, amount: normalizeAmount(e.amount) })
```

### Update Expense (Server — Edge Runtime)

```
FUNCTION PUT /api/expenses/[id](request, { params }):
    token ← request.cookies["auth_token"]
    user ← null

    IF token exists:
        user ← decrypt(token)
    ELSE IF development environment:
        user ← { id: "dev-user-id", username: "dev-user" }

    IF user is null:
        RETURN 401 { error: "Unauthorized" }

    data ← request.json()               // { description, amount, date, category }

    result ← SQL.UPDATE expenses
                SET description = data.description,
                    amount = data.amount,
                    date = data.date,
                    category = data.category
                WHERE id = params.id AND user_id = user.id
                RETURNING *

    IF result.length == 0:
        RETURN 404 { error: "Expense not found" }

    RETURN 200 { ...result[0], amount: normalizeAmount(result[0].amount) }
```

### Delete Expense (Server — Edge Runtime)

```
FUNCTION DELETE /api/expenses/[id](request, { params }):
    token ← request.cookies["auth_token"]
    user ← null

    IF token exists:
        user ← decrypt(token)
    ELSE IF development environment:
        user ← { id: "dev-user-id", username: "dev-user" }

    IF user is null:
        RETURN 401 { error: "Unauthorized" }

    result ← SQL.DELETE FROM expenses
                WHERE id = params.id AND user_id = user.id
                RETURNING *

    IF result.length == 0:
        RETURN 404 { error: "Expense not found" }

    RETURN 200 { success: true, deleted: result[0] }
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

### Expense Record Normalization

```
FUNCTION normalizeExpenseRecord(expense):
    RETURN {
        ...expense,
        item: expense.item ?? expense.description ?? "",
        amount: normalizeExpenseAmount(expense.amount)
    }
```

### Filter & Sort Engine

```
FUNCTION filterAndSortExpenses({
    expenses,
    searchQuery,
    categoryFilter,
    activeDateFilter,
    appliedCustomRange,
    specificDate,
    sortBy,
    sortOrder
}):
    result ← expenses.map(normalizeExpenseRecord)

    // --- Search filter ---
    IF searchQuery.trim() != "":
        query ← searchQuery.toLowerCase()
        result ← result.filter(exp →
            exp.description.toLowerCase().includes(query) OR
            exp.item.toLowerCase().includes(query)
        )

    // --- Category filter ---
    IF categoryFilter != "All":
        result ← result.filter(exp → exp.category == categoryFilter)

    // --- Date filter ---
    SWITCH activeDateFilter:
        CASE "today":    result ← result.filter(isToday)
        CASE "week":     result ← result.filter(isThisWeek)
        CASE "month":    result ← result.filter(isThisMonth)
        CASE "specific": result ← result.filter(exp → exp.date == specificDate)
        CASE "custom":   result ← result.filter(exp →
                             exp.date >= appliedCustomRange.start AND
                             exp.date <= appliedCustomRange.end
                         )

    // --- Sort ---
    IF sortBy == "date":
        result.sort((a, b) →
            sortOrder == "desc"
                ? new Date(b.date) - new Date(a.date)
                : new Date(a.date) - new Date(b.date)
        )
    ELSE IF sortBy == "amount":
        result.sort((a, b) →
            sortOrder == "desc" ? b.amount - a.amount : a.amount - b.amount
        )

    RETURN result
```

### Summary Cards Calculation

```
FUNCTION calculateSummaryCards(expenses):
    total ← 0
    today ← 0
    week ← 0
    month ← 0

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

    totals ← {}           // Map<category_name, sum_amount>
    grandTotal ← 0

    FOR EACH expense IN expenses:
        amount ← normalizeExpenseAmount(expense.amount)
        totals[expense.category] += amount
        grandTotal += amount

    breakdown ← MAP entries of totals TO {
        category: key,
        amount: value,
        percentage: ROUND((value / grandTotal) * 100)
    }

    RETURN breakdown SORTED BY amount DESCENDING
```

### Daily Spending Trend Calculation

```
FUNCTION calculateDailySpendingTrend(expenses):
    trendDays ← []        // Array of 7 date strings (today - 6 to today)
    dateValues ← {}       // Map<date_string, total_amount>

    FOR i = 6 DOWN TO 0:
        dateStr ← getRelativeInputDate(-i)
        trendDays.push(dateStr)
        dateValues[dateStr] ← 0

    FOR EACH expense IN expenses:
        IF expense.date IN dateValues:
            dateValues[expense.date] += normalizeExpenseAmount(expense.amount)

    maxSpent ← MAX(1, MAX(dateValues.values))

    RETURN trendDays.map(date → {
        date,
        label: formatShortDate(date),
        amount: dateValues[date],
        heightPct: ROUND((dateValues[date] / maxSpent) * 100)
    })
```

### Quick Stats Calculation

```
FUNCTION calculateQuickStats(expenses):
    IF expenses.length == 0:
        RETURN { highest: { date: "N/A", amount: 0 },
                 lowest:  { date: "N/A", amount: 0 },
                 mostUsedCategory: "N/A",
                 avgDaily: 0 }

    dateGroups ← {}        // Map<date_string, total_amount>
    categoryCounts ← {}    // Map<category_name, count>

    FOR EACH expense IN expenses:
        amount ← normalizeExpenseAmount(expense.amount)
        dateGroups[expense.date] += amount
        categoryCounts[expense.category] += 1

    // Find highest/lowest spending days
    highest ← { date: null, amount: -Infinity }
    lowest  ← { date: null, amount: Infinity }

    FOR EACH (date, amount) IN dateGroups:
        IF amount > highest.amount: highest ← { date, amount }
        IF amount < lowest.amount:  lowest  ← { date, amount }

    // Find most frequent category
    mostUsedCategory ← category entry with highest count

    // Calculate daily average
    totalAmount ← SUM of all expense amounts
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

### Login / Auto-Register

```
FUNCTION POST /api/auth/login(request):
    { username, password } ← request.json()

    IF !username OR !password:
        RETURN 400 { error: "Username and password are required" }

    user ← null

    IF database is configured:
        users ← SQL.SELECT * FROM users WHERE username = username

        IF users.length == 0:
            // Auto-register new user
            hashedPassword ← bcrypt.hash(password, 10)
            inserted ← SQL.INSERT INTO users (username, password_hash)
                            VALUES (username, hashedPassword)
                            RETURNING *
            user ← inserted[0]
        ELSE:
            user ← users[0]
            IF NOT development environment:
                valid ← bcrypt.compare(password, user.password_hash)
                IF NOT valid:
                    RETURN 401 { error: "Invalid username or password" }
    ELSE:
        // Development mock
        user ← { id: "mock-user-id", username }

    // Generate JWT
    token ← encrypt({ id: user.id, username: user.username })
    // HS256, 30-day expiration

    response ← { success: true, user }
    SET cookie: auth_token = token
        httpOnly: true
        secure: production only
        maxAge: 30 days
        path: "/"

    RETURN response
```

### Logout

```
FUNCTION POST /api/auth/logout():
    response ← { success: true }
    CLEAR cookie: auth_token
    RETURN response
```

### Get Current User

```
FUNCTION GET /api/auth/me(request):
    token ← request.cookies["auth_token"]
    IF NOT token:
        RETURN 401 { error: "Not authenticated" }

    payload ← decrypt(token)
    IF NOT payload:
        RETURN 401 { error: "Invalid token" }

    RETURN { user: { id: payload.id, username: payload.username } }
```

### JWT Helper Pseudocode

```
IMPORT { SignJWT, jwtVerify } from "jose"

CONST secret ← Encode(process.env.JWT_SECRET) AS Uint8Array

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

| Constraint               | Entity      | Rule                                       |
|--------------------------|-------------|--------------------------------------------|
| Primary Key              | User        | `id` UUID, auto-generated                  |
| Primary Key              | Expense     | `id` VARCHAR(255), client-generated        |
| Unique                   | User        | `username` must be unique across all users |
| NOT NULL                 | User        | `username`, `password_hash` required       |
| Foreign Key              | Expense     | `user_id` REFERENCES `users(id)`           |
| Cascade Delete           | Expense     | Deleting a User deletes all their Expenses |
| Default Value            | User        | `created_at` defaults to CURRENT_TIMESTAMP |
| Default Value            | Expense     | `created_at` defaults to CURRENT_TIMESTAMP |

### Application-Level Constraints

| Validation           | Rule                                              | Location                  |
|----------------------|---------------------------------------------------|---------------------------|
| Amount > 0           | `min="0.01"` on input, parsed via `parseFloat()`  | Frontend + Backend        |
| Required fields      | Description and Amount must be non-empty           | `handleAddExpense()`      |
| Category whitelist   | Must be one of 8 predefined categories             | LedgerFilters, Modals     |
| Date format          | `YYYY-MM-DD` string                                | Throughout                |
| Auth required        | All expense APIs check for valid user              | API middleware            |
| Password length      | Implicit (no min length enforced)                  | AuthModal                 |

### Edge Cases Handled

| Scenario                              | Handling Strategy                                |
|---------------------------------------|--------------------------------------------------|
| No database configured                | Fallback to SEED_EXPENSES mock data               |
| Development without auth              | Dev user ID override, password check skipped      |
| Missing `item` field on expense       | Falls back to `description` field                 |
| Non-numeric or NaN amount             | `normalizeAmount()` returns 0                     |
| SQL `ALTER TABLE` for `user_id`       | Wrapped in try-catch (column might already exist) |
| Empty expense list                    | Returns empty array, UI shows "No records" state  |
| Invalid/expired JWT                   | `decrypt()` returns null → triggers re-auth       |
| Custom date range start > end         | Client-side validation with toast error           |

---

## 8. Indexing Strategy

```sql
-- Index 1: Fast username lookup during login
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Index 2: Fast expense retrieval per user, ordered by date (most recent first)
CREATE INDEX IF NOT EXISTS idx_expenses_user_id_date
    ON expenses(user_id, date DESC);
```

**Rationale:**

| Index                           | Purpose                                                         |
|----------------------------------|-----------------------------------------------------------------|
| `idx_users_username`            | O(1) lookup for unique username during login/auto-register     |
| `idx_expenses_user_id_date`     | Composite index supporting `WHERE user_id = ? ORDER BY date DESC` — the primary query pattern for fetching all expenses for a user sorted by date |

---

> **Document Version:** 1.0  
> **Last Updated:** July 2026  
> **Project:** ExpenseTracker (FinVue)
