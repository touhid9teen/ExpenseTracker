import { XIcon } from "../../common/Icons";

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
                    <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 transform scale-100 transition-transform ${darkMode ? "bg-slate-900 border-slate-800 shadow-black/30" : "bg-white border-slate-200 shadow-slate-200/40"}`}>
                        <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-bold tracking-tight">Edit Transaction Details</h3>
                            <button
                                onClick={() => setEditingExpense(null)}
                                className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"}`}
                            >
                                <XIcon className="w-5.5 h-5.5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div>
                                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Date</label>
                                <input
                                    type="date"
                                    required
                                    value={editingExpense.date}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-850"}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Category</label>
                                <select
                                    value={editingExpense.category}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })}
                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-850"}`}
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Description</label>
                                <input
                                    type="text"
                                    required
                                    value={editingExpense.description}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-850"}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Amount (৳)</label>
                                <input
                                    type="number"
                                    required
                                    min="0.01"
                                    step="0.01"
                                    value={editingExpense.amount}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-850"}`}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingExpense(null)}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${darkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-300 text-slate-650"}`}
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
