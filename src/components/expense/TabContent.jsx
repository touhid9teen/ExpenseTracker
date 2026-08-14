"use client";
import dynamic from "next/dynamic";
import { loadThemePreference } from "../../utils/storageUtils";
import AboutView from "../about/AboutView";
import AdminView from "../admin/AdminView";
import AIAssistant from "../chat/AIAssistant/AIAssistant";
import CommandCenter from "../chat/CommandCenter";
import LedgerView from "../ledger/LedgerView";
import StatisticsSkeleton from "../skeletons/StatisticsSkeleton/StatisticsSkeleton";

const StatisticsView = dynamic(
  () => import("../statistics/StatisticsView"),
  {
    // The dynamic chunk only loads once at app boot; use the persisted theme
    // so the brief fallback matches the active theme.
    loading: () => <StatisticsSkeleton darkMode={loadThemePreference()} />,
  }
);

/**
 * TabContent – the active tab's page content: the command cards (Command
 * Center tab only), the per-tab skeleton while switching/loading, and the
 * Statistics / Ledger / About / Admin views. The AI assistant stays mounted
 * below so the conversation persists across tabs.
 */
const TabContent = ({
  props,
  isOverview,
  isChat,
  showPageSkeleton,
  pageSkeleton,
  newChatSignal,
  commandCenterProps,
}) => (
  <>
    {/* Nav cards row — Command Center tab only, desktop only. On small
        screens navigation lives in the bottom nav + collapsible sidebar. */}
    {isOverview && !props.isAuthLoading && (
      <div className="hidden lg:block shrink-0">
        <CommandCenter {...commandCenterProps} />
      </div>
    )}

    <div
      className={`mt-6 space-y-8 sm:space-y-10 ${
        isOverview ? "lg:flex-1 lg:min-h-0" : ""
      }`}
    >
      {/* The Command Center tab shows the command buttons + AI chat only;
          the analysis & transaction table live on their own tabs. Each tab
          shows its own page skeleton while switching / loading. */}
      {showPageSkeleton && pageSkeleton}

      {/* Always mounted (CSS-hidden when inactive) so chart state survives
          section switches. */}
      <StatisticsView
        {...props}
        visible={!showPageSkeleton && props.activeTab === "statistics"}
      />

      {!showPageSkeleton && props.activeTab === "ledger" && (
        <LedgerView {...props} />
      )}

      {!showPageSkeleton && props.activeTab === "about" && (
        <AboutView
          darkMode={props.darkMode}
          setActiveTab={props.setActiveTab}
        />
      )}

      {!!props.user?.isAdmin &&
        props.activeTab === "admin" &&
        !showPageSkeleton && <AdminView {...props} />}

      {/* AI assistant — full page on the chat tab, and kept on the Command
          Center tab below the command buttons (kept mounted so the
          conversation persists). */}
      <AIAssistant
        darkMode={props.darkMode}
        user={props.user}
        expenses={props.expenses}
        addExpenseDirect={props.addExpenseDirect}
        updateExpenseDirect={props.updateExpenseDirect}
        deleteExpenseDirect={props.deleteExpenseDirect}
        setActiveTab={props.setActiveTab}
        pendingAction={props.pendingAction}
        setPendingAction={props.setPendingAction}
        pushRecentQuery={props.pushRecentQuery}
        resetSignal={newChatSignal}
        visible={!showPageSkeleton && (isChat || isOverview)}
        compact={isOverview}
      />
    </div>
  </>
);

export default TabContent;
