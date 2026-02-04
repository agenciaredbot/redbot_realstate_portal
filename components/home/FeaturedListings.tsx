'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/PropertyCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface AgentInfo {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  full_name: string;
  photo_url: string | null;
}

interface FeaturedListingsProps {
  properties: any[];
  agents: Record<string, AgentInfo>;
}

export function FeaturedListings({ properties, agents }: FeaturedListingsProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-luxus-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-luxus-gold font-medium text-sm uppercase tracking-wider">
            Propiedades Destacadas
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-luxus-dark mt-2 font-serif">
            Listados Exclusivos
          </h2>
          <p className="text-luxus-gray mt-4 max-w-2xl mx-auto">
            Descubre nuestra seleccion de propiedades premium cuidadosamente
            seleccionadas para ti.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            className="pb-12"
          >
            {properties.map((property) => (
              <SwiperSlide key={property.id}>
                <PropertyCard
                  property={property}
                  agent={property.agent || agents[property.agent_id]}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg border-0 hover:bg-luxus-gold hover:text-white hidden lg:flex"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg border-0 hover:bg-luxus-gold hover:text-white hidden lg:flex"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedListings;
