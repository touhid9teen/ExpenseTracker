"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EyeIcon, EditPencilIcon, TrashIcon, KebabIcon } from "../ui/Icons";

const MenuItem = ({ darkMode, icon: Icon, label, onClick, danger = false }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold transition-colors ${
            danger
                ? darkMode
                    ? "text-rose-400 hover:bg-rose-500/15"
                    : "text-rose-600 hover:bg-rose-50"
                : darkMode
                    ? "text-slate-300 hover:bg-slate-800 hover:text-violet-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-violet-600"
        }`}
    >
        <Icon className="w-4 h-4" strokeWidth={2} />
        {label}
    </button>
);

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
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
    const btnRef = useRef(null);

    const actionBtn = `p-2 rounded-lg transition-colors ${
        darkMode
            ? "text-slate-400 hover:bg-slate-800 hover:text-violet-300"
            : "text-slate-400 hover:bg-slate-100 hover:text-violet-600"
    }`;

    useEffect(() => {
        if (!menuOpen) return undefined;

        const close = () => setMenuOpen(false);
        const onKeyDown = (e) => {
            if (e.key === "Escape") close();
        };
        document.addEventListener("click", close);
        window.addEventListener("scroll", close, true);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("click", close);
            window.removeEventListener("scroll", close, true);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [menuOpen]);

    const toggleMenu = (e) => {
        e.stopPropagation();
        const rect = btnRef.current.getBoundingClientRect();
        setMenuPos({
            top: rect.bottom + 6,
            right: Math.max(8, window.innerWidth - rect.right),
        });
        setMenuOpen((v) => !v);
    };

    const run = (fn) => {
        setMenuOpen(false);
        fn();
    };

    return (
        <tr className={`border-b last:border-0 transition-colors ${darkMode ? "border-slate-800 hover:bg-slate-800/40" : "border-slate-100 hover:bg-slate-50"}`}>
            {/* Date */}
            <td className="px-4 py-2 whitespace-nowrap">
                <button
                    onClick={() => setSelectedDailyDate(exp.date)}
                    className={`text-sm font-semibold transition-colors ${darkMode ? "text-slate-200 hover:text-violet-300" : "text-slate-700 hover:text-violet-600"}`}
                    title="View all expenses for this day"
                >
                    {formatDate(exp.date)}
                </button>
            </td>

            {/* Category pill */}
            <td className="px-4 py-2 whitespace-nowrap">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full ${style.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${style.bullet}`} />
                    {exp.category}
                </span>
            </td>

            {/* Description */}
            <td className={`px-4 py-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                <span className="block max-w-[140px] sm:max-w-xs truncate text-sm font-medium" title={exp.description}>
                    {exp.description}
                </span>
            </td>

            {/* Amount (red) */}
            <td className="px-4 py-2 whitespace-nowrap text-right">
                <span className={`text-sm font-bold ${darkMode ? "text-rose-400" : "text-rose-600"}`}>
                    ৳{Math.round(exp.amount).toLocaleString()}
                </span>
            </td>

            {/* Actions */}
            <td className="px-4 py-2 whitespace-nowrap">
                <div className="flex items-center justify-end">
                    <button
                        ref={btnRef}
                        onClick={toggleMenu}
                        className={actionBtn}
                        aria-label="Actions"
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                        title="Actions"
                    >
                        <KebabIcon className="w-4 h-4" />
                    </button>

                    {menuOpen &&
                        createPortal(
                            <div
                                role="menu"
                                className={`fixed z-50 min-w-[160px] rounded-xl border shadow-xl py-1.5 ${
                                    darkMode
                                        ? "bg-slate-900 border-slate-700/70 shadow-black/40"
                                        : "bg-white border-slate-200 shadow-slate-300/40"
                                }`}
                                style={{ top: menuPos.top, right: menuPos.right }}
                            >
                                <MenuItem
                                    darkMode={darkMode}
                                    icon={EyeIcon}
                                    label="View Day"
                                    onClick={() => run(() => setSelectedDailyDate(exp.date))}
                                />
                                <MenuItem
                                    darkMode={darkMode}
                                    icon={EditPencilIcon}
                                    label="Edit"
                                    onClick={() => run(() => setEditingExpense(exp))}
                                />
                                <div className={`my-1 h-px mx-2 ${darkMode ? "bg-slate-700/70" : "bg-slate-200"}`} />
                                <MenuItem
                                    darkMode={darkMode}
                                    icon={TrashIcon}
                                    label="Delete"
                                    danger
                                    onClick={() => run(() => setDeletingExpense(exp))}
                                />
                            </div>,
                            document.body
                        )}
                </div>
            </td>
        </tr>
    );
};

export default LedgerRow;
