import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPropertyBySlug } from '@/lib/supabase/queries';
import { PropertyDetailEmbed } from '@/components/property/PropertyDetailEmbed';

// Make page dynamic
export const dynamic = 'force-dynamic';

interface EmbedPropertyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Minimal metadata without branding
export async function generateMetadata({
  params,
}: EmbedPropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: 'Propiedad no encontrada',
      robots: 'noindex, nofollow',
    };
  }

  const firstImage = property.images?.[0] || null;

  return {
    title: property.title,
    description: property.description_short || property.description,
    robots: 'noindex, nofollow',
    openGraph: {
      title: property.title,
      description: property.description_short || property.description || '',
      images: firstImage ? [firstImage] : [],
      type: 'website',
    },
  };
}

export default async function EmbedPropertyPage({
  params,
}: EmbedPropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return <PropertyDetailEmbed property={property} />;
}
