import { CheckIcon } from "../../ui/Icons";
import Button from "../../ui/Button";

const SuccessModal = ({ username, onContinue }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300">
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-xl"
      onClick={onContinue}
    />      <div className="relative w-full max-w-sm transition-all duration-300">
      <div className="relative rounded-2xl p-8 sm:p-10 bg-white border border-slate-200 shadow-2xl text-center">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 opacity-70 pointer-events-none" />
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div
            className="absolute inset-0 rounded-2xl bg-violet-500/15 blur-xl animate-pulse"
            style={{ animationDuration: "3s" }}
          />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <CheckIcon className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome to FinVue!
        </h2>
        <p className="mt-3 text-base text-slate-500 leading-relaxed">
          Your account{" "}
          <span className="font-semibold text-violet-600">@{username}</span>{" "}
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
