import { TrendingUpIcon, CalendarIcon, ChartBarIcon, ChartPieIcon } from "../common/Icons";
import { cardSurface, accentText } from "./cardStyles";

const accents = ["rose", "emerald", "purple", "sky"];

const SummaryCard = ({ darkMode, title, value = 0, icon, note, accent }) => (
    <div className={`
        flex flex-col items-center justify-center text-center
        p-6 rounded-tl-[48px] rounded-br-[48px] min-h-[155px]
        transition-all duration-200 hover:scale-[1.02]
        ${cardSurface(accent, darkMode)}
    `}>
        <div className={accentText(accent, darkMode) + " mb-3"}>
            {icon}
        </div>
        <span className={`text-base font-bold leading-tight ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
            {title}
        </span>
        <span className={`text-2xl font-bold mt-1 tracking-tight ${accentText(accent, darkMode)}`}>
            ৳{Math.round(value).toLocaleString()}
        </span>
        <span className={`text-xs mt-1 leading-tight ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {note}
        </span>
    </div>
);

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
            <SummaryCard darkMode={darkMode} title="All-Time" value={safeSummaryCards.total} note="Filtered dataset" accent={accents[0]} icon={<TrendingUpIcon className="w-8 h-8" strokeWidth={2.5} />} />
            <SummaryCard darkMode={darkMode} title="Today" value={safeSummaryCards.today} note={safeDateLabels.today} accent={accents[1]} icon={<CalendarIcon className="w-8 h-8" strokeWidth={2.5} />} />
            <SummaryCard darkMode={darkMode} title="This Week" value={safeSummaryCards.week} note={safeDateLabels.week} accent={accents[2]} icon={<ChartBarIcon className="w-8 h-8" strokeWidth={2.5} />} />
            <SummaryCard darkMode={darkMode} title="This Month" value={safeSummaryCards.month} note={safeDateLabels.month} accent={accents[3]} icon={<ChartPieIcon className="w-8 h-8" strokeWidth={2.5} />} />
        </div>
    );
};
