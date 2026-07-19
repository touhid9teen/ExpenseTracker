import {
  FinVueLogoIcon,
  ChartPieIcon,
  ClipboardListIcon,
  InfoCircleIcon,
  SunIcon,
  MoonIcon,
} from "./Icons";

const AppHeader = ({
  darkMode,
  activeTab,
  setActiveTab,
  toggleTheme,
  user,
  handleLogout,
}) => {
  return (
    <header
      className={`sticky top-0 z-30 transition-colors duration-300 border-b ${
        darkMode
          ? "bg-[#0f172a]/90 border-slate-800/80 backdrop-blur-md"
          : "bg-white/95 border-slate-300/85 backdrop-blur-md shadow-md shadow-slate-200/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-3 sm:py-0 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
        {/* Logo Area */}
        <div className="flex min-w-0 flex-1 sm:flex-none items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <FinVueLogoIcon className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <span className="block truncate font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              FinVue
            </span>
            <span
              className={`text-xs block truncate font-medium -mt-1 ${
                darkMode ? "text-slate-400" : "text-slate-550"
              }`}
            >
              Expense Control Center
            </span>
          </div>
        </div>

        {/* THREE-PAGE VIEW SELECTOR (TAB BUTTONS) - Hidden on mobile, shown on sm+ */}
        <div className="hidden sm:flex order-3 w-full sm:order-none sm:w-auto items-center">
          <div
            className={`w-full sm:w-auto p-1 rounded-xl grid grid-cols-3 sm:flex gap-1 border ${
              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-slate-100 border-slate-300"
            }`}
          >
            <button
              onClick={() => setActiveTab("statistics")}
              className={`px-3 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === "statistics"
                  ? darkMode
                    ? "bg-slate-800 text-amber-400 shadow-sm shadow-black/5"
                    : "bg-white text-amber-600 shadow-sm shadow-slate-200/20"
                  : darkMode
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-500 hover:text-slate-850"
              }`}
              id="nav-btn-stats"
            >
              <ChartPieIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span className="hidden sm:inline">Statistics Hub</span>
            </button>
            <button
              onClick={() => setActiveTab("ledger")}
              className={`px-3 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === "ledger"
                  ? darkMode
                    ? "bg-slate-800 text-amber-400 shadow-sm shadow-black/5"
                    : "bg-white text-amber-600 shadow-sm shadow-slate-200/20"
                  : darkMode
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-500 hover:text-slate-850"
              }`}
              id="nav-btn-ledger"
            >
              <ClipboardListIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span className="hidden sm:inline">Transactions Ledger</span>
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`px-3 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === "about"
                  ? darkMode
                    ? "bg-slate-800 text-amber-400 shadow-sm shadow-black/5"
                    : "bg-white text-amber-600 shadow-sm shadow-slate-200/20"
                  : darkMode
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-500 hover:text-slate-850"
              }`}
              id="nav-btn-about"
            >
              <InfoCircleIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span className="hidden sm:inline">About</span>
            </button>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-105 ${
              darkMode
                ? "bg-slate-800 border-slate-700/80 text-amber-400 hover:bg-slate-750"
                : "bg-slate-100 border-slate-300 text-slate-650 hover:bg-slate-200"
            }`}
            id="theme-toggler"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>

          {/* User Profile & Logout */}
          {user && (
            <div className="flex items-center gap-2 border-l pl-3 ml-1 border-slate-300 dark:border-slate-700">
              <div
                className={`hidden sm:flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${
                  darkMode
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  darkMode
                    ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
