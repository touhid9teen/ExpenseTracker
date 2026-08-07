"use client";
import LedgerRow from "./LedgerRow";

const SortHeader = ({ label, sortKey, sortBy, setSortBy, sortOrder, setSortOrder, darkMode, alignRight = false }) => {
    const active = sortBy === sortKey;
    return (
        <th className={`px-4 py-3.5 whitespace-nowrap ${alignRight ? "text-right" : ""}`}>
            <button
                onClick={() => {
                    if (active) setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    else { setSortBy(sortKey); setSortOrder("desc"); }
                }}
                className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                    alignRight ? "justify-end" : ""
                } ${active ? "text-violet-500" : darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"}`}
            >
                {label}
                <span className="text-[10px]">{active ? (sortOrder === "desc" ? "▼" : "▲") : "↕"}</span>
            </button>
        </th>
    );
};

const HeadCell = ({ children, darkMode, alignRight = false, className = "" }) => (
    <th className={`px-4 py-3.5 whitespace-nowrap text-xs font-bold uppercase tracking-wider ${alignRight ? "text-right" : "text-left"} ${darkMode ? "text-slate-400" : "text-slate-500"} ${className}`}>
        {children}
    </th>
);

export const ExpenseTable = ({
    darkMode,
    paginatedExpenses,
    getCategoryStyles,
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
        <div className={`rounded-2xl border overflow-hidden ${darkMode ? "bg-slate-900 border-slate-700/70" : "bg-white border-slate-200"}`}>
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className={`border-b ${darkMode ? "border-slate-700/70 bg-slate-800/40" : "border-slate-200 bg-slate-50"}`}>
                            <SortHeader label="Date" sortKey="date" sortBy={sortBy} setSortBy={setSortBy} sortOrder={sortOrder} setSortOrder={setSortOrder} darkMode={darkMode} />
                            <HeadCell darkMode={darkMode}>Category</HeadCell>
                            <HeadCell darkMode={darkMode}>Description</HeadCell>
                            <SortHeader label="Amount" sortKey="amount" sortBy={sortBy} setSortBy={setSortBy} sortOrder={sortOrder} setSortOrder={setSortOrder} darkMode={darkMode} alignRight />
                            <HeadCell darkMode={darkMode} alignRight>Actions</HeadCell>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedExpenses.length === 0 ? (
                            <tr>
                                <td colSpan="5" className={`text-center py-16 text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
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
