const LedgerView = ({
    activeTab,
    darkMode,
    setActiveTab,
    showQuickAdd,
    setShowQuickAdd,
    handleAddExpense,
    addDescription,
    setAddDescription,
    addAmount,
    setAddAmount,
    addCategory,
    setAddCategory,
    addDate,
    setAddDate,
    CATEGORIES,
    filteredExpenses,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    activeDateFilter,
    setActiveDateFilter,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    setAppliedCustomRange,
    handleApplyCustomRange,
    handleResetFilters,
    paginatedExpenses,
    getCategoryStyles,
    formatDate,
    openMenuId,
    setOpenMenuId,
    setSelectedDailyDate,
    setEditingExpense,
    setDeletingExpense,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages
}) => {
    const currentTableTotal = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <>
                {activeTab === "ledger" && (
                    <div className="space-y-6 animate-fadeIn">
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 border-slate-200/50 dark:border-slate-800/50">
                            <div>
                                <h1 className="text-2xl font-black tracking-tight">Transactions Ledger</h1>
                                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-550"}`}>Log, search, sort, and edit expenditures safely</p>
                            </div>
                            
                            <div className="mt-3 md:mt-0 flex gap-2">
                                {/* Collapsible Toggle Quick Add Form */}
                                <button
                                    onClick={() => setShowQuickAdd(!showQuickAdd)}
                                    className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md focus:outline-none"
                                >
                                    <svg className={`w-4 h-4 transition-transform duration-300 ${showQuickAdd ? "rotate-45" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    {showQuickAdd ? "Collapse Form" : "Log New Expense"}
                                </button>
                                
                                <button
                                    onClick={() => setActiveTab("statistics")}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${darkMode ? "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300" : "bg-white hover:bg-slate-100 border-slate-200 text-slate-650"}`}
                                >
                                    ← Open Analytics
                                </button>
                            </div>
                        </div>

                        {/* ----------------------------------------------------
                            COLLAPSIBLE LOG FORM
                           ---------------------------------------------------- */}
                        {showQuickAdd && (
                            <div className={`p-6 rounded-2xl border shadow-xl transition-all duration-300 transform scale-100 origin-top ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-slate-200/50"}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-extrabold uppercase tracking-widest flex items-center gap-2 text-emerald-500">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                                        Log New Expense
                                    </h2>
                                    <button
                                        onClick={() => setShowQuickAdd(false)}
                                        className={`p-1 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Description */}
                                    <div>
                                        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Description</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Rice, meat and vegetables"
                                            value={addDescription}
                                            onChange={(e) => setAddDescription(e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-[#1e293b] border-slate-700 text-slate-150 placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"}`}
                                        />
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Amount (৳)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0.01"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={addAmount}
                                            onChange={(e) => setAddAmount(e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-[#1e293b] border-slate-700 text-slate-150 placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"}`}
                                        />
                                    </div>

                                    {/* Category selector */}
                                    <div>
                                        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Category</label>
                                        <select
                                            value={addCategory}
                                            onChange={(e) => setAddCategory(e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-[#1e293b] border-slate-700 text-slate-150" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Date picker */}
                                    <div>
                                        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={addDate}
                                            onChange={(e) => setAddDate(e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-[#1e293b] border-slate-700 text-slate-150" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                                        />
                                    </div>

                                    <div className="md:col-span-4 flex justify-end gap-3 mt-2 border-t pt-4 border-slate-150 dark:border-slate-800">
                                        <button
                                            type="button"
                                            onClick={() => setShowQuickAdd(false)}
                                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${darkMode ? "bg-slate-800 hover:bg-slate-750 text-slate-350" : "bg-slate-100 hover:bg-slate-200 text-slate-650"}`}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/10 focus:outline-none"
                                        >
                                            Save Expense
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ----------------------------------------------------
                            FILTER TOOLBAR PANEL
                           ---------------------------------------------------- */}
                        <div className={`p-6 rounded-2xl border transition-all duration-300 shadow-sm ${darkMode ? "bg-slate-900/60 border-slate-800/80 shadow-black/10" : "bg-white border-slate-100 shadow-slate-100/30"}`}>
                            
                            {/* Text inputs and dropdown selector */}
                            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between border-b pb-5 border-slate-200/50 dark:border-slate-800/50">
                                <div>
                                    <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500 block mb-1">Interactive Filter Toolbar</span>
                                    <div className="flex flex-wrap items-baseline gap-2">
                                        <h3 className="text-lg font-bold tracking-tight">Filter Criteria</h3>
                                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${darkMode ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-300" : "bg-emerald-50 border-emerald-100 text-emerald-700"}`}>
                                            {filteredExpenses.length} record{filteredExpenses.length !== 1 ? "s" : ""}
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 items-center">
                                    {/* Text query input */}
                                    <div className="relative w-full sm:w-60">
                                        <svg className={`w-4 h-4 absolute left-3.5 top-3.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Search description/item..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-[#182235] border-slate-750 text-slate-150 placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"}`}
                                        />
                                    </div>

                                    {/* Category select input */}
                                    <div className="w-full sm:w-44">
                                        <select
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-[#182235] border-slate-750 text-slate-150" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                                        >
                                            <option value="All">All Categories</option>
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Toolbar Buttons */}
                            <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center justify-between mt-5">
                                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => setActiveDateFilter("today")}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeDateFilter === "today" ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10" : darkMode ? "bg-[#182235] hover:bg-slate-750 border-slate-750 text-slate-350 hover:text-slate-200" : "bg-white hover:bg-slate-100 border-slate-200 text-slate-650 hover:text-slate-850"}`}
                                    >
                                        Today
                                    </button>

                                    <button
                                        onClick={() => setActiveDateFilter("week")}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeDateFilter === "week" ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10" : darkMode ? "bg-[#182235] hover:bg-slate-750 border-slate-750 text-slate-350 hover:text-slate-200" : "bg-white hover:bg-slate-100 border-slate-200 text-slate-650 hover:text-slate-850"}`}
                                    >
                                        This Week
                                    </button>

                                    <button
                                        onClick={() => setActiveDateFilter("month")}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeDateFilter === "month" ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10" : darkMode ? "bg-[#182235] hover:bg-slate-750 border-slate-750 text-slate-350 hover:text-slate-200" : "bg-white hover:bg-slate-100 border-slate-200 text-slate-650 hover:text-slate-850"}`}
                                    >
                                        This Month
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (activeDateFilter === "custom") {
                                                setActiveDateFilter("all");
                                                setAppliedCustomRange(null);
                                            } else {
                                                setActiveDateFilter("custom");
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeDateFilter === "custom" ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10" : darkMode ? "bg-[#182235] hover:bg-slate-750 border-slate-750 text-slate-350 hover:text-slate-200" : "bg-white hover:bg-slate-100 border-slate-200 text-slate-650 hover:text-slate-850"}`}
                                    >
                                        Custom Date Range
                                    </button>
                                </div>

                                <button
                                    onClick={handleResetFilters}
                                    className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold transition-all border ${darkMode ? "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300 hover:text-slate-100" : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-800"}`}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3m-3 3l-3-3" />
                                    </svg>
                                    Reset Filters
                                </button>
                            </div>

                            {/* Custom range calendar inputs */}
                            {activeDateFilter === "custom" && (
                                <div className={`mt-5 p-4 rounded-xl border flex flex-col md:flex-row flex-wrap md:items-center justify-between gap-4 transition-all duration-300 ${darkMode ? "bg-[#141b2b]/80 border-slate-800" : "bg-slate-50/80 border-slate-200/60"}`}>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <label className={`text-xs font-bold uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>From</label>
                                            <input
                                                type="date"
                                                value={customStart}
                                                onChange={(e) => setCustomStart(e.target.value)}
                                                className={`px-3 py-1.5 rounded-lg border text-xs focus:outline-none ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-slate-250 text-slate-800"}`}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className={`text-xs font-bold uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>To</label>
                                            <input
                                                type="date"
                                                value={customEnd}
                                                onChange={(e) => setCustomEnd(e.target.value)}
                                                className={`px-3 py-1.5 rounded-lg border text-xs focus:outline-none ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-slate-250 text-slate-800"}`}
                                            />
                                        </div>
                                        <button
                                            onClick={handleApplyCustomRange}
                                            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
                                        >
                                            Apply Filter
                                        </button>
                                    </div>

                                </div>
                            )}

                            <div className={`mt-5 p-4 rounded-xl border flex items-center justify-between gap-3 text-sm font-semibold ${darkMode ? "bg-[#141b2b]/80 border-slate-800" : "bg-slate-50/80 border-slate-200/60"}`}>
                                <span className={darkMode ? "text-slate-400" : "text-slate-500"}>Total Expense for Current Table Data:</span>
                                <span className="text-emerald-500 font-extrabold">৳{currentTableTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* ----------------------------------------------------
                            EXPENSE TABLE — single unified table with both
                            horizontal & vertical scrolling + ⋮ three-dot menu
                           ---------------------------------------------------- */}
                        <div className={`rounded-2xl border overflow-hidden transition-all duration-300 shadow-sm ${darkMode ? "bg-slate-900/60 border-slate-800/80 shadow-black/10" : "bg-white border-slate-100 shadow-slate-100/30"}`}>
                            
                            {/* Scrollable wrapper — horizontal for narrow screens, vertical for long lists */}
                            <div className="w-full overflow-x-auto overflow-y-auto max-h-[520px]">
                                <table className="w-full text-left border-collapse" style={{ minWidth: "600px" }}>
                                    <thead className="sticky top-0 z-10">
                                        <tr className={`border-b text-xs font-bold uppercase tracking-wider ${darkMode ? "bg-[#0f172a] border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                                            {/* Date — sortable */}
                                            <th className="px-4 py-3 whitespace-nowrap">
                                                <button
                                                    onClick={() => {
                                                        if (sortBy === "date") setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                                                        else { setSortBy("date"); setSortOrder("desc"); }
                                                    }}
                                                    className="flex items-center gap-1 hover:text-emerald-500 transition-colors focus:outline-none font-bold uppercase"
                                                >
                                                    Date
                                                    <span className="text-[10px]">{sortBy === "date" ? (sortOrder === "desc" ? "▼" : "▲") : "↕"}</span>
                                                </button>
                                            </th>
                                            <th className="px-4 py-3 whitespace-nowrap">Category</th>
                                            <th className="px-4 py-3 whitespace-nowrap">Description</th>
                                            {/* Amount — sortable */}
                                            <th className="px-4 py-3 whitespace-nowrap">
                                                <button
                                                    onClick={() => {
                                                        if (sortBy === "amount") setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                                                        else { setSortBy("amount"); setSortOrder("desc"); }
                                                    }}
                                                    className="flex items-center gap-1 hover:text-emerald-500 transition-colors focus:outline-none font-bold uppercase"
                                                >
                                                    Amount
                                                    <span className="text-[10px]">{sortBy === "amount" ? (sortOrder === "desc" ? "▼" : "▲") : "↕"}</span>
                                                </button>
                                            </th>
                                            {/* ⋮ three-dot action column — narrow */}
                                            <th className="px-4 py-3 w-10 text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y text-sm ${darkMode ? "divide-slate-800/60" : "divide-slate-100"}`}>
                                        {paginatedExpenses.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-16 text-slate-500 font-medium">
                                                    No matching transactions found.
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedExpenses.map((exp) => {
                                                const style = getCategoryStyles(exp.category);
                                                const isMenuOpen = openMenuId === exp.id;
                                                return (
                                                    <tr
                                                        key={exp.id}
                                                        className={`transition-colors duration-150 ${darkMode ? "hover:bg-slate-800/20" : "hover:bg-slate-50/70"}`}
                                                    >
                                                        {/* Date — clickable to open daily detail modal */}
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <button
                                                                onClick={() => setSelectedDailyDate(exp.date)}
                                                                className="font-bold text-xs border-b border-dashed border-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-all focus:outline-none whitespace-nowrap"
                                                                title="Click to view all expenses for this day"
                                                            >
                                                                {formatDate(exp.date)}
                                                            </button>
                                                        </td>

                                                        {/* Category badge */}
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${style.bg}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.bullet}`}></span>
                                                                {exp.category}
                                                            </span>
                                                        </td>

                                                        {/* Description — truncated, max width */}
                                                        <td className={`px-4 py-3 font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                                                            <span className="block max-w-[200px] sm:max-w-xs truncate" title={exp.description}>
                                                                {exp.description}
                                                            </span>
                                                        </td>

                                                        {/* Amount */}
                                                        <td className="px-4 py-3 font-bold whitespace-nowrap">
                                                            ৳{exp.amount.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                                                        </td>

                                                        {/* ⋮ Three-dot dropdown column */}
                                                        <td className="px-4 py-3 text-center">
                                                            <div className="relative flex justify-center">
                                                                {/* Trigger button */}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setOpenMenuId(isMenuOpen ? null : exp.id);
                                                                    }}
                                                                    className={`p-1.5 rounded-lg transition-all focus:outline-none ${isMenuOpen ? (darkMode ? "bg-slate-700 text-emerald-400" : "bg-slate-200 text-emerald-600") : (darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800")}`}
                                                                    aria-label="Row actions"
                                                                    title="More actions"
                                                                >
                                                                    {/* Three vertical dots ⋮ */}
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                        <circle cx="12" cy="5" r="1.5" />
                                                                        <circle cx="12" cy="12" r="1.5" />
                                                                        <circle cx="12" cy="19" r="1.5" />
                                                                    </svg>
                                                                </button>

                                                                {/* Dropdown menu panel */}
                                                                {isMenuOpen && (
                                                                    <div
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className={`absolute right-0 z-20 mt-8 w-36 rounded-xl border shadow-xl py-1.5 ${darkMode ? "bg-slate-900 border-slate-700 shadow-black/40" : "bg-white border-slate-200 shadow-slate-200/60"}`}
                                                                        style={{ top: 0 }}
                                                                    >
                                                                        {/* Edit option */}
                                                                        <button
                                                                            onClick={() => {
                                                                                setEditingExpense(exp);
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                            className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold transition-colors ${
                                                                                darkMode
                                                                                    ? "text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
                                                                                    : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                                                                            }`}
                                                                        >
                                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-2.036a5 5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                            </svg>
                                                                            Edit Expense
                                                                        </button>

                                                                        {/* Divider */}
                                                                        <div className={`my-1 mx-3 border-t ${darkMode ? "border-slate-800" : "border-slate-100"}`}></div>

                                                                        {/* Delete option */}
                                                                        <button
                                                                            onClick={() => {
                                                                                setDeletingExpense(exp);
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                            className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold transition-colors ${
                                                                                darkMode
                                                                                    ? "text-rose-400 hover:bg-rose-950/30 hover:text-rose-300"
                                                                                    : "text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                                                            }`}
                                                                        >
                                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                            </svg>
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* ----------------------------------------------------
                                PAGINATION BAR
                               ---------------------------------------------------- */}
                            <div className={`px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-t ${darkMode ? "bg-[#111827]/40 border-slate-850" : "bg-slate-50/30 border-slate-150"}`}>
                                <div className="space-y-1">
                                    <span className={`block text-xs font-semibold ${darkMode ? "text-slate-450" : "text-slate-500"}`}>
                                        Showing <span className="font-bold text-slate-200 dark:text-slate-100">{filteredExpenses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                                        <span className="font-bold text-slate-200 dark:text-slate-100">
                                            {Math.min(currentPage * itemsPerPage, filteredExpenses.length)}
                                        </span>{" "}
                                        of <span className="font-bold text-slate-200 dark:text-slate-100">{filteredExpenses.length}</span> results
                                    </span>
                                    <span className={`block text-sm font-extrabold ${darkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                                        Current table total: ৳{currentTableTotal.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${darkMode ? "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-350" : "bg-white hover:bg-slate-100 border-slate-200 text-slate-650"}`}
                                    >
                                        Prev
                                    </button>

                                    <span className={`px-3.5 py-1.5 text-xs font-extrabold rounded-lg ${darkMode ? "bg-slate-800 text-emerald-400" : "bg-slate-100 text-emerald-700"}`}>
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${darkMode ? "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-350" : "bg-white hover:bg-slate-100 border-slate-200 text-slate-650"}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
        </>
    );
};

export default LedgerView;
