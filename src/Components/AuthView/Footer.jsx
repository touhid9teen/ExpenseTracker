import Link from 'next/link';

const Footer = ({ step }) => (
  <>
    <p className="text-center mt-6 text-xs text-slate-500">
      {step === 1
        ? "If the username doesn't exist, a new account will be created automatically."
        : "New here? Enter any password to create your account."
      }
    </p>
    <p className="text-center mt-4 text-[10px]">
      <Link href="/terms" className="hover:underline transition-colors text-slate-500 hover:text-emerald-400">
        Terms &amp; Conditions
      </Link>
    </p>
  </>
);

export default Footer;
