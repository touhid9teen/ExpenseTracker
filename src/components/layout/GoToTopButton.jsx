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
      className={`fixed bottom-24 lg:bottom-6 right-4 sm:right-6 z-40 w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/40 ring-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-violet-500/60 active:scale-95 ${
        darkMode ? "ring-[#0d1326]" : "ring-white"
      }`}
    >
      <ArrowUpIcon className="w-5 h-5" strokeWidth={2.5} />
    </button>
  );
});

export default GoToTopButton;
