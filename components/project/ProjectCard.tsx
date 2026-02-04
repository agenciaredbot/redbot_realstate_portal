'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Building2, Calendar, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Project } from '@/types';
import { formatPriceCOP } from '@/lib/format';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

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

export function ProjectCard({ project, className }: ProjectCardProps) {
  const mainImage = project.images.find((img) => img.is_main) || project.images[0];
  const availabilityPercentage = Math.round(
    (project.available_units / project.total_units) * 100
  );

  return (
    <div
      className={cn(
        'group bg-white rounded-xl overflow-hidden shadow-luxus hover:shadow-xl transition-all duration-300',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={mainImage?.url || '/images/placeholder-project.jpg'}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <Badge className={cn('text-white border-0', statusColors[project.status])}>
            {statusLabels[project.status]}
          </Badge>
          <Badge className="bg-luxus-gold text-white border-0">
            {project.project_type}
          </Badge>
        </div>

        {/* Featured Badge */}
        {project.is_featured && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-yellow-500 text-white border-0">Destacado</Badge>
          </div>
        )}

        {/* Price Range */}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white/80 text-sm mb-1">Desde</p>
          <p className="text-white text-2xl font-bold">
            {formatPriceCOP(project.price_from)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <Link href={`/proyectos/${project.slug}`}>
          <h3 className="text-xl font-semibold text-luxus-dark hover:text-luxus-gold transition-colors font-heading line-clamp-1">
            {project.title}
          </h3>
        </Link>

        {/* Developer */}
        <p className="text-sm text-luxus-gray mt-1">por {project.developer_name}</p>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-luxus-gray mt-2">
          <MapPin className="w-4 h-4 text-luxus-gold flex-shrink-0" />
          <span className="line-clamp-1">
            {project.neighborhood}, {project.city}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-luxus-gray-light">
          {/* Units */}
          <div className="flex items-center gap-1">
            <Building2 className="w-4 h-4 text-luxus-gold" />
            <span className="text-sm text-luxus-gray">
              {project.available_units} de {project.total_units} disponibles
            </span>
          </div>
        </div>

        {/* Availability Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-luxus-gray mb-1">
            <span>Disponibilidad</span>
            <span>{availabilityPercentage}%</span>
          </div>
          <div className="h-2 bg-luxus-gray-light rounded-full overflow-hidden">
            <div
              className="h-full bg-luxus-gold rounded-full transition-all duration-500"
              style={{ width: `${availabilityPercentage}%` }}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center gap-4 mt-4 text-sm text-luxus-gray">
          {project.floors && (
            <div className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>{project.floors} pisos</span>
            </div>
          )}
          {project.completion_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Entrega: {project.completion_date}</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Link href={`/proyectos/${project.slug}`} className="block mt-4">
          <Button className="w-full bg-luxus-gold hover:bg-luxus-gold-dark text-white">
            Ver Proyecto
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ProjectCard;
