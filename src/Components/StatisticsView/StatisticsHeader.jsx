"use client";
import { CalendarIcon, DownloadIcon } from "../common/Icons";
import { mutedText, headingText } from "./panelStyles";
import { exportExpensesToCSV } from "../../utils/exportUtils";

export const StatisticsHeader = ({ darkMode, dateLabels, expenses = [] }) => {
    const monthLabel = dateLabels?.month || "";

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className={`text-2xl sm:text-[28px] font-extrabold tracking-tight ${headingText(darkMode)}`}>
                    Analytics
                </h1>
                <p className={`text-sm mt-1 ${mutedText(darkMode)}`}>
                    A visual breakdown of your spending over time
                </p>
            </div>

            <div className="flex items-center gap-2.5">
                <span
                    className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border ${
                        darkMode
                            ? "bg-slate-900 border-slate-700/70 text-slate-300"
                            : "bg-white border-slate-200 text-slate-600"
                    }`}
                >
                    <CalendarIcon className="w-4 h-4 text-violet-500" strokeWidth={2.25} />
                    {monthLabel}
                </span>
                <button
                    onClick={() => exportExpensesToCSV(expenses)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 shadow-lg shadow-violet-500/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                    <DownloadIcon className="w-4 h-4" strokeWidth={2.25} />
                    Download Report
                </button>
            </div>
        </div>
    );
};

export default StatisticsHeader;
