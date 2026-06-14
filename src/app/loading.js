import Skeleton, { SkeletonCard } from "../Components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100">
      {/* App header skeleton */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton variant="avatar" darkMode className="!h-9 !w-9 !rounded-xl" />
            <Skeleton variant="text" darkMode className="!h-5 !w-28" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton variant="avatar" darkMode className="!h-8 !w-8" />
            <Skeleton variant="button" darkMode className="!h-8 !w-20" />
          </div>
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 border-slate-800/50">
            <div className="space-y-2">
              <Skeleton variant="heading" darkMode className="!h-8 !w-56" />
              <Skeleton variant="text" darkMode className="!h-4 !w-72" />
            </div>
            <div className="mt-2 md:mt-0">
              <Skeleton variant="badge" darkMode className="!h-5 !w-32" />
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} darkMode />
            ))}
          </div>

          {/* Stats + chart area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800/80">
              <Skeleton variant="text" darkMode className="!h-5 !w-40 mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between">
                      <Skeleton variant="text" darkMode className="!h-3 !w-24" />
                      <Skeleton variant="text" darkMode className="!h-3 !w-16" />
                    </div>
                    <Skeleton variant="text" darkMode className="!h-2.5 !rounded-full" />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-2xl border border-slate-800/80">
              <Skeleton variant="text" darkMode className="!h-5 !w-48 mb-6" />
              <div className="flex items-end justify-between gap-2.5 h-[200px] pt-6">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                    <Skeleton
                      variant="text"
                      darkMode
                      className="!rounded-t-lg"
                      style={{ height: `${30 + Math.random() * 60}px` }}
                    />
                    <Skeleton variant="text" darkMode className="!h-3 !w-6 mt-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
