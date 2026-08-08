import Skeleton, { SkeletonCard, SkeletonTableRow, panelClass } from "../Skeleton";

/**
 * LedgerSkeleton – mirrors the LedgerView layout: header actions, summary
 * cards, filter bar, expense table and pagination.
 */
const LedgerSkeleton = ({ darkMode = false }) => {
  return (
    <div className="space-y-3 animate-fadeIn" aria-label="Loading ledger">
      {/* Header actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton variant="heading" darkMode={darkMode} className="!h-7 !w-56" />
          <Skeleton variant="text" darkMode={darkMode} className="!w-64" />
        </div>
        <div className="flex gap-2.5">
          <Skeleton variant="button" darkMode={darkMode} className="!w-36 !h-9" />
          <Skeleton variant="button" darkMode={darkMode} className="!w-32 !h-9 hidden sm:block" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} darkMode={darkMode} className="!p-4" />
        ))}
      </div>

      {/* Filters bar */}
      <div className={`rounded-2xl border p-4 sm:p-5 ${panelClass(darkMode)}`}>
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          <div className="flex gap-3 w-full">
            <Skeleton variant="input" darkMode={darkMode} className="!h-9" />
            <Skeleton variant="input" darkMode={darkMode} className="!h-9 !w-40 hidden sm:block" />
          </div>
          <div className="flex gap-2 w-full lg:w-auto">
            <Skeleton variant="input" darkMode={darkMode} className="!h-9 !w-36" />
            <Skeleton variant="input" darkMode={darkMode} className="!h-9 !w-28" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden ${panelClass(darkMode)}`}>
        <div className={`flex items-center gap-3 px-2 sm:px-4 py-3 border-b ${darkMode ? "bg-slate-800/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              darkMode={darkMode}
              className={`!h-4 ${i === 4 ? "!w-8" : i === 0 ? "!w-24" : "flex-1"}`}
            />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonTableRow key={i} darkMode={darkMode} cols={5} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton variant="text" darkMode={darkMode} className="!w-32" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="button" darkMode={darkMode} className="!h-8 !w-10 !rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LedgerSkeleton;
