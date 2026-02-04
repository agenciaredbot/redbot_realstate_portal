'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { cn } from '@/lib/utils';

interface AgentInfo {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  full_name: string;
  photo_url: string | null;
}

interface FreshListingsProps {
  properties: any[];
  agents: Record<string, AgentInfo>;
}

const TABS = [
  { label: 'Todos', value: 'all' },
  { label: 'Apartamentos', value: 'apartamento' },
  { label: 'Casas', value: 'casa' },
  { label: 'Oficinas', value: 'oficina' },
  { label: 'Locales', value: 'local' },
  { label: 'Fincas', value: 'finca' },
] as const;

export function FreshListings({ properties, agents }: FreshListingsProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredProperties = useMemo(() => {
    if (activeTab === 'all') {
      return properties.slice(0, 6);
    }

    return properties
      .filter((p) => p.property_type?.toLowerCase() === activeTab.toLowerCase())
      .slice(0, 6);
  }, [activeTab, properties]);

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-luxus-gold font-medium uppercase tracking-wider text-sm mb-2">
            Nuevas Propiedades
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-luxus-dark font-heading mb-4">
            Listados Recientes
          </h2>
          <p className="text-luxus-gray max-w-2xl mx-auto">
            Explora nuestras propiedades mas recientes y encuentra tu proximo hogar
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all duration-300',
                activeTab === tab.value
                  ? 'bg-luxus-gold text-white'
                  : 'bg-luxus-cream text-luxus-gray hover:bg-luxus-gold/10 hover:text-luxus-gold'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                agent={property.agent || agents[property.agent_id]}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-luxus-gray">
              No hay propiedades disponibles en esta categoria
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button
            asChild
            variant="outline"
            className="border-luxus-gold text-luxus-gold hover:bg-luxus-gold hover:text-white"
          >
            <Link href="/propiedades">
              Ver Todas las Propiedades
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FreshListings;
