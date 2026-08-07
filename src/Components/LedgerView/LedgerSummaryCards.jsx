"use client";
import { WalletIcon, ClipboardListIcon, ChartBarSquareIcon, TrendingUpIcon } from "../common/Icons";
import { normalizeExpenseAmount } from "../../utils/expenseCalculations";

const formatTaka = (value) => `৳${Math.round(Number(value) || 0).toLocaleString()}`;

const CHIP = {
    violet: { light: "bg-violet-100 text-violet-600", dark: "bg-violet-500/15 text-violet-300" },
    sky: { light: "bg-sky-100 text-sky-600", dark: "bg-sky-500/15 text-sky-300" },
    emerald: { light: "bg-emerald-100 text-emerald-600", dark: "bg-emerald-500/15 text-emerald-300" },
    amber: { light: "bg-amber-100 text-amber-600", dark: "bg-amber-500/15 text-amber-300" },
};

const Card = ({ darkMode, icon: Icon, chip, label, value }) => (
    <div
        className={`rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
            darkMode
                ? "bg-slate-900 border-slate-700/70 hover:border-violet-500/50 hover:shadow-violet-500/10"
                : "bg-white border-slate-200 hover:border-violet-300 hover:shadow-violet-500/10"
        }`}
    >
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? CHIP[chip].dark : CHIP[chip].light}`}>
                <Icon className="w-5 h-5" strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
                <p className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
                <p className={`text-xl font-black tracking-tight truncate ${darkMode ? "text-white" : "text-slate-900"}`}>{value}</p>
            </div>
        </div>
    </div>
);

export const LedgerSummaryCards = ({ darkMode, expenses = [] }) => {
    const count = expenses.length;
    const total = expenses.reduce((sum, e) => sum + normalizeExpenseAmount(e.amount), 0);
    const average = count > 0 ? total / count : 0;
    const highest = count > 0 ? Math.max(...expenses.map((e) => normalizeExpenseAmount(e.amount))) : 0;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card darkMode={darkMode} icon={WalletIcon} chip="violet" label="Total" value={formatTaka(total)} />
            <Card darkMode={darkMode} icon={ClipboardListIcon} chip="sky" label="Transactions" value={count.toLocaleString()} />
            <Card darkMode={darkMode} icon={ChartBarSquareIcon} chip="emerald" label="Average" value={formatTaka(average)} />
            <Card darkMode={darkMode} icon={TrendingUpIcon} chip="amber" label="Highest" value={formatTaka(highest)} />
        </div>
    );
};

export default LedgerSummaryCards;
