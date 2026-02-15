import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redbot | Plataforma para Inmobiliarias',
  description:
    'Crea tu portal inmobiliario profesional en minutos. Gestiona propiedades, recibe leads y haz crecer tu negocio con Redbot.',
  keywords: [
    'portal inmobiliario',
    'software inmobiliario',
    'gestión de propiedades',
    'CRM inmobiliario',
    'website inmobiliaria',
  ],
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
