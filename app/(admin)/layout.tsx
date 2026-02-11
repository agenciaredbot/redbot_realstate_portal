import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import '@/app/globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Admin Panel | Redbot Real Estate',
  description: 'Panel de administración de Redbot Real Estate',
  robots: 'noindex, nofollow', // Don't index admin pages
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
