import type { Metadata } from 'next';
import { Geist, Geist_Mono, DM_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const dmSans = DM_Sans({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'Redbot Real Estate | Propiedades en Colombia',
    template: '%s | Redbot Real Estate',
  },
  description:
    'Portal inmobiliario con las mejores propiedades en Colombia. Encuentra casas, apartamentos, villas y mas. Tu socio confiable en el mercado inmobiliario.',
  keywords: [
    'inmobiliaria',
    'propiedades',
    'casas en venta',
    'apartamentos',
    'bienes raices',
    'Colombia',
    'arriendo',
    'comprar casa',
    'Bogota',
    'Medellin',
    'Cartagena',
  ],
  authors: [{ name: 'Redbot Real Estate' }],
  creator: 'Redbot Real Estate',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://redbot-realestate.com',
    siteName: 'Redbot Real Estate',
    title: 'Redbot Real Estate | Propiedades en Colombia',
    description:
      'Portal inmobiliario con las mejores propiedades en Colombia. Encuentra casas, apartamentos, villas y mas.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Redbot Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Redbot Real Estate | Propiedades en Colombia',
    description:
      'Portal inmobiliario con las mejores propiedades en Colombia.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
