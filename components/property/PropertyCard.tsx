'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatPrice, formatArea } from '@/lib/format';
import type { Property, Agent } from '@/types';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  agent?: Partial<Agent>;
  className?: string;
}

export function PropertyCard({ property, agent, className }: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Handle both old format (array of objects) and new format (array of strings)
  const getMainImage = () => {
    if (!property.images || property.images.length === 0) {
      return '/images/placeholder-property.jpg';
    }
    const firstImage = property.images[0];
    // Check if it's a string (new format) or object (old format)
    if (typeof firstImage === 'string') {
      return firstImage;
    }
    return (firstImage as any)?.url || '/images/placeholder-property.jpg';
  };

  const mainImage = getMainImage();
  const currency = (property.price_currency || 'COP') as 'COP' | 'USD';
  const priceDisplay = formatPrice(property.price, currency, { compact: true });
  const priceWithFrequency = priceDisplay;

  return (
    <div
      className={cn(
        'group relative bg-white rounded-2xl overflow-hidden shadow-luxus transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={mainImage}
          alt={property.title}
          fill
          className={cn(
            'object-cover transition-transform duration-500',
            isHovered && 'scale-110'
          )}
        />

        {/* Badges - Top Left */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <Badge className="bg-luxus-green text-white border-0 px-3 py-1">
            {property.property_type}
          </Badge>
          <Badge className="bg-luxus-orange text-white border-0 px-3 py-1">
            {property.status}
          </Badge>
        </div>

        {/* Favorite Button - Top Right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className={cn(
            'absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all',
            isFavorite
              ? 'bg-luxus-gold text-white'
              : 'bg-white/90 text-luxus-gold hover:bg-luxus-gold hover:text-white'
          )}
        >
          <Star className={cn('w-5 h-5', isFavorite && 'fill-current')} />
        </button>

        {/* Price Overlay - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <span className="text-xl font-bold text-white drop-shadow-lg">
            {priceWithFrequency}
          </span>
        </div>

        {/* Hover Content Overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-white/95 backdrop-blur-sm p-6 flex flex-col justify-between transition-all duration-400 ease-out',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
          )}
        >
          {/* Dot Indicator */}
          <div className="absolute top-4 right-4">
            <div className="w-3 h-3 rounded-full bg-luxus-gold border-2 border-luxus-gold/30" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-luxus-dark font-heading leading-tight pr-8">
            {property.title}
          </h3>

          {/* Specs */}
          <div className="flex gap-3 my-4">
            <div className="flex-1 border border-dashed border-luxus-gold rounded-lg p-3 text-center">
              <Bed className="w-5 h-5 text-luxus-gold mx-auto mb-1" />
              <span className="text-sm text-luxus-dark">{property.bedrooms} Hab.</span>
            </div>
            <div className="flex-1 border border-dashed border-luxus-gold rounded-lg p-3 text-center">
              <Bath className="w-5 h-5 text-luxus-gold mx-auto mb-1" />
              <span className="text-sm text-luxus-dark">{property.bathrooms} Bano(s)</span>
            </div>
            <div className="flex-1 border border-dashed border-luxus-gold rounded-lg p-3 text-center">
              <Maximize className="w-5 h-5 text-luxus-gold mx-auto mb-1" />
              <span className="text-sm text-luxus-dark">{formatArea(property.area_m2 || 0)}</span>
            </div>
          </div>

          {/* View Details Button */}
          <Button
            asChild
            variant="outline"
            className="w-full border-luxus-gold text-luxus-gold hover:bg-luxus-gold hover:text-white"
          >
            <Link href={`/propiedades/${property.slug}`}>Ver Detalles</Link>
          </Button>
        </div>
      </div>

      {/* Card Footer - Normal State */}
      <div
        className={cn(
          'p-4 transition-opacity duration-300',
          isHovered ? 'opacity-0' : 'opacity-100'
        )}
      >
        {/* Title */}
        <h3 className="text-lg font-semibold text-luxus-dark font-heading mb-3 line-clamp-1">
          {property.title}
        </h3>

        {/* Dotted Separator */}
        <div className="border-t border-dashed border-luxus-gold mb-3" />

        {/* Agent & Location Row */}
        <div className="flex items-center justify-between">
          {/* Agent Info */}
          {agent && (
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={agent.photo_url} alt={agent.full_name} />
                <AvatarFallback className="bg-luxus-cream text-luxus-gold text-xs">
                  {agent.first_name?.[0]}
                  {agent.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-luxus-gray">{agent.full_name}</span>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-luxus-gray">
            <MapPin className="w-4 h-4 text-luxus-gold" />
            <span>{property.city}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
