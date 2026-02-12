import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getUserProfile } from '@/lib/supabase/auth';
import { getProjectById } from '@/lib/supabase/project-queries';
import { USER_ROLES } from '@/types/admin';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, AMENITIES_LIST } from '@/types/project-db';
import { formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  Star,
  Calendar,
  MapPin,
  Building2,
  DollarSign,
  Maximize,
  Home,
  Video,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectActions } from './ProjectActions';

export const dynamic = 'force-dynamic';

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatPrice(price: number | null, currency: string = 'COP'): string {
  if (!price) return '-';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function getAmenityLabel(value: string): string {
  const amenity = AMENITIES_LIST.find((a) => a.value === value);
  return amenity?.label || value;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const profile = await getUserProfile();
  const { id } = await params;

  if (!profile) {
    redirect('/login');
  }

  // Only admins can access this page
  if (profile.role !== USER_ROLES.ADMIN) {
    redirect('/admin/dashboard');
  }

  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/proyectos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 line-clamp-1">
              {project.name}
            </h1>
            <p className="text-gray-500 text-sm">ID: {project.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={PROJECT_STATUS_COLORS[project.status]}
          >
            {PROJECT_STATUS_LABELS[project.status]}
          </Badge>
          {!project.is_active && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
              <EyeOff className="h-3 w-3 mr-1" />
              Inactivo
            </Badge>
          )}
          {project.is_active && (
            <Badge className="bg-green-100 text-green-800">
              <Eye className="h-3 w-3 mr-1" />
              Activo
            </Badge>
          )}
          {project.is_featured && (
            <Badge className="bg-yellow-100 text-yellow-800">
              <Star className="h-3 w-3 mr-1 fill-yellow-500" />
              Destacado
            </Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <ProjectActions project={project} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Imagenes</CardTitle>
            </CardHeader>
            <CardContent>
              {project.images && project.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {project.images.map((url, index) => (
                    <div
                      key={index}
                      className={`relative rounded-lg overflow-hidden ${
                        index === 0 ? 'col-span-2 row-span-2 aspect-video' : 'aspect-square'
                      }`}
                    >
                      <Image
                        src={url}
                        alt={`${project.name} - Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {index === 0 && (
                        <Badge className="absolute top-2 left-2">Principal</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                  <div className="text-center text-gray-400">
                    <Building2 className="h-12 w-12 mx-auto mb-2" />
                    <p>Sin imagenes</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Descripcion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.description_short && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Descripcion Corta</p>
                  <p className="text-gray-700">{project.description_short}</p>
                </div>
              )}
              {project.description && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Descripcion Completa</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                </div>
              )}
              {!project.description_short && !project.description && (
                <p className="text-gray-400 italic">Sin descripcion</p>
              )}
            </CardContent>
          </Card>

          {/* Pricing & Units */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Precios y Unidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Precio Desde</p>
                  <p className="text-lg font-semibold">
                    {formatPrice(project.price_from, project.price_currency || 'COP')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Precio Hasta</p>
                  <p className="text-lg font-semibold">
                    {formatPrice(project.price_to, project.price_currency || 'COP')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Unidades</p>
                  <p className="text-lg font-semibold">{project.total_units || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Disponibles</p>
                  <p className="text-lg font-semibold text-green-600">
                    {project.available_units || '-'}
                  </p>
                </div>
              </div>

              {(project.area_from || project.area_to) && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Maximize className="h-4 w-4" />
                    <span>
                      Areas: {project.area_from || '?'} - {project.area_to || '?'} m²
                    </span>
                  </div>
                </div>
              )}

              {project.unit_types && project.unit_types.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Tipos de Unidad</p>
                  <div className="flex flex-wrap gap-2">
                    {project.unit_types.map((type) => (
                      <Badge key={type} variant="outline">
                        <Home className="h-3 w-3 mr-1" />
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Amenities */}
          {project.amenities && project.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary">
                      {getAmenityLabel(amenity)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Button asChild className="w-full">
                <Link href={`/admin/proyectos/${project.id}/editar`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Proyecto
                </Link>
              </Button>
              {project.is_active && (
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/proyectos/${project.slug}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver en Portal
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Developer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Desarrollador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {project.logo_url ? (
                  <div className="relative w-12 h-12 rounded bg-gray-50">
                    <Image
                      src={project.logo_url}
                      alt={project.developer || 'Logo'}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{project.developer || 'Sin especificar'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ubicacion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{project.city}</p>
              {project.neighborhood && (
                <p className="text-sm text-gray-600">{project.neighborhood}</p>
              )}
              {project.address && (
                <p className="text-sm text-gray-500">{project.address}</p>
              )}
              {project.latitude && project.longitude && (
                <p className="text-xs text-gray-400 font-mono">
                  {project.latitude}, {project.longitude}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informacion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Creado:</span>
                <span>{formatDate(project.created_at)}</span>
              </div>

              {project.completion_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Entrega:</span>
                  <span>{formatDate(project.completion_date)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Media Links */}
          {(project.video_url || project.brochure_url) && (
            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {project.video_url && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href={project.video_url} target="_blank" rel="noopener noreferrer">
                      <Video className="h-4 w-4 mr-2" />
                      Ver Video
                    </a>
                  </Button>
                )}
                {project.brochure_url && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href={project.brochure_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Brochure
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadatos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Slug</span>
                <span className="font-mono text-xs truncate max-w-[150px]">
                  {project.slug}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Actualizado</span>
                <span>{formatDate(project.updated_at)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
