import { Inter } from 'next/font/google';
import { Metadata } from 'next';

import '../styles/globals.scss';
import '../styles/globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Practice FE',
  description: 'Frontend practice project',
};

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={inter.variable}>
        <main>{children}</main>
      </body>
    </html>
  );
}
