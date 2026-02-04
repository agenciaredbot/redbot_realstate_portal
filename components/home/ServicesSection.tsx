'use client';

import {
  Home,
  DollarSign,
  Key,
  Building2,
  MessageCircle,
  Landmark,
} from 'lucide-react';
import { SERVICES } from '@/lib/constants';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  DollarSign,
  Key,
  Building2,
  MessageCircle,
  Landmark,
};

export function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-luxus-gold font-medium text-sm uppercase tracking-wider">
            Lo Que Ofrecemos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-luxus-dark mt-2 font-serif">
            Nuestros Servicios
          </h2>
          <p className="text-luxus-gray mt-4 max-w-2xl mx-auto">
            Ofrecemos una gama completa de servicios inmobiliarios para ayudarte
            en cada paso del camino.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => {
            const IconComponent = iconMap[service.icon] || Home;

            return (
              <div
                key={service.id}
                className="group p-8 rounded-2xl border border-luxus-gray-light bg-white hover:bg-luxus-cream hover:border-luxus-gold transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-luxus-cream flex items-center justify-center mb-6 group-hover:bg-luxus-gold transition-colors">
                  <IconComponent className="w-7 h-7 text-luxus-gold group-hover:text-white transition-colors" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-luxus-dark font-serif mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-luxus-gray leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
