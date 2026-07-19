import { FinVueLogoIcon } from '../common/Icons';

const Header = ({ mode }) => (
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25 mb-3">
      <FinVueLogoIcon className="w-6 h-6 text-white" />
    </div>
    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
      {mode === 'login' ? 'Welcome Back' : 'Create Account'}
    </h2>
    <p className="mt-1.5 text-sm text-slate-500 leading-snug max-w-xs mx-auto">
      {mode === 'login'
        ? 'Hey, enter your details to sign in to your account.'
        : 'Set up your account to start tracking expenses.'}
    </p>
  </div>
);

export default Header;
