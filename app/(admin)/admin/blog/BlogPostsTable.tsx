'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPostDB } from '@/types/blog';
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  Star,
  StarOff,
  FileText,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { formatDate } from '@/lib/utils';

interface BlogPostsTableProps {
  posts: BlogPostDB[];
  categories: string[];
}

export function BlogPostsTable({ posts, categories }: BlogPostsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || post.category === categoryFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && post.is_published) ||
      (statusFilter === 'draft' && !post.is_published) ||
      (statusFilter === 'featured' && post.is_featured);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleTogglePublished = async (postId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/blog/toggle-published', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
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

  const handleToggleFeatured = async (postId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/blog/toggle-featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
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
    if (!deletePostId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/${deletePostId}/delete`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeletePostId(null);
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
    }
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar artículos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="draft">Borradores</SelectItem>
            <SelectItem value="featured">Destacados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No hay artículos
          </h3>
          <p className="text-gray-500 mb-4">
            {search || categoryFilter !== 'all' || statusFilter !== 'all'
              ? 'No se encontraron artículos con los filtros aplicados'
              : 'Comienza creando tu primer artículo'}
          </p>
          {!search && categoryFilter === 'all' && statusFilter === 'all' && (
            <Button asChild>
              <Link href="/admin/blog/nuevo">Crear Artículo</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Artículo
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Categoría
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Estado
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Fecha
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Vistas
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {post.featured_image ? (
                        <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-12 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-6 w-6 text-gray-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="font-medium text-gray-900 hover:text-primary truncate block"
                        >
                          {post.title}
                        </Link>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {post.excerpt || 'Sin descripción'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {post.category ? (
                      <Badge variant="outline">{post.category}</Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={post.is_published ? 'default' : 'secondary'}
                        className={
                          post.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {post.is_published ? 'Publicado' : 'Borrador'}
                      </Badge>
                      {post.is_featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {post.published_at
                      ? formatDate(post.published_at)
                      : formatDate(post.created_at)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {post.views_count || 0}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/blog/${post.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/blog/${post.id}/editar`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {post.is_published && (
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                className="flex items-center"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ver en portal
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleTogglePublished(post.id)}
                            disabled={isLoading}
                          >
                            {post.is_published ? (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Despublicar
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Publicar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleFeatured(post.id)}
                            disabled={isLoading}
                          >
                            {post.is_featured ? (
                              <>
                                <StarOff className="h-4 w-4 mr-2" />
                                Quitar destacado
                              </>
                            ) : (
                              <>
                                <Star className="h-4 w-4 mr-2" />
                                Destacar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeletePostId(post.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletePostId}
        onOpenChange={() => setDeletePostId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar artículo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El artículo será eliminado
              permanentemente.
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
