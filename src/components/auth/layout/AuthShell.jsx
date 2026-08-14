import { XIcon } from "../../ui/Icons";
import AuthAside from "./AuthAside";
import Footer from "./Footer";
import Header, { LogoMark } from "./Header";

/**
 * AuthShell – the full-screen light layout wrapping the auth card: mobile
 * brand bar on top, dashboard illustration on the left (desktop), and the
 * sign-in / sign-up card on the right. Children render inside the card.
 */
const AuthShell = ({ mode, onClose, children }) => (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-white lg:bg-[#F5F4FB]">
    {/* Centered shell — constrains the split into a single elevated card
        so the image and the form sit close together in the middle of the
        viewport instead of hugging the far edges (desktop only). */}
    <div className="relative min-h-full lg:flex lg:items-center lg:justify-center lg:p-6 xl:p-10">
      <div className="relative w-full lg:grid lg:grid-cols-2 lg:max-w-5xl lg:overflow-hidden lg:rounded-3xl lg:bg-white lg:ring-1 lg:ring-slate-900/5 lg:shadow-[0_24px_80px_-24px_rgba(76,29,149,0.25)]">
        {/* Mobile brand bar (back button is in-flow so it never overlaps
            the logo) */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 bg-white/90 backdrop-blur px-4 py-3 border-b border-slate-100">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 hover:border-violet-300 hover:text-violet-600"
            >
              <XIcon className="w-3.5 h-3.5" />
              Back
            </button>
          )}
          <LogoMark />
          <span className="text-lg font-extrabold tracking-tight text-[#0F172A]">
            FinVue
          </span>
        </div>

        {/* Left: dashboard image (desktop only) */}
        <AuthAside onClose={onClose} />

        {/* Right: centered white sign-in / sign-up card */}
        <section className="flex items-center justify-center bg-white px-4 sm:px-8 py-10">
          <div className="w-full max-w-md">
            <Header mode={mode} />
            <div className="mt-8">{children}</div>
            <Footer />
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default AuthShell;
