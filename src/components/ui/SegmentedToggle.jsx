// Small segmented pill toggle used by the Statistics charts (Week/Month/Year,
// Daily/Weekly/Monthly). The active segment gets the violet→indigo gradient.
export const SegmentedToggle = ({ options, value, onChange, darkMode, ariaLabel = "View" }) => (
    <div
        role="tablist"
        aria-label={ariaLabel}
        className={`inline-flex p-1 rounded-xl ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}
    >
        {options.map((opt) => {
            const selected = value === opt.key;
            return (
                <button
                    key={opt.key}
                    role="tab"
                    aria-selected={selected}
                    onClick={() => onChange(opt.key)}
                    className={`px-3.5 py-1.5 text-xs sm:text-[13px] font-bold rounded-lg transition-all duration-200 ${
                        selected
                            ? "bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-sm shadow-violet-500/30"
                            : darkMode
                                ? "text-slate-400 hover:text-slate-200"
                                : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    {opt.label}
                </button>
            );
        })}
    </div>
);

export default SegmentedToggle;
