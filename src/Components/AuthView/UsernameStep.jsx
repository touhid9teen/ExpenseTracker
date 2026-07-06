import { forwardRef } from "react";
import { ArrowRightIcon } from "../Icons";
import Button from "../Button";

const UsernameStep = (
  { username, setUsername, onSubmit, visible },
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
        className="w-full px-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-700 transition-all duration-200 text-base"
      />
      <div className="mt-5">
        <Button
          type="submit"
          icon={<ArrowRightIcon className="w-4 h-4" strokeWidth={2.5} />}
        >
          Continue
        </Button>
      </div>
    </form>
  </div>
);

export default forwardRef(UsernameStep);
