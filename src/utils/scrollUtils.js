// Shared "scroll to top" helper for the fixed dashboard shell.
//
// At lg+ the app is a fixed-height shell and an inner `#app-scroll` div is the
// scroll container; below lg the window scrolls as usual. Scrolling BOTH the
// container and the window is safe — whichever isn't the active scroller is a
// harmless no-op — so callers don't need to know which layout is active.

export const APP_SCROLL_ID = "app-scroll";

export const scrollAppToTop = () => {
  if (typeof document !== "undefined") {
    document.getElementById(APP_SCROLL_ID)?.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
