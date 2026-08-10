import InsightsRail from "../AIAssistant/InsightsRail";

/**
 * InsightsRailSide – the AI insights rail (desktop only) shown on the
 * finance tabs. Hidden on About / Admin and while chat is fullscreen, so it
 * never fights the composer for space.
 */
const InsightsRailSide = ({ props, isOverview, isChat, chatExpanded }) => {
  if (
    props.isAuthLoading ||
    (isChat && chatExpanded) ||
    props.activeTab === "about" ||
    props.activeTab === "admin"
  ) {
    return null;
  }

  return (
    <aside
      className={`hidden xl:block w-80 shrink-0 ${
        isOverview ? "lg:min-h-0" : ""
      }`}
    >
      {/* On the Command Center tab the rail stays fixed with its own
          internal scroll */}
      <div className={isOverview ? "h-full overflow-y-auto no-scrollbar" : ""}>
        <InsightsRail
          darkMode={props.darkMode}
          expenses={props.expenses}
          recentQueries={props.recentQueries}
          setActiveTab={props.setActiveTab}
          setPendingAction={props.setPendingAction}
        />
      </div>
    </aside>
  );
};

export default InsightsRailSide;
