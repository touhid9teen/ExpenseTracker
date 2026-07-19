"use client";
import toast from 'react-hot-toast';

// Brand glyphs kept inline so the auth view has no extra icon dependency.
const GoogleGlyph = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.75-2.1-6.69-4.93H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.31 14.32a7.2 7.2 0 0 1 0-4.63V6.6H1.29a12 12 0 0 0 0 10.8l4.02-3.08z" />
    <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.12 15.24 0 12 0A11.99 11.99 0 0 0 1.29 6.6l4.02 3.09C6.25 6.85 8.89 4.75 12 4.75z" />
  </svg>
);

const AppleGlyph = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.05 12.54c-.02-2.02 1.65-2.99 1.72-3.04-.94-1.37-2.4-1.56-2.92-1.58-1.24-.13-2.42.73-3.05.73-.63 0-1.6-.71-2.63-.69-1.35.02-2.6.79-3.29 2-1.4 2.43-.36 6.03 1 8.01.67.97 1.46 2.06 2.5 2.02 1-.04 1.38-.65 2.6-.65 1.2 0 1.55.65 2.61.63 1.08-.02 1.76-.99 2.42-1.96.76-1.12 1.08-2.2 1.09-2.26-.02-.01-2.09-.8-2.11-3.18zM15.1 6.24c.55-.67.92-1.6.82-2.53-.79.03-1.75.53-2.32 1.19-.51.59-.96 1.53-.84 2.44.88.07 1.79-.45 2.34-1.1z" />
  </svg>
);

const FacebookGlyph = (props) => (
  <svg viewBox="0 0 24 24" fill="#1877F2" {...props}>
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
  </svg>
);

const providers = [
  { name: 'Google', Glyph: GoogleGlyph },
  { name: 'Apple ID', Glyph: AppleGlyph },
  { name: 'Facebook', Glyph: FacebookGlyph },
];

const SocialButtons = ({ disabled = false }) => {
  const notReady = (name) =>
    toast(`${name} sign-in is coming soon`, { icon: '🔒' });

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {providers.map(({ name, Glyph }) => (
        <button
          key={name}
          type="button"
          disabled={disabled}
          onClick={() => notReady(name)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50"
        >
          <Glyph className="w-4 h-4 shrink-0" />
          <span className="truncate">{name}</span>
        </button>
      ))}
    </div>
  );
};

export default SocialButtons;
