const LedgerRow = ({
  exp,
  darkMode,
  getCategoryStyles,
  formatDate,
  openMenuId,
  setOpenMenuId,
  setSelectedDailyDate,
  setEditingExpense,
  setDeletingExpense,
}) => {
  const style = getCategoryStyles(exp.category);
  const isMenuOpen = openMenuId === exp.id;
  return (
    <tr
      className={`transition-colors duration-150 border-b ${darkMode ? "border-slate-800/60 hover:bg-slate-800/40" : "border-slate-100 hover:bg-slate-50/80"}`}
    >
      {/* Date — short format on mobile, full on desktop */}
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
        <button
          onClick={() => setSelectedDailyDate(exp.date)}
          className="font-bold text-[10px] sm:text-xs border-b border-dashed border-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-all focus:outline-none whitespace-nowrap"
          title="Click to view all expenses for this day"
        >
          <span className="hidden sm:inline">{formatDate(exp.date)}</span>
          <span className="sm:hidden">
            {new Date(exp.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </button>
      </td>

      {/* Category */}
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 sm:px-2.5 py-1 rounded-full border ${style.bg}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.bullet}`}
          ></span>
          <span className="hidden sm:inline">{exp.category}</span>
          <span className="sm:hidden">{exp.category.slice(0, 4)}</span>
        </span>
      </td>

      {/* Description */}
      <td
        className={`px-2 sm:px-4 py-3 ${darkMode ? "text-slate-200" : "text-slate-700"}`}
      >
        <span
          className="block max-w-[80px] sm:max-w-[200px] lg:max-w-xs truncate font-medium text-xs sm:text-sm"
          title={exp.description}
        >
          {exp.description}
        </span>
      </td>

      {/* Amount */}
      <td
        className={`px-2 sm:px-4 py-3 font-bold whitespace-nowrap text-xs sm:text-sm ${darkMode ? "text-slate-100" : "text-slate-800"}`}
      >
        ৳{Math.round(exp.amount).toLocaleString()}
      </td>

      {/* Actions Menu */}
      <td className="px-1 sm:px-4 py-3 text-center w-8 sm:w-10">
        <div className="relative inline-block text-left">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpenMenuId(isMenuOpen ? null : exp.id);
            }}
            className={`p-1 sm:p-1.5 rounded-lg transition-all focus:outline-none ${isMenuOpen ? (darkMode ? "bg-slate-700 text-emerald-400" : "bg-slate-200 text-emerald-600") : darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
            aria-label="Row actions"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
          {isMenuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute right-0 z-20 w-40 rounded-xl border shadow-xl py-1.5 ${darkMode ? "bg-slate-900 border-slate-700 shadow-black/40" : "bg-white border-slate-200 shadow-slate-200/60"}`}
              style={{ top: "100%", marginTop: "0.25rem" }}
            >
              <button
                onClick={() => {
                  setEditingExpense(exp);
                  setOpenMenuId(null);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold transition-colors ${darkMode ? "text-slate-300 hover:bg-slate-800 hover:text-emerald-400" : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"}`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-2.036a5 5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit Expense
              </button>
              <div
                className={`my-1 mx-3 border-t ${darkMode ? "border-slate-800" : "border-slate-100"}`}
              ></div>
              <button
                onClick={() => {
                  setDeletingExpense(exp);
                  setOpenMenuId(null);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold transition-colors ${darkMode ? "text-rose-400 hover:bg-rose-950/30 hover:text-rose-300" : "text-rose-600 hover:bg-rose-50 hover:text-rose-700"}`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export const ExpenseTable = ({
  darkMode,
  paginatedExpenses,
  getCategoryStyles,
  openMenuId,
  setOpenMenuId,
  setSelectedDailyDate,
  setEditingExpense,
  setDeletingExpense,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  formatDate,
}) => {
  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-all duration-300 shadow-sm ${darkMode ? "bg-slate-900/60 border-slate-800/80 shadow-black/10" : "bg-white border-slate-100 shadow-slate-100/30"}`}
    >
      <div className="w-full overflow-x-auto max-h-[520px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10">
            <tr
              className={`border-b text-xs font-bold uppercase tracking-wider ${darkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"}`}
            >
              {/* Date — always visible */}
              <th className="px-2 sm:px-4 py-3 whitespace-nowrap">
                <button
                  onClick={() => {
                    if (sortBy === "date")
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    else {
                      setSortBy("date");
                      setSortOrder("desc");
                    }
                  }}
                  className="flex items-center gap-1 hover:text-emerald-500 transition-colors focus:outline-none font-bold uppercase"
                >
                  Date{" "}
                  <span className="text-[10px]">
                    {sortBy === "date"
                      ? sortOrder === "desc"
                        ? "▼"
                        : "▲"
                      : "↕"}
                  </span>
                </button>
              </th>

              <th className="px-2 sm:px-4 py-3 whitespace-nowrap">Category</th>
              <th className="px-2 sm:px-4 py-3 whitespace-nowrap">
                Description
              </th>

              <th className="px-2 sm:px-4 py-3 whitespace-nowrap">
                <button
                  onClick={() => {
                    if (sortBy === "amount")
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    else {
                      setSortBy("amount");
                      setSortOrder("desc");
                    }
                  }}
                  className="flex items-center gap-1 hover:text-emerald-500 transition-colors focus:outline-none font-bold uppercase"
                >
                  Amount{" "}
                  <span className="text-[10px]">
                    {sortBy === "amount"
                      ? sortOrder === "desc"
                        ? "▼"
                        : "▲"
                      : "↕"}
                  </span>
                </button>
              </th>

              <th className="px-1 sm:px-4 py-3 w-8 sm:w-10"></th>
            </tr>
          </thead>
          <tbody
            className={`divide-y text-sm ${darkMode ? "divide-slate-800/60" : "divide-slate-100"}`}
          >
            {paginatedExpenses.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-16 text-slate-500 font-medium"
                >
                  No matching transactions found.
                </td>
              </tr>
            ) : (
              paginatedExpenses.map((exp) => (
                <LedgerRow
                  key={exp.id}
                  exp={exp}
                  darkMode={darkMode}
                  getCategoryStyles={getCategoryStyles}
                  formatDate={formatDate}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  setSelectedDailyDate={setSelectedDailyDate}
                  setEditingExpense={setEditingExpense}
                  setDeletingExpense={setDeletingExpense}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
