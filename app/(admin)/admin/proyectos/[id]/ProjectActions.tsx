'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectDB } from '@/types/project-db';
import {
  Eye,
  EyeOff,
  Star,
  StarOff,
  Trash2,
  AlertCircle,
  Power,
  PowerOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProjectActionsProps {
  project: ProjectDB;
}

export function ProjectActions({ project }: ProjectActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleToggleActive = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/projects/toggle-active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al cambiar el estado');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar el estado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFeatured = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/projects/toggle-featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al cambiar el estado');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar el estado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}/delete`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/admin/proyectos');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar el proyecto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el proyecto');
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Acciones Rapidas</h3>
              <p className="text-sm text-gray-500">
                Gestiona el estado de este proyecto
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleToggleActive}
                disabled={isLoading}
                variant={project.is_active ? 'outline' : 'default'}
                className={!project.is_active ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {project.is_active ? (
                  <>
                    <PowerOff className="h-4 w-4 mr-2" />
                    Desactivar
                  </>
                ) : (
                  <>
                    <Power className="h-4 w-4 mr-2" />
                    Activar
                  </>
                )}
              </Button>

              <Button
                onClick={handleToggleFeatured}
                disabled={isLoading}
                variant="outline"
              >
                {project.is_featured ? (
                  <>
                    <StarOff className="h-4 w-4 mr-2" />
                    Quitar Destacado
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Destacar
                  </>
                )}
              </Button>

              <Button
                onClick={() => setShowDeleteDialog(true)}
                disabled={isLoading}
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              ¿Eliminar proyecto?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Estas a punto de eliminar el proyecto &ldquo;{project.name}&rdquo;.
              Esta accion no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
