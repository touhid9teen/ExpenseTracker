import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata = {
  title: 'FinVue - Premium Expense Tracker',
  description: 'Interactive and responsive financial management dashboard.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
