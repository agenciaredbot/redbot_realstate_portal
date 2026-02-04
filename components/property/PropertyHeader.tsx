'use client';

import { useState } from 'react';
import {
  MapPin,
  Heart,
  Share2,
  Printer,
  Maximize,
  Bed,
  Bath,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/types';
import { formatPriceCOP, formatArea } from '@/lib/format';
import { PROPERTY_TYPE_LABELS, TRANSACTION_TYPE_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface PropertyHeaderProps {
  property: Property;
  className?: string;
}

export function PropertyHeader({ property, className }: PropertyHeaderProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Mira esta propiedad: ${property.title}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-luxus', className)}>
      {/* Top Row: Badges and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            {PROPERTY_TYPE_LABELS[property.property_type]}
          </Badge>
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
            {TRANSACTION_TYPE_LABELS[property.status]}
          </Badge>
          {property.is_featured && (
            <Badge className="bg-luxus-gold hover:bg-luxus-gold-dark text-white">
              Destacada
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFavorite(!isFavorite)}
            className={cn(
              'border-luxus-gray-light hover:border-luxus-gold',
              isFavorite && 'bg-red-50 border-red-200'
            )}
          >
            <Heart
              className={cn(
                'w-5 h-5',
                isFavorite ? 'fill-red-500 text-red-500' : 'text-luxus-gray'
              )}
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            className="border-luxus-gray-light hover:border-luxus-gold"
          >
            <Share2 className="w-5 h-5 text-luxus-gray" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrint}
            className="border-luxus-gray-light hover:border-luxus-gold print:hidden"
          >
            <Printer className="w-5 h-5 text-luxus-gray" />
          </Button>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-luxus-dark font-heading mb-2">
        {property.title}
      </h1>

      {/* Location */}
      <div className="flex items-center gap-2 text-luxus-gray mb-4">
        <MapPin className="w-5 h-5 text-luxus-gold flex-shrink-0" />
        <span>
          {property.neighborhood && `${property.neighborhood}, `}
          {property.city}
        </span>
      </div>

      {/* Price and Key Specs */}
      <div className="flex flex-wrap items-end justify-between gap-4 pt-4 border-t border-luxus-gray-light">
        {/* Price */}
        <div>
          <span className="text-sm text-luxus-gray">Precio</span>
          <div className="text-3xl md:text-4xl font-bold text-luxus-gold">
            {formatPriceCOP(property.price)}
          </div>
          {property.status === 'arriendo' && (
            <span className="text-sm text-luxus-gray">/ mes</span>
          )}
        </div>

        {/* Key Specs */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-luxus-cream flex items-center justify-center">
              <Maximize className="w-5 h-5 text-luxus-gold" />
            </div>
            <div>
              <span className="text-xs text-luxus-gray block">Área</span>
              <span className="font-semibold text-luxus-dark">
                {formatArea(property.area_m2 || 0)}
              </span>
            </div>
          </div>

          {property.bedrooms > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-luxus-cream flex items-center justify-center">
                <Bed className="w-5 h-5 text-luxus-gold" />
              </div>
              <div>
                <span className="text-xs text-luxus-gray block">Habitaciones</span>
                <span className="font-semibold text-luxus-dark">
                  {property.bedrooms}
                </span>
              </div>
            </div>
          )}

          {property.bathrooms > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-luxus-cream flex items-center justify-center">
                <Bath className="w-5 h-5 text-luxus-gold" />
              </div>
              <div>
                <span className="text-xs text-luxus-gray block">Baños</span>
                <span className="font-semibold text-luxus-dark">
                  {property.bathrooms}
                </span>
              </div>
            </div>
          )}

          {property.parking_spots && property.parking_spots > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-luxus-cream flex items-center justify-center">
                <Car className="w-5 h-5 text-luxus-gold" />
              </div>
              <div>
                <span className="text-xs text-luxus-gray block">Parqueaderos</span>
                <span className="font-semibold text-luxus-dark">
                  {property.parking_spots}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyHeader;
