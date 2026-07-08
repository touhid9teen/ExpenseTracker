import Skeleton, { SkeletonTableRow } from "../Skeleton";

const LedgerSkeleton = ({ darkMode = true }) => {
  return (
    <div className="space-y-6 animate-fadeIn" aria-label="Loading ledger">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 border-slate-300/60 dark:border-slate-800/50">
        <div className="space-y-2">
          <Skeleton
            variant="heading"
            darkMode={darkMode}
            className="!h-8 !w-56"
          />
          <Skeleton variant="text" darkMode={darkMode} className="!w-64" />
        </div>
        <div className="mt-3 md:mt-0 flex gap-2">
          <Skeleton variant="button" darkMode={darkMode} className="!w-40" />
          <Skeleton
            variant="button"
            darkMode={darkMode}
            className="!w-32 hidden sm:block"
          />
        </div>
      </div>

      {/* Quick add form skeleton */}
      <div
        className={`p-6 rounded-2xl border ${
          darkMode ? "border-slate-800/80" : "border-slate-200"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          <Skeleton variant="input" darkMode={darkMode} />
          <Skeleton variant="input" darkMode={darkMode} />
          <Skeleton variant="input" darkMode={darkMode} />
          <Skeleton variant="button" darkMode={darkMode} className="!w-full" />
        </div>
      </div>

      {/* Filters skeleton */}
      <div
        className={`p-6 rounded-2xl border ${
          darkMode ? "border-slate-800/80" : "border-slate-200"
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between border-b pb-5 border-slate-200/50 dark:border-slate-800/50">
          <div className="space-y-2 w-full">
            <Skeleton variant="badge" darkMode={darkMode} className="!w-32" />
            <Skeleton
              variant="title"
              darkMode={darkMode}
              className="!h-5 !w-40"
            />
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <Skeleton
              variant="input"
              darkMode={darkMode}
              className="!w-full sm:!w-60"
            />
            <Skeleton
              variant="input"
              darkMode={darkMode}
              className="!w-full sm:!w-44"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="button"
              darkMode={darkMode}
              className="!h-8 !w-24"
            />
          ))}
        </div>
      </div>

      {/* Table skeleton */}
      <div
        className={`rounded-2xl border overflow-hidden ${
          darkMode ? "border-slate-800/80" : "border-slate-200"
        }`}
      >
        {/* Table header */}
        <div
          className={`flex items-center gap-3 px-2 sm:px-4 py-3 border-b ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          {["Date", "Category", "Description", "Amount", ""].map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              darkMode={darkMode}
              className={`!h-4 ${
                i === 4 ? "!w-8" : i === 0 ? "!w-24" : "flex-1"
              }`}
            />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonTableRow key={i} darkMode={darkMode} cols={5} />
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton variant="text" darkMode={darkMode} className="!w-32" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="button"
              darkMode={darkMode}
              className="!h-8 !w-10 !rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LedgerSkeleton;
