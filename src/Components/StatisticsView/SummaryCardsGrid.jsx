const cardColors = [
    "bg-[#FBD5E4]",
    "bg-[#C9F2D8]",
    "bg-[#DCD3F7]",
    "bg-[#C9E4F9]",
];

const valueColors = [
    "text-rose-700",
    "text-emerald-700",
    "text-purple-700",
    "text-sky-700",
];

const SummaryCard = ({ darkMode, title, value = 0, icon, note, bgClass, valueClass, accentClass }) => (
    <div className={`
        flex flex-col items-center justify-center text-center
        p-6 rounded-tl-[48px] rounded-br-[48px] min-h-[155px]
        transition-all duration-200
        hover:scale-[1.02]
        ${bgClass}
        ${darkMode ? "shadow-md shadow-black/15" : "shadow-md"}
    `}>
        <div className="text-slate-800 mb-3">
            {icon}
        </div>
        <span className="text-base font-bold text-slate-800 leading-tight">
            {title}
        </span>
        <span className={`text-2xl font-bold mt-1 tracking-tight ${valueClass || "text-slate-800"}`}>
            ৳{Math.round(value).toLocaleString()}
        </span>
        <span className="text-xs text-slate-600 mt-1 leading-tight">
            {note}
        </span>
    </div>
);

import { TrendingUpIcon, CalendarIcon, ChartBarIcon, ChartPieIcon } from "../Icons";

export const SummaryCardsGrid = ({ darkMode = true, summaryCards = {}, dateLabels = {} }) => {
    const safeSummaryCards = {
        total: 0,
        today: 0,
        week: 0,
        month: 0,
        ...summaryCards
    };
    const safeDateLabels = {
        today: "",
        week: "",
        month: "",
        ...dateLabels
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <SummaryCard darkMode={darkMode} title="All-Time" value={safeSummaryCards.total} note="Filtered dataset" bgClass={cardColors[0]} valueClass={valueColors[0]} icon={<TrendingUpIcon className="w-8 h-8" strokeWidth={2.5} />} />
            <SummaryCard darkMode={darkMode} title="Today" value={safeSummaryCards.today} note={safeDateLabels.today} bgClass={cardColors[1]} valueClass={valueColors[1]} icon={<CalendarIcon className="w-8 h-8" strokeWidth={2.5} />} />
            <SummaryCard darkMode={darkMode} title="This Week" value={safeSummaryCards.week} note={safeDateLabels.week} bgClass={cardColors[2]} valueClass={valueColors[2]} icon={<ChartBarIcon className="w-8 h-8" strokeWidth={2.5} />} />
            <SummaryCard darkMode={darkMode} title="This Month" value={safeSummaryCards.month} note={safeDateLabels.month} bgClass={cardColors[3]} valueClass={valueColors[3]} icon={<ChartPieIcon className="w-8 h-8" strokeWidth={2.5} />} />
        </div>
    );
};
