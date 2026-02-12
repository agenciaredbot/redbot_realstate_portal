'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { ProjectDB } from '@/types/project-db';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@/types/project-db';
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  Star,
  StarOff,
  Building2,
  Search,
  MapPin,
  Power,
  PowerOff,
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

interface ProjectsTableProps {
  projects: ProjectDB[];
  cities: string[];
}

function formatPrice(price: number | null): string {
  if (!price) return '-';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProjectsTable({ projects, cities }: ProjectsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      !search ||
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.developer?.toLowerCase().includes(search.toLowerCase()) ||
      project.city?.toLowerCase().includes(search.toLowerCase());

    const matchesCity =
      cityFilter === 'all' || project.city === cityFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      project.status === statusFilter ||
      (statusFilter === 'active' && project.is_active) ||
      (statusFilter === 'inactive' && !project.is_active) ||
      (statusFilter === 'featured' && project.is_featured);

    return matchesSearch && matchesCity && matchesStatus;
  });

  const handleToggleActive = async (projectId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/projects/toggle-active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
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

  const handleToggleFeatured = async (projectId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/projects/toggle-featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
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
    if (!deleteProjectId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/projects/${deleteProjectId}/delete`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeleteProjectId(null);
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
    }
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar proyectos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Ciudad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las ciudades</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
            <SelectItem value="featured">Destacados</SelectItem>
            <SelectItem value="preventa">Preventa</SelectItem>
            <SelectItem value="en_construccion">En Construccion</SelectItem>
            <SelectItem value="entrega_inmediata">Entrega Inmediata</SelectItem>
            <SelectItem value="vendido">Vendido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No hay proyectos
          </h3>
          <p className="text-gray-500 mb-4">
            {search || cityFilter !== 'all' || statusFilter !== 'all'
              ? 'No se encontraron proyectos con los filtros aplicados'
              : 'Comienza creando tu primer proyecto'}
          </p>
          {!search && cityFilter === 'all' && statusFilter === 'all' && (
            <Button asChild>
              <Link href="/admin/proyectos/nuevo">Crear Proyecto</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Proyecto
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Ubicacion
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Estado
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Precio Desde
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Unidades
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {project.images && project.images.length > 0 ? (
                        <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={project.images[0]}
                            alt={project.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-12 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-6 w-6 text-gray-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <Link
                          href={`/admin/proyectos/${project.id}`}
                          className="font-medium text-gray-900 hover:text-primary truncate block"
                        >
                          {project.name}
                        </Link>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {project.developer || 'Sin desarrollador'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      {project.city}
                      {project.neighborhood && `, ${project.neighborhood}`}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={PROJECT_STATUS_COLORS[project.status]}
                      >
                        {PROJECT_STATUS_LABELS[project.status]}
                      </Badge>
                      {!project.is_active && (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                          Inactivo
                        </Badge>
                      )}
                      {project.is_featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {formatPrice(project.price_from)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">
                        {project.available_units || 0}
                      </span>
                      <span className="text-gray-500">
                        {' '}/ {project.total_units || 0}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/proyectos/${project.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/proyectos/${project.id}/editar`}>
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
                          {project.is_active && (
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/proyectos/${project.slug}`}
                                target="_blank"
                                className="flex items-center"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ver en portal
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleToggleActive(project.id)}
                            disabled={isLoading}
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
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleFeatured(project.id)}
                            disabled={isLoading}
                          >
                            {project.is_featured ? (
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
                            onClick={() => setDeleteProjectId(project.id)}
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
        open={!!deleteProjectId}
        onOpenChange={() => setDeleteProjectId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. El proyecto sera eliminado
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
