import Skeleton, { SkeletonTableRow, panelClass } from "../Skeleton";

/**
 * AdminSkeleton – mirrors the AdminView layout: header, summary cards,
 * segmented tab bar and the active tab's data table.
 */
const AdminSkeleton = ({ darkMode = false, adminTab = "users" }) => {
  // Match the active tab's table shape: users=4 cols, expenses=5, logs=3.
  const cols = adminTab === "expenses" ? 5 : adminTab === "logs" ? 3 : 4;

  return (
    <div className="space-y-3 animate-fadeIn" aria-label="Loading admin console">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="space-y-2">
        <Skeleton variant="heading" darkMode={darkMode} className="!h-7 !w-52" />
        <Skeleton variant="text" darkMode={darkMode} className="!w-72" />
      </div>
      <Skeleton variant="button" darkMode={darkMode} className="!w-32 !h-9" />
    </div>

    {/* Summary cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={`rounded-xl p-3 border ${panelClass(darkMode)}`}>
          <div className="flex items-center gap-2.5">
            <Skeleton variant="avatar" darkMode={darkMode} className="!w-8 !h-8 !rounded-lg" />
            <div className="space-y-1.5 flex-1">
              <Skeleton variant="text" darkMode={darkMode} className="!h-3 !w-14" />
              <Skeleton variant="text" darkMode={darkMode} className="!h-5 !w-10" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Segmented tab bar */}
    <div className={`inline-flex p-1 rounded-xl ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} variant="badge" darkMode={darkMode} className="!h-8 !w-24 !rounded-lg mx-0.5" />
      ))}
    </div>

    {/* Tab content table */}
    <div className={`rounded-2xl border overflow-hidden ${panelClass(darkMode)}`}>
      <div className={`flex items-center gap-3 px-2 sm:px-4 py-3 border-b ${darkMode ? "bg-slate-800/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            darkMode={darkMode}
            className={`!h-4 ${i === cols - 1 ? "!w-8" : i === 0 ? "!w-24" : "flex-1"}`}
          />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonTableRow key={i} darkMode={darkMode} cols={cols} />
      ))}
    </div>
  </div>
  );
};

export default AdminSkeleton;
