'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import {
  MapPin,
  Building2,
  Calendar,
  Home,
  Check,
  Phone,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Project } from '@/types';
import { formatPriceCOP } from '@/lib/format';
import { cn } from '@/lib/utils';
import PortableText from '@/components/sanity/PortableText';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

const statusColors: Record<string, string> = {
  'En Construccion': 'bg-blue-500',
  'Preventa': 'bg-purple-500',
  'Entrega Inmediata': 'bg-green-500',
  'Vendido': 'bg-gray-500',
};

const statusLabels: Record<string, string> = {
  'En Construccion': 'En Construcción',
  'Preventa': 'Preventa',
  'Entrega Inmediata': 'Entrega Inmediata',
  'Vendido': 'Vendido',
};

interface ProjectDetailContentProps {
  project: Project;
}

export function ProjectDetailContent({ project }: ProjectDetailContentProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const availabilityPercentage = Math.round(
    (project.available_units / project.total_units) * 100
  );

  return (
    <div className="min-h-screen bg-luxus-cream pt-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          href="/proyectos"
          className="inline-flex items-center gap-2 text-luxus-gray hover:text-luxus-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a proyectos</span>
        </Link>
      </div>

      {/* Gallery Section */}
      <section className="container mx-auto px-4 mb-8">
        <div className="relative">
          {/* Main Swiper */}
          <Swiper
            modules={[Navigation, Thumbs, FreeMode]}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            navigation={{
              prevEl: '.gallery-prev',
              nextEl: '.gallery-next',
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="rounded-xl overflow-hidden aspect-[16/9] md:aspect-[21/9]"
          >
            {project.images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <Image
                    src={image.url}
                    alt={image.alt || project.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button className="gallery-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="gallery-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 z-10 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {activeIndex + 1} / {project.images.length}
          </div>
        </div>

        {/* Thumbnails */}
        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={12}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          breakpoints={{
            640: { slidesPerView: 5 },
            768: { slidesPerView: 6 },
            1024: { slidesPerView: 8 },
          }}
          className="mt-4"
        >
          {project.images.map((image, index) => (
            <SwiperSlide key={index}>
              <div
                className={cn(
                  'relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all',
                  activeIndex === index
                    ? 'border-luxus-gold'
                    : 'border-transparent hover:border-luxus-gold/50'
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${project.title} - ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Project Info */}
          <div className="lg:w-2/3">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-luxus p-6 mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  className={cn('text-white border-0', statusColors[project.status])}
                >
                  {statusLabels[project.status]}
                </Badge>
                <Badge className="bg-luxus-gold text-white border-0">
                  {project.project_type}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-luxus-dark font-heading mb-2">
                {project.title}
              </h1>

              <div className="flex items-center gap-1 text-luxus-gray mb-4">
                <MapPin className="w-5 h-5 text-luxus-gold" />
                <span>
                  {project.neighborhood}, {project.city}
                </span>
              </div>

              <p className="text-sm text-luxus-gray mb-4">
                Desarrollado por{' '}
                <span className="font-semibold text-luxus-dark">
                  {project.developer_name}
                </span>
              </p>

              {/* Price Range */}
              <div className="bg-luxus-cream rounded-lg p-4 mb-4">
                <p className="text-sm text-luxus-gray mb-1">Rango de precios</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-luxus-gold">
                    {formatPriceCOP(project.price_from)}
                  </span>
                  <span className="text-luxus-gray">-</span>
                  <span className="text-2xl font-bold text-luxus-gold">
                    {formatPriceCOP(project.price_to)}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-luxus-cream rounded-lg">
                  <Building2 className="w-6 h-6 text-luxus-gold mx-auto mb-1" />
                  <p className="text-xl font-bold text-luxus-dark">
                    {project.total_units}
                  </p>
                  <p className="text-xs text-luxus-gray">Unidades totales</p>
                </div>
                <div className="text-center p-3 bg-luxus-cream rounded-lg">
                  <Users className="w-6 h-6 text-luxus-gold mx-auto mb-1" />
                  <p className="text-xl font-bold text-luxus-dark">
                    {project.available_units}
                  </p>
                  <p className="text-xs text-luxus-gray">Disponibles</p>
                </div>
                {project.floors && (
                  <div className="text-center p-3 bg-luxus-cream rounded-lg">
                    <Home className="w-6 h-6 text-luxus-gold mx-auto mb-1" />
                    <p className="text-xl font-bold text-luxus-dark">
                      {project.floors}
                    </p>
                    <p className="text-xs text-luxus-gray">Pisos</p>
                  </div>
                )}
                {project.completion_date && (
                  <div className="text-center p-3 bg-luxus-cream rounded-lg">
                    <Calendar className="w-6 h-6 text-luxus-gold mx-auto mb-1" />
                    <p className="text-xl font-bold text-luxus-dark">
                      {project.completion_date}
                    </p>
                    <p className="text-xs text-luxus-gray">Entrega</p>
                  </div>
                )}
              </div>

              {/* Availability Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-luxus-gray mb-2">
                  <span>Disponibilidad del proyecto</span>
                  <span className="font-semibold text-luxus-dark">
                    {availabilityPercentage}% disponible
                  </span>
                </div>
                <div className="h-3 bg-luxus-gray-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-luxus-gold rounded-full transition-all duration-500"
                    style={{ width: `${availabilityPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-luxus p-6 mb-6">
              <h2 className="text-xl font-bold text-luxus-dark font-heading mb-4">
                Descripción del Proyecto
              </h2>
              <div className="prose prose-luxus max-w-none text-luxus-gray">
                {Array.isArray(project.description_full) ? (
                  <PortableText value={project.description_full} />
                ) : (
                  project.description_full.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3">
                      {paragraph}
                    </p>
                  ))
                )}
              </div>
            </div>

            {/* Unit Types */}
            {project.units && project.units.length > 0 && (
              <div className="bg-white rounded-xl shadow-luxus p-6 mb-6">
                <h2 className="text-xl font-bold text-luxus-dark font-heading mb-4">
                  Tipos de Unidades
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-luxus-gray-light">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-luxus-dark">
                          Tipo
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-luxus-dark">
                          Área
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-luxus-dark">
                          Precio desde
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-luxus-dark">
                          Disponibles
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.units.map((unit, index) => (
                        <tr
                          key={index}
                          className="border-b border-luxus-gray-light last:border-0"
                        >
                          <td className="py-3 px-4 text-luxus-dark font-medium">
                            {unit.type}
                          </td>
                          <td className="py-3 px-4 text-luxus-gray">
                            {unit.area_min} - {unit.area_max} m²
                          </td>
                          <td className="py-3 px-4 text-luxus-gold font-semibold">
                            {formatPriceCOP(unit.price_from)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={unit.available > 0 ? 'default' : 'secondary'}
                              className={
                                unit.available > 0
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-500'
                              }
                            >
                              {unit.available > 0
                                ? `${unit.available} disponibles`
                                : 'Agotado'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-luxus p-6 mb-6">
              <h2 className="text-xl font-bold text-luxus-dark font-heading mb-4">
                Amenidades del Proyecto
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {project.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-luxus-gold flex-shrink-0" />
                    <span className="text-luxus-gray">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Video */}
            {project.video_url && (
              <div className="bg-white rounded-xl shadow-luxus p-6 mb-6">
                <h2 className="text-xl font-bold text-luxus-dark font-heading mb-4">
                  Video del Proyecto
                </h2>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-luxus-dark">
                  <iframe
                    src={project.video_url.replace('watch?v=', 'embed/')}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Location Map */}
            <div className="bg-white rounded-xl shadow-luxus p-6">
              <h2 className="text-xl font-bold text-luxus-dark font-heading mb-4">
                Ubicación
              </h2>
              <div className="flex items-center gap-2 text-luxus-gray mb-4">
                <MapPin className="w-5 h-5 text-luxus-gold" />
                <span>{project.address}</span>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden bg-luxus-gray-light">
                {/* Map placeholder - would use Leaflet in production */}
                <div className="w-full h-full flex items-center justify-center text-luxus-gray">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-2 text-luxus-gold" />
                    <p>Mapa de ubicación</p>
                    <p className="text-sm">
                      {project.neighborhood}, {project.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-luxus p-6 lg:sticky lg:top-24">
              <h3 className="text-xl font-bold text-luxus-dark font-heading mb-4">
                Solicitar Información
              </h3>

              <form className="space-y-4">
                <div>
                  <Input placeholder="Nombre completo *" className="w-full" />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Correo electrónico *"
                    className="w-full"
                  />
                </div>
                <div>
                  <Input type="tel" placeholder="Teléfono *" className="w-full" />
                </div>
                <div>
                  <Textarea
                    placeholder="Me interesa recibir información sobre este proyecto..."
                    rows={4}
                    className="w-full resize-none"
                  />
                </div>
                <Button className="w-full bg-luxus-gold hover:bg-luxus-gold-dark text-white">
                  Enviar Solicitud
                </Button>
              </form>

              {/* Contact Options */}
              <div className="mt-6 pt-6 border-t border-luxus-gray-light">
                <p className="text-sm text-luxus-gray mb-4 text-center">
                  O contáctanos directamente:
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-luxus-gold text-luxus-gold hover:bg-luxus-gold hover:text-white"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </Button>
                </div>
              </div>

              {/* Brochure Download */}
              {project.brochure_url && (
                <div className="mt-6 pt-6 border-t border-luxus-gray-light">
                  <a
                    href={project.brochure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-luxus-cream rounded-lg text-luxus-dark hover:bg-luxus-gold/10 transition-colors"
                  >
                    <Download className="w-5 h-5 text-luxus-gold" />
                    <span className="font-medium">Descargar Brochure</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
