const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;

const base = (darkMode) =>
  darkMode
    ? "bg-slate-800/60 rounded-xl"
    : "bg-slate-200/60 rounded-xl";

const Skeleton = ({ variant = "text", darkMode = true, className = "", width, height }) => {
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
      className={`${shimmer} ${base(darkMode)} ${sizeClass} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};

export const SkeletonCard = ({ darkMode, className = "" }) => (
  <div
    className={`p-4 sm:p-6 rounded-2xl border ${darkMode ? "border-slate-800/80" : "border-slate-200"} ${className}`}
  >
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <Skeleton variant="badge" darkMode={darkMode} />
      <Skeleton variant="avatar" darkMode={darkMode} className="!h-8 !w-8 !rounded-lg" />
    </div>
    <Skeleton variant="heading" darkMode={darkMode} className="!h-8 !w-1/3 mb-2" />
    <Skeleton variant="text" darkMode={darkMode} className="!w-1/2" />
  </div>
);

export const SkeletonChart = ({ darkMode }) => (
  <div
    className={`p-6 rounded-2xl border ${darkMode ? "border-slate-800/80" : "border-slate-200"}`}
  >
    <Skeleton variant="title" darkMode={darkMode} className="mb-6 !h-5" />
    <div className="flex items-end justify-between gap-2.5 h-[200px] pt-6">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
          <Skeleton
            variant="text"
            darkMode={darkMode}
            className="!rounded-t-lg"
            style={{ height: `${30 + Math.random() * 60}%` }}
          />
          <Skeleton variant="text" darkMode={darkMode} className="!h-3 !w-6 mt-2" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonTableRow = ({ darkMode, cols = 5 }) => (
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
