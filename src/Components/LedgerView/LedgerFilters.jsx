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
  return (
    <div
      className={`p-6 rounded-2xl border transition-all duration-300 shadow-md ${
        darkMode
          ? "bg-slate-900/60 border-slate-800/80 shadow-black/15": "bg-white border-slate-200 shadow-slate-200/50"}`}
    >
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between border-b pb-5 border-slate-200/50 dark:border-slate-800/50">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500 block mb-1">
            Interactive Filter Toolbar
          </span>          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold tracking-tight">
              Filter Criteria
            </h3>
            <span
              className={`inline-flex items-center text-[10px] px-2.5 py-1.5 rounded-lg font-bold border ${
                darkMode
                  ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-300"
                  : "bg-emerald-50 border-emerald-100 text-emerald-700"
              }`}
            >
              {filteredExpenses.length} record
              {filteredExpenses.length !== 1 ? "s" : ""}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border-dotted border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  darkMode
                    ? "border-rose-600/50 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 hover:border-rose-500 hover:text-rose-200"
                    : "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-400 hover:text-rose-700"
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
              className={`w-4 h-4 absolute left-3.5 top-3.5 ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search description/item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${
                darkMode
                  ? "bg-[#182235] border-slate-750 text-slate-150 placeholder-slate-500": "bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400"}`}
            />
          </div>
          <div className="w-full sm:w-44">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${
                darkMode
                  ? "bg-[#182235] border-slate-750 text-slate-150": "bg-slate-50 border-slate-300 text-slate-800"}`}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
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
              className={`px-4 py-2 shrink-0 rounded-xl text-xs font-bold transition-all border ${
                activeDateFilter === filter
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10"
                  : darkMode
                  ? "bg-[#182235] hover:bg-slate-750 border-slate-750 text-slate-350 hover:text-slate-200": "bg-white hover:bg-slate-100 border-slate-300 text-slate-650 hover:text-slate-850"}`}
            >
              {filter === "today"
                ? "Today"
                : filter === "week"
                ? "This Week"
                : "This Month"}
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
            className={`px-4 py-2 shrink-0 rounded-xl text-xs font-bold transition-all border ${
              activeDateFilter === "specific"
                ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10"
                : darkMode
                ? "bg-[#182235] hover:bg-slate-750 border-slate-750 text-slate-350 hover:text-slate-200"
                : "bg-white hover:bg-slate-100 border-slate-200 text-slate-650 hover:text-slate-850"
            }`}
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
            className={`px-4 py-2 shrink-0 rounded-xl text-xs font-bold transition-all border ${
              activeDateFilter === "custom"
                ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10"
                : darkMode
                ? "bg-[#182235] hover:bg-slate-750 border-slate-750 text-slate-350 hover:text-slate-200"
                : "bg-white hover:bg-slate-100 border-slate-200 text-slate-650 hover:text-slate-850"
            }`}
          >
            Custom Date Range
          </button>
        </div>
      </div>
      {activeDateFilter === "specific" && (
        <div
          className={`mt-5 p-4 rounded-xl border flex flex-col sm:flex-row flex-wrap sm:items-center gap-4 transition-all duration-300 ${
            darkMode
              ? "bg-[#141b2b]/80 border-slate-800"
              : "bg-slate-50/80 border-slate-200/60"
          }`}
        >
          <div className="flex items-center gap-2">
            <label
              className={`text-xs font-bold uppercase ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Pick a Date
            </label>
            <input
              type="date"
              value={specificDate}
              onChange={(e) => setSpecificDate(e.target.value)}
              className={`px-3 py-1.5 rounded-lg border text-xs focus:outline-none ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-slate-200"
                  : "bg-white border-slate-250 text-slate-800"
              }`}
            />
          </div>
          {specificDate && (
            <button
              onClick={() => {
                setSpecificDate("");
                setActiveDateFilter("all");
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                darkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300"
              }`}
            >
              Clear
            </button>
          )}
        </div>
      )}
      {activeDateFilter === "custom" && (
        <div
          className={`mt-5 p-4 rounded-xl border flex flex-col md:flex-row flex-wrap md:items-center justify-between gap-4 transition-all duration-300 ${
            darkMode
              ? "bg-[#141b2b]/80 border-slate-800"
              : "bg-slate-50/80 border-slate-200/60"
          }`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label
                className={`text-xs font-bold uppercase ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                From
              </label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className={`px-3 py-1.5 rounded-lg border text-xs focus:outline-none ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 text-slate-200"
                    : "bg-white border-slate-250 text-slate-800"
                }`}
              />
            </div>
            <div className="flex items-center gap-2">
              <label
                className={`text-xs font-bold uppercase ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                To
              </label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className={`px-3 py-1.5 rounded-lg border text-xs focus:outline-none ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 text-slate-200"
                    : "bg-white border-slate-250 text-slate-800"
                }`}
              />
            </div>
            <button
              onClick={handleApplyCustomRange}  
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
