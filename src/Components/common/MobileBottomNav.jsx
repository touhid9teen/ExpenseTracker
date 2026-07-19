import {
  ChartPieIcon,
  PlusIcon,
  ClipboardListIcon,
  InfoCircleIcon,
  XIcon,
  LightningBoltIcon,
} from "./Icons";

const QuickActionsPopover = ({ darkMode, suggestions, onSelect, onClose }) => {
  if (!suggestions?.length) return null;

  return (
    <div
      className={`absolute bottom-full right-0 mb-2 w-64 rounded-2xl border overflow-hidden shadow-2xl z-50 ${
        darkMode
          ? "bg-slate-900 border-slate-700 shadow-black/50"
          : "bg-white border-slate-200 shadow-slate-300/80"
      }`}
    >
      <div
        className={`px-4 py-2.5 border-b flex items-center justify-between ${
          darkMode ? "border-slate-700" : "border-slate-200"
        }`}
      >
        <span
          className={`text-[11px] font-semibold uppercase tracking-widest ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Quick Actions
        </span>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors ${
            darkMode
              ? "hover:bg-slate-700 text-slate-500"
              : "hover:bg-slate-100 text-slate-400"
          }`}
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-0 max-h-72 overflow-y-auto">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(s)}
            className={`flex items-center gap-3 px-4 py-3 text-left transition-all border-b ${
              darkMode
                ? "border-slate-700/50 hover:bg-slate-800"
                : "border-slate-100 hover:bg-slate-50"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconBg}`}
            >
              {s.icon}
            </div>
            <div className="min-w-0">
              <p
                className={`text-xs font-semibold leading-tight truncate ${
                  darkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                {s.label}
              </p>
              <p
                className={`text-[10px] leading-tight truncate mt-0.5 ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {s.sub}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const NavButton = ({
  icon: Icon,
  label,
  isActive,
  darkMode,
  onClick,
  strokeWidth = 2.5,
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
      isActive ? (darkMode ? "text-amber-400" : "text-amber-600") : ""
    }`}
  >
    <Icon className="w-5 h-5" strokeWidth={strokeWidth} />
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

const MobileBottomNav = ({
  darkMode,
  activeTab,
  setActiveTab,
  showQuickAdd,
  setShowQuickAdd,
  showQuickActionsNav,
  setShowQuickActionsNav,
  quickActionSuggestions,
  setPendingAction,
  setChatOpen,
}) => {
  const handleQuickAdd = () => {
    setActiveTab("ledger");
    setShowQuickAdd(true);
    setTimeout(() => {
      const form = document.querySelector("form");
      if (form) form.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleQuickActionSelect = (s) => {
    setShowQuickActionsNav(false);
    setPendingAction(s);
    setChatOpen(true);
  };

  return (
    <div
      className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 px-6 py-2 flex justify-around items-center border-t backdrop-blur-lg shadow-lg ${
        darkMode
          ? "bg-slate-950/90 border-slate-800/80 text-slate-400"
          : "bg-white/85 border-slate-300/80 text-slate-500"
      }`}
    >
      <NavButton
        icon={ChartPieIcon}
        label="Analytics"
        isActive={activeTab === "statistics"}
        darkMode={darkMode}
        onClick={() => setActiveTab("statistics")}
      />

      <NavButton
        icon={ClipboardListIcon}
        label="Ledger"
        isActive={activeTab === "ledger"}
        darkMode={darkMode}
        onClick={() => setActiveTab("ledger")}
      />

      {/* Floating Action Button (FAB) for Quick Add */}
      <button
        onClick={handleQuickAdd}
        className="relative -top-4 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/35 hover:scale-105 active:scale-95 transition-all"
      >
        <PlusIcon className="w-6 h-6" strokeWidth={3} />
      </button>

      {/* Quick Actions Nav Button */}
      <div className="relative" data-quick-actions-nav>
        <NavButton
          icon={LightningBoltIcon}
          label="Quick"
          isActive={showQuickActionsNav}
          darkMode={darkMode}
          onClick={() => setShowQuickActionsNav(!showQuickActionsNav)}
        />

        {showQuickActionsNav && (
          <QuickActionsPopover
            darkMode={darkMode}
            suggestions={quickActionSuggestions}
            onSelect={handleQuickActionSelect}
            onClose={() => setShowQuickActionsNav(false)}
          />
        )}
      </div>

      <NavButton
        icon={InfoCircleIcon}
        label="About"
        isActive={activeTab === "about"}
        darkMode={darkMode}
        onClick={() => setActiveTab("about")}
      />
    </div>
  );
};

export default MobileBottomNav;
