import Link from 'next/link';

const Footer = () => (
  <p className="text-center mt-5 text-xs text-slate-400">
    Copyright &copy; {new Date().getFullYear()} FinVue{'  '}|{'  '}
    <Link href="/terms" className="hover:underline transition-colors hover:text-amber-600">
      Privacy Policy
    </Link>
  </p>
);

export default Footer;
