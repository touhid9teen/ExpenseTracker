# 📁 FinVue — Project Structure

> **Tech Stack:** Next.js 16 (App Router) · React 18 · Tailwind CSS · PostgreSQL (Neon) · JWT Auth · Gemini AI

```
ExpenseTracker/
│
├── 📄 next.config.mjs              # Next.js configuration
├── 📄 tailwind.config.js            # Tailwind CSS theme & plugins config
├── 📄 postcss.config.cjs            # PostCSS configuration
├── 📄 eslint.config.js              # ESLint configuration
├── 📄 jsconfig.json                 # JS/Path alias configuration
├── 📄 package.json                  # Dependencies & scripts
├── 📄 yarn.lock                     # Yarn lockfile
├── 📄 .gitignore                    # Git ignore rules
├── 📄 README.md                     # Project overview & setup guide
├── 📄 ENTITY_RELATIONSHIP.md        # Database entity relationship docs
├── 📄 initDB.js                     # Database initialization script (JS)
│
├── 📂 scripts/                      # Utility scripts
│   └── 📄 init-db.mjs               # DB init script (ESM)
│
├── 📂 src/                          # Main application source
│   │
│   ├── 📂 app/                      # Next.js App Router (pages & APIs)
│   │   ├── 📄 layout.js             # Root layout (HTML shell, fonts, providers)
│   │   ├── 📄 page.js               # Home page (main app entry)
│   │   ├── 📄 loading.js            # Root loading skeleton (Suspense fallback)
│   │   ├── 📄 globals.css           # Global styles & Tailwind directives
│   │   │
│   │   ├── 📂 terms/                # Terms & Conditions page
│   │   │   └── 📄 page.js
│   │   │
│   │   └── 📂 api/                  # Next.js API route handlers
│   │       ├── 📂 auth/
│   │       │   ├── 📂 login/        # POST — authenticate user
│   │       │   │   └── 📄 route.js
│   │       │   ├── 📂 logout/       # POST — clear auth session
│   │       │   │   └── 📄 route.js
│   │       │   └── 📂 me/           # GET — fetch current user info
│   │       │       └── 📄 route.js
│   │       ├── 📂 expenses/
│   │       │   ├── 📄 route.js      # GET (list) / POST (create) expenses
│   │       │   └── 📂 [id]/
│   │       │       └── 📄 route.js  # PATCH / DELETE a single expense
│   │       ├── 📂 chat/
│   │       │   └── 📄 route.js      # POST — AI-powered chat endpoint
│   │       └── 📂 init-db/
│   │           └── 📄 route.js      # POST — initialize database tables
│   │
│   ├── 📂 Components/               # Reusable UI components
│   │   ├── 📄 AppHeader.jsx         # Top navigation bar
│   │   ├── 📄 MobileBottomNav.jsx   # Bottom navigation (mobile)
│   │   ├── 📄 Button.jsx            # Reusable button component
│   │   ├── 📄 InputField.jsx        # Reusable input field
│   │   ├── 📄 Icons.jsx             # SVG icon set
│   │   ├── 📄 AuthModal.jsx         # Login / Register modal
│   │   ├── 📄 LedgerView.jsx        # Expense ledger (table view)
│   │   ├── 📄 StatisticsView.jsx    # Statistics & charts view
│   │   ├── 📄 AboutView.jsx         # About / info view
│   │   ├── 📄 ExpenseClipper.jsx    # Expense clipper trigger
│   │   ├── 📄 ExpenseClipperScreen.jsx  # Expense clipper screen overlay
│   │   ├── 📄 ExpenseModals.jsx     # Expense modal manager
│   │   ├── 📄 ToastProvider.jsx     # Toast notification provider
│   │   ├── 📄 LedgerSkeleton.jsx    # Skeleton loader for ledger
│   │   ├── 📄 StatisticsSkeleton.jsx # Skeleton loader for statistics
│   │   ├── 📄 Skeleton.jsx          # Generic skeleton primitive
│   │   │
│   │   ├── 📂 LedgerView/           # Sub-components for ledger view
│   │   │   ├── 📄 ExpenseTable.jsx       # Expense rows table
│   │   │   ├── 📄 LedgerRow.jsx          # Single expense row
│   │   │   ├── 📄 LedgerFilters.jsx      # Filter bar (search, category, date)
│   │   │   ├── 📄 LedgerHeaderActions.jsx # Header action buttons
│   │   │   ├── 📄 QuickAddExpenseForm.jsx # Inline quick-add form
│   │   │   └── 📄 PaginationBar.jsx      # Pagination controls
│   │   │
│   │   ├── 📂 StatisticsView/       # Sub-components for statistics view
│   │   │   ├── 📄 StatisticsHeader.jsx   # Stats header / date range picker
│   │   │   ├── 📄 SummaryCardsGrid.jsx   # Summary statistic cards
│   │   │   ├── 📄 QuickStatsGrid.jsx     # Quick mini-stat cards
│   │   │   ├── 📄 CategoryBreakdown.jsx  # Category breakdown chart
│   │   │   └── 📄 DailyTrendChart.jsx    # Daily spending trend chart
│   │   │
│   │   ├── 📂 ExpenseModals/        # Expense CRUD modals
│   │   │   ├── 📄 DailyExpenseModal.jsx  # Add daily expense modal
│   │   │   ├── 📄 EditExpenseModal.jsx   # Edit expense modal
│   │   │   └── 📄 DeleteExpenseModal.jsx # Confirm delete modal
│   │   │
│   │   └── 📂 ChatBot/              # AI Chat assistant
│   │       ├── 📄 index.jsx              # ChatBot main component
│   │       ├── 📄 FloatingTrigger.jsx    # Floating chat trigger button
│   │       ├── 📄 ChatBotHeader.jsx      # Chat header with branding
│   │       ├── 📄 ChatInput.jsx          # Message input field
│   │       ├── 📄 ChatMessage.jsx        # Individual message bubble
│   │       ├── 📄 ChatMessageList.jsx    # Scrollable message list
│   │       ├── 📄 QuickActionsPopover.jsx # Quick action suggestions popover
│   │       └── 📄 suggestions.js         # Predefined suggestion data
│   │
│   ├── 📂 hooks/                    # Custom React hooks
│   │   └── 📄 useExpenseClipper.js  # Expense clipper screen state & logic
│   │
│   ├── 📂 data/                     # Static / mock data
│   │   └── 📄 expenseData.js        # Sample expense data
│   │
│   ├── 📂 lib/                      # Core library modules
│   │   ├── 📄 db.js                 # Neon PostgreSQL connection pool
│   │   ├── 📄 schema.sql            # SQL schema (users + expenses tables)
│   │   └── 📄 jwt.js                # JWT sign / verify utilities
│   │
│   └── 📂 utils/                    # Utility functions
│       ├── 📄 dateUtils.js          # Date formatting & helpers
│       ├── 📄 expenseCalculations.js # Expense aggregation & math
│       ├── 📄 categoryStyles.js     # Category color & style map
│       └── 📄 storageUtils.js       # localStorage helpers
│
└── 📂 .vite/                        # Vite cache (auto-generated)
    └── 📂 deps/
        ├── 📄 _metadata.json
        ├── 📄 package.json
        ├── 📄 react.js
        ├── 📄 react-dom_client.js
        └── 📄 chunk-GFWMZNU4.js
```

---

## 📌 Key Architecture Notes

| Layer | Location | Description |
|-------|----------|-------------|
| **Pages** | `src/app/` | Next.js App Router pages — home, terms, loading |
| **API** | `src/app/api/` | RESTful route handlers — auth, expenses, chat, init-db |
| **Components** | `src/Components/` | All React UI components, organized by feature |
| **Hooks** | `src/hooks/` | Custom React hooks for shared stateful logic |
| **Lib** | `src/lib/` | Database client, schema SQL, JWT utilities |
| **Utils** | `src/utils/` | Pure helper functions for dates, calculations, styles, storage |

### 🔐 Authentication Flow
- **Login** → `POST /api/auth/login` → validates credentials → sets JWT cookie
- **Logout** → `POST /api/auth/logout` → clears JWT cookie
- **Me** → `GET /api/auth/me` → verifies JWT → returns user data

### 💰 Expense CRUD
- **List** → `GET /api/expenses` (supports filtering, search, pagination)
- **Create** → `POST /api/expenses`
- **Update** → `PATCH /api/expenses/[id]`
- **Delete** → `DELETE /api/expenses/[id]`

### 🤖 AI Chat
- **Endpoint** → `POST /api/chat` → powered by Google Gemini AI
- **UI** → `src/Components/ChatBot/` — full-featured chatbot UI with quick actions
