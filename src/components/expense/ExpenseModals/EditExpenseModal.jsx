import { CheckIcon, EditPencilIcon } from "../../ui/Icons";
import { ModalShell, fieldClass, ghostBtnClass, primaryBtnClass } from "../../ui/ModalShell";

const labelClass = (darkMode) => `block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`;

export const EditExpenseModal = ({
    editingExpense,
    setEditingExpense,
    darkMode,
    handleSaveEdit,
    CATEGORIES
}) => {
    const inputClass = fieldClass(darkMode);

    return (
        <>
            {editingExpense && (
                <ModalShell
                    darkMode={darkMode}
                    onClose={() => setEditingExpense(null)}
                    title="Edit Transaction Details"
                    subtitle="Update the fields below"
                    icon={<EditPencilIcon className="w-4 h-4" strokeWidth={2.25} />}
                >
                    <form onSubmit={handleSaveEdit} className="space-y-4">
                        <div>
                            <label className={labelClass(darkMode)}>Date</label>
                            <input
                                type="date"
                                required
                                value={editingExpense.date}
                                onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass(darkMode)}>Category</label>
                            <select
                                value={editingExpense.category}
                                onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })}
                                className={inputClass}
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat} className={darkMode ? "bg-slate-900" : "bg-white"}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass(darkMode)}>Description</label>
                            <input
                                type="text"
                                required
                                value={editingExpense.description}
                                onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass(darkMode)}>Amount (৳)</label>
                            <input
                                type="number"
                                required
                                min="0.01"
                                step="0.01"
                                value={editingExpense.amount}
                                onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
                                className={`w-full px-4 py-3 rounded-xl border text-xl font-black font-mono outline-none transition-colors ${
                                    darkMode
                                        ? "bg-slate-800/70 border-slate-700 text-violet-300 focus:border-violet-500"
                                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-violet-400"
                                }`}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-slate-800/70">
                            <button
                                type="button"
                                onClick={() => setEditingExpense(null)}
                                className={ghostBtnClass(darkMode)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className={primaryBtnClass}>
                                <CheckIcon className="w-4 h-4" strokeWidth={3} />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </ModalShell>
            )}
        </>
    );
};
