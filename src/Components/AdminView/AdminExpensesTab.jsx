"use client";
import { memo } from "react";
import { TrashIcon, EmptyStateIcon } from "../common/Icons";

const formatCurrency = (amount) =>
  `৳${Math.round(Number(amount) || 0).toLocaleString()}`;

const formatDate = (value) => {
  if (!value) return "—";
  const parts = String(value).split("T")[0].split("-");
  if (parts.length !== 3) return String(value);
  const [, month, day] = parts;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[Number(month) - 1] || month} ${parts[0]}`;
};

const AdminExpensesTab = memo(
  function AdminExpensesTab({ darkMode, allExpenses, isAdminLoading, deleteExpense, getCategoryStyles }) {
    const handleDelete = (expense) => {
      if (
        window.confirm(
          `Delete "${expense.description || "this expense"}" (${formatCurrency(expense.amount)}) by ${expense.username}? This cannot be undone.`
        )
      ) {
        deleteExpense(expense.id);
      }
    };

    if (!isAdminLoading && allExpenses.length === 0) {
      return (
        <div
          className={`rounded-2xl border px-6 py-14 flex flex-col items-center justify-center text-center ${
            darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-300/80"
          }`}
        >
          <div className={`mb-4 ${darkMode ? "text-slate-600" : "text-slate-300"}`}>
            <EmptyStateIcon className="w-12 h-12" strokeWidth={1.5} />
          </div>
          <p className={`text-sm font-bold ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            No expenses recorded
          </p>
          <p className={`mt-1 text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
            Expenses from all users will appear here.
          </p>
        </div>
      );
    }

    return (
      <div
        className={`rounded-2xl border overflow-hidden ${
          darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-300/80"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[680px]">
            <thead>
              <tr
                className={`text-[10px] uppercase tracking-widest font-bold border-b ${
                  darkMode ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-200"
                }`}
              >
                <th className="px-5 py-3.5">Owner</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5 text-right">Amount</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {allExpenses.map((expense) => {
                const categoryStyle = getCategoryStyles?.(expense.category) || {};
                return (
                  <tr
                    key={expense.id}
                    className={`transition-colors ${
                      darkMode
                        ? "divide-slate-800/70 hover:bg-slate-800/40"
                        : "divide-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                            darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {(expense.username || "?").charAt(0).toUpperCase()}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            darkMode ? "text-slate-300" : "text-slate-600"
                          }`}
                        >
                          {expense.username || "Unknown"}
                        </span>
                      </span>
                    </td>
                    <td
                      className={`px-5 py-3.5 text-sm max-w-[240px] truncate ${
                        darkMode ? "text-slate-200" : "text-slate-800"
                      }`}
                    >
                      {expense.description || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          categoryStyle.bg || (darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500")
                        }`}
                      >
                        {expense.category || "Others"}
                      </span>
                    </td>
                    <td
                      className={`px-5 py-3.5 text-right text-sm font-extrabold tabular-nums ${
                        darkMode ? "text-amber-400" : "text-amber-600"
                      }`}
                    >
                      {formatCurrency(expense.amount)}
                    </td>
                    <td
                      className={`px-5 py-3.5 text-xs ${
                        darkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(expense)}
                        disabled={isAdminLoading}
                        aria-label="Delete expense"
                        className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 ${
                          darkMode
                            ? "text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                            : "text-slate-400 hover:text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

export default AdminExpensesTab;
