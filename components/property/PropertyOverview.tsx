'use client';

import {
  Maximize,
  Bed,
  Bath,
  Car,
  Calendar,
  Building2,
  LandPlot,
} from 'lucide-react';
import { formatArea } from '@/lib/format';
import type { Property } from '@/types';
import { cn } from '@/lib/utils';

interface PropertyOverviewProps {
  property: Property;
  className?: string;
}

export function PropertyOverview({ property, className }: PropertyOverviewProps) {
  const overviewItems = [
    {
      icon: Maximize,
      label: 'Area Construida',
      value: formatArea(property.area_m2 || 0),
      show: !!(property.area_m2 && property.area_m2 > 0),
    },
    {
      icon: LandPlot,
      label: 'Area Construida',
      value: property.area_built_m2 ? formatArea(property.area_built_m2) : null,
      show: !!property.area_built_m2 && property.area_built_m2 !== property.area_m2,
    },
    {
      icon: Bed,
      label: 'Habitaciones',
      value: (property.bedrooms || 0) > 0 ? property.bedrooms?.toString() : null,
      show: (property.bedrooms || 0) > 0,
    },
    {
      icon: Bath,
      label: 'Banos',
      value: (property.bathrooms || 0) > 0 ? property.bathrooms?.toString() : null,
      show: (property.bathrooms || 0) > 0,
    },
    {
      icon: Car,
      label: 'Parqueaderos',
      value: property.parking_spots
        ? `${property.parking_spots} vehiculos`
        : null,
      show: !!property.parking_spots,
    },
    {
      icon: Calendar,
      label: 'Ano de Construccion',
      value: property.year_built?.toString() || null,
      show: !!property.year_built,
    },
    {
      icon: Building2,
      label: 'Piso',
      value: property.floor_number?.toString() || null,
      show: !!property.floor_number,
    },
  ].filter((item) => item.show && item.value);

  if (overviewItems.length === 0) {
    return null;
  }

  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-luxus', className)}>
      <h2 className="text-xl font-semibold text-luxus-dark mb-6 font-serif flex items-center gap-2">
        <span className="w-8 h-1 bg-luxus-gold rounded-full" />
        Overview
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {overviewItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 rounded-lg bg-luxus-cream/50 border border-luxus-gray-light/50"
          >
            <div className="w-10 h-10 rounded-full bg-luxus-cream flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-luxus-gold" />
            </div>
            <div>
              <p className="text-xs text-luxus-gray">{item.label}</p>
              <p className="text-sm font-semibold text-luxus-dark">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PropertyOverview;
