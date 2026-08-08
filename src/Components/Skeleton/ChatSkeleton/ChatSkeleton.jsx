import Skeleton, { panelClass } from "../Skeleton";

/**
 * ChatSkeleton – mirrors the AI assistant (chat / overview) page: the
 * centered welcome header, suggestion cards and the round composer bar.
 * `compact` matches the overview tab's smaller chat height; otherwise it
 * uses the full-page chat height.
 */
const ChatSkeleton = ({ darkMode = false, compact = false }) => (
  <div className="animate-fadeIn" aria-label="Loading chat">
    <div
      className={`flex flex-col ${
        compact
          ? "h-[calc(100dvh-17rem)] min-h-[22rem] lg:h-full lg:min-h-0"
          : "h-[calc(100dvh-10.5rem)] min-h-[26rem] xl:h-[calc(100dvh-9.5rem)]"
      }`}
    >
      {/* Welcome area */}
      <div className="flex-1 overflow-hidden px-4 sm:px-6 py-5 flex flex-col items-center justify-center">
        <Skeleton variant="avatar" darkMode={darkMode} className="!w-14 !h-14 !rounded-2xl mb-4" />
        <Skeleton variant="title" darkMode={darkMode} className="!h-5 !w-56 mb-2" />
        <Skeleton variant="text" darkMode={darkMode} className="!w-72" />

        {/* Suggestion cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl w-full mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border ${panelClass(darkMode)}`}>
              <Skeleton variant="avatar" darkMode={darkMode} className="!w-8 !h-8 !rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <Skeleton variant="text" darkMode={darkMode} className="!h-3 !w-3/4" />
                <Skeleton variant="text" darkMode={darkMode} className="!h-2.5 !w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="px-4 sm:px-6 py-4">
        <div className={`flex items-center gap-1.5 sm:gap-2 rounded-full border pl-2 pr-1.5 py-1.5 ${panelClass(darkMode)}`}>
          <Skeleton variant="avatar" darkMode={darkMode} className="!w-9 !h-9 !rounded-full shrink-0" />
          <Skeleton variant="text" darkMode={darkMode} className="flex-1 !h-4 !rounded-full" />
          <Skeleton variant="avatar" darkMode={darkMode} className="!w-9 !h-9 !rounded-full shrink-0" />
        </div>
      </div>
    </div>
  </div>
);

export default ChatSkeleton;
