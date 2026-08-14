"use client";
import { XIcon, SearchIcon } from "../ui/Icons";

const DATE_CHIPS = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "specific", label: "Specific Date" },
    { key: "custom", label: "Custom Range" },
];

export const LedgerFilters = ({
    darkMode,
    filteredExpenses,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    activeDateFilter,
    setActiveDateFilter,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    appliedCustomRange,
    setAppliedCustomRange,
    handleApplyCustomRange,
    handleResetFilters,
    specificDate,
    setSpecificDate,
    CATEGORIES,
}) => {
    const hasActiveFilters =
        searchQuery ||
        categoryFilter !== "All" ||
        activeDateFilter !== "all" ||
        specificDate ||
        appliedCustomRange;

    const fieldClass = darkMode
        ? "bg-slate-800/70 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-violet-500"
        : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-violet-400";

    const chipClass = (active) =>
        `px-3 py-1.5 shrink-0 rounded-lg text-xs font-bold transition-all duration-200 border ${
            active
                ? "bg-gradient-to-br from-violet-500 to-indigo-500 text-white border-transparent shadow-sm shadow-violet-500/30"
                : darkMode
                    ? "bg-slate-800/70 border-slate-700 text-slate-300 hover:text-violet-300 hover:border-violet-500/50"
                    : "bg-white border-slate-200 text-slate-600 hover:text-violet-600 hover:border-violet-300"
        }`;

    const toggleChip = (key) => {
        if (key === "specific") {
            if (activeDateFilter === "specific") {
                setActiveDateFilter("all");
                setSpecificDate("");
            } else {
                setActiveDateFilter("specific");
            }
        } else if (key === "custom") {
            if (activeDateFilter === "custom") {
                setActiveDateFilter("all");
                setAppliedCustomRange(null);
            } else {
                setActiveDateFilter("custom");
            }
        } else {
            setActiveDateFilter(activeDateFilter === key ? "all" : key);
        }
    };

    return (
        <div className={`rounded-xl p-3 border ${darkMode ? "bg-slate-900 border-slate-700/70" : "bg-white border-slate-200"}`}>
            {/* Top row: search + category + record count + reset */}
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
                <div className="relative flex-1 min-w-0">
                    <SearchIcon className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
                    <input
                        type="text"
                        placeholder="Search description or item…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm font-medium outline-none transition-colors ${fieldClass}`}
                    />
                </div>

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className={`w-full lg:w-48 px-3.5 py-2 rounded-xl border text-sm font-medium outline-none transition-colors cursor-pointer ${fieldClass}`}
                >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold whitespace-nowrap ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {filteredExpenses.length} record{filteredExpenses.length !== 1 ? "s" : ""}
                    </span>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                                darkMode
                                    ? "bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                                    : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                            }`}
                        >
                            <XIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Date chips */}
            <div className="flex overflow-x-auto gap-2 mt-3 pb-1 scrollbar-none">
                {DATE_CHIPS.map((chip) => (
                    <button key={chip.key} onClick={() => toggleChip(chip.key)} className={chipClass(activeDateFilter === chip.key)}>
                        {chip.label}
                    </button>
                ))}
            </div>

            {/* Specific date picker */}
            {activeDateFilter === "specific" && (
                <div className={`mt-4 p-4 rounded-xl flex flex-wrap items-center gap-4 ${darkMode ? "bg-slate-800/50" : "bg-slate-50"}`}>
                    <div className="flex items-center gap-2">
                        <label className={`text-xs font-bold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Pick a date</label>
                        <input
                            type="date"
                            value={specificDate}
                            onChange={(e) => setSpecificDate(e.target.value)}
                            className={`px-3 py-1.5 rounded-lg border text-xs outline-none transition-colors ${fieldClass}`}
                        />
                    </div>
                    {specificDate && (
                        <button
                            onClick={() => { setSpecificDate(""); setActiveDateFilter("all"); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${darkMode ? "bg-slate-700 text-slate-200 hover:bg-slate-600" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`}
                        >
                            Clear
                        </button>
                    )}
                </div>
            )}

            {/* Custom range picker */}
            {activeDateFilter === "custom" && (
                <div className={`mt-4 p-4 rounded-xl flex flex-wrap items-center gap-4 ${darkMode ? "bg-slate-800/50" : "bg-slate-50"}`}>
                    <div className="flex items-center gap-2">
                        <label className={`text-xs font-bold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>From</label>
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className={`px-3 py-1.5 rounded-lg border text-xs outline-none transition-colors ${fieldClass}`}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className={`text-xs font-bold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>To</label>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className={`px-3 py-1.5 rounded-lg border text-xs outline-none transition-colors ${fieldClass}`}
                        />
                    </div>
                    <button
                        onClick={handleApplyCustomRange}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-br from-violet-500 to-indigo-500 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
};
