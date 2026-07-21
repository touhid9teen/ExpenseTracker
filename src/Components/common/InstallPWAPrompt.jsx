"use client";
import { useEffect, useState } from "react";
import { FinVueLogoIcon, XIcon, ArrowUpIcon } from "./Icons";

const DISMISS_KEY = "finvue-pwa-dismissed";

/**
 * InstallPWAPrompt – a dismissible popup inviting the user to install the
 * FinVue PWA. Relies on the browser's `beforeinstallprompt` event, with a
 * separate hint for iOS Safari (which doesn't fire that event).
 */
const InstallPWAPrompt = ({ darkMode = true }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Already installed / running standalone — never prompt.
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (standalone) return;

    // Respect a previous dismissal.
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const ios =
      /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) &&
      !window.navigator.userAgent.includes("Chrome");

    if (ios) {
      setIsIOS(true);
      setVisible(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, "1");
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setDeferredPrompt(null);
    localStorage.setItem(DISMISS_KEY, "1");
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 inset-x-4 z-[70] flex justify-center sm:bottom-6 sm:inset-x-auto sm:right-6"
      style={{ animation: "fadeSlideUp 0.3s ease-out" }}
    >
      <div
        className={`w-full max-w-sm rounded-2xl border shadow-2xl p-4 flex items-start gap-3 ${
          darkMode
            ? "bg-slate-900 border-slate-800 shadow-black/40"
            : "bg-white border-slate-200 shadow-slate-300/40"
        }`}
        role="dialog"
        aria-label="Install FinVue"
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25 flex-shrink-0">
          <FinVueLogoIcon className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-bold ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Install FinVue
          </h3>
          {isIOS ? (
            <p
              className={`mt-0.5 text-xs leading-relaxed flex items-center flex-wrap gap-1 ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Tap the Share
              <ArrowUpIcon className="w-3.5 h-3.5 inline" strokeWidth={2.5} />
              button, then <span className="font-semibold">Add to Home Screen</span>.
            </p>
          ) : (
            <p
              className={`mt-0.5 text-xs leading-relaxed ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Add the app to your device for a faster, full-screen experience —
              works offline too.
            </p>
          )}

          {!isIOS && (
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all shadow-md shadow-amber-500/25"
              >
                Install
              </button>
              <button
                onClick={dismiss}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  darkMode
                    ? "text-slate-400 hover:bg-slate-800"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                Not now
              </button>
            </div>
          )}
        </div>

        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className={`p-1 rounded-lg transition-colors flex-shrink-0 ${
            darkMode
              ? "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          }`}
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InstallPWAPrompt;
