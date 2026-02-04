import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPropertyBySlug, getAllPropertySlugs } from '@/lib/supabase/queries';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyHeader } from '@/components/property/PropertyHeader';
import { PropertyOverview } from '@/components/property/PropertyOverview';
import { PropertyDescription } from '@/components/property/PropertyDescription';
import { PropertyAmenities } from '@/components/property/PropertyAmenities';
import { PropertyMap } from '@/components/property/PropertyMap';
import { ContactAgentForm } from '@/components/property/ContactAgentForm';
import { formatPriceCOP } from '@/lib/format';
import { PROPERTY_TYPE_LABELS, TRANSACTION_TYPE_LABELS } from '@/lib/constants';

interface PropertyDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all properties
export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: 'Propiedad no encontrada | Redbot Real Estate',
    };
  }

  const firstImage = property.images?.[0] || null;

  return {
    title: `${property.title} | Redbot Real Estate`,
    description: property.description_short || property.description,
    openGraph: {
      title: property.title,
      description: property.description_short || property.description || '',
      images: firstImage ? [firstImage] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description: property.description_short || property.description || '',
      images: firstImage ? [firstImage] : [],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  // Agent comes from the joined query
  const agent = property.agent;

  // Build full address
  const fullAddress = [
    property.address,
    property.neighborhood,
    property.city,
  ]
    .filter(Boolean)
    .join(', ');

  // Convert images array of strings to PropertyGallery format
  const galleryImages = (property.images || []).map((url: string, index: number) => ({
    id: `img-${index}`,
    url,
    order: index,
  }));

  return (
    <div className="min-h-screen bg-luxus-cream/30">
      {/* Gallery - Full Width */}
      <PropertyGallery
        images={galleryImages}
        title={property.title}
        className="mb-8"
      />

      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <PropertyHeader property={property} />

            {/* Overview */}
            <PropertyOverview property={property} />

            {/* Description */}
            <PropertyDescription description={property.description || property.description_short || ''} />

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <PropertyAmenities amenities={property.amenities} />
            )}

            {/* Video (if exists) */}
            {property.video_url && (
              <div className="bg-white rounded-xl p-6 shadow-luxus">
                <h2 className="text-xl font-semibold text-luxus-dark mb-6 font-serif flex items-center gap-2">
                  <span className="w-8 h-1 bg-luxus-gold rounded-full" />
                  Video
                </h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={property.video_url.replace('watch?v=', 'embed/')}
                    title={`Video de ${property.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Map */}
            {property.latitude && property.longitude && (
              <PropertyMap
                latitude={property.latitude}
                longitude={property.longitude}
                title={property.title}
                address={fullAddress}
              />
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {agent && (
                <ContactAgentForm
                  agent={agent}
                  propertyId={property.id}
                  propertyTitle={property.title}
                />
              )}

              {/* Quick Info Card */}
              <div className="bg-white rounded-xl p-6 shadow-luxus mt-6">
                <h3 className="text-lg font-semibold text-luxus-dark mb-4 font-serif">
                  Información Rápida
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-luxus-gray">ID Propiedad</span>
                    <span className="font-medium text-luxus-dark">
                      {property.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-luxus-gray">Tipo</span>
                    <span className="font-medium text-luxus-dark">
                      {PROPERTY_TYPE_LABELS[property.property_type] || property.property_type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-luxus-gray">Transacción</span>
                    <span className="font-medium text-luxus-dark">
                      {TRANSACTION_TYPE_LABELS[property.status] || property.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-luxus-gray">Precio</span>
                    <span className="font-medium text-luxus-gold">
                      {formatPriceCOP(property.price)}
                    </span>
                  </div>
                  {property.area_m2 && property.area_m2 > 0 && (
                    <div className="flex justify-between">
                      <span className="text-luxus-gray">Precio/m²</span>
                      <span className="font-medium text-luxus-dark">
                        {formatPriceCOP(Math.round(property.price / property.area_m2))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
