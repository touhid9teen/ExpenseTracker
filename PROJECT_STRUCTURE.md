# 📁 FinVue — Project Structure

> **Tech Stack:** Next.js 16 (App Router) · React 18 · Tailwind CSS · PostgreSQL (Neon) · JWT Auth · Gemini AI

```
ExpenseTracker/
│
├── 📄 next.config.mjs              # Next.js configuration
├── 📄 tailwind.config.js            # Tailwind CSS theme & plugins config
├── 📄 postcss.config.cjs            # PostCSS configuration
├── 📄 eslint.config.js              # ESLint configuration (flat config)
├── 📄 jsconfig.json                 # JS/Path alias configuration
├── 📄 package.json                  # Dependencies & scripts
├── 📄 package-lock.json             # Lockfile (npm)
├── 📄 Dockerfile                    # Multi-stage production build
├── 📄 docker-compose.yml            # App + db-init services
├── 📄 .dockerignore                 # Files excluded from Docker context
├── 📄 .gitignore                    # Git ignore rules
├── 📄 .env.local                    # Local env vars (never committed)
├── 📄 .env                          # Docker Compose env vars
├── 📄 initDB.js                     # Database initialization script (legacy JS)
├── 📄 README.md                     # Project overview & setup guide
├── 📄 AGENTS.md                     # Guidance for AI coding agents
├── 📄 CLAUDE.md                     # Detailed architecture reference
├── 📄 knowledge.md                  # Conventions & gotchas
├── 📄 ENTITY_RELATIONSHIP.md        # Database entity relationship docs
├── 📄 PROJECT_STRUCTURE.md          # This file
│
├── 📂 scripts/                      # Utility scripts
│   ├── 📄 init-db.mjs               # DB init / migration script (ESM)
│   ├── 📄 db-inspect.mjs            # Database inspection tool
│   └── 📄 admin-e2e.mjs             # Admin end-to-end test script
│
├── 📂 public/                       # Static assets (PWA manifest, icons)
│   ├── 📄 favicon.svg
│   ├── 📄 manifest.json
│   ├── 📄 sw.js
│   └── 📄 vite.svg
│
├── 📂 src/                          # Main application source
│   │
│   ├── 📄 middleware.js             # Edge middleware (auth guard)
│   │
│   ├── 📂 app/                      # Next.js App Router (pages & APIs)
│   │   ├── 📄 layout.js             # Root layout (HTML shell, fonts, providers)
│   │   ├── 📄 page.js               # Home page (main app entry)
│   │   ├── 📄 loading.js            # Root loading skeleton (Suspense fallback)
│   │   ├── 📄 globals.css           # Global styles & Tailwind directives
│   │   │
│   │   ├── 📂 login/                # Standalone login page
│   │   │   └── 📄 page.js
│   │   │
│   │   ├── 📂 terms/                # Terms & Conditions page
│   │   │   └── 📄 page.js
│   │   │
│   │   └── 📂 api/                  # Next.js API route handlers
│   │       ├── 📂 auth/
│   │       │   ├── 📂 login/        # POST — authenticate user
│   │       │   ├── 📂 register/     # POST — create new user
│   │       │   ├── 📂 logout/       # POST — clear auth session
│   │       │   ├── 📂 profile/      # GET — fetch current user info
│   │       │   ├── 📂 recover/      # POST — password recovery
│   │       │   └── 📂 security/     # POST — security question verification
│   │       ├── 📂 expenses/
│   │       │   ├── 📄 route.js      # GET (list) / POST (create) expenses
│   │       │   └── 📂 [id]/
│   │       │       └── 📄 route.js  # PATCH / DELETE a single expense
│   │       ├── 📂 admin/
│   │       │   ├── 📂 users/        # Admin — user management
│   │       │   ├── 📂 expenses/     # Admin — expense management
│   │       │   └── 📂 logs/         # Admin — API logs
│   │       ├── 📂 chat/
│   │       │   └── 📄 route.js      # POST — AI-powered chat endpoint
│   │       └── 📂 init-db/
│   │           └── 📄 route.js      # GET — initialize database tables
│   │
│   ├── 📂 assets/                   # Static images
│   │   ├── 📄 login-view.jpg
│   │   └── 📄 react.svg
│   │
│   ├── 📂 Components/               # Reusable UI components (by feature)
│   │   ├── 📂 common/               # Shared UI primitives
│   │   │   ├── 📄 AppHeader.jsx         # Top navigation bar
│   │   │   ├── 📄 Sidebar.jsx           # Side navigation
│   │   │   ├── 📄 Button.jsx            # Reusable button component
│   │   │   ├── 📄 InputField.jsx        # Reusable input field
│   │   │   ├── 📄 Icons.jsx             # Inline SVG icon set
│   │   │   ├── 📄 categoryIcons.jsx     # Category icon map
│   │   │   ├── 📄 ToastProvider.jsx     # Toast notification provider
│   │   │   ├── 📄 AppLoader.jsx         # App-level loading spinner
│   │   │   ├── 📄 GoToTopButton.jsx     # Scroll-to-top button
│   │   │   ├── 📄 InstallPWAPrompt.jsx  # PWA install prompt
│   │   │   └── 📄 OfflineBanner.jsx     # Offline status banner
│   │   │
│   │   ├── 📂 AuthView/             # Authentication UI
│   │   │   ├── 📄 AuthView.jsx          # Login / register screen (composition)
│   │   │   ├── 📄 useAuthView.js        # Auth state & submit handlers hook
│   │   │   ├── 📄 authValidation.js     # Validation rules & error messages
│   │   │   ├── 📂 layout/               # Page shell
│   │   │   │   ├── 📄 AuthShell.jsx     # Full-screen layout shell
│   │   │   │   ├── 📄 AuthAside.jsx     # Left dashboard illustration panel
│   │   │   │   ├── 📄 Header.jsx        # Auth card header + logo mark
│   │   │   │   └── 📄 Footer.jsx        # Auth footer
│   │   │   ├── 📂 forms/                # Sign-in / sign-up pieces
│   │   │   │   ├── 📄 LoginForm.jsx     # Sign-in form
│   │   │   │   ├── 📄 RegisterForm.jsx  # Sign-up form
│   │   │   │   ├── 📄 AuthInput.jsx     # Auth input field
│   │   │   │   ├── 📄 AuthCheckbox.jsx  # Custom accessible checkbox
│   │   │   │   ├── 📄 OrDivider.jsx     # "Or Continue With" divider
│   │   │   │   ├── 📄 PasswordStrengthMeter.jsx # Strength indicator
│   │   │   │   └── 📄 SocialButtons.jsx # Social login buttons
│   │   │   └── 📂 modals/               # Overlay dialogs
│   │   │       ├── 📄 ForgotPasswordModal.jsx # Password recovery modal
│   │   │       └── 📄 SuccessModal.jsx  # Success confirmation modal
│   │   │
│   │   ├── 📂 ExpenseClipper/       # Main expense entry flow
│   │   │   ├── 📄 ExpenseClipper.jsx       # Clipper container
│   │   │   ├── 📄 ExpenseClipperScreen.jsx # Screen shell (composition)
│   │   │   ├── 📄 useClipperScreen.js      # Shell UI state & handlers hook
│   │   │   ├── 📄 MainContentView.jsx      # Header + tab content + insights rail
│   │   │   ├── 📄 TabContent.jsx           # Command cards, skeletons & views
│   │   │   ├── 📄 InsightsRailSide.jsx     # AI insights rail (desktop)
│   │   │   ├── 📄 AmbientBackground.jsx    # Aurora/grid backdrop
│   │   │   └── 📂 ExpenseModals/
│   │   │       ├── 📄 ExpenseModals.jsx       # Modal manager
│   │   │       ├── 📄 ModalLayer.jsx          # Renders all expense modals
│   │   │       ├── 📄 ModalShell.jsx          # Shared modal shell/tokens
│   │   │       ├── 📄 AddExpenseModal.jsx     # Add expense modal
│   │   │       ├── 📄 DailyExpenseModal.jsx   # Daily expense modal
│   │   │       ├── 📄 EditExpenseModal.jsx    # Edit expense modal
│   │   │       └── 📄 DeleteExpenseModal.jsx  # Confirm delete modal
│   │   │
│   │   ├── 📂 LedgerView/           # Expense ledger (table view)
│   │   │   ├── 📄 LedgerView.jsx         # Ledger container
│   │   │   ├── 📄 ExpenseTable.jsx       # Expense rows table
│   │   │   ├── 📄 LedgerRow.jsx          # Single expense row
│   │   │   ├── 📄 LedgerFilters.jsx      # Filter bar (search, category, date)
│   │   │   ├── 📄 LedgerHeaderActions.jsx # Header action buttons
│   │   │   ├── 📄 LedgerSummaryCards.jsx # Summary cards
│   │   │   └── 📄 PaginationBar.jsx      # Pagination controls
│   │   │
│   │   ├── 📂 StatisticsView/       # Statistics & charts view
│   │   │   ├── 📄 StatisticsView.jsx        # Stats container
│   │   │   ├── 📄 StatisticsHeader.jsx      # Header / date range picker
│   │   │   ├── 📄 SummaryCardsGrid.jsx      # Summary statistic cards
│   │   │   ├── 📄 SegmentedToggle.jsx       # View toggle control
│   │   │   ├── 📄 SpendingDonutChart.jsx    # Category donut chart
│   │   │   ├── 📄 SpendingOverviewChart.jsx # Spending overview chart
│   │   │   ├── 📄 ExpenseTrendChart.jsx     # Daily trend chart
│   │   │   ├── 📄 CategoryInsightsGrid.jsx  # Category insight cards
│   │   │   ├── 📄 AIInsightCards.jsx        # AI-generated insight cards
│   │   │   └── 📄 panelStyles.js            # Shared panel styles
│   │   │
│   │   ├── 📂 AIAssistant/          # AI insights & chat widgets
│   │   │   ├── 📄 AIAssistant.jsx       # AI assistant container
│   │   │   ├── 📄 ChatWidgets.jsx       # Chat UI widgets
│   │   │   └── 📄 InsightsRail.jsx      # Insights rail panel
│   │   │
│   │   ├── 📂 ChatBot/              # AI chat assistant
│   │   │   ├── 📄 ChatMessage.jsx       # Individual message bubble
│   │   │   └── 📄 suggestions.js        # Predefined suggestion data
│   │   │
│   │   ├── 📂 CommandCenter/        # Command palette
│   │   │   └── 📄 CommandCenter.jsx
│   │   │
│   │   ├── 📂 AdminView/            # Admin console
│   │   │   ├── 📄 AdminView.jsx           # Admin container
│   │   │   ├── 📄 AdminUsersTab.jsx       # Users management tab
│   │   │   ├── 📄 AdminExpensesTab.jsx    # Expenses management tab
│   │   │   ├── 📄 AdminLogsTab.jsx        # API logs tab
│   │   │   ├── 📄 AdminPagination.jsx     # Pagination controls
│   │   │   └── 📄 useAdminPagination.js   # Pagination hook
│   │   │
│   │   ├── 📂 AboutView/            # About / info view
│   │   │   ├── 📄 AboutView.jsx         # About screen
│   │   │   └── 📄 aboutData.js          # About content data
│   │   │
│   │   └── 📂 Skeleton/             # Loading skeletons
│   │       ├── 📄 Skeleton.jsx              # Generic skeleton primitive
│   │       ├── 📂 LedgerSkeleton/           # Ledger loader
│   │       ├── 📂 StatisticsSkeleton/       # Stats loader
│   │       ├── 📂 LoginSkeleton/            # Login loader
│   │       ├── 📂 AdminSkeleton/            # Admin loader
│   │       ├── 📂 ChatSkeleton/             # Chat loader
│   │       └── 📂 AboutSkeleton/            # About loader
│   │
│   ├── 📂 hooks/                    # Custom React hooks
│   │   ├── 📄 useExpenseClipper.js  # Composition layer (merges sub-hooks)
│   │   ├── 📄 useAuth.js            # Auth state & actions
│   │   ├── 📄 useTheme.js           # Dark/light mode toggle
│   │   ├── 📄 useExpenses.js        # Expense CRUD & optimistic cache
│   │   ├── 📄 useExpenseFilters.js  # Filter & sorting state
│   │   ├── 📄 useExpenseForm.js     # Expense form state
│   │   ├── 📄 useUIState.js         # UI modal/panel state
│   │   ├── 📄 useOnlineStatus.js    # Online/offline detection
│   │   └── 📄 useAdmin.js           # Admin panel state & actions
│   │
│   ├── 📂 config/                   # Configuration modules
│   │   └── 📄 aiModels.js           # AI model provider config
│   │
│   ├── 📂 data/                     # Static / mock data
│   │   └── 📄 expenseData.js        # Seed expense data & categories
│   │
│   ├── 📂 lib/                      # Core library modules
│   │   ├── 📄 db.js                 # Neon PostgreSQL client (Edge-compatible)
│   │   ├── 📄 jwt.js                # JWT sign / verify utilities
│   │   ├── 📄 admin.js              # Admin authorization helpers
│   │   ├── 📄 validations.js        # Zod validation schemas
│   │   ├── 📄 schema.sql            # SQL schema (mirror of schema.mjs)
│   │   └── 📄 schema.mjs            # Canonical schema (used by /api/init-db)
│   │
│   └── 📂 utils/                    # Utility functions
│       ├── 📄 dateUtils.js          # Date formatting & helpers
│       ├── 📂 expenseCalculations/    # Expense aggregation & math
│       │   ├── 📄 index.js            # Barrel re-exports (public API)
│       │   ├── 📄 normalization.js    # Amount/record normalization
│       │   ├── 📄 filters.js          # Filter, sort, paginate
│       │   ├── 📄 summary.js          # Summary cards & quick stats
│       │   ├── 📄 overview.js         # Period chart aggregations
│       │   ├── 📄 insights.js         # Statistics & AI insights
│       │   └── 📄 helpers.js          # Shared internal helpers
│       ├── 📄 categoryStyles.js     # Category color & style map
│       ├── 📄 storageUtils.js       # localStorage helpers
│       ├── 📄 offlineStore.js       # Per-user offline queue & sync
│       ├── 📄 apiLogger.js          # API log writer (admin Live Logs)
│       ├── 📄 rateLimiter.js        # In-memory rate limiting
│       ├── 📄 smartExpenseParser.js # Smart quick-add parser
│       ├── 📄 aiProviders.js        # Gemini / DeepSeek / Groq / OpenAI clients
│       ├── 📄 promptBuilder.js      # AI prompt construction
│       ├── 📄 passwordStrength.js   # Password strength scoring
│       ├── 📄 exportUtils.js        # Export helpers (CSV)
│       └── 📄 scrollUtils.js        # Scroll helpers
│
└── 📂 .vite/                        # Vite cache (auto-generated)
    └── 📂 deps/
```

---

## 📌 Key Architecture Notes

| Layer | Location | Description |
|-------|----------|-------------|
| **Pages** | `src/app/` | Next.js App Router pages — home, login, terms, loading |
| **API** | `src/app/api/` | RESTful route handlers — auth, expenses, admin, chat, init-db |
| **Components** | `src/Components/` | All React UI components, organized by feature |
| **Hooks** | `src/hooks/` | Custom React hooks for shared stateful logic |
| **Config** | `src/config/` | AI model provider configuration |
| **Lib** | `src/lib/` | Database client, schema, JWT & validation utilities |
| **Utils** | `src/utils/` | Pure helper functions — dates, calculations, styles, storage |
| **Middleware** | `src/middleware.js` | Edge middleware for request guarding |

### 🔐 Authentication Flow
- **Register** → `POST /api/auth/register` → creates user with bcrypt-hashed password
- **Login** → `POST /api/auth/login` → validates credentials → sets JWT cookie
- **Logout** → `POST /api/auth/logout` → clears JWT cookie
- **Profile** → `GET /api/auth/profile` → verifies JWT → returns user data
- **Recover** → `POST /api/auth/recover` → password recovery
- **Security** → `POST /api/auth/security` → security question verification

### 💰 Expense CRUD
- **List** → `GET /api/expenses` (supports filtering, search, pagination)
- **Create** → `POST /api/expenses`
- **Update** → `PATCH /api/expenses/[id]`
- **Delete** → `DELETE /api/expenses/[id]`

### 🛡️ Admin Panel
- **Users** → `GET/PATCH/DELETE /api/admin/users`
- **Expenses** → `GET/DELETE /api/admin/expenses`
- **Logs** → `GET /api/admin/logs` → powered by `withApiLog` (`src/utils/apiLogger.js`)

### 🤖 AI Chat
- **Endpoint** → `POST /api/chat` → Gemini AI with DeepSeek / Groq / OpenAI fallbacks
- **Config** → `src/config/aiModels.js` + `src/utils/aiProviders.js`
- **UI** → `src/Components/ChatBot/` + `src/Components/AIAssistant/` — chat UI with quick actions
