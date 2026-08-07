import { TrendingUpIcon, CalendarIcon, ChartBarIcon, ChartPieIcon } from "../common/Icons";
import { cardSurface, accentText } from "./cardStyles";

const accents = ["gold", "rose", "violet", "sky"];

const SummaryCard = ({ darkMode, title, value = 0, icon, note, accent }) => (
    <div className={`
        cyber-tilt-scene
    `}>
        <div className={`
        cyber-tilt cyber-shine
        flex flex-col items-center justify-center text-center
        p-6 cyber-cut min-h-[155px] relative overflow-hidden
        cyber-inner-edge
        ${cardSurface(accent, darkMode)}
    `}>
            {/* Neon corner glint */}
            <span className="absolute top-0 left-0 w-14 h-[3px] bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400" />
            <span className={`absolute bottom-0 right-0 w-14 h-[3px] bg-gradient-to-l ${accent === "gold" ? "from-amber-400" : accent === "rose" ? "from-rose-400" : accent === "violet" ? "from-violet-400" : "from-cyan-400"} to-transparent`} />
            <div className={accentText(accent, darkMode) + " mb-3 relative z-[2]"}>
                {icon}
            </div>
            <span className={`relative z-[2] text-base font-bold leading-tight ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                {title}
            </span>
            <span className={`relative z-[2] text-2xl font-black mt-1 tracking-tight font-mono cyber-emboss ${accentText(accent, darkMode)} ${darkMode ? (accent === "gold" ? "neon-gold" : "neon-taka") : ""}`}>
                ৳{Math.round(value).toLocaleString()}
            </span>
            <span className={`relative z-[2] text-xs mt-1 leading-tight ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {note}
            </span>
        </div>
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
