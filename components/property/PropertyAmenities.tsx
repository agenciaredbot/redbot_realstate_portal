'use client';

import { Check } from 'lucide-react';
import type { Amenity } from '@/types';
import { cn } from '@/lib/utils';

interface PropertyAmenitiesProps {
  amenities: Amenity[];
  className?: string;
}

// Map amenity names to more readable Spanish labels
// Must match exactly with Amenity type from @/types/property.ts
const amenityLabels: Record<Amenity, string> = {
  'Aire Acondicionado': 'Aire Acondicionado',
  'Balcon': 'Balcón',
  'Chimenea': 'Chimenea',
  'Amoblado': 'Amoblado',
  'Garaje': 'Garaje',
  'Pisos de Madera': 'Pisos de Madera',
  'Techos Altos': 'Techos Altos',
  'Internet / Wi-Fi': 'Internet / Wi-Fi',
  'Cuarto de Lavado': 'Cuarto de Lavado',
  'Sala de Medios': 'Sala de Medios',
  'Piscina': 'Piscina',
  'Walking Closet': 'Walking Closet',
  'Gimnasio': 'Gimnasio',
  'Seguridad 24/7': 'Seguridad 24/7',
  'Ascensor': 'Ascensor',
  'Terraza': 'Terraza',
  'Jardin': 'Jardín',
  'BBQ': 'Zona BBQ',
  'Salon Comunal': 'Salón Comunal',
  'Parqueadero Visitantes': 'Parqueadero Visitantes',
  'Jacuzzi': 'Jacuzzi',
  'Vista Panoramica': 'Vista Panorámica',
  'Playa': 'Acceso a Playa',
  'Sauna': 'Sauna',
  'Cancha de Tenis': 'Cancha de Tenis',
  'Area de Juegos': 'Área de Juegos',
};

export function PropertyAmenities({ amenities, className }: PropertyAmenitiesProps) {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-luxus', className)}>
      <h2 className="text-xl font-semibold text-luxus-dark mb-6 font-heading flex items-center gap-2">
        <span className="w-8 h-1 bg-luxus-gold rounded-full" />
        Amenidades
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {amenities.map((amenity) => (
          <div
            key={amenity}
            className="flex items-center gap-3 p-3 rounded-lg bg-luxus-cream/30 border border-luxus-gray-light/30"
          >
            <div className="w-6 h-6 rounded-full bg-luxus-gold/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-luxus-gold" />
            </div>
            <span className="text-sm text-luxus-dark">
              {amenityLabels[amenity] || amenity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PropertyAmenities;
