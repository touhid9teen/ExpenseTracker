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
        <div className={`px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-t ${darkMode ? "bg-[#111827]/40 border-slate-850" : "bg-slate-50/30 border-slate-150"}`}>
            <div className="space-y-1">
                <span className={`block text-xs font-semibold ${darkMode ? "text-slate-450" : "text-slate-500"}`}>
                    Showing <span className="font-bold text-slate-200 dark:text-slate-100">{filteredExpenses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-200 dark:text-slate-100">{Math.min(currentPage * itemsPerPage, filteredExpenses.length)}</span> of <span className="font-bold text-slate-200 dark:text-slate-100">{filteredExpenses.length}</span> results
                </span>
                <span className={`block text-sm font-extrabold ${darkMode ? "text-amber-400" : "text-amber-700"}`}>Current table total: ৳{Math.round(currentTableTotal).toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${darkMode ? "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-350" : "bg-white hover:bg-slate-100 border-slate-300 text-slate-650"}`}>Prev</button>
                <span className={`px-3.5 py-1.5 text-xs font-extrabold rounded-lg ${darkMode ? "bg-slate-800 text-amber-400" : "bg-slate-100 text-amber-700"}`}>Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${darkMode ? "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-350" : "bg-white hover:bg-slate-100 border-slate-300 text-slate-650"}`}>Next</button>
            </div>
        </div>
    );
};
