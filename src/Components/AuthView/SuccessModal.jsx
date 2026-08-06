import { CheckIcon } from "../common/Icons";
import Button from "../common/Button";

const SuccessModal = ({ username, onContinue }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300">
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-xl"
      onClick={onContinue}
    />
    <div className="relative w-full max-w-sm transition-all duration-300">
      <div className="relative cyber-cut-lg p-8 sm:p-10 bg-slate-950 border-2 border-cyan-700/60 cyber-cut-glow text-center">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-cyan-400 to-sky-400 opacity-70 pointer-events-none" />
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div
            className="absolute inset-0 cyber-cut bg-cyan-500/20 blur-xl animate-pulse"
            style={{ animationDuration: "3s" }}
          />
          <div className="relative w-20 h-20 cyber-cut bg-gradient-to-tr from-cyan-500 to-sky-500 flex items-center justify-center shadow-[4px_4px_0px_var(--accent-glow)]">
            <CheckIcon className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Welcome to FinVue!
        </h2>
        <p className="mt-3 text-base text-slate-300 leading-relaxed">
          Your account{" "}
          <span className="font-semibold text-cyan-300">@{username}</span>{" "}
          has been created successfully. Start tracking your expenses now!
        </p>

        <div className="mt-8">
          <Button onClick={onContinue}>Get Started</Button>
        </div>
      </div>
    </div>
  </div>
);

export default SuccessModal;
