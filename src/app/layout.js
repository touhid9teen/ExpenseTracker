import './globals.css';

export const metadata = {
  title: 'FinVue - Premium Expense Tracker',
  description: 'Interactive and responsive financial management dashboard.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  appleWebApp: {
    capable: true,
    title: 'FinVue',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport = {
  themeColor: '#060a16',
};

export default function RootLayout({ children }) {
  return (
    /* `suppressHydrationWarning` silences attribute mismatches on the root
       tags caused by browser extensions (e.g. Grammarly) injecting their own
       attributes into <body> after the server render. Content mismatches
       are still surfaced. */
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full antialiased font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
