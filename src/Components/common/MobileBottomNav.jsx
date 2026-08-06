import { memo, useRef, useEffect, useState } from "react";
import {
  ChartPieIcon,
  PlusIcon,
  ClipboardListIcon,
  InfoCircleIcon,
  XIcon,
  LightningBoltIcon,
  ShieldCheckIcon,
} from "./Icons";

const QuickActionsPopover = memo(function QuickActionsPopover({ darkMode, suggestions, onSelect, onClose }) {
  if (!suggestions?.length) return null;

  return (
    <div
      className={`absolute bottom-full right-0 mb-3 w-64 border-2 overflow-hidden shadow-2xl z-50 cyber-cut ${
        darkMode
          ? "bg-slate-950 border-cyan-800/60 shadow-black/60"
          : "bg-white border-cyan-300 shadow-slate-300/80"
      }`}
    >
      <div
        className={`px-4 py-2.5 border-b-2 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-cyan-500/10 ${
          darkMode ? "border-cyan-900/60" : "border-cyan-200"
        }`}
      >
        <span
          className={`text-[11px] font-semibold uppercase tracking-widest ${
            darkMode ? "text-cyan-400" : "text-cyan-600"
          }`}
        >
          Quick Actions
        </span>
        <button
          onClick={onClose}
          className={`p-1 transition-colors ${
            darkMode
              ? "hover:bg-slate-800 text-slate-400"
              : "hover:bg-slate-100 text-slate-500"
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
                ? "border-slate-800 hover:bg-slate-900"
                : "border-slate-100 hover:bg-slate-50"
            }`}
          >
            <div
              className={`w-8 h-8 cyber-cut-sm flex items-center justify-center flex-shrink-0 ${s.iconBg}`}
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
});

// The liquid pill indicator slides between dock items. We measure the active
// button's offset so the pill can morph under it.
const DockButton = ({ icon: Icon, label, isActive, darkMode, onClick, buttonRef }) => (
  <button
    ref={buttonRef}
    onClick={onClick}
    className={`relative z-10 flex flex-col items-center gap-1 py-2.5 px-3.5 transition-all duration-200 ${
      isActive
        ? darkMode ? "text-white" : "text-slate-900"
        : darkMode ? "text-slate-400 hover:text-cyan-300" : "text-slate-500 hover:text-cyan-600"
    }`}
  >
    <Icon className="w-5 h-5" strokeWidth={2.5} />
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

const MobileBottomNav = memo(function MobileBottomNav({
  darkMode,
  activeTab,
  setActiveTab,
  setShowQuickAdd,
  showQuickActionsNav,
  setShowQuickActionsNav,
  quickActionSuggestions,
  setPendingAction,
  setChatOpen,
  isAdmin,
}) {
  const dockRef = useRef(null);
  const btnRefs = useRef({});
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });

  const tabs = [
    { key: "statistics", label: "Stats", icon: ChartPieIcon },
    { key: "ledger", label: "Ledger", icon: ClipboardListIcon },
    { key: "about", label: "About", icon: InfoCircleIcon },
    ...(isAdmin ? [{ key: "admin", label: "Admin", icon: ShieldCheckIcon }] : []),
  ];

  // Keep the liquid pill under the active tab. Re-measure on resize so the
  // pill stays aligned when the viewport (or dock) changes width.
  useEffect(() => {
    const measure = () => {
      const btn = btnRefs.current[activeTab];
      const dock = dockRef.current;
      if (btn && dock) {
        const dockRect = dock.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        setPill({
          left: btnRect.left - dockRect.left,
          width: btnRect.width,
          visible: true,
        });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [activeTab, isAdmin, darkMode]);

  const handleQuickAdd = () => {
    setShowQuickAdd(true);
  };

  const handleQuickActionSelect = (s) => {
    setShowQuickActionsNav(false);
    setPendingAction(s);
    setChatOpen(true);
  };

  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 px-2 py-1.5 flex items-center gap-1 border-2 backdrop-blur-xl shadow-2xl ${
        darkMode
          ? "bg-slate-950/90 border-cyan-900/60 shadow-black/60"
          : "bg-white/90 border-cyan-300/70 shadow-slate-400/40"
      }`}
      ref={dockRef}
      data-cyber-dock
    >
      {/* Liquid indicator pill */}
      <span
        className="liquid-pill"
        style={{
          left: pill.left,
          width: pill.width,
          opacity: pill.visible ? 1 : 0,
          transform: pill.visible ? "translateX(0)" : "translateX(-8px)",
        }}
      />

      {tabs.map((tab) => (
        <DockButton
          key={tab.key}
          icon={tab.icon}
          label={tab.label}
          isActive={activeTab === tab.key}
          darkMode={darkMode}
          onClick={() => setActiveTab(tab.key)}
          buttonRef={(el) => {
            btnRefs.current[tab.key] = el;
          }}
        />
      ))}

      {/* Floating Action Button (FAB) for Quick Add */}
      <button
        onClick={handleQuickAdd}
        aria-label="Add expense"
        className="relative z-10 mx-1 -my-3 w-12 h-12 cyber-cut bg-gradient-to-tr from-cyan-500 to-sky-500 text-white flex items-center justify-center shadow-[0_0_20px_var(--accent-glow-strong)] hover:scale-110 active:scale-95 transition-all"
      >
        <PlusIcon className="w-6 h-6" strokeWidth={3} />
      </button>

      {/* Quick Actions Nav Button */}
      <div className="relative z-10" data-quick-actions-nav>
        <button
          onClick={() => setShowQuickActionsNav(!showQuickActionsNav)}
          className={`flex flex-col items-center gap-1 py-2.5 px-3.5 transition-all duration-200 ${
            showQuickActionsNav
              ? darkMode ? "text-white" : "text-slate-900"
              : darkMode ? "text-slate-400 hover:text-cyan-300" : "text-slate-500 hover:text-cyan-600"
          }`}
        >
          <LightningBoltIcon className="w-5 h-5" strokeWidth={2.5} />
          <span className="text-[10px] font-bold">Quick</span>
        </button>

        {showQuickActionsNav && (
          <QuickActionsPopover
            darkMode={darkMode}
            suggestions={quickActionSuggestions}
            onSelect={handleQuickActionSelect}
            onClose={() => setShowQuickActionsNav(false)}
          />
        )}
      </div>
    </div>
  );
});

export default MobileBottomNav;
