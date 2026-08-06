import { WarningTriangleIcon } from "../../common/Icons";

export const DeleteExpenseModal = ({
    deletingExpense,
    setDeletingExpense,
    darkMode,
    handleConfirmDelete
}) => {
    return (
        <>
            {deletingExpense && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xl transition-opacity duration-300">
                    <div className={`relative w-full max-w-md cyber-cut-lg border-2 p-6 transform scale-100 transition-transform ${
                        darkMode
                            ? "bg-slate-950 border-rose-800/70 [filter:drop-shadow(0_0_30px_rgba(244,63,94,0.2))]"
                            : "bg-white border-rose-400 [filter:drop-shadow(0_0_24px_rgba(244,63,94,0.12))]"
                    }`}>
                        <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-400 via-cyan-400 to-rose-400 opacity-70 pointer-events-none" />
                        <div className="flex items-center gap-3 text-rose-500 mb-4">
                            <div className="w-10 h-10 cyber-cut-sm bg-rose-500/10 flex items-center justify-center border-2 border-rose-500/40">
                                <WarningTriangleIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold tracking-tight">Confirm Deletion</h3>
                        </div>

                        <p className={`text-sm leading-relaxed mb-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                            Are you absolutely sure you want to permanently delete <span className={`font-bold ${darkMode ? "text-slate-100" : "text-slate-800"}`}>&quot;{deletingExpense.description}&quot;</span> of amount{" "}
                            <span className={`font-extrabold font-mono ${darkMode ? "text-rose-400 neon-taka" : "text-rose-600"}`}>৳{Math.round(deletingExpense.amount).toLocaleString()}</span>? This action is irreversible.
                        </p>

                        <div className="flex justify-end gap-3 pt-4 border-t-2 border-rose-500/20">
                            <button
                                onClick={() => setDeletingExpense(null)}
                                className={`px-5 py-2.5 cyber-cut-sm text-xs font-bold transition-all border-2 ${darkMode ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-300 text-slate-600"}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-6 py-2.5 cyber-cut-sm text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-md focus:outline-none"
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
