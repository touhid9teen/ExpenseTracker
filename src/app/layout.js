import './globals.css';

export const metadata = {
  title: 'FinVue - Premium Expense Tracker',
  description: 'Interactive and responsive financial management dashboard.',
  icons: {
    icon: '/favicon.svg',
  },
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
