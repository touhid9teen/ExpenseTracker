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
  themeColor: '#f59e0b',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
