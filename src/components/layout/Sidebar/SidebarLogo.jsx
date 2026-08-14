"use client";

import { XIcon } from "../../ui/Icons";

/**
 * SidebarLogo – brand mark + wordmark, with an optional close button
 * (only shown on the mobile drawer).
 */
const SidebarLogo = ({ darkMode, withClose = false, onCloseMobile }) => (
  <div className="flex items-center gap-3 px-6 pt-6 pb-5">
    <div className="w-10 h-10 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 20 20" className="w-6 h-6 text-white" fill="currentColor" aria-hidden="true">
        <path d="M7 0l2.4 4.6L14 7l-4.6 2.4L7 14l-2.4-4.6L0 7l4.6-2.4L7 0z" />
        <path d="M15.5 0l1.35 3.15L20 4.5l-3.15 1.35L15.5 9l-1.35-3.15L11 4.5l3.15-1.35L15.5 0z" />
      </svg>
    </div>
    <span
      className={`text-xl font-extrabold tracking-tight ${
        darkMode ? "text-white" : "text-[#1E1B4B]"
      }`}
    >
      FinVue
    </span>
    {withClose && (
      <button
        onClick={onCloseMobile}
        aria-label="Close navigation menu"
        className={`ml-auto p-2 rounded-lg transition-colors ${
          darkMode
            ? "text-slate-400 hover:bg-slate-800 hover:text-white"
            : "text-slate-400 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <XIcon className="w-5 h-5" strokeWidth={2.25} />
      </button>
    )}
  </div>
);

export default SidebarLogo;
