'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address?: string;
  className?: string;
}

export function PropertyMap({
  latitude,
  longitude,
  title,
  address,
  className,
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      if (typeof window === 'undefined' || !mapRef.current) return;

      // Import Leaflet
      const L = (await import('leaflet')).default;

      // Prevent re-initialization
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Create map
      const map = L.map(mapRef.current, {
        center: [latitude, longitude],
        zoom: 15,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Create custom icon
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: #E8A838;
            width: 40px;
            height: 40px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          ">
            <svg
              style="transform: rotate(45deg); width: 20px; height: 20px; color: white;"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      // Add marker
      const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(
        map
      );

      // Add popup
      marker.bindPopup(
        `<div style="font-family: sans-serif;">
          <strong style="color: #1A1A2E;">${title}</strong>
          ${address ? `<br><span style="color: #6B7280; font-size: 12px;">${address}</span>` : ''}
        </div>`
      );

      setIsLoaded(true);
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, title, address]);

  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-luxus', className)}>
      <h2 className="text-xl font-semibold text-luxus-dark mb-6 font-heading flex items-center gap-2">
        <span className="w-8 h-1 bg-luxus-gold rounded-full" />
        Ubicación
      </h2>

      {address && (
        <div className="flex items-center gap-2 text-luxus-gray mb-4">
          <MapPin className="w-5 h-5 text-luxus-gold flex-shrink-0" />
          <span>{address}</span>
        </div>
      )}

      <div
        ref={mapRef}
        className={cn(
          'w-full h-[400px] rounded-lg overflow-hidden',
          !isLoaded && 'bg-luxus-cream animate-pulse'
        )}
      />

      {/* Google Maps Link */}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-4 text-sm text-luxus-gold hover:text-luxus-gold-dark transition-colors"
      >
        <MapPin className="w-4 h-4" />
        Abrir en Google Maps
      </a>
    </div>
  );
}

export default PropertyMap;
