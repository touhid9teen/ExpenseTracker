import LedgerRow from "./LedgerRow";

const SortHeader = ({ label, sortKey, sortBy, setSortBy, sortOrder, setSortOrder, darkMode, alignRight = false }) => (
  <th className={`px-2 sm:px-4 py-3 whitespace-nowrap ${alignRight ? "text-right" : ""}`}>
    <button
      onClick={() => {
        if (sortBy === sortKey)
          setSortOrder(sortOrder === "desc" ? "asc" : "desc");
        else {
          setSortBy(sortKey);
          setSortOrder("desc");
        }
      }}
      className={`flex items-center gap-1 font-bold uppercase transition-colors focus:outline-none ${
        alignRight ? "justify-end w-full" : ""
      } ${
        sortBy === sortKey
          ? "text-amber-400 neon-taka"
          : darkMode ? "text-cyan-300/90 hover:text-cyan-300" : "text-cyan-700 hover:text-cyan-600"
      }`}
    >
      {label}{" "}
      <span className="text-[10px]">
        {sortBy === sortKey ? (sortOrder === "desc" ? "▼" : "▲") : "↕"}
      </span>
    </button>
  </th>
);

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
      className={`border-2 overflow-hidden transition-all duration-300 cyber-shadow ${
        darkMode
          ? "bg-slate-900/70 border-cyan-900/60"
          : "bg-white border-cyan-300/80"
      }`}
    >
      <div className="w-full overflow-x-auto max-h-[520px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10">
            <tr
              className={`cyber-ticker text-xs font-bold uppercase tracking-wider border-b-2 ${
                darkMode
                  ? "bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-cyan-900/70 text-slate-300"
                  : "bg-gradient-to-r from-slate-100 via-white to-slate-100 border-cyan-200 text-slate-600"
              }`}
            >
              {/* Glowing left accent edge */}
              <th className="w-1.5 p-0">
                <span className="block h-full w-1.5 bg-gradient-to-b from-amber-400 to-cyan-400" />
              </th>
              <SortHeader
                label="Date"
                sortKey="date"
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                darkMode={darkMode}
              />
              <th className="px-2 sm:px-4 py-3 whitespace-nowrap">
                <span
                  className={`flex items-center gap-1 font-bold uppercase ${
                    darkMode ? "text-cyan-300/90" : "text-cyan-700"
                  }`}
                >
                  Category
                </span>
              </th>
              <th className="px-2 sm:px-4 py-3 whitespace-nowrap">
                <span
                  className={`flex items-center gap-1 font-bold uppercase ${
                    darkMode ? "text-cyan-300/90" : "text-cyan-700"
                  }`}
                >
                  Description
                </span>
              </th>
              <SortHeader
                label="Amount"
                sortKey="amount"
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                darkMode={darkMode}
                alignRight
              />
              <th className="px-1 sm:px-4 py-3 w-8 sm:w-10"></th>
            </tr>
          </thead>
          <tbody className={`text-sm ${darkMode ? "" : ""}`}>
            {paginatedExpenses.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
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
