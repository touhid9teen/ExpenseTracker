import Skeleton from "../Skeleton";

/**
 * LoginSkeleton – mirrors the /login mockup layout exactly: the dashboard
 * image column on the left (FinVue logo top-left corner only) and the
 * centered white sign-in card (title, fields, button, divider, Google
 * button) on the right. Shown by `loading.js` while the login route loads
 * so the skeleton and the real UI match.
 */
const LoginSkeleton = () => {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-white"
      aria-label="Loading login page"
      role="status"
    >
      <div className="relative min-h-full lg:grid lg:grid-cols-2">
        {/* Mobile brand bar */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 bg-white/90 backdrop-blur px-4 py-3 border-b border-slate-100">
          <Skeleton variant="avatar" className="!w-11 !h-11" />
          <Skeleton variant="title" className="!h-5 !w-24" />
        </div>

        {/* Left: image + logo top-left (desktop) */}
        <section className="relative hidden lg:block lg:h-full overflow-hidden bg-white">
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="!rounded-none !w-full max-w-[560px] !h-auto aspect-[932/972]" />
          </div>
          {/* Logo top-left (no border/pill) */}
          <div className="absolute top-8 left-8 z-10 inline-flex items-center gap-3">
            <Skeleton variant="avatar" className="!w-11 !h-11" />
            <Skeleton variant="title" className="!h-5 !w-20" />
          </div>
        </section>

        {/* Right: centered white sign-in card */}
        <section className="flex items-center justify-center bg-white px-4 sm:px-8 py-10">
          <div className="w-full max-w-md">
            {/* Title + subtitle (no logo in card) */}
            <div className="text-center space-y-2.5">
              <Skeleton variant="heading" className="!h-8 !w-60 mx-auto" />
              <Skeleton variant="text" className="!w-56 mx-auto" />
            </div>

            {/* Fields */}
            <div className="mt-8 space-y-4">
              <div>
                <Skeleton variant="text" className="!h-3 !w-16 mb-1.5" />
                <Skeleton className="!h-11 !rounded-lg" />
              </div>
              <div>
                <Skeleton variant="text" className="!h-3 !w-16 mb-1.5" />
                <Skeleton className="!h-11 !rounded-lg" />
              </div>

              {/* Remember me + forgot */}
              <div className="flex items-center justify-between">
                <Skeleton className="!h-4 !w-28" />
                <Skeleton className="!h-4 !w-24" />
              </div>

              <Skeleton className="!h-12 !rounded-lg" />

              <Skeleton variant="text" className="!w-52 mx-auto !h-4" />

              {/* Dashed divider */}
              <div className="flex items-center gap-3 py-1">
                <span className="flex-1 border-t border-slate-200" />
                <Skeleton variant="text" className="!h-3 !w-28" />
                <span className="flex-1 border-t border-slate-200" />
              </div>

              {/* Google button */}
              <Skeleton className="!h-12 !rounded-lg" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginSkeleton;
