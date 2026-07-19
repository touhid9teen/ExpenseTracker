import { CheckIcon } from "../common/Icons";
import Button from "../common/Button";

const SuccessModal = ({ username, onContinue }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300">
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={onContinue}
    />
    <div className="relative w-full max-w-sm transition-all duration-300">
      <div className="rounded-2xl p-8 sm:p-10 bg-slate-900 border border-slate-800/80 shadow-2xl shadow-black/40 text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div
            className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse"
            style={{ animationDuration: "3s" }}
          />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <CheckIcon className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Welcome to FinVue!
        </h2>
        <p className="mt-3 text-base text-slate-300 leading-relaxed">
          Your account{" "}
          <span className="font-semibold text-amber-300">@{username}</span>{" "}
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
