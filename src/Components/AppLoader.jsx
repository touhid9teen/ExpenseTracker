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
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M9 7.5h6M9 7.5v9M9 12h4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {/* Spinning ring */}
        <div
          className={`absolute -inset-2 rounded-full border-2 border-transparent border-t-emerald-400 animate-spin ${
            darkMode ? "border-t-emerald-400" : "border-t-emerald-500"
          }`}
        />
      </div>
    </div>
  );
};

export default AppLoader;
