"use client";
import toast from 'react-hot-toast';

// Google G glyph kept inline so the auth view has no extra icon dependency.
const GoogleGlyph = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.75-2.1-6.69-4.93H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.31 14.32a7.2 7.2 0 0 1 0-4.63V6.6H1.29a12 12 0 0 0 0 10.8l4.02-3.08z" />
    <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.12 15.24 0 12 0A11.99 11.99 0 0 0 1.29 6.6l4.02 3.09C6.25 6.85 8.89 4.75 12 4.75z" />
  </svg>
);

// Single full-width Google button matching the sign-in mockup (white, thin
// light-gray border, rounded, Google G + label).
const SocialButtons = ({ disabled = false, text = 'Login with Google' }) => {
  const notReady = () =>
    toast('Google sign-in is coming soon', { icon: '🔒' });

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={notReady}
      className="flex items-center justify-center gap-2.5 w-full py-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-violet-50/60 hover:border-violet-300 hover:text-violet-700 hover:shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
    >
      <GoogleGlyph className="w-5 h-5 shrink-0" />
      <span>{text}</span>
    </button>
  );
};

export default SocialButtons;
