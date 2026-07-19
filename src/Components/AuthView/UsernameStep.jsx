import { forwardRef } from "react";
import { ArrowRightIcon } from "../common/Icons";
import Button from "../common/Button";

const UsernameStep = (
  { username, setUsername, onSubmit, visible, isLoading },
  ref
) => (
  <div
    className={`transition-all duration-300 ${
      visible
        ? "opacity-100 scale-100"
        : "opacity-0 scale-95 absolute inset-x-8 sm:inset-x-10 pointer-events-none"
    }`}
  >
    <form onSubmit={onSubmit} className={visible ? "" : "hidden"}>
      <input
        ref={ref}
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        autoComplete="username"
        disabled={isLoading}
        className="w-full px-5 py-4 rounded-xl bg-slate-800 border-2 border-slate-500/50 text-white placeholder-slate-300 hover:border-slate-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-slate-700/80 transition-all duration-200 text-base disabled:opacity-50"
      />
      <div className="mt-5">
        <Button
          type="submit"
          loading={isLoading}
          icon={<ArrowRightIcon className="w-4 h-4" strokeWidth={2.5} />}
        >
          Continue
        </Button>
      </div>
    </form>
  </div>
);

export default forwardRef(UsernameStep);
