import { FinVueLogoIcon } from '../Icons';

const Header = ({ step, username }) => (
  <div className="text-center mb-8">
    <div className="relative w-16 h-16 mx-auto mb-5">
      <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
        <FinVueLogoIcon className="w-8 h-8 text-white" />
      </div>
    </div>
    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Welcome to FinVue</h2>
    <p className="mt-2 text-sm text-slate-400">
      {step === 1 ? 'Enter your username to get started' : `Welcome back, ${username}`}
    </p>
  </div>
);

export default Header;
