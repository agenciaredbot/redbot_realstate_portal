'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { PropertyWithSubmission } from '@/types/admin';
import {
  Building2,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  User,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatPrice, formatDate } from '@/lib/utils';

interface PendingPropertiesListProps {
  properties: PropertyWithSubmission[];
  total: number;
}

export function PendingPropertiesList({
  properties,
  total,
}: PendingPropertiesListProps) {
  const router = useRouter();
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyWithSubmission | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async (propertyId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/properties/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al aprobar la propiedad');
      }
    } catch (error) {
      console.error('Error approving property:', error);
      alert('Error al aprobar la propiedad');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProperty || !rejectReason.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/properties/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: selectedProperty.id,
          reason: rejectReason,
        }),
      });

      if (res.ok) {
        setIsRejectDialogOpen(false);
        setSelectedProperty(null);
        setRejectReason('');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al rechazar la propiedad');
      }
    } catch (error) {
      console.error('Error rejecting property:', error);
      alert('Error al rechazar la propiedad');
    } finally {
      setIsLoading(false);
    }
  };

  const openRejectDialog = (property: PropertyWithSubmission) => {
    setSelectedProperty(property);
    setRejectReason('');
    setIsRejectDialogOpen(true);
  };

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay propiedades pendientes
            </h3>
            <p className="text-gray-500">
              Todas las propiedades han sido revisadas
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="text-sm text-gray-500 mb-4">
        {total} propiedad(es) pendiente(s) de aprobación
      </div>

      <div className="grid grid-cols-1 gap-4">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Property Image Placeholder */}
                <div className="w-full lg:w-64 h-48 lg:h-auto bg-gray-100 flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-gray-300" />
                </div>

                {/* Property Details */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-3">
                      {/* Title and Type */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {property.title}
                          </h3>
                          <Badge
                            variant={
                              property.status === 'venta'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {property.status === 'venta' ? 'Venta' : 'Arriendo'}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          {formatPrice(property.price)}
                        </p>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {property.city} • {property.property_type}
                        </span>
                      </div>

                      {/* Submitter Info */}
                      {property.submitter && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4" />
                          <span>
                            Enviado por:{' '}
                            <span className="font-medium">
                              {property.submitter.full_name ||
                                property.submitter.email}
                            </span>
                          </span>
                        </div>
                      )}

                      {/* Date */}
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Enviado el {formatDate(property.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row lg:flex-col gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="flex-1 lg:flex-none"
                      >
                        <Link href={`/admin/propiedades/${property.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </Link>
                      </Button>

                      <Button
                        onClick={() => handleApprove(property.id)}
                        disabled={isLoading}
                        className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprobar
                      </Button>

                      <Button
                        onClick={() => openRejectDialog(property)}
                        disabled={isLoading}
                        variant="destructive"
                        className="flex-1 lg:flex-none"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Rechazar Propiedad
            </DialogTitle>
            <DialogDescription>
              {selectedProperty && (
                <>
                  Estás a punto de rechazar la propiedad &ldquo;
                  {selectedProperty.title}&rdquo;. El usuario será notificado
                  con el motivo del rechazo.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo del rechazo *
            </label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Escribe el motivo por el cual la propiedad no puede ser publicada..."
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Este mensaje será visible para el usuario que envió la propiedad.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isLoading || !rejectReason.trim()}
            >
              {isLoading ? 'Rechazando...' : 'Rechazar propiedad'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
