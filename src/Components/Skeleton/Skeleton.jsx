// Theme-aware skeleton primitives.
// Light mode mirrors the app's white cards (white surfaces + soft gray
// blocks); dark mode mirrors the slate-900 slabs (slate-700 blocks).
// Default theme is light.

const shimmer = (darkMode) =>
  `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent ${
    darkMode ? "before:via-white/10" : "before:via-white/80"
  } before:to-transparent`;

const base = (darkMode) =>
  darkMode ? "bg-slate-700/50 rounded-xl" : "bg-slate-200 rounded-xl";

// Shared panel surface — mirrors the app's card look per theme:
// white cards on the light background, slate-900 slabs in dark mode.
export const panelClass = (darkMode) =>
  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";

// Deterministic bar heights so chart skeletons don't jump between renders.
const CHART_BARS = [42, 68, 55, 80, 62, 90, 48, 72, 58, 85, 66, 76];

const Skeleton = ({ variant = "text", darkMode = false, className = "", width, height }) => {
  const variants = {
    text: "h-4 w-full",
    title: "h-6 w-3/4",
    heading: "h-8 w-1/2",
    avatar: "h-10 w-10 rounded-full",
    badge: "h-5 w-16 rounded-lg",
    button: "h-10 w-28 rounded-xl",
    card: "h-32 w-full rounded-2xl",
    chart: "h-[200px] w-full rounded-2xl",
    row: "h-12 w-full rounded-xl",
    input: "h-10 w-full rounded-xl",
  };

  const sizeClass = variants[variant] || variants.text;

  return (
    <div
      className={`${shimmer(darkMode)} ${base(darkMode)} ${sizeClass} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};

export const SkeletonCard = ({ darkMode = false, className = "" }) => (
  <div className={`p-4 sm:p-6 rounded-2xl border ${panelClass(darkMode)} ${className}`}>
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <Skeleton variant="badge" darkMode={darkMode} />
      <Skeleton variant="avatar" darkMode={darkMode} className="!h-8 !w-8 !rounded-lg" />
    </div>
    <Skeleton variant="heading" darkMode={darkMode} className="!h-8 !w-1/3 mb-2" />
    <Skeleton variant="text" darkMode={darkMode} className="!w-1/2" />
  </div>
);

export const SkeletonChart = ({ darkMode = false }) => (
  <div className={`p-6 rounded-2xl border ${panelClass(darkMode)}`}>
    <Skeleton variant="title" darkMode={darkMode} className="mb-6 !h-5" />
    <div className="flex items-end justify-between gap-2.5 h-[200px] pt-6">
      {CHART_BARS.map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
          <Skeleton
            variant="text"
            darkMode={darkMode}
            className="!rounded-t-lg"
            style={{ height: `${h}%` }}
          />
          <Skeleton variant="text" darkMode={darkMode} className="!h-3 !w-6 mt-2" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonTableRow = ({ darkMode = false, cols = 5 }) => (
  <div className={`flex items-center gap-3 px-2 sm:px-4 py-3 border-b ${darkMode ? "border-slate-800/60" : "border-slate-100"}`}>
    {Array.from({ length: cols }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        darkMode={darkMode}
        className={`!h-4 ${i === cols - 1 ? "!w-8" : i === 0 ? "!w-24" : "flex-1"}`}
      />
    ))}
  </div>
);

export default Skeleton;
