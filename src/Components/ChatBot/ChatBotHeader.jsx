import { LightningBoltIcon, XIcon } from "../common/Icons";

/**
 * ChatBotHeader – avatar, title, online status dot, and close button.
 *
 * Props:
 *   - darkMode : boolean
 *   - onClose  : () => void
 */
const ChatBotHeader = ({ darkMode, onClose }) => (
  <div
    className={`px-5 py-4 border-b-2 flex items-center justify-between gap-3 flex-shrink-0 ${
      darkMode
        ? "bg-slate-900/90 border-cyan-900/60": "bg-slate-50 border-cyan-200"}`}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 cyber-cut bg-gradient-to-tr from-amber-500 to-cyan-500 flex items-center justify-center shadow-[3px_3px_0px_rgba(34,211,238,0.35)] flex-shrink-0">
        <LightningBoltIcon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3
          className={`font-bold text-base ${darkMode ? "text-white" : "text-slate-800"}`}
        >
          FinVue AI
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 cyber-cut-sm bg-emerald-400 inline-block" />
          <p
            className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            Always here to help
          </p>
        </div>
      </div>
    </div>
    <button
      onClick={onClose}
      aria-label="Close chat"
      className={`p-2 cyber-cut-sm transition-colors border-2 ${
        darkMode
          ? "hover:bg-slate-800 text-slate-400 border-transparent hover:border-cyan-800"
          : "hover:bg-slate-200 text-slate-500 border-transparent hover:border-cyan-300"
      }`}
    >
      <XIcon className="w-4 h-4" />
    </button>
  </div>
);

export default ChatBotHeader;
