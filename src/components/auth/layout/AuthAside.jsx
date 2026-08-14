import Image from "next/image";
import { XIcon } from "../../ui/Icons";
import { LogoMark } from "./Header";
// Retina 2× upscale of the original illustration (see scripts: sharp lanczos3).
import loginArt from "../../../assets/login-view.jpg";

/**
 * AuthAside – the left dashboard-illustration panel (desktop only). The
 * FinVue logo sits in the top-left corner and an optional "Back to app"
 * button appears in the top-right when browsing as a guest (onClose set).
 * object-contain keeps the full illustration visible at every screen size.
 */
const AuthAside = ({ onClose }) => (
  <section className="relative hidden lg:block lg:h-full lg:min-h-[480px] overflow-hidden bg-white">
    <Image
      src={loginArt}
      alt="FinVue dashboard illustration"
      priority
      quality={100}
      sizes="(min-width: 1280px) 50vw, (min-width: 1024px) 50vw, 100vw"
      fill
      className="object-contain select-none pointer-events-none"
    />

    {/* FinVue logo — top-left corner only (no border/pill) */}
    <div className="absolute top-8 left-8 z-10 inline-flex items-center gap-3">
      <LogoMark />
      <span className="text-xl font-extrabold tracking-tight text-[#0F172A] drop-shadow-sm">
        FinVue
      </span>
    </div>

    {/* Back-to-app button (guest browsing mode) — top-right, in-flow
        so it never floats over the brand mark */}
    {onClose && (
      <button
        type="button"
        onClick={onClose}
        className="absolute top-8 right-8 z-10 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 bg-white/90 border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600 backdrop-blur"
      >
        <XIcon className="w-4 h-4" />
        Back to app
      </button>
    )}
  </section>
);

export default AuthAside;
