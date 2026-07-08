import { SpinnerIcon } from "./Icons";

const variants = {
  primary: {
    base: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white",
    glow: "from-emerald-500/30 to-teal-500/30",
    loading: "bg-emerald-500/70",
  },
};

const sizes = {
  sm: "py-2 px-3 text-sm rounded-lg",
  md: "py-3 px-4 text-sm rounded-xl",
  lg: "py-3.5 px-4 rounded-xl",
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
      className={`relative w-full font-bold text-white overflow-hidden group transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed ${sizes[size]} ${className}`}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          loading ? v.loading : v.base
        }`}
      />
      {!loading && shimmer && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}
      {!loading && glow && (
        <div
          className={`absolute -inset-1 bg-gradient-to-r ${v.glow} rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
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
