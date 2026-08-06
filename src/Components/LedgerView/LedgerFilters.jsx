import { XIcon, SearchIcon } from "../common/Icons";

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

  const chipBase = (active) =>
    `px-4 py-2 shrink-0 cyber-cut-sm text-xs font-bold transition-all border-2 ${
      active
        ? "text-white bg-gradient-to-r from-cyan-500 to-sky-500 border-cyan-500 shadow-[3px_3px_0px_rgba(34,211,238,0.35)]"
        : darkMode
          ? "bg-slate-900/70 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-800"
          : "bg-white hover:bg-slate-100 border-slate-300 text-slate-600 hover:text-cyan-700 hover:border-cyan-300"
    }`;

  return (
    <div
      className={`p-6 border-2 transition-all duration-300 cyber-shadow-sm ${
        darkMode
          ? "bg-slate-900/60 border-cyan-900/50"
          : "bg-white border-cyan-300/70"
      }`}
    >
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between border-b-2 pb-5 border-cyan-500/20">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-500 block mb-1">
            Interactive Filter Toolbar
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
              Filter Criteria
              <span className={`inline-block w-1.5 h-5 cyber-cut-sm ${darkMode ? "bg-cyan-400" : "bg-cyan-500"}`} />
            </h3>
            <span
              className={`inline-flex items-center text-[10px] px-2.5 py-1.5 cyber-cut-sm font-bold border-2 ${
                darkMode
                  ? "bg-cyan-950/50 border-cyan-800/60 text-cyan-300"
                  : "bg-cyan-50 border-cyan-200 text-cyan-700"
              }`}
            >
              {filteredExpenses.length} record
              {filteredExpenses.length !== 1 ? "s" : ""}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 cyber-cut-sm border-2 border-dashed text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  darkMode
                    ? "border-rose-600/60 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 hover:border-rose-500"
                    : "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-400"
                }`}
              >
                <XIcon className="w-3 h-3" strokeWidth={2.5} />
                Reset
              </button>
            )}
          </div>
        </div>
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative w-full sm:w-60">
            <SearchIcon
              className={`w-4 h-4 absolute left-1 top-1/2 -translate-y-1/2 ${
                darkMode ? "text-cyan-500" : "text-cyan-600"
              }`}
            />
            <input
              type="text"
              placeholder="Search description/item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`cyber-input w-full pl-7 pr-4 py-2.5 text-xs font-medium ${
                darkMode
                  ? "text-slate-100 placeholder-slate-500"
                  : "text-slate-800 placeholder-slate-400"
              }`}
            />
          </div>
          <div className="w-full sm:w-44">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`cyber-input w-full px-1 py-2.5 text-xs font-medium ${
                darkMode
                  ? "bg-transparent text-slate-100"
                  : "bg-transparent text-slate-800"
              }`}
            >
              <option value="All" className={darkMode ? "bg-slate-900" : "bg-white"}>
                All Categories
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className={darkMode ? "bg-slate-900" : "bg-white"}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mt-5">
        <div className="flex overflow-x-auto gap-2 pb-2 w-full sm:w-auto -mb-2 scrollbar-none whitespace-nowrap">
          {["today", "week", "month"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveDateFilter(filter)}
              className={chipBase(activeDateFilter === filter)}
            >
              {filter === "today" ? "Today" : filter === "week" ? "This Week" : "This Month"}
            </button>
          ))}
          <button
            onClick={() => {
              if (activeDateFilter === "specific") {
                setActiveDateFilter("all");
                setSpecificDate("");
              } else {
                setActiveDateFilter("specific");
              }
            }}
            className={chipBase(activeDateFilter === "specific")}
          >
            Specific Date
          </button>
          <button
            onClick={() => {
              if (activeDateFilter === "custom") {
                setActiveDateFilter("all");
                setAppliedCustomRange(null);
              } else {
                setActiveDateFilter("custom");
              }
            }}
            className={chipBase(activeDateFilter === "custom")}
          >
            Custom Date Range
          </button>
        </div>
      </div>
      {activeDateFilter === "specific" && (
        <div
          className={`mt-5 p-4 border-2 cyber-cut flex flex-col sm:flex-row flex-wrap sm:items-center gap-4 transition-all duration-300 ${
            darkMode
              ? "bg-slate-950/60 border-cyan-900/40"
              : "bg-slate-50/80 border-cyan-200/60"
          }`}
        >
          <div className="flex items-center gap-2">
            <label className={`text-xs font-bold uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Pick a Date
            </label>
            <input
              type="date"
              value={specificDate}
              onChange={(e) => setSpecificDate(e.target.value)}
              className={`cyber-input px-3 py-1.5 text-xs ${
                darkMode ? "text-slate-200" : "text-slate-800"
              }`}
            />
          </div>
          {specificDate && (
            <button
              onClick={() => {
                setSpecificDate("");
                setActiveDateFilter("all");
              }}
              className={`px-4 py-1.5 cyber-cut-sm text-xs font-semibold transition-colors border-2 ${
                darkMode
                  ? "bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-700"
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300 border-slate-300"
              }`}
            >
              Clear
            </button>
          )}
        </div>
      )}
      {activeDateFilter === "custom" && (
        <div
          className={`mt-5 p-4 border-2 cyber-cut flex flex-col md:flex-row flex-wrap md:items-center justify-between gap-4 transition-all duration-300 ${
            darkMode
              ? "bg-slate-950/60 border-cyan-900/40"
              : "bg-slate-50/80 border-cyan-200/60"
          }`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className={`text-xs font-bold uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                From
              </label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className={`cyber-input px-3 py-1.5 text-xs ${
                  darkMode ? "text-slate-200" : "text-slate-800"
                }`}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className={`text-xs font-bold uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                To
              </label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className={`cyber-input px-3 py-1.5 text-xs ${
                  darkMode ? "text-slate-200" : "text-slate-800"
                }`}
              />
            </div>
            <button
              onClick={handleApplyCustomRange}
              className="px-4 py-1.5 cyber-cut-sm text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
