"use client";

const AppLoader = ({ darkMode = true }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-700 ${
        darkMode ? "bg-[#0b0f19]" : "bg-[#f8fafc]"
      }`}
    >
      {/* Logo */}
      <div className="relative mb-6">
        <svg
          className="w-16 h-16 text-emerald-400"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8.5 7h7M8.5 7v10M8.5 12h5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 14l-2.5-3-2 1.5L10 9l-2 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
        </svg>
        {/* Spinning ring */}
        <div
          className={`absolute -inset-2 rounded-full border-2 border-transparent border-t-emerald-400 animate-spin ${
            darkMode ? "border-t-emerald-400" : "border-t-emerald-500"
          }`}
        />
      </div>

      {/* App name */}
      <h1
        className={`text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent`}
      >
        FinVue
      </h1>
      <p
        className={`mt-2 text-sm font-medium ${
          darkMode ? "text-slate-500" : "text-slate-400"
        }`}
      >
        Loading your expense dashboard...
      </p>
    </div>
  );
};

export default AppLoader;
