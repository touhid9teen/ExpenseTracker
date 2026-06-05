import { WarningTriangleIcon } from "../Icons";

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
                                <WarningTriangleIcon className="w-6 h-6" />
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
