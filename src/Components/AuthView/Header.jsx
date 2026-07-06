import { FinVueLogoIcon } from '../Icons';

const Header = ({ step }) => (
  <div className="text-center mb-8">
    <div className="relative w-16 h-16 mx-auto mb-5">
      <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
        <FinVueLogoIcon className="w-8 h-8 text-white" />
      </div>
    </div>
    {step === 1 ? (
      <>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Welcome to FinVue</h2>
        <p className="mt-2 text-base text-emerald-300 leading-relaxed max-w-xs mx-auto">
          Your account will be created{" "}
          <span className="font-semibold text-emerald-200">automatically</span>{" "}
          if it doesn&apos;t exist.
        </p>
      </>
    ) : (
      <p className="text-base text-emerald-300 leading-relaxed max-w-xs mx-auto">
        New here? Enter any password<br />
        to{" "}
        <span className="font-semibold text-emerald-200">create your account</span>.
      </p>
    )}
  </div>
);

export default Header;
