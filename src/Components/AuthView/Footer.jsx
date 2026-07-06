import Link from 'next/link';

const Footer = () => (
  <p className="text-center mt-4 text-xs">
    <Link href="/terms" className="hover:underline transition-colors text-slate-400 hover:text-emerald-400">
      Terms &amp; Conditions
    </Link>
  </p>
);

export default Footer;
