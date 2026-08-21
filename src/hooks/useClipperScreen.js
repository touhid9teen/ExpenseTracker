import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ChatSkeleton from "../components/skeletons/ChatSkeleton/ChatSkeleton";
import StatisticsSkeleton from "../components/skeletons/StatisticsSkeleton/StatisticsSkeleton";
import LedgerSkeleton from "../components/skeletons/LedgerSkeleton/LedgerSkeleton";
import AboutSkeleton from "../components/skeletons/AboutSkeleton/AboutSkeleton";
import AdminSkeleton from "../components/skeletons/AdminSkeleton/AdminSkeleton";

const useClipperScreen = (props) => {
  const [showAuth, setShowAuth] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [newChatSignal, setNewChatSignal] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [tabTransitioning, setTabTransitioning] = useState(false);
  const firstRenderRef = useRef(true);

  const { activeTab } = props;
  const isOverview = activeTab === "overview";
  const isChat = activeTab === "chat";

  // A brief per-tab skeleton plays on every tab switch (the first render is
  // skipped because the shell already shows the active tab's skeleton while
  // the session loads); it stays up longer while that tab's data is genuinely
  // still loading (fresh fetch with nothing cached yet). Cached content
  // renders instantly — no flash.
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    setTabTransitioning(true);
    const t = setTimeout(() => setTabTransitioning(false), 300);
    return () => clearTimeout(t);
  }, [activeTab]);

  const hasExpenses = (props.expenses?.length ?? 0) > 0;
  const hasAdminData =
    (props.users?.length ?? 0) > 0 || (props.allExpenses?.length ?? 0) > 0;

  const showPageSkeleton =
    props.isAuthLoading ||
    tabTransitioning ||
    (activeTab === "statistics" && props.isExpensesLoading && !hasExpenses) ||
    (activeTab === "ledger" && props.isExpensesLoading && !hasExpenses) ||
    (activeTab === "admin" && props.isAdminLoading && !hasAdminData);

  const pageSkeleton = {
    chat: <ChatSkeleton darkMode={props.darkMode} />,
    overview: <ChatSkeleton darkMode={props.darkMode} compact={isOverview} />,
    statistics: <StatisticsSkeleton darkMode={props.darkMode} />,
    ledger: <LedgerSkeleton darkMode={props.darkMode} />,
    about: <AboutSkeleton darkMode={props.darkMode} />,
    admin: <AdminSkeleton darkMode={props.darkMode} adminTab={props.adminTab} />,
  }[activeTab];

  // Close the auth overlay as soon as a session is established.
  const handleSetUser = (user) => {
    props.setUser(user);
    if (user) setShowAuth(false);
  };

  const handleLogout = async () => {
    const loggedOut = await props.handleLogout();
    if (!loggedOut) return;
    props.setActiveTab("chat");
    setMobileSidebarOpen(false);
    window.location.href = "/login";
  };

  // Guests can browse (AI chat + layout) but must log in to mutate data.
  const guardedSetShowQuickAdd = (next) => {
    if (next && !props.user) {
      toast.error("Please log in to add expenses.");
      setShowAuth(true);
      return;
    }
    props.setShowQuickAdd(next);
  };

  const commandCenterProps = {
    darkMode: props.darkMode,
    activeTab,
    setActiveTab: props.setActiveTab,
    setShowQuickAdd: guardedSetShowQuickAdd,
    setPendingAction: props.setPendingAction,
    isAdmin: !!props.user?.isAdmin,
  };

  return {
    activeTab,
    isOverview,
    isChat,
    showAuth,
    setShowAuth,
    chatExpanded,
    setChatExpanded,
    newChatSignal,
    setNewChatSignal,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    showPageSkeleton,
    pageSkeleton,
    handleSetUser,
    handleLogout,
    guardedSetShowQuickAdd,
    commandCenterProps,
  };
};

export default useClipperScreen;
