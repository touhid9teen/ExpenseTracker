import Skeleton, { SkeletonCard, SkeletonChart } from "../Skeleton";

const StatisticsSkeleton = ({ darkMode = true }) => {
  return (
    <div className="space-y-8 animate-fadeIn" aria-label="Loading statistics">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 border-slate-300/60 dark:border-slate-800/50">
        <div className="space-y-2">
          <Skeleton
            variant="heading"
            darkMode={darkMode}
            className="!h-8 !w-56"
          />
          <Skeleton variant="text" darkMode={darkMode} className="!w-72" />
        </div>
        <div className="mt-2 md:mt-0">
          <Skeleton variant="badge" darkMode={darkMode} className="!w-32" />
        </div>
      </div>

      {/* Summary cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} darkMode={darkMode} />
        ))}
      </div>

      {/* Quick stats */}
      <div
        className={`p-6 rounded-2xl border ${
          darkMode ? "border-slate-800/80" : "border-slate-200"
        }`}
      >
        <Skeleton
          variant="title"
          darkMode={darkMode}
          className="mb-4 !h-5 !w-48"
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border ${
                darkMode ? "border-slate-800/60" : "border-slate-200"
              }`}
            >
              <Skeleton
                variant="badge"
                darkMode={darkMode}
                className="!h-4 !w-28 mb-2"
              />
              <Skeleton
                variant="heading"
                darkMode={darkMode}
                className="!h-6 !w-20 mb-1"
              />
              <Skeleton variant="text" darkMode={darkMode} className="!w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Category & Chart side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-2xl border ${
            darkMode ? "border-slate-800/80" : "border-slate-200"
          }`}
        >
          <Skeleton
            variant="title"
            darkMode={darkMode}
            className="mb-4 !h-5 !w-40"
          />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton
                    variant="text"
                    darkMode={darkMode}
                    className="!w-24"
                  />
                  <Skeleton
                    variant="text"
                    darkMode={darkMode}
                    className="!w-16"
                  />
                </div>
                <Skeleton
                  variant="text"
                  darkMode={darkMode}
                  className="!h-2.5 !rounded-full"
                />
              </div>
            ))}
          </div>
        </div>
        <SkeletonChart darkMode={darkMode} />
      </div>
    </div>
  );
};

export default StatisticsSkeleton;
