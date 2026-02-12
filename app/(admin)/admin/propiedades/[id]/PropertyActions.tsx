'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PropertyActionsProps {
  propertyId: string;
  propertyTitle: string;
}

export function PropertyActions({ propertyId, propertyTitle }: PropertyActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/properties/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      });

      if (res.ok) {
        router.refresh();
        router.push('/admin/propiedades/pendientes');
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
    if (!rejectReason.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/properties/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          reason: rejectReason,
        }),
      });

      if (res.ok) {
        setIsRejectDialogOpen(false);
        router.refresh();
        router.push('/admin/propiedades/pendientes');
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

  return (
    <>
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-yellow-800">Propiedad Pendiente de Aprobación</h3>
              <p className="text-sm text-yellow-700">
                Revisa los detalles y decide si aprobar o rechazar esta propiedad.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleApprove}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprobar
              </Button>
              <Button
                onClick={() => setIsRejectDialogOpen(true)}
                disabled={isLoading}
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rechazar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Rechazar Propiedad
            </DialogTitle>
            <DialogDescription>
              Estás a punto de rechazar la propiedad &ldquo;{propertyTitle}&rdquo;.
              El usuario será notificado con el motivo del rechazo.
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
