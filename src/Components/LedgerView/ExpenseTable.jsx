import LedgerRow from "./LedgerRow";

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
      className={`rounded-2xl border overflow-hidden transition-all duration-300 shadow-md ${darkMode ? "bg-slate-900/60 border-slate-800/80 shadow-black/15" : "bg-white border-slate-200 shadow-slate-200/50"}`}
    >
      <div className="w-full overflow-x-auto max-h-[520px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10">
            <tr
              className={`border-b text-xs font-bold uppercase tracking-wider ${darkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-300 text-slate-500"}`}
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
                  className="flex items-center gap-1 hover:text-amber-500 transition-colors focus:outline-none font-bold uppercase"
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
                  className="flex items-center gap-1 hover:text-amber-500 transition-colors focus:outline-none font-bold uppercase"
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
