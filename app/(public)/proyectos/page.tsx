import { Metadata } from 'next';
import { Building2, Filter } from 'lucide-react';
import { ProjectCard } from '@/components/project/ProjectCard';
import { getActiveProjects } from '@/lib/mock-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const metadata: Metadata = {
  title: 'Proyectos Inmobiliarios | Redbot Real Estate',
  description:
    'Descubre los mejores proyectos inmobiliarios en Colombia. Apartamentos, casas y locales comerciales en preventa y construcción.',
};

export default function ProyectosPage() {
  const projects = getActiveProjects();

  return (
    <div className="min-h-screen bg-luxus-cream pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-luxus-gold mb-2">
            <Building2 className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">
              Nuevos Desarrollos
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-luxus-dark font-heading mb-2">
            Proyectos Inmobiliarios
          </h1>
          <p className="text-luxus-gray max-w-2xl">
            Explora nuestra selección de proyectos inmobiliarios en las mejores
            ubicaciones de Colombia. Desde apartamentos de lujo hasta desarrollos
            comerciales.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-luxus p-4 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Results Count */}
            <p className="text-sm text-luxus-gray">
              <span className="font-semibold text-luxus-dark">
                {projects.length}
              </span>{' '}
              proyectos encontrados
            </p>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-luxus-gray" />
                <span className="text-sm text-luxus-gray hidden sm:inline">
                  Filtrar:
                </span>
              </div>

              {/* Status Filter */}
              <Select defaultValue="all">
                <SelectTrigger className="w-[160px] text-sm">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="preventa">Preventa</SelectItem>
                  <SelectItem value="construccion">En Construcción</SelectItem>
                  <SelectItem value="entrega">Entrega Inmediata</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px] text-sm">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="residencial">Residencial</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="mixto">Mixto</SelectItem>
                </SelectContent>
              </Select>

              {/* City Filter */}
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px] text-sm">
                  <SelectValue placeholder="Ciudad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ciudades</SelectItem>
                  <SelectItem value="bogota">Bogotá</SelectItem>
                  <SelectItem value="medellin">Medellín</SelectItem>
                  <SelectItem value="cartagena">Cartagena</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-luxus-gray-light mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-luxus-dark mb-2">
              No hay proyectos disponibles
            </h3>
            <p className="text-luxus-gray">
              Pronto agregaremos nuevos proyectos. Vuelve a visitarnos.
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-xl shadow-luxus p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-luxus-dark font-heading mb-4">
              ¿Por qué invertir en proyectos sobre planos?
            </h2>
            <p className="text-luxus-gray mb-6">
              Comprar en preventa o durante la construcción ofrece múltiples
              beneficios: precios más bajos, planes de pago flexibles,
              personalización de acabados y valorización garantizada.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-luxus-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-luxus-gold">15%</span>
                </div>
                <p className="text-sm text-luxus-gray">
                  Ahorro promedio vs. entrega inmediata
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-luxus-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-luxus-gold">30%</span>
                </div>
                <p className="text-sm text-luxus-gray">
                  Cuota inicial diferida
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-luxus-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-luxus-gold">+25%</span>
                </div>
                <p className="text-sm text-luxus-gray">
                  Valorización potencial
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
