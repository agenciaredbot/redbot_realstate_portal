'use client';

import { PropertyCard } from './PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Property, Agent } from '@/types';
import { cn } from '@/lib/utils';

interface PropertyGridProps {
  properties: Property[];
  agents: Record<string, Partial<Agent>>;
  isLoading?: boolean;
  className?: string;
}

export function PropertyGrid({
  properties,
  agents,
  isLoading = false,
  className,
}: PropertyGridProps) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6', className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-luxus-cream flex items-center justify-center">
          <svg
            className="w-10 h-10 text-luxus-gray"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-luxus-dark mb-2">
          No se encontraron propiedades
        </h3>
        <p className="text-luxus-gray max-w-md mx-auto">
          Intenta ajustar los filtros de busqueda para encontrar mas opciones.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6', className)}>
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          agent={property.agent || (property.agent_id ? agents[property.agent_id] : undefined)}
        />
      ))}
    </div>
  );
}

function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-luxus">
      <Skeleton className="h-64 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-px w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

export default PropertyGrid;
