import { WarningTriangleIcon } from "../../common/Icons";
import { ModalShell, ghostBtnClass } from "./ModalShell";

export const DeleteExpenseModal = ({
    deletingExpense,
    setDeletingExpense,
    darkMode,
    handleConfirmDelete
}) => {
    return (
        <>
            {deletingExpense && (
                <ModalShell
                    darkMode={darkMode}
                    onClose={() => setDeletingExpense(null)}
                    title="Confirm Deletion"
                    subtitle="This action cannot be undone"
                    maxWidth="max-w-md"
                >
                    <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${darkMode ? "bg-rose-500/15 text-rose-300" : "bg-rose-100 text-rose-600"}`}>
                            <WarningTriangleIcon className="w-6 h-6" />
                        </div>
                        <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                            Are you absolutely sure you want to permanently delete <span className={`font-bold ${darkMode ? "text-slate-100" : "text-slate-800"}`}>&quot;{deletingExpense.description}&quot;</span> of amount{" "}
                            <span className={`font-extrabold font-mono ${darkMode ? "text-rose-300" : "text-rose-600"}`}>৳{Math.round(deletingExpense.amount).toLocaleString()}</span>? This action is irreversible.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-slate-800/70">
                        <button
                            onClick={() => setDeletingExpense(null)}
                            className={ghostBtnClass(darkMode)}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 focus:outline-none`}
                        >
                            Confirm Delete
                        </button>
                    </div>
                </ModalShell>
            )}
        </>
    );
};
