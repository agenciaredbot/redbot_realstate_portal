'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Users, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Tenant } from '@/types/tenant';

interface TenantActionsProps {
  tenant: Tenant;
}

export function TenantActions({ tenant }: TenantActionsProps) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isDefaultTenant = tenant.id === '00000000-0000-0000-0000-000000000001';

  const handleToggleActive = async () => {
    if (isDefaultTenant) {
      alert('No puedes desactivar el tenant por defecto');
      return;
    }

    setIsToggling(true);
    try {
      const response = await fetch(`/api/super-admin/tenants/${tenant.id}/toggle-active`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al cambiar estado');
      }

      router.refresh();
    } catch (error) {
      console.error('Error toggling tenant:', error);
      alert(error instanceof Error ? error.message : 'Error al cambiar estado del tenant');
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDefaultTenant) {
      alert('No puedes eliminar el tenant por defecto');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/super-admin/tenants/${tenant.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar tenant');
      }

      router.push('/super-admin/tenants');
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert(error instanceof Error ? error.message : 'Error al eliminar tenant');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h2>

      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/super-admin/tenants/${tenant.id}/editar`)}
        >
          <Settings className="w-4 h-4 mr-2" />
          Editar Configuración
        </Button>

        <Button
          variant="outline"
          disabled
          title="Próximamente"
        >
          <Users className="w-4 h-4 mr-2" />
          Impersonar Admin
        </Button>

        {!isDefaultTenant && (
          <>
            <Button
              variant="outline"
              onClick={handleToggleActive}
              disabled={isToggling}
              className={tenant.is_active
                ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
              }
            >
              {isToggling ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {tenant.is_active ? 'Desactivar Tenant' : 'Activar Tenant'}
            </Button>

            {!showDeleteConfirm ? (
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar Tenant
              </Button>
            ) : (
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                <span className="text-sm text-red-700">¿Confirmar eliminación?</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Sí, eliminar'
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </>
        )}

        {isDefaultTenant && (
          <p className="text-sm text-gray-500 italic">
            Este es el tenant por defecto y no puede ser modificado ni eliminado.
          </p>
        )}
      </div>
    </div>
  );
}
