import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getUserProfile } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { USER_ROLES } from '@/types/admin';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  User,
  Calendar,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyActions } from './PropertyActions';
import { CopyLinkButtons } from './CopyLinkButtons';

export const dynamic = 'force-dynamic';

interface PropertyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getPropertyById(id: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      agent:agents(*),
      submitter:profiles!properties_submitted_by_fkey(id, full_name, email)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching property:', error);
    return null;
  }

  return data;
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const profile = await getUserProfile();
  const { id } = await params;

  if (!profile) {
    redirect('/login');
  }

  // Only admins can access this page
  if (profile.role !== USER_ROLES.ADMIN) {
    redirect('/admin/dashboard');
  }

  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    pending: 'Pendiente',
    approved: 'Aprobada',
    rejected: 'Rechazada',
  };

  const statusIcons = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
  };

  const StatusIcon = statusIcons[property.submission_status as keyof typeof statusIcons] || Clock;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/propiedades">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
            <p className="text-gray-500 text-sm">ID: {property.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusColors[property.submission_status as keyof typeof statusColors]}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusLabels[property.submission_status as keyof typeof statusLabels]}
          </Badge>
          {property.is_active ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Activa
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              Inactiva
            </Badge>
          )}
        </div>
      </div>

      {/* Action Buttons for Pending Properties */}
      {property.submission_status === 'pending' && (
        <PropertyActions propertyId={property.id} propertyTitle={property.title} />
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Imágenes</CardTitle>
            </CardHeader>
            <CardContent>
              {property.images && property.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.images.map((image: string, index: number) => (
                    <div
                      key={index}
                      className={`relative aspect-video rounded-lg overflow-hidden ${
                        index === 0 ? 'col-span-2 row-span-2' : ''
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${property.title} - Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                          Principal
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                  <div className="text-center text-gray-400">
                    <Building2 className="h-12 w-12 mx-auto mb-2" />
                    <p>Sin imágenes</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              {property.description ? (
                <p className="text-gray-600 whitespace-pre-wrap">{property.description}</p>
              ) : (
                <p className="text-gray-400 italic">Sin descripción</p>
              )}
            </CardContent>
          </Card>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rejection Reason */}
          {property.submission_status === 'rejected' && property.rejection_reason && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">Motivo del Rechazo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">{property.rejection_reason}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price & Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Precio</p>
                <p className="text-2xl font-bold text-primary">{formatPrice(property.price)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-medium capitalize">{property.property_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transacción</p>
                  <Badge variant={property.status === 'venta' ? 'default' : 'secondary'}>
                    {property.status === 'venta' ? 'Venta' : 'Arriendo'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{property.city}</span>
                {property.neighborhood && <span>• {property.neighborhood}</span>}
              </div>

              {property.address && (
                <div className="text-sm text-gray-500">{property.address}</div>
              )}
            </CardContent>
          </Card>

          {/* Characteristics */}
          <Card>
            <CardHeader>
              <CardTitle>Características</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Bed className="h-5 w-5 mx-auto mb-1 text-gray-400" />
                  <p className="font-semibold">{property.bedrooms || 0}</p>
                  <p className="text-xs text-gray-500">Habitaciones</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Bath className="h-5 w-5 mx-auto mb-1 text-gray-400" />
                  <p className="font-semibold">{property.bathrooms || 0}</p>
                  <p className="text-xs text-gray-500">Baños</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Square className="h-5 w-5 mx-auto mb-1 text-gray-400" />
                  <p className="font-semibold">{property.area_m2 || 0}</p>
                  <p className="text-xs text-gray-500">m²</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submitter Info */}
          {property.submitter && (
            <Card>
              <CardHeader>
                <CardTitle>Enviado por</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">
                    {property.submitter.full_name || property.submitter.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Enviado el {formatDate(property.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Agent Info */}
          {property.agent && (
            <Card>
              <CardHeader>
                <CardTitle>Agente Asignado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-3">
                  {property.agent.photo_url ? (
                    <Image
                      src={property.agent.photo_url}
                      alt={property.agent.first_name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {property.agent.first_name} {property.agent.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{property.agent.email}</p>
                  </div>
                </div>
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
                <span className="text-gray-500">Código</span>
                <span className="font-mono">{property.reference_code || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Slug</span>
                <span className="font-mono text-xs">{property.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Creado</span>
                <span>{formatDate(property.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Actualizado</span>
                <span>{formatDate(property.updated_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Destacada</span>
                <span>{property.is_featured ? 'Sí' : 'No'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Button asChild className="w-full" variant="outline">
                <Link href={`/admin/propiedades/${property.id}/editar`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Propiedad
                </Link>
              </Button>
              {property.submission_status === 'approved' && property.is_active && (
                <Button asChild className="w-full" variant="secondary">
                  <Link href={`/propiedades/${property.slug}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver en Portal
                  </Link>
                </Button>
              )}

              {/* Copy Links */}
              {property.slug && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-500 mb-2">Compartir propiedad</p>
                  <CopyLinkButtons slug={property.slug} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
