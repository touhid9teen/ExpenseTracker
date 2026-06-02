export const DailyExpenseModal = ({
    selectedDailyDate,
    dailyModalDetails,
    darkMode,
    formatDate,
    getCategoryStyles,
    setSelectedDailyDate
}) => {
    return (
        <>
            {selectedDailyDate && dailyModalDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm transition-opacity duration-300">
                    <div className={`w-full max-w-xl rounded-2xl border shadow-2xl p-6 transform scale-100 transition-transform ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                        <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="text-lg font-bold tracking-tight text-emerald-500 font-black">
                                    {formatDate(dailyModalDetails.date)}
                                </h3>
                                <span className={`text-xs font-medium block ${darkMode ? "text-slate-400" : "text-slate-555"}`}>
                                    {dailyModalDetails.count} transaction{dailyModalDetails.count !== 1 ? "s" : ""} on this day
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedDailyDate(null)}
                                className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"}`}
                            >
                                <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* List of items on this date */}
                        <div className="space-y-3 max-h-[300px] overflow-y-auto mb-5 pr-1">
                            {dailyModalDetails.items.map((item) => {
                                const style = getCategoryStyles(item.category);
                                return (
                                    <div key={item.id} className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${darkMode ? "bg-slate-800/35 border-slate-850" : "bg-slate-50 border-slate-150"}`}>
                                        <div className="space-y-1 truncate max-w-[340px]">
                                            <p className={`text-sm font-bold truncate ${darkMode ? "text-slate-200" : "text-slate-750"}`}>
                                                {item.description}
                                            </p>
                                            <span className={`inline-flex items-center gap-1 text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${style.bg}`}>
                                                {item.category}
                                            </span>
                                        </div>
                                        <span className="font-black text-sm text-emerald-500 flex-shrink-0">
                                            ৳{Math.round(item.amount).toLocaleString()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Day's total */}
                        <div className="border-t pt-4 border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <span className={`font-bold text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Total Expense of Day:</span>
                            <span className="text-xl font-extrabold text-emerald-500">৳{Math.round(dailyModalDetails.total).toLocaleString()}</span>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedDailyDate(null)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${darkMode ? "bg-slate-800 border-slate-700 text-slate-250 hover:bg-slate-750" : "bg-slate-100 border-slate-200 text-slate-650 hover:bg-slate-200"}`}
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export const EditExpenseModal = ({
    editingExpense,
    setEditingExpense,
    darkMode,
    handleSaveEdit,
    CATEGORIES
}) => {
    return (
        <>
            {editingExpense && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm transition-opacity duration-300">
                    <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 transform scale-100 transition-transform ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                        <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-bold tracking-tight">Edit Transaction Details</h3>
                            <button
                                onClick={() => setEditingExpense(null)}
                                className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"}`}
                            >
                                <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            {/* Date Field */}
                            <div>
                                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Date</label>
                                <input
                                    type="date"
                                    required
                                    value={editingExpense.date}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-850"}`}
                                />
                            </div>

                            {/* Category selector */}
                            <div>
                                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Category</label>
                                <select
                                    value={editingExpense.category}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })}
                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-850"}`}
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description field */}
                            <div>
                                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Description</label>
                                <input
                                    type="text"
                                    required
                                    value={editingExpense.description}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-850"}`}
                                />
                            </div>

                            {/* Amount field */}
                            <div>
                                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Amount (৳)</label>
                                <input
                                    type="number"
                                    required
                                    min="0.01"
                                    step="0.01"
                                    value={editingExpense.amount}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-850"}`}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingExpense(null)}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${darkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-650"}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md focus:outline-none"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export const DeleteExpenseModal = ({
    deletingExpense,
    setDeletingExpense,
    darkMode,
    handleConfirmDelete
}) => {
    return (
        <>
            {deletingExpense && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm transition-opacity duration-300">
                    <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 transform scale-100 transition-transform ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                        <div className="flex items-center gap-3 text-rose-500 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold tracking-tight">Confirm Deletion</h3>
                        </div>

                        <p className={`text-sm leading-relaxed mb-6 ${darkMode ? "text-slate-300" : "text-slate-650"}`}>
                            Are you absolutely sure you want to permanently delete <span className="font-bold text-slate-150 dark:text-slate-100">&quot;{deletingExpense.description}&quot;</span> of amount{" "}
                            <span className="font-extrabold text-rose-500">৳{Math.round(deletingExpense.amount).toLocaleString()}</span>? This action is irreversible.
                        </p>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <button
                                onClick={() => setDeletingExpense(null)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${darkMode ? "bg-slate-800 border-slate-700 text-slate-350" : "bg-slate-100 border-slate-200 text-slate-650"}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-md focus:outline-none"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
