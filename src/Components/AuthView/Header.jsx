import { FinVueLogoIcon } from '../common/Icons';

const Header = ({ step, isExistingUser }) => (
  <div className="text-center -mx-8 sm:-mx-10 -mt-8 sm:-mt-10 px-8 sm:px-10 pt-8 sm:pt-10 pb-8 rounded-t-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
    <div className="relative w-14 h-14 mx-auto mb-4">
      <div className="absolute inset-0 rounded-2xl bg-slate-900/30 blur-xl animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="relative w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center shadow-lg shadow-black/20">
        <FinVueLogoIcon className="w-7 h-7 text-white" />
      </div>
    </div>
    {step === 1 ? (
      <>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome to FinVue</h2>
        <p className="mt-2 text-sm font-bold text-slate-800 leading-relaxed max-w-xs mx-auto">
          Enter your username to get started.
        </p>
      </>
    ) : isExistingUser ? (
      <>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
        <p className="mt-2 text-sm font-bold text-slate-800 leading-relaxed max-w-xs mx-auto">
          Enter your password to sign in.
        </p>
      </>
    ) : (
      <>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
        <p className="mt-2 text-sm font-bold text-slate-800 leading-relaxed max-w-xs mx-auto">
          Create a password and set up account recovery.
        </p>
      </>
    )}
  </div>
);

export default Header;
