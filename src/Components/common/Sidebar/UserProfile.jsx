"use client";

import { ChevronDownIcon } from "../Icons";

/**
 * UserProfile – signed-in user avatar + name/email footer row.
 */
const UserProfile = ({ darkMode, user }) => (
  <div
    className={`px-4 py-4 border-t flex items-center gap-3 ${
      darkMode ? "border-slate-800" : "border-[#EBEBEC]"
    }`}
  >
    <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
      {user.username?.charAt(0).toUpperCase() || "?"}
    </div>
    <div className="min-w-0 flex-1">
      <p
        className={`text-sm font-bold truncate ${
          darkMode ? "text-white" : "text-slate-900"
        }`}
      >
        {user.username}
      </p>
      <p
        className={`text-xs truncate ${
          darkMode ? "text-slate-500" : "text-slate-400"
        }`}
      >
        {user.email || "user@finvue.app"}
      </p>
    </div>
    <ChevronDownIcon
      className={`w-4 h-4 shrink-0 ${
        darkMode ? "text-slate-500" : "text-slate-400"
      }`}
    />
  </div>
);

export default UserProfile;
