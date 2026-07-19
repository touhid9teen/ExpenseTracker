import { KebabIcon, EditPencilIcon, TrashIcon } from "../common/Icons";

const LedgerRow = ({
  exp,
  darkMode,
  getCategoryStyles,
  formatDate,
  openMenuId,
  setOpenMenuId,
  setSelectedDailyDate,
  setEditingExpense,
  setDeletingExpense,
}) => {
  const style = getCategoryStyles(exp.category);
  const isMenuOpen = openMenuId === exp.id;
  return (
    <tr
      className={`transition-colors duration-150 border-b ${darkMode ? "border-slate-800/60 hover:bg-slate-800/40" : "border-slate-200 hover:bg-slate-50/80"}`}
    >
      {/* Date — short format on mobile, full on desktop */}
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
        <button
          onClick={() => setSelectedDailyDate(exp.date)}
          className="font-bold text-[10px] sm:text-xs border-b border-dashed border-slate-400 hover:border-amber-500 hover:text-amber-500 transition-all focus:outline-none whitespace-nowrap"
          title="Click to view all expenses for this day"
        >
          <span className="hidden sm:inline">{formatDate(exp.date)}</span>
          <span className="sm:hidden">
            {new Date(exp.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </button>
      </td>

      {/* Category */}
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 sm:px-2.5 py-1 rounded-full border ${style.bg}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.bullet}`}
          ></span>
          <span className="hidden sm:inline">{exp.category}</span>
          <span className="sm:hidden">{exp.category.slice(0, 4)}</span>
        </span>
      </td>

      {/* Description */}
      <td
        className={`px-2 sm:px-4 py-3 ${darkMode ? "text-slate-200" : "text-slate-700"}`}
      >
        <span
          className="block max-w-[80px] sm:max-w-[200px] lg:max-w-xs truncate font-medium text-xs sm:text-sm"
          title={exp.description}
        >
          {exp.description}
        </span>
      </td>

      {/* Amount */}
      <td
        className={`px-2 sm:px-4 py-3 font-bold whitespace-nowrap text-xs sm:text-sm ${darkMode ? "text-slate-100" : "text-slate-800"}`}
      >
        ৳{Math.round(exp.amount).toLocaleString()}
      </td>

      {/* Actions Menu */}
      <td className="px-1 sm:px-4 py-3 text-center w-8 sm:w-10">
        <div className="relative inline-block text-left">
          <button
            data-menu-area="true"
            onClick={(e) => {
              e.preventDefault();
              setOpenMenuId(isMenuOpen ? null : exp.id);
            }}
            className={`p-1 sm:p-1.5 rounded-lg transition-all focus:outline-none ${isMenuOpen ? (darkMode ? "bg-slate-700 text-amber-400" : "bg-slate-200 text-amber-600") : darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
            aria-label="Row actions"
          >
            <KebabIcon className="w-4 h-4" />
          </button>
          {isMenuOpen && (
            <div
              data-menu-area="true"
              className={`absolute right-0 z-20 w-40 rounded-xl border shadow-xl py-1.5 ${darkMode ? "bg-slate-900 border-slate-700 shadow-black/40" : "bg-white border-slate-200 shadow-slate-200/60"}`}
              style={{ top: "100%", marginTop: "0.25rem" }}
            >
              <button
                onClick={() => {
                  setEditingExpense(exp);
                  setOpenMenuId(null);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold transition-colors ${darkMode ? "text-slate-300 hover:bg-slate-800 hover:text-amber-400" : "text-slate-700 hover:bg-amber-50 hover:text-amber-700"}`}
              >
                <EditPencilIcon className="w-3.5 h-3.5" />
                Edit Expense
              </button>
              <div
                className={`my-1 mx-3 border-t ${darkMode ? "border-slate-800" : "border-slate-200"}`}
              ></div>
              <button
                onClick={() => {
                  setDeletingExpense(exp);
                  setOpenMenuId(null);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold transition-colors ${darkMode ? "text-rose-400 hover:bg-rose-950/30 hover:text-rose-300" : "text-rose-600 hover:bg-rose-50 hover:text-rose-700"}`}
              >
                <TrashIcon className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default LedgerRow;
