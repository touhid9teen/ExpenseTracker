import Link from 'next/link';

const Footer = () => (
  <p className="text-center mt-4 text-[10px]">
    <Link href="/terms" className="hover:underline transition-colors text-slate-500 hover:text-emerald-400">
      Terms &amp; Conditions
    </Link>
  </p>
);

export default Footer;
