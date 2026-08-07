import { XIcon } from "../../common/Icons";

export const EditExpenseModal = ({
    editingExpense,
    setEditingExpense,
    darkMode,
    handleSaveEdit,
    CATEGORIES
}) => {
    const inputClass = `cyber-input w-full px-1 py-2.5 text-sm font-medium ${
        darkMode ? "text-slate-100" : "text-slate-800"
    }`;

    return (
        <>
            {editingExpense && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xl transition-opacity duration-300">
                    <div className={`relative w-full max-w-lg cyber-cut-lg border-2 p-6 transform scale-100 transition-transform cyber-3d-lg cyber-inner-edge [--glow-3d-2:var(--violet-glow-soft)] ${
                        darkMode
                            ? "bg-slate-950 border-cyan-700/60"
                            : "bg-white border-cyan-400"
                    }`}>
                        <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 opacity-80 pointer-events-none" />
                        <div className="flex items-center justify-between border-b-2 pb-4 mb-4 border-cyan-500/25">
                            <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
                                Edit Transaction Details
                                <span className={`inline-block w-1.5 h-5 cyber-cut-sm bg-gradient-to-b ${darkMode ? "from-cyan-400 to-violet-500" : "from-cyan-500 to-violet-600"}`} />
                            </h3>
                            <button
                                onClick={() => setEditingExpense(null)}
                                className={`p-1.5 cyber-cut-sm transition-colors ${darkMode ? "hover:bg-slate-900 text-slate-400 hover:text-cyan-300" : "hover:bg-slate-100 text-slate-500 hover:text-cyan-600"}`}
                            >
                                <XIcon className="w-5.5 h-5.5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div>
                                <label className={`block text-xs font-bold uppercase mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Date</label>
                                <input
                                    type="date"
                                    required
                                    value={editingExpense.date}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold uppercase mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Category</label>
                                <select
                                    value={editingExpense.category}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })}
                                    className={`cyber-input w-full px-1 py-2.5 text-sm font-medium ${
                                        darkMode ? "text-slate-100" : "text-slate-800"
                                    }`}
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat} className={darkMode ? "bg-slate-900" : "bg-white"}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={`block text-xs font-bold uppercase mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Description</label>
                                <input
                                    type="text"
                                    required
                                    value={editingExpense.description}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold uppercase mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Amount (৳)</label>
                                <input
                                    type="number"
                                    required
                                    min="0.01"
                                    step="0.01"
                                    value={editingExpense.amount}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
                                    className={`cyber-input w-full px-1 py-2.5 text-sm font-black font-mono ${
                                        darkMode ? "text-cyan-400" : "text-cyan-600"
                                    }`}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t-2 border-cyan-500/20">
                                <button
                                    type="button"
                                    onClick={() => setEditingExpense(null)}
                                    className={`px-5 py-2.5 cyber-cut-sm text-xs font-bold transition-all border-2 ${darkMode ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-300 text-slate-600"}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 cyber-cut-sm text-xs font-bold text-white cyber-btn-accent transition-all shadow-md focus:outline-none"
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
