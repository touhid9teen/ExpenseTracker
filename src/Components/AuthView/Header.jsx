import { FinVueLogoIcon } from '../common/Icons';

const Header = ({ mode }) => (
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-11 h-11 cyber-cut bg-gradient-to-br from-cyan-500 to-sky-500 cyber-3d-sm mb-3">
      <FinVueLogoIcon className="w-6 h-6 text-white" />
    </div>
    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
      {mode === 'login' ? 'Welcome Back' : 'Create Account'}
      <span className="inline-block w-1.5 h-6 cyber-cut-sm bg-gradient-to-b from-cyan-500 to-sky-500" />
    </h2>
    <p className="mt-1.5 text-sm text-slate-500 leading-snug max-w-xs mx-auto">
      {mode === 'login'
        ? 'Hey, enter your details to sign in to your account.'
        : 'Set up your account to start tracking expenses.'}
    </p>
  </div>
);

export default Header;
