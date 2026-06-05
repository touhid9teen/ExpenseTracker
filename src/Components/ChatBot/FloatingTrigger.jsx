import React from "react";
import { XIcon, ChatBubbleIcon } from "../Icons";

/**
 * FloatingTrigger – the FAB button and "Ask AI" tooltip bubble.
 *
 * Props:
 *   - isOpen           : boolean – whether the chat window is visible
 *   - onToggle         : () => void – toggle chat open/close
 *   - darkMode         : boolean
 *   - tooltipDismissed : boolean – whether the tooltip has been dismissed
 *   - onDismissTooltip : () => void – dismisses the tooltip
 */
const FloatingTrigger = ({ isOpen, onToggle, darkMode, tooltipDismissed, onDismissTooltip }) => (
  <div
    className="fixed sm:bottom-8 sm:right-8 bottom-[90px] right-4 z-[60]
                  flex flex-col items-end gap-3"
  >
    {!isOpen && !tooltipDismissed && (
      <div className="flex flex-col items-end animate-[floatIn_0.35s_ease_both]">
        <div
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-[14px]
                         shadow-lg relative
                         ${
                           darkMode
                             ? "bg-zinc-900 border border-zinc-700"
                             : "bg-white border border-zinc-200"
                         }`}
        >
          {/* Dismiss button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismissTooltip();
            }}
            aria-label="Dismiss tooltip"
            className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center
              cursor-pointer z-10
              ${
                darkMode
                  ? "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                  : "bg-zinc-200 text-zinc-500 hover:bg-zinc-300"
              }
            `}
          >
            <XIcon className="w-3 h-3" strokeWidth={2.5} />
          </button>

          <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
          <div>
            <p
              className={`text-[13px] font-medium leading-none
                           ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}
            >
              Ask AI
            </p>
            <p
              className={`text-[11px] mt-0.5
                           ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}
            >
              How can I help?
            </p>
          </div>
          <span
            className={`absolute -bottom-[6px] right-5 w-2.5 h-2.5 rotate-45
                             ${
                               darkMode
                                 ? "bg-zinc-900 border-r border-b border-zinc-700"
                                 : "bg-white border-r border-b border-zinc-200"
                             }`}
          />
        </div>
      </div>
    )}

    <div className="relative">
      {!isOpen && (
        <span
          className="pointer-events-none absolute inset-[-4px] rounded-full
                          border-[1.5px] border-violet-400/40
                          animate-[ringPulse_3s_ease-in-out_infinite]"
        />
      )}
      <button
        onClick={onToggle}
        type="button"
        className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center
                    transition-transform duration-200 hover:scale-105 active:scale-95
                    ${
                      isOpen
                        ? "bg-rose-600 hover:bg-rose-700"
                        : "bg-violet-600 hover:bg-violet-700"
                    }`}
        aria-label="Toggle AI chat"
      >
        {isOpen ? <FloatingXIcon /> : <ChatIcon />}
      </button>
    </div>
  </div>
);

const FloatingXIcon = () => (
  <XIcon className="w-6 h-6 text-white" strokeWidth={2.5} />
);

const ChatIcon = () => (
  <ChatBubbleIcon className="w-6 h-6 text-white" strokeWidth={2.5} />
);

export default FloatingTrigger;
