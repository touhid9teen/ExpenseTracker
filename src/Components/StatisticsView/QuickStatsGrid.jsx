import { TrendingUp, TrendingDown, PieChart, Calculator } from "lucide-react";
import { ChartBarSquareIcon } from "../Icons";

const cardColors = [
  "bg-[#C9E4F9]",
  "bg-[#DCD3F7]",
  "bg-[#C9F2D8]",
  "bg-[#FBD5E4]",
];

const statIcons = [TrendingUp, TrendingDown, PieChart, Calculator];

const StatCard = ({
  darkMode,
  title,
  value = "",
  note,
  valueClass,
  icon: Icon,
  bgClass,
}) => (
  <div
    className={`
        flex flex-col items-center justify-center text-center
        p-6 rounded-tl-[48px] rounded-br-[48px] min-h-[155px]
        transition-all duration-200
        hover:scale-[1.02]
        ${bgClass}
        ${darkMode ? "shadow-md shadow-black/15" : "shadow-md"}
    `}
  >
    <Icon className="w-8 h-8 text-slate-800 mb-3" />
    <span className="text-base font-bold text-slate-800 leading-tight">
      {title}
    </span>
    <span
      className={`text-2xl font-bold mt-1 tracking-tight ${
        valueClass || "text-slate-800"
      }`}
    >
      {value}
    </span>
    <span className="text-xs text-slate-600 mt-1 leading-tight">{note}</span>
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
          bgClass={cardColors[0]}
          icon={statIcons[0]}
          title="Highest Spending Day"
          value={`৳${Math.round(
            safeQuickStats.highest.amount
          ).toLocaleString()}`}
          valueClass="text-sky-700"
          note={
            safeQuickStats.highest.date !== "N/A"
              ? formatDate(safeQuickStats.highest.date)
              : "N/A"
          }
        />
        <StatCard
          darkMode={darkMode}
          bgClass={cardColors[1]}
          icon={statIcons[1]}
          title="Lowest Spending Day"
          value={`৳${Math.round(
            safeQuickStats.lowest.amount
          ).toLocaleString()}`}
          valueClass="text-purple-700"
          note={
            safeQuickStats.lowest.date !== "N/A"
              ? formatDate(safeQuickStats.lowest.date)
              : "N/A"
          }
        />
        <StatCard
          darkMode={darkMode}
          bgClass={cardColors[2]}
          icon={statIcons[2]}
          title="Most Used Category"
          value={safeQuickStats.mostUsedCategory}
          valueClass="text-emerald-700"
          note="Frequent category"
        />
        <StatCard
          darkMode={darkMode}
          bgClass={cardColors[3]}
          icon={statIcons[3]}
          title="Average Daily Expense"
          value={`৳${Math.round(safeQuickStats.avgDaily).toLocaleString()}`}
          valueClass="text-rose-700"
          note="Per active day"
        />
      </div>
    </div>
  );
};
