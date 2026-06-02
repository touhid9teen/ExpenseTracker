const FilterAlert = ({ searchQuery, categoryFilter, activeDateFilter, darkMode, handleResetFilters }) => {
    return (
        <>
                {/* Active filter alert indicator to explain statistics or totals scopes */}
                {(searchQuery || categoryFilter !== "All" || activeDateFilter !== "all") && (
                    <div className={`mb-6 p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold ${darkMode ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-300" : "bg-emerald-50 border-emerald-100 text-emerald-700"}`}>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            <span>Filters are active! The metrics below display values for the filtered search subset.</span>
                        </div>
                        <button
                            onClick={handleResetFilters}
                            className="font-bold underline hover:text-emerald-400 uppercase tracking-wider"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
        </>
    );
};

export default FilterAlert;
