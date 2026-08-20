# API Documentation — FinVue Expense Tracker

Base URL: `http://localhost:3000` (development) or your production domain.

All responses return JSON. Authentication is via `auth_token` httpOnly cookie (JWT, 30-day expiry).

---

## 1. Authentication

| No | Entity | HTTP Method | Purpose | URL | Parameters / Request Body | API Output / Response Example |
|----|--------|-------------|---------|-----|--------------------------|-------------------------------|
| 1 | Auth | POST | Register a new user account | `/api/auth/register` | **Body (JSON):** `{ "username": "john", "email": "john@example.com", "password": "secret123" }` | **201 Created** `{ "success": true, "user": { "id": "abc123", "username": "john", "email": "john@example.com", "isAdmin": false }, "isNewUser": true }` |
| 2 | Auth | POST | Log in and set JWT cookie | `/api/auth/login` | **Body (JSON):** `{ "username": "john", "password": "secret123" }` | **200 OK** `{ "success": true, "user": { "id": "abc123", "username": "john", "email": "john@example.com", "isAdmin": false } }` — sets `auth_token` cookie |
| 3 | Auth | POST | Log out (delete auth cookie) | `/api/auth/logout` | None | **200 OK** `{ "success": true }` — deletes `auth_token` cookie |
| 4 | Auth | POST | Request password reset code | `/api/auth/recover` | **Body (JSON):** `{ "email": "john@example.com" }` | **200 OK** `{ "success": true, "message": "If this email is registered, you will receive a reset link." }` — In dev mode also returns `devToken` |
| 5 | Auth | PUT | Verify reset code and set new password | `/api/auth/recover` | **Body (JSON):** `{ "email": "john@example.com", "token": "482910", "newPassword": "newsecret" }` | **200 OK** `{ "success": true, "message": "Password reset successfully!" }` |
| 6 | Auth | POST | Set security question and answer | `/api/auth/security` | **Body (JSON):** `{ "securityQuestion": "What is your pet's name?", "securityAnswer": "buddy" }` — Requires `auth_token` cookie | **200 OK** `{ "success": true }` |
| 7 | Auth | GET | Get current user profile | `/api/auth/profile` | None — Uses `auth_token` cookie | **200 OK** `{ "user": { "id": "abc123", "username": "john", "isAdmin": false } }` or `{ "user": null }` if not logged in |

---

## 2. Expenses (User)

| No | Entity | HTTP Method | Purpose | URL | Parameters / Request Body | API Output / Response Example |
|----|--------|-------------|---------|-----|--------------------------|-------------------------------|
| 8 | Expenses | GET | List all expenses for the logged-in user | `/api/expenses` | None — Requires `auth_token` cookie | **200 OK** `[{ "id": "exp-a1b2c3d4e5f6", "user_id": "abc123", "item": "Lunch", "description": "Lunch", "amount": 350, "date": "2026-08-20", "category": "Food" }]` |
| 9 | Expenses | POST | Create a new expense | `/api/expenses` | **Body (JSON):** `{ "id": "exp-a1b2c3d4e5f6", "description": "Lunch at cafe", "amount": 350, "date": "2026-08-20", "category": "Food" }` — Requires `auth_token` cookie | **201 Created** `{ "id": "exp-a1b2c3d4e5f6", "user_id": "abc123", "item": "Lunch at cafe", "description": "Lunch at cafe", "amount": 350, "date": "2026-08-20", "category": "Food", "created_at": "..." }` |
| 10 | Expenses | PUT | Update an existing expense by ID | `/api/expenses/:id` | **URL Param:** `id` — **Body (JSON):** `{ "description": "Lunch at cafe", "amount": 400, "date": "2026-08-20", "category": "Food" }` — Requires `auth_token` cookie | **200 OK** `{ "id": "exp-a1b2c3d4e5f6", "user_id": "abc123", "description": "Lunch at cafe", "amount": 400, "date": "2026-08-20", "category": "Food" }` |
| 11 | Expenses | DELETE | Delete an expense by ID | `/api/expenses/:id` | **URL Param:** `id` — Requires `auth_token` cookie | **200 OK** `{ "success": true, "deleted": { "id": "exp-a1b2c3d4e5f6", ... } }` |

---

## 3. Chat (AI Assistant)

| No | Entity | HTTP Method | Purpose | URL | Parameters / Request Body | API Output / Response Example |
|----|--------|-------------|---------|-----|--------------------------|-------------------------------|
| 12 | Chat | POST | Send message to AI assistant (multi-provider fallback) | `/api/chat` | **Body (JSON):** `{ "message": "How much did I spend on food?", "expenses": [...], "user": { "username": "john" } }` | **200 OK** `{ "response": "You spent ৳1,500 on Food this month across 8 transactions." }` |

---

## 4. Notifications

| No | Entity | HTTP Method | Purpose | URL | Parameters / Request Body | API Output / Response Example |
|----|--------|-------------|---------|-----|--------------------------|-------------------------------|
| 13 | Notifications | GET | Get user notifications + unread count | `/api/notifications` | None — Requires `auth_token` cookie | **200 OK** `{ "notifications": [{ "id": 1, "period": "monthly", "type": "summary", "title": "Monthly Summary", "message": "...", "is_read": false, "created_at": "..." }], "unreadCount": 3 }` |
| 14 | Notifications | POST | Mark notification(s) as read | `/api/notifications/read` | **Body (JSON):** `{ "id": 1 }` or `{ "all": true }` — Requires `auth_token` cookie | **200 OK** `{ "ok": true }` |
| 15 | Notifications | GET | Generate notifications (admin/cron) | `/api/notifications/generate` | Requires admin cookie or `Authorization: Bearer <CRON_SECRET>` header | **200 OK** `{ "generated": 2, "skipped": 0 }` |
| 16 | Notifications | POST | Generate notifications (admin/cron) | `/api/notifications/generate` | Requires admin cookie or `Authorization: Bearer <CRON_SECRET>` header | **200 OK** `{ "generated": 2, "skipped": 0 }` |

---

## 5. Admin — Users

| No | Entity | HTTP Method | Purpose | URL | Parameters / Request Body | API Output / Response Example |
|----|--------|-------------|---------|-----|--------------------------|-------------------------------|
| 17 | Admin Users | GET | List all users with expense counts | `/api/admin/users` | None — Requires admin `auth_token` cookie | **200 OK** `[{ "id": "abc123", "username": "john", "email": "john@example.com", "isAdmin": false, "expenseCount": 12, "createdAt": "2026-01-15T..." }]` |
| 18 | Admin Users | PATCH | Grant or revoke admin role | `/api/admin/users` | **Body (JSON):** `{ "id": "abc123", "isAdmin": true }` — Requires admin cookie — Cannot change own role | **200 OK** `{ "id": "abc123", "username": "john", "email": "john@example.com", "isAdmin": true, "createdAt": "..." }` |
| 19 | Admin Users | DELETE | Delete a user account | `/api/admin/users` | **Body (JSON):** `{ "id": "abc123" }` — Requires admin cookie — Cannot delete self | **200 OK** `{ "success": true }` |

---

## 6. Admin — Expenses

| No | Entity | HTTP Method | Purpose | URL | Parameters / Request Body | API Output / Response Example |
|----|--------|-------------|---------|-----|--------------------------|-------------------------------|
| 20 | Admin Expenses | GET | List all expenses (admin override) | `/api/admin/expenses` | **Query Params (optional):** `?userId=abc123` (filter by user), `?limit=500` (max 2000) — Requires admin cookie | **200 OK** `[{ "id": "exp-...", "userId": "abc123", "username": "john", "description": "Lunch", "amount": 350, "date": "2026-08-20", "category": "Food", "createdAt": "..." }]` |
| 21 | Admin Expenses | DELETE | Delete any expense by ID | `/api/admin/expenses` | **Body (JSON):** `{ "id": "exp-a1b2c3d4e5f6" }` — Requires admin cookie — No user scoping | **200 OK** `{ "success": true }` |

---

## 7. Admin — Logs

| No | Entity | HTTP Method | Purpose | URL | Parameters / Request Body | API Output / Response Example |
|----|--------|-------------|---------|-----|--------------------------|-------------------------------|
| 22 | Admin Logs | GET | List recent API request logs | `/api/admin/logs` | **Query Param (optional):** `?limit=150` (max 500) — Requires admin cookie | **200 OK** `[{ "id": 1, "method": "POST", "path": "/api/auth/login", "status": 200, "userId": "abc123", "username": "john", "ip": "127.0.0.1", "durationMs": 42, "createdAt": "..." }]` |
| 23 | Admin Logs | DELETE | Clear all API logs | `/api/admin/logs` | None — Requires admin cookie | **200 OK** `{ "success": true }` |

---

## 8. System

| No | Entity | HTTP Method | Purpose | URL | Parameters / Request Body | API Output / Response Example |
|----|--------|-------------|---------|-----|--------------------------|-------------------------------|
| 24 | System | GET | Apply/migrate database schema | `/api/init-db` | None — No auth required | **200 OK** `{ "success": true, "message": "Database initialized successfully!" }` |

---

## Error Response Format

All error responses follow a consistent structure:

```json
{ "error": "Human-readable error message" }
```

Common HTTP status codes:
- **400** — Bad request / validation error
- **401** — Unauthorized (missing or invalid auth)
- **403** — Forbidden (admin-only endpoint)
- **404** — Resource not found
- **409** — Conflict (e.g. duplicate username/email)
- **429** — Rate limit exceeded
- **500** — Internal server error
- **503** — Database not configured

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `POST /api/auth/login` | 10 requests/min per IP |
| `POST /api/auth/register` | 5 requests/min per IP |
| `POST /api/auth/recover` | 3 requests/min per IP |
| `PUT /api/auth/recover` | 5 requests/min per IP |
| `POST /api/chat` | 20 requests/min per IP |

## Authentication

- **JWT Cookie:** `auth_token` (httpOnly, 30-day expiry, HS256 via `jose`)
- **Admin Check:** JWT must contain `isAdmin: true`
- **Cron Jobs:** Pass `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret` header
