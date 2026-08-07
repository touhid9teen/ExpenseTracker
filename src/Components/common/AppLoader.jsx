const AppLoader = ({ darkMode = true }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-700 ${
        darkMode ? "bg-[#060a16] aurora-bg" : "bg-[#f5f7fc] aurora-bg-light"
      }`}
    >
      {/* Logo */}
      <div className="relative mb-6 cyber-3d-sm [--glow-3d:var(--accent-glow-soft)] [--glow-3d-2:var(--violet-glow-soft)]">
        <div className="w-16 h-16 cyber-cut bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-500 flex items-center justify-center">
          <svg
            className="w-9 h-9 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
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
        </div>
        {/* Spinning ring */}
        <div
          className={`absolute -inset-2 rounded-full border-2 border-transparent animate-spin ${
            darkMode ? "border-t-cyan-400 border-r-violet-500" : "border-t-cyan-500 border-r-violet-600"
          }`}
        />
      </div>
    </div>
  );
};

export default AppLoader;
