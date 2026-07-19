import { TrendingUp, TrendingDown, PieChart, Calculator } from "lucide-react";
import { ChartBarSquareIcon } from "../common/Icons";
import { cardSurface, accentText } from "./cardStyles";

const accents = ["sky", "purple", "emerald", "rose"];
const statIcons = [TrendingUp, TrendingDown, PieChart, Calculator];

const StatCard = ({ darkMode, title, value = "", note, icon: Icon, accent }) => (
  <div
    className={`
        flex flex-col items-center justify-center text-center
        p-6 rounded-tl-[48px] rounded-br-[48px] min-h-[155px]
        transition-all duration-200 hover:scale-[1.02]
        ${cardSurface(accent, darkMode)}
    `}
  >
    <Icon className={`w-8 h-8 mb-3 ${accentText(accent, darkMode)}`} />
    <span className={`text-base font-bold leading-tight ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
      {title}
    </span>
    <span className={`text-2xl font-bold mt-1 tracking-tight ${accentText(accent, darkMode)}`}>
      {value}
    </span>
    <span className={`text-xs mt-1 leading-tight ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{note}</span>
  </div>
);

export const QuickStatsGrid = ({
  darkMode = true,
  quickStats = {},
  formatDate = (value) => value || "",
}) => {
  const safeQuickStats = {
    highest: { date: "N/A", amount: 0 },
    lowest: { date: "N/A", amount: 0 },
    mostUsedCategory: "N/A",
    avgDaily: 0,
    ...quickStats,
  };

  return (
    <div>
      <h2 className={`text-base font-bold tracking-tight mb-4 flex items-center gap-2 ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
        <ChartBarSquareIcon className="w-5 h-5 text-emerald-500" />
        Core Spending Statistics
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          darkMode={darkMode}
          accent={accents[0]}
          icon={statIcons[0]}
          title="Highest Spending Day"
          value={`৳${Math.round(safeQuickStats.highest.amount).toLocaleString()}`}
          note={
            safeQuickStats.highest.date !== "N/A"
              ? formatDate(safeQuickStats.highest.date)
              : "N/A"
          }
        />
        <StatCard
          darkMode={darkMode}
          accent={accents[1]}
          icon={statIcons[1]}
          title="Lowest Spending Day"
          value={`৳${Math.round(safeQuickStats.lowest.amount).toLocaleString()}`}
          note={
            safeQuickStats.lowest.date !== "N/A"
              ? formatDate(safeQuickStats.lowest.date)
              : "N/A"
          }
        />
        <StatCard
          darkMode={darkMode}
          accent={accents[2]}
          icon={statIcons[2]}
          title="Most Used Category"
          value={safeQuickStats.mostUsedCategory}
          note="Frequent category"
        />
        <StatCard
          darkMode={darkMode}
          accent={accents[3]}
          icon={statIcons[3]}
          title="Average Daily Expense"
          value={`৳${Math.round(safeQuickStats.avgDaily).toLocaleString()}`}
          note="Per active day"
        />
      </div>
    </div>
  );
};
