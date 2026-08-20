# API Documentation — FinVue Expense Tracker

Base URL: `http://localhost:3000` (development) or your production domain.

All responses return JSON. Authentication is via `auth_token` httpOnly cookie (JWT, 30-day expiry).

---

## 1. Auth

**POST** To register a new user account

`/api/auth/register`

Headers:

```
content-type: application/json
```

Request URL: `http://localhost:3000/api/auth/register`

Request Body:

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "secret123"
}
```

Response Body (201 Created):

```json
{
  "success": true,
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john",
    "email": "john@example.com",
    "isAdmin": false
  },
  "isNewUser": true
}
```

---

## 2. Auth

**POST** To log in and set JWT cookie

`/api/auth/login`

Headers:

```
content-type: application/json
```

Request URL: `http://localhost:3000/api/auth/login`

Request Body:

```json
{
  "username": "john",
  "password": "secret123"
}
```

Response Body (200 OK):

```json
{
  "success": true,
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

Sets `auth_token` httpOnly cookie with 30-day expiry.

---

## 3. Auth

**POST** To log out (delete auth cookie)

`/api/auth/logout`

Headers:

```
content-type: application/json
```

Request URL: `http://localhost:3000/api/auth/logout`

Request Body: None

Response Body (200 OK):

```json
{
  "success": true
}
```

Deletes `auth_token` cookie.

---

## 4. Auth

**POST** To request a password reset code

`/api/auth/recover`

Headers:

```
content-type: application/json
```

Request URL: `http://localhost:3000/api/auth/recover`

Request Body:

```json
{
  "email": "john@example.com"
}
```

Response Body (200 OK):

```json
{
  "success": true,
  "message": "If this email is registered, you will receive a reset link.",
  "devToken": "482910",
  "devMode": true
}
```

Note: `devToken` and `devMode` fields only appear when `APP_ENV=development`.

---

## 5. Auth

**PUT** To verify reset code and set new password

`/api/auth/recover`

Headers:

```
content-type: application/json
```

Request URL: `http://localhost:3000/api/auth/recover`

Request Body:

```json
{
  "email": "john@example.com",
  "token": "482910",
  "newPassword": "newsecret123"
}
```

Response Body (200 OK):

```json
{
  "success": true,
  "message": "Password reset successfully!"
}
```

---

## 6. Auth

**POST** To set security question and answer

`/api/auth/security`

Headers:

```
content-type: application/json
cookie: auth_token=<JWT>
```

Request URL: `http://localhost:3000/api/auth/security`

Request Body:

```json
{
  "securityQuestion": "What is your pet's name?",
  "securityAnswer": "buddy"
}
```

Response Body (200 OK):

```json
{
  "success": true
}
```

Requires authenticated user via `auth_token` cookie.

---

## 7. Auth

**GET** To get current user profile

`/api/auth/profile`

Headers:

```
cookie: auth_token=<JWT>
```

Request URL: `http://localhost:3000/api/auth/profile`

Request Body: None

Response Body (200 OK):

```json
{
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john",
    "isAdmin": false
  }
}
```

Returns `{ "user": null }` if not logged in.

---

## 8. Expenses

**GET** To list all expenses for the logged-in user

`/api/expenses`

Headers:

```
cookie: auth_token=<JWT>
```

Request URL: `http://localhost:3000/api/expenses`

Request Body: None

Response Body (200 OK):

```json
[
  {
    "id": "exp-a1b2c3d4e5f6",
    "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "item": "Lunch at cafe",
    "description": "Lunch at cafe",
    "amount": 350,
    "date": "2026-08-20",
    "category": "Food",
    "created_at": "2026-08-20T10:30:00.000Z"
  }
]
```

Returns `SEED_EXPENSES` demo data when no database or auth is available.

---

## 9. Expenses

**POST** To create a new expense

`/api/expenses`

Headers:

```
content-type: application/json
cookie: auth_token=<JWT>
```

Request URL: `http://localhost:3000/api/expenses`

Request Body:

```json
{
  "id": "exp-a1b2c3d4e5f6",
  "description": "Lunch at cafe",
  "amount": 350,
  "date": "2026-08-20",
  "category": "Food"
}
```

Response Body (201 Created):

```json
{
  "id": "exp-a1b2c3d4e5f6",
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "item": "Lunch at cafe",
  "description": "Lunch at cafe",
  "amount": 350,
  "date": "2026-08-20",
  "category": "Food",
  "created_at": "2026-08-20T10:30:00.000Z"
}
```

Note: Expense ID is client-generated: `exp-<12hexchars>` from `crypto.randomUUID()`.

---

## 10. Expenses

**PUT** To update an existing expense by ID

`/api/expenses/:id`

Headers:

```
content-type: application/json
cookie: auth_token=<JWT>
```

Request URL: `http://localhost:3000/api/expenses/exp-a1b2c3d4e5f6`

Request Body:

```json
{
  "description": "Lunch at cafe",
  "amount": 400,
  "date": "2026-08-20",
  "category": "Food"
}
```

Response Body (200 OK):

```json
{
  "id": "exp-a1b2c3d4e5f6",
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "item": "Lunch at cafe",
  "description": "Lunch at cafe",
  "amount": 400,
  "date": "2026-08-20",
  "category": "Food",
  "created_at": "2026-08-20T10:30:00.000Z"
}
```

Returns 404 if expense not found or does not belong to the authenticated user.

---

## 11. Expenses

**DELETE** To delete an expense by ID

`/api/expenses/:id`

Headers:

```
cookie: auth_token=<JWT>
```

Request URL: `http://localhost:3000/api/expenses/exp-a1b2c3d4e5f6`

Request Body: None

Response Body (200 OK):

```json
{
  "success": true,
  "deleted": {
    "id": "exp-a1b2c3d4e5f6",
    "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "item": "Lunch at cafe",
    "description": "Lunch at cafe",
    "amount": 400,
    "date": "2026-08-20",
    "category": "Food",
    "created_at": "2026-08-20T10:30:00.000Z"
  }
}
```

Returns 404 if expense not found or does not belong to the authenticated user.

---

## 12. Chat

**POST** To send message to AI assistant (multi-provider fallback)

`/api/chat`

Headers:

```
content-type: application/json
```

Request URL: `http://localhost:3000/api/chat`

Request Body:

```json
{
  "message": "How much did I spend on food this month?",
  "expenses": [],
  "user": {
    "username": "john"
  }
}
```

Response Body (200 OK):

```json
{
  "response": "You spent ৳1,500 on Food this month across 8 transactions."
}
```

AI provider chain: Gemini → DeepSeek → Groq → OpenAI (automatic fallback on failure).

---

## 13. Notifications

**GET** To get user notifications and unread count

`/api/notifications`

Headers:

```
cookie: auth_token=<JWT>
```

Request URL: `http://localhost:3000/api/notifications`

Request Body: None

Response Body (200 OK):

```json
{
  "notifications": [
    {
      "id": 1,
      "period": "monthly",
      "period_key": "2026-08",
      "type": "summary",
      "title": "Monthly Summary — August 2026",
      "message": "You spent ৳15,200 this month, which is 12% less than last month.",
      "is_read": false,
      "created_at": "2026-09-01T00:00:00.000Z"
    }
  ],
  "unreadCount": 3
}
```

Notifications are cron-generated (daily at 18:00 UTC). Client polls this endpoint every 60 seconds.

---

## 14. Notifications

**POST** To mark notification(s) as read

`/api/notifications/read`

Headers:

```
content-type: application/json
cookie: auth_token=<JWT>
```

Request URL: `http://localhost:3000/api/notifications/read`

Request Body (mark single):

```json
{
  "id": 1
}
```

Request Body (mark all):

```json
{
  "all": true
}
```

Response Body (200 OK):

```json
{
  "ok": true
}
```

---

## 15. Notifications

**GET** To trigger notification generation (admin/cron)

`/api/notifications/generate`

Headers:

```
authorization: Bearer <CRON_SECRET>
```

or

```
x-cron-secret: <CRON_SECRET>
```

Request URL: `http://localhost:3000/api/notifications/generate`

Request Body: None

Response Body (200 OK):

```json
{
  "generated": 2,
  "skipped": 0,
  "users": 5,
  "periods": ["day", "week", "month", "year"]
}
```

Requires admin JWT cookie or `CRON_SECRET` header. Runs daily via Vercel Cron (`0 18 * * *`).

---

## 16. Notifications

**POST** To trigger notification generation (admin/cron)

`/api/notifications/generate`

Headers:

```
content-type: application/json
authorization: Bearer <CRON_SECRET>
```

Request URL: `http://localhost:3000/api/notifications/generate`

Request Body: None

Response Body (200 OK):

```json
{
  "generated": 2,
  "skipped": 0,
  "users": 5,
  "periods": ["day", "week", "month", "year"]
}
```

Same as GET — requires admin JWT cookie or `CRON_SECRET` header.

---

## 17. Admin Users

**GET** To list all users with expense counts

`/api/admin/users`

Headers:

```
cookie: auth_token=<JWT>
```

Request URL: `http://localhost:3000/api/admin/users`

Request Body: None

Response Body (200 OK):

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john",
    "email": "john@example.com",
    "isAdmin": false,
    "expenseCount": 12,
    "createdAt": "2026-01-15T10:00:00.000Z"
  }
]
```

Requires admin privileges (`isAdmin: true` in JWT).

---

## 18. Admin Users

**PATCH** To grant or revoke admin role

`/api/admin/users`

Headers:

```
content-type: application/json
cookie: auth_token=<JWT>
```

Request URL: `http://localhost:3000/api/admin/users`

Request Body:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "isAdmin": true
}
```

Response Body (200 OK):

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "username": "john",
  "email": "john@example.com",
  "isAdmin": true,
  "createdAt": "2026-01-15T10:00:00.000Z"
}
```

Cannot change your own admin role (returns 400).

---

## 19. Admin Users

**DELETE** To delete a user account

`/api/admin/users`

Headers:

```
content-type: application/json
cookie: auth_token=<JWT>
```

Request URL: `http://localhost:3000/api/admin/users`

Request Body:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

Response Body (200 OK):

```json
{
  "success": true
}
```

Cannot delete your own account (returns 400). Deleting a user cascades to their expenses, reset tokens, and notifications.

---

## 20. Admin Expenses

**GET** To list all expenses (admin override)

`/api/admin/expenses`

Headers:

```
cookie: auth_token=<JWT>
```

Request URL: `http://localhost:3000/api/admin/expenses?limit=500`

Query Params (optional):

- `userId` — filter by specific user ID
- `limit` — max rows to return (default 500, max 2000)

Request Body: None

Response Body (200 OK):

```json
[
  {
    "id": "exp-a1b2c3d4e5f6",
    "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john",
    "description": "Lunch at cafe",
    "amount": 350,
    "date": "2026-08-20",
    "category": "Food",
    "createdAt": "2026-08-20T10:30:00.000Z"
  }
]
```

Requires admin privileges. No user scoping — admins can see all expenses.

---

## 21. Admin Expenses

**DELETE** To delete any expense by ID

`/api/admin/expenses`

Headers:

```
content-type: application/json
cookie: auth_token=<JWT>
```

Request URL: `http://localhost:3000/api/admin/expenses`

Request Body:

```json
{
  "id": "exp-a1b2c3d4e5f6"
}
```

Response Body (200 OK):

```json
{
  "success": true
}
```

Requires admin privileges. No user scoping — admins can delete any expense.

---

## 22. Admin Logs

**GET** To list recent API request logs

`/api/admin/logs`

Headers:

```
cookie: auth_token=<JWT>
```

Request URL: `http://localhost:3000/api/admin/logs?limit=150`

Query Param (optional):

- `limit` — max rows to return (default 150, max 500)

Request Body: None

Response Body (200 OK):

```json
[
  {
    "id": 1,
    "method": "POST",
    "path": "/api/auth/login",
    "status": 200,
    "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john",
    "ip": "127.0.0.1",
    "durationMs": 42,
    "createdAt": "2026-08-20T10:30:00.000Z"
  }
]
```

Requires admin privileges. Logs are written by `withApiLog` wrapper on every API route.

---

## 23. Admin Logs

**DELETE** To clear all API logs

`/api/admin/logs`

Headers:

```
cookie: auth_token=<JWT>
```

Request URL: `http://localhost:3000/api/admin/logs`

Request Body: None

Response Body (200 OK):

```json
{
  "success": true
}
```

Requires admin privileges. Wipes the entire `api_logs` table.

---

## 24. System

**GET** To apply/migrate database schema

`/api/init-db`

Headers:

```
accept: application/json
```

Request URL: `http://localhost:3000/api/init-db`

Request Body: None

Response Body (200 OK):

```json
{
  "success": true,
  "message": "Database initialized successfully!"
}
```

No auth required. Executes all statements from `src/lib/schema.mjs` as idempotent `CREATE ... IF NOT EXISTS`.

---

## Error Response Format

All error responses follow a consistent structure:

```json
{ "error": "Human-readable error message" }
```

Common HTTP status codes:

| Status | Meaning |
|--------|---------|
| 400 | Bad request / validation error |
| 401 | Unauthorized (missing or invalid auth) |
| 403 | Forbidden (admin-only endpoint) |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate username/email) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
| 503 | Database not configured |

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `POST /api/auth/register` | 5 requests/min per IP |
| `POST /api/auth/login` | 10 requests/min per IP |
| `POST /api/auth/recover` | 3 requests/min per IP |
| `PUT /api/auth/recover` | 5 requests/min per IP |
| `POST /api/chat` | 20 requests/min per IP |

## Authentication

- **JWT Cookie:** `auth_token` (httpOnly, 30-day expiry, HS256 via `jose`)
- **Admin Check:** JWT must contain `isAdmin: true`
- **Cron Jobs:** Pass `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret` header
