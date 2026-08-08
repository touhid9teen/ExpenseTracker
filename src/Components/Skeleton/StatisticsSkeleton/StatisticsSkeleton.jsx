import Skeleton, { SkeletonCard, SkeletonChart, panelClass } from "../Skeleton";

// Deterministic bar heights for the overview chart skeleton.
const OVERVIEW_BARS = [45, 70, 58, 84, 62, 92, 50, 76, 64, 88, 70, 96];

/**
 * StatisticsSkeleton – mirrors the StatisticsView layout: header, spending
 * overview chart, summary cards, category insights and the chart pair.
 */
const StatisticsSkeleton = ({ darkMode = false }) => {
  return (
    <div className="space-y-3 animate-fadeIn" aria-label="Loading statistics">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton variant="heading" darkMode={darkMode} className="!h-7 !w-56" />
          <Skeleton variant="text" darkMode={darkMode} className="!w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="badge" darkMode={darkMode} className="!h-9 !w-24" />
          <Skeleton variant="badge" darkMode={darkMode} className="!h-9 !w-24" />
        </div>
      </div>

      {/* Spending overview chart */}
      <div className={`rounded-2xl border p-5 sm:p-6 ${panelClass(darkMode)}`}>
        <Skeleton variant="title" darkMode={darkMode} className="mb-5 !h-5 !w-48" />
        <div className="flex items-end justify-between gap-2.5 h-[220px]">
          {OVERVIEW_BARS.map((h, i) => (
            <Skeleton
              key={i}
              variant="text"
              darkMode={darkMode}
              className="!rounded-t-lg"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} darkMode={darkMode} />
        ))}
      </div>

      {/* Category insights */}
      <div className={`rounded-2xl border p-5 sm:p-6 ${panelClass(darkMode)}`}>
        <Skeleton variant="title" darkMode={darkMode} className="mb-5 !h-5 !w-44" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton variant="text" darkMode={darkMode} className="!w-24" />
                <Skeleton variant="text" darkMode={darkMode} className="!w-14" />
              </div>
              <Skeleton variant="text" darkMode={darkMode} className="!h-2.5 !rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Donut + trend charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonChart darkMode={darkMode} />
        <SkeletonChart darkMode={darkMode} />
      </div>
    </div>
  );
};

export default StatisticsSkeleton;
