'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Button } from '@/components/ui/button';
import { AgentCard } from '@/components/agent/AgentCard';

import 'swiper/css';
import 'swiper/css/navigation';

interface AgentsCarouselProps {
  agents: any[];
}

export function AgentsCarousel({ agents }: AgentsCarouselProps) {
  const activeAgents = agents.filter((a) => a.is_active !== false);

  if (activeAgents.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-luxus-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <p className="text-luxus-gold font-medium uppercase tracking-wider text-sm mb-2">
              Nuestro Equipo
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-luxus-dark font-heading mb-2">
              Agentes Inmobiliarios
            </h2>
            <p className="text-luxus-gray max-w-xl">
              Conoce a nuestros expertos que te ayudaran a encontrar la propiedad perfecta
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="mt-4 md:mt-0 border-luxus-gold text-luxus-gold hover:bg-luxus-gold hover:text-white"
          >
            <Link href="/agentes">
              Ver Todos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Agents Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: '.agents-prev',
              nextEl: '.agents-next',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-4"
          >
            {activeAgents.map((agent) => (
              <SwiperSlide key={agent.id}>
                <AgentCard agent={agent} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button className="agents-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-luxus-gold hover:text-white transition-colors hidden lg:flex">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="agents-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-luxus-gold hover:text-white transition-colors hidden lg:flex">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default AgentsCarousel;
