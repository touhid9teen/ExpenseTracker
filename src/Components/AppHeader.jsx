const AppHeader = ({ darkMode, activeTab, setActiveTab, toggleTheme, user, handleLogout }) => {
    return (
            <header className={`sticky top-0 z-30 transition-colors duration-300 border-b ${darkMode ? "bg-[#0f172a]/90 border-slate-800/80 backdrop-blur-md" : "bg-white/95 border-slate-200/85 backdrop-blur-md shadow-sm"}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-3 sm:py-0 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                    {/* Logo Area */}
                    <div className="flex min-w-0 flex-1 sm:flex-none items-center gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <span className="block truncate font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">FinVue</span>
                            <span className={`text-xs block truncate font-medium -mt-1 ${darkMode ? "text-slate-400" : "text-slate-550"}`}>Expense Control Center</span>
                        </div>
                    </div>

                    {/* THREE-PAGE VIEW SELECTOR (TAB BUTTONS) - Hidden on mobile, shown on sm+ */}
                    <div className="hidden sm:flex order-3 w-full sm:order-none sm:w-auto items-center">
                        <div className={`w-full sm:w-auto p-1 rounded-xl grid grid-cols-3 sm:flex gap-1 border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"}`}>
                            <button
                                onClick={() => setActiveTab("statistics")}
                                className={`px-3 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${activeTab === "statistics" ? (darkMode ? "bg-slate-800 text-emerald-400 shadow-sm" : "bg-white text-emerald-600 shadow-sm") : (darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-850")}`}
                                id="nav-btn-stats"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                </svg>
                                <span className="hidden sm:inline">Statistics Hub</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("ledger")}
                                className={`px-3 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${activeTab === "ledger" ? (darkMode ? "bg-slate-800 text-emerald-400 shadow-sm" : "bg-white text-emerald-600 shadow-sm") : (darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-850")}`}
                                id="nav-btn-ledger"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span className="hidden sm:inline">Transactions Ledger</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("about")}
                                className={`px-3 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${activeTab === "about" ? (darkMode ? "bg-slate-800 text-emerald-400 shadow-sm" : "bg-white text-emerald-600 shadow-sm") : (darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-850")}`}
                                id="nav-btn-about"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="hidden sm:inline">About</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-105 ${darkMode ? "bg-slate-800 border-slate-700/80 text-amber-400 hover:bg-slate-750" : "bg-slate-100 border-slate-200 text-slate-650 hover:bg-slate-200"}`}
                            id="theme-toggler"
                            aria-label="Toggle Theme"
                        >
                            {darkMode ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728L19 12a9 9 0 11-9-9c.386 0 .767.024 1.14.072M12 9a3 3 0 110 6 3 3 0 010-6z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {/* User Profile & Logout */}
                        {user && (
                            <div className="flex items-center gap-2 border-l pl-3 ml-1 border-slate-200 dark:border-slate-700">
                                <div className={`hidden sm:flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${darkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
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
