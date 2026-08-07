"use client";
import { EyeIcon, EditPencilIcon, TrashIcon } from "../common/Icons";

const LedgerRow = ({
    exp,
    darkMode,
    getCategoryStyles,
    formatDate,
    setSelectedDailyDate,
    setEditingExpense,
    setDeletingExpense,
}) => {
    const style = getCategoryStyles(exp.category);

    const actionBtn = (variant) =>
        `p-2 rounded-lg transition-colors ${
            variant === "danger"
                ? darkMode
                    ? "text-slate-400 hover:bg-rose-500/15 hover:text-rose-300"
                    : "text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                : darkMode
                    ? "text-slate-400 hover:bg-slate-800 hover:text-violet-300"
                    : "text-slate-400 hover:bg-slate-100 hover:text-violet-600"
        }`;

    return (
        <tr className={`border-b last:border-0 transition-colors ${darkMode ? "border-slate-800 hover:bg-slate-800/40" : "border-slate-100 hover:bg-slate-50"}`}>
            {/* Date */}
            <td className="px-4 py-3.5 whitespace-nowrap">
                <button
                    onClick={() => setSelectedDailyDate(exp.date)}
                    className={`text-sm font-semibold transition-colors ${darkMode ? "text-slate-200 hover:text-violet-300" : "text-slate-700 hover:text-violet-600"}`}
                    title="View all expenses for this day"
                >
                    {formatDate(exp.date)}
                </button>
            </td>

            {/* Category pill */}
            <td className="px-4 py-3.5 whitespace-nowrap">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${style.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${style.bullet}`} />
                    {exp.category}
                </span>
            </td>

            {/* Description */}
            <td className={`px-4 py-3.5 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                <span className="block max-w-[140px] sm:max-w-xs truncate text-sm font-medium" title={exp.description}>
                    {exp.description}
                </span>
            </td>

            {/* Amount (red) */}
            <td className="px-4 py-3.5 whitespace-nowrap text-right">
                <span className={`text-sm font-bold ${darkMode ? "text-rose-400" : "text-rose-600"}`}>
                    ৳{Math.round(exp.amount).toLocaleString()}
                </span>
            </td>

            {/* Actions */}
            <td className="px-4 py-3.5 whitespace-nowrap">
                <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setSelectedDailyDate(exp.date)} className={actionBtn()} aria-label="View day" title="View day">
                        <EyeIcon className="w-4 h-4" strokeWidth={2} />
                    </button>
                    <button onClick={() => setEditingExpense(exp)} className={actionBtn()} aria-label="Edit expense" title="Edit">
                        <EditPencilIcon className="w-4 h-4" strokeWidth={2} />
                    </button>
                    <button onClick={() => setDeletingExpense(exp)} className={actionBtn("danger")} aria-label="Delete expense" title="Delete">
                        <TrashIcon className="w-4 h-4" strokeWidth={2} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default LedgerRow;
