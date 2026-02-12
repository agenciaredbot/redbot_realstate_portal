import '@/app/globals.css';

export const metadata = {
  robots: 'noindex, nofollow', // Evitar indexación de páginas embed
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
