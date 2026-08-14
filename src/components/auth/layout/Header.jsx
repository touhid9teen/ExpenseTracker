/** FinVue logo mark — purple hexagonal icon, same mark as the app sidebar.
 *  Used only in the top-left corner of the auth page (not in the form card). */
export const LogoMark = () => (
  <div className="w-11 h-11 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30">
    <svg viewBox="0 0 20 20" className="w-6 h-6 text-white" fill="currentColor" aria-hidden="true">
      <path d="M7 0l2.4 4.6L14 7l-4.6 2.4L7 14l-2.4-4.6L0 7l4.6-2.4L7 0z" />
      <path d="M15.5 0l1.35 3.15L20 4.5l-3.15 1.35L15.5 9l-1.35-3.15L11 4.5l3.15-1.35L15.5 0z" />
    </svg>
  </div>
);

/**
 * Header – the sign-in card header: title ("Welcome to FinVue") and a muted
 * subtitle. No logo here — the FinVue mark lives in the top-left corner only.
 */
const Header = ({ mode }) => (
  <div className="text-center">
    <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
      Welcome to FinVue
    </h2>
    <p className="mt-2 text-sm text-slate-500">
      {mode === 'login'
        ? 'Sign in to access your secure dashboard.'
        : 'Sign up to create your secure account.'}
    </p>
  </div>
);

export default Header;
