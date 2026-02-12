'use client';

import { PropertyGallery } from './PropertyGallery';
import { PropertyOverview } from './PropertyOverview';
import { PropertyDescription } from './PropertyDescription';
import { PropertyAmenities } from './PropertyAmenities';
import { PropertyMap } from './PropertyMap';
import { formatPriceCOP, formatArea } from '@/lib/format';
import { PROPERTY_TYPE_LABELS, TRANSACTION_TYPE_LABELS } from '@/lib/constants';
import type { Property } from '@/types';
import { MapPin, Bed, Bath, Car, Maximize } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PropertyDetailEmbedProps {
  property: Property;
}

export function PropertyDetailEmbed({ property }: PropertyDetailEmbedProps) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Gallery - Full Width */}
      <PropertyGallery
        images={galleryImages}
        title={property.title}
        className="mb-6"
      />

      <div className="container mx-auto px-4 pb-12 max-w-5xl">
        {/* Header Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="bg-luxus-gold/10 text-luxus-gold">
              {TRANSACTION_TYPE_LABELS[property.status] || property.status}
            </Badge>
            <Badge variant="outline">
              {PROPERTY_TYPE_LABELS[property.property_type] || property.property_type}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {property.title}
          </h1>

          {/* Location */}
          {fullAddress && (
            <p className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin className="w-4 h-4 text-luxus-gold" />
              {fullAddress}
            </p>
          )}

          {/* Price */}
          <div className="text-3xl font-bold text-luxus-gold mb-4">
            {formatPriceCOP(property.price)}
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 pt-4 border-t">
            {property.area_m2 && property.area_m2 > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Maximize className="w-5 h-5 text-gray-400" />
                <span>{formatArea(property.area_m2)}</span>
              </div>
            )}
            {property.bedrooms && property.bedrooms > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Bed className="w-5 h-5 text-gray-400" />
                <span>{property.bedrooms} Habitaciones</span>
              </div>
            )}
            {property.bathrooms && property.bathrooms > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Bath className="w-5 h-5 text-gray-400" />
                <span>{property.bathrooms} Banos</span>
              </div>
            )}
            {property.parking_spots && property.parking_spots > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Car className="w-5 h-5 text-gray-400" />
                <span>{property.parking_spots} Parqueaderos</span>
              </div>
            )}
          </div>
        </div>

        {/* Overview */}
        <PropertyOverview property={property} className="mb-6" />

        {/* Description */}
        {(property.description || property.description_short) && (
          <PropertyDescription
            description={property.description || property.description_short || ''}
            className="mb-6"
          />
        )}

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <PropertyAmenities amenities={property.amenities} className="mb-6" />
        )}

        {/* Video (if exists) */}
        {property.video_url && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
    </div>
  );
}

export default PropertyDetailEmbed;
