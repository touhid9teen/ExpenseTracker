export const PaginationBar = ({
    darkMode,
    filteredExpenses,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    currentTableTotal
}) => {
    return (
        <div className={`px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-t-2 border-cyan-500/20 ${darkMode ? "bg-slate-950/40" : "bg-slate-50/60"}`}>
            <div className="space-y-1">
                <span className={`block text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Showing <span className="font-bold text-cyan-500">{filteredExpenses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-cyan-500">{Math.min(currentPage * itemsPerPage, filteredExpenses.length)}</span> of <span className="font-bold text-cyan-500">{filteredExpenses.length}</span> results
                </span>
                <span className={`block text-sm font-extrabold ${darkMode ? "text-cyan-400 neon-taka" : "text-cyan-700"}`}>
                    Current table total: ৳{Math.round(currentTableTotal).toLocaleString()}
                </span>
            </div>
            <div className="flex gap-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`px-3 py-1.5 cyber-cut-sm border-2 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        darkMode
                            ? "bg-slate-900 hover:bg-slate-800 border-cyan-900 text-cyan-300"
                            : "bg-white hover:bg-slate-100 border-cyan-300 text-cyan-700"
                    }`}
                >
                    Prev
                </button>
                <span className={`px-3.5 py-1.5 text-xs font-extrabold cyber-cut-sm border-2 ${
                    darkMode
                        ? "bg-slate-900 text-cyan-400 border-cyan-800/60"
                        : "bg-slate-100 text-cyan-700 border-cyan-300"
                }`}>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`px-3 py-1.5 cyber-cut-sm border-2 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        darkMode
                            ? "bg-slate-900 hover:bg-slate-800 border-cyan-900 text-cyan-300"
                            : "bg-white hover:bg-slate-100 border-cyan-300 text-cyan-700"
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};
