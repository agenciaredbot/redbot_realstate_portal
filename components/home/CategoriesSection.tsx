'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { PropertyCategory } from '@/types';

// Mock categories data
const MOCK_CATEGORIES: PropertyCategory[] = [
  {
    type: 'Apartamento',
    label: 'Apartamentos',
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
    count: 85,
  },
  {
    type: 'Casa',
    label: 'Casas',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
    count: 64,
  },
  {
    type: 'Villa',
    label: 'Villas',
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
    count: 23,
  },
  {
    type: 'Penthouse',
    label: 'Penthouses',
    image_url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600',
    count: 12,
  },
  {
    type: 'Local Comercial',
    label: 'Comercial',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
    count: 34,
  },
  {
    type: 'Oficina',
    label: 'Oficinas',
    image_url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600',
    count: 28,
  },
];

interface CategoriesSectionProps {
  categories?: PropertyCategory[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const displayCategories = categories?.length ? categories : MOCK_CATEGORIES;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-luxus-gold font-medium text-sm uppercase tracking-wider">
            Categorias Populares
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-luxus-dark mt-2 font-serif">
            Explora por Tipo de Propiedad
          </h2>
          <p className="text-luxus-gray mt-4 max-w-2xl mx-auto">
            Encuentra la propiedad perfecta explorando nuestras categorias mas
            populares.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((category) => (
            <Link
              key={category.type}
              href={`/propiedades?type=${encodeURIComponent(category.type)}`}
              className="group relative h-64 rounded-2xl overflow-hidden"
            >
              {/* Background Image */}
              <Image
                src={category.image_url}
                alt={category.label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-luxus-dark/90 transition-colors" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white font-serif mb-1">
                      {category.label}
                    </h3>
                    <span className="text-sm text-white/70">
                      {category.count} propiedades
                    </span>
                  </div>

                  {/* Arrow Icon */}
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-luxus-gold transition-colors">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
