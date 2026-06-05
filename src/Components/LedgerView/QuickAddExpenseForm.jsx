import { XIcon } from "../Icons";

export const QuickAddExpenseForm = ({
    showQuickAdd,
    darkMode,
    setShowQuickAdd,
    handleAddExpense,
    addDescription,
    setAddDescription,
    addAmount,
    setAddAmount,
    addCategory,
    setAddCategory,
    addDate,
    setAddDate,
    CATEGORIES
}) => {
    if (!showQuickAdd) return null;

    return (
        <div className={`p-6 rounded-2xl border shadow-xl transition-all duration-300 transform scale-100 origin-top ${darkMode ? "bg-slate-900 border-slate-800 shadow-black/30" : "bg-white border-slate-200 shadow-slate-300/60"}`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-extrabold uppercase tracking-widest flex items-center gap-2 text-emerald-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Log New Expense
                </h2>
                <button
                    onClick={() => setShowQuickAdd(false)}
                    className={`p-1 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"}`}
                >
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
            <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Description</label>
                    <input type="text" required placeholder="e.g. Rice, meat and vegetables" value={addDescription} onChange={(e) => setAddDescription(e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-[#1e293b] border-slate-700 text-slate-150 placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400"}`} />
                </div>
                <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Amount (৳)</label>
                    <input type="number" required min="0.01" step="0.01" placeholder="0.00" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-[#1e293b] border-slate-700 text-slate-150 placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400"}`} />
                </div>
                <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Category</label>
                    <select value={addCategory} onChange={(e) => setAddCategory(e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-[#1e293b] border-slate-700 text-slate-150" : "bg-slate-50 border-slate-200 text-slate-800"}`}>
                        {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                    </select>
                </div>
                <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Date</label>
                    <input type="date" required value={addDate} onChange={(e) => setAddDate(e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? "bg-[#1e293b] border-slate-700 text-slate-150" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                </div>
                <div className="md:col-span-4 flex justify-end gap-3 mt-2 border-t pt-4 border-slate-300 dark:border-slate-800">
                    <button type="button" onClick={() => setShowQuickAdd(false)} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${darkMode ? "bg-slate-800 hover:bg-slate-750 text-slate-350" : "bg-slate-100 hover:bg-slate-200 text-slate-650"}`}>Cancel</button>
                    <button type="submit" className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/10 focus:outline-none">Save Expense</button>
                </div>
            </form>
        </div>
    );
};
