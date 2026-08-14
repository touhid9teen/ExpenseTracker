"use client";

import { memo, useEffect, useState } from "react";
import { ArrowUpIcon } from "../ui/Icons";

/**
 * GoToTopButton – floating "back to top" control. Appears once the page is
 * scrolled down and smooth-scrolls to the top on click.
 *
 * Props:
 *   - darkMode : boolean
 */
const GoToTopButton = memo(function GoToTopButton({ darkMode }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-4 sm:right-6 z-40 w-11 h-11 cyber-cut flex items-center justify-center border-2 transition-all duration-200 hover:-translate-y-1 active:scale-95 cyber-3d-sm ${
        darkMode
          ? "bg-slate-900 border-cyan-700/70 text-cyan-400 hover:border-violet-500/70 hover:text-violet-300 [--glow-3d:var(--accent-glow-soft)]"
          : "bg-white border-cyan-300 text-cyan-600 hover:border-violet-400 hover:text-violet-600"
      }`}
    >
      <ArrowUpIcon className="w-5 h-5" strokeWidth={2.5} />
    </button>
  );
});

export default GoToTopButton;
