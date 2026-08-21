import './globals.css';

export const metadata = {
  title: 'FinVue',
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
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full antialiased font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
