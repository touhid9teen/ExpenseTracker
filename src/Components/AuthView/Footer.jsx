import Link from 'next/link';

/**
 * Footer – small centered Privacy Policy link below the sign-in card,
 * matching the mockup.
 */
const Footer = () => (
  <p className="text-center mt-6 text-xs text-slate-400">
    <Link href="/terms" className="hover:text-violet-600 transition-colors">
      Privacy Policy
    </Link>
  </p>
);

export default Footer;
