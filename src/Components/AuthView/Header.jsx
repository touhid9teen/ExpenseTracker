import { FinVueLogoIcon } from '../common/Icons';

const Header = ({ mode }) => (
  <div className="text-center -mx-5 sm:-mx-8 -mt-5 sm:-mt-8 px-5 sm:px-8 pt-5 sm:pt-8 pb-5 sm:pb-6 rounded-t-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
    <div className="relative w-11 h-11 sm:w-14 sm:h-14 mx-auto mb-3">
      <div className="absolute inset-0 rounded-2xl bg-slate-900/30 blur-xl animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center shadow-lg shadow-black/20">
        <FinVueLogoIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </div>
    </div>
    {mode === 'login' ? (
      <>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Welcome Back</h2>
        <p className="mt-1.5 text-xs sm:text-sm font-medium text-white/85 leading-relaxed max-w-xs mx-auto">
          Sign in to manage your expenses.
        </p>
      </>
    ) : (
      <>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Create Account</h2>
        <p className="mt-1.5 text-xs sm:text-sm font-medium text-white/85 leading-relaxed max-w-xs mx-auto">
          Track your finances with style.
        </p>
      </>
    )}
  </div>
);

export default Header;
