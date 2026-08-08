import Skeleton, { panelClass } from "../Skeleton";

const FeatureCard = ({ darkMode }) => (
  <div className={`rounded-2xl border p-4 sm:p-5 ${panelClass(darkMode)}`}>
    <Skeleton variant="avatar" darkMode={darkMode} className="!w-10 !h-10 !rounded-xl mb-3" />
    <Skeleton variant="title" darkMode={darkMode} className="!h-4 !w-2/3 mb-2" />
    <Skeleton variant="text" darkMode={darkMode} className="!w-full" />
    <Skeleton variant="text" darkMode={darkMode} className="!w-3/4" />
  </div>
);

/**
 * AboutSkeleton – mirrors the AboutView layout: header actions, intro panel,
 * key-features grid and the "How to Use" step grid.
 */
const AboutSkeleton = ({ darkMode = false }) => (
  <div className="space-y-3 animate-fadeIn" aria-label="Loading about page">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="space-y-2">
        <Skeleton variant="heading" darkMode={darkMode} className="!h-7 !w-48" />
        <Skeleton variant="text" darkMode={darkMode} className="!w-64" />
      </div>
      <div className="flex gap-2.5">
        <Skeleton variant="button" darkMode={darkMode} className="!w-28 !h-9" />
        <Skeleton variant="button" darkMode={darkMode} className="!w-32 !h-9" />
      </div>
    </div>

    {/* Intro panel */}
    <div className={`rounded-2xl border p-5 sm:p-6 ${panelClass(darkMode)}`}>
      <div className="flex items-start gap-4">
        <Skeleton variant="avatar" darkMode={darkMode} className="!w-11 !h-11 !rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="title" darkMode={darkMode} className="!h-5 !w-56" />
          <Skeleton variant="text" darkMode={darkMode} className="!w-full" />
          <Skeleton variant="text" darkMode={darkMode} className="!w-2/3" />
        </div>
      </div>
      <div className={`mt-4 pt-4 border-t flex gap-2 ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="badge" darkMode={darkMode} className="!h-7 !w-24" />
        ))}
      </div>
    </div>

    {/* Key features */}
    <div className="space-y-3 pt-2">
      <Skeleton variant="title" darkMode={darkMode} className="!h-5 !w-40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <FeatureCard key={i} darkMode={darkMode} />
        ))}
      </div>
    </div>

    {/* How to use */}
    <div className="space-y-3 pt-2">
      <Skeleton variant="title" darkMode={darkMode} className="!h-5 !w-36" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <FeatureCard key={i} darkMode={darkMode} />
        ))}
      </div>
    </div>
  </div>
);

export default AboutSkeleton;
