'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BlogPostDB } from '@/types/blog';
import {
  Eye,
  EyeOff,
  Star,
  StarOff,
  Trash2,
  AlertCircle,
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

interface BlogPostActionsProps {
  post: BlogPostDB;
}

export function BlogPostActions({ post }: BlogPostActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleTogglePublished = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/blog/toggle-published', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
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
      const res = await fetch('/api/admin/blog/toggle-featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
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
      const res = await fetch(`/api/admin/blog/${post.id}/delete`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/admin/blog');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar el post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el post');
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
              <h3 className="font-semibold text-gray-900">Acciones Rápidas</h3>
              <p className="text-sm text-gray-500">
                Gestiona el estado de este artículo
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleTogglePublished}
                disabled={isLoading}
                variant={post.is_published ? 'outline' : 'default'}
                className={!post.is_published ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {post.is_published ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Despublicar
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Publicar
                  </>
                )}
              </Button>

              <Button
                onClick={handleToggleFeatured}
                disabled={isLoading}
                variant="outline"
              >
                {post.is_featured ? (
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
              ¿Eliminar artículo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar el artículo &ldquo;{post.title}&rdquo;.
              Esta acción no se puede deshacer.
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
