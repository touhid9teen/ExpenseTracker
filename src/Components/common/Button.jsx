import { SpinnerIcon } from "./Icons";

const variants = {
  primary: {
    base: "bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-400 text-white",
    glow: "from-cyan-500/30 to-cyan-400/30",
    loading: "bg-cyan-500/70",
  },
  cyan: {
    base: "bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-white",
    glow: "from-cyan-400/30 to-sky-500/30",
    loading: "bg-cyan-500/70",
  },
};

const sizes = {
  sm: "py-2 px-3 text-sm",
  md: "py-3 px-4 text-sm",
  lg: "py-3.5 px-4",
};

const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  variant = "primary",
  size = "lg",
  icon,
  className = "",
  shimmer = true,
  glow = true,
}) => {
  const v = variants[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative w-full font-bold text-white overflow-hidden group transition-all duration-300 cyber-btn-3d disabled:cursor-not-allowed cyber-cut-sm ${
        disabled && !loading ? 'opacity-50' : ''
      } ${sizes[size]} ${className}`}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          loading ? v.loading : v.base
        }`}
      />
      {/* Neon edge strip along the top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-white/40 to-sky-400 opacity-80" />
      {!loading && shimmer && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      )}
      {!loading && glow && (
        <div
          className={`absolute -inset-1 bg-gradient-to-r ${v.glow} blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />
      )}
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <SpinnerIcon className="w-5 h-5" />
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        <span>{children}</span>
      </span>
    </button>
  );
};

export default Button;
