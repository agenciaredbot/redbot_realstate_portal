'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { PropertyWithSubmission, UserRole } from '@/types/admin';
import { USER_ROLES, SUBMISSION_STATUS_LABELS, SUBMISSION_STATUS_COLORS } from '@/types/admin';
import {
  Building2,
  Eye,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Power,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn, formatPrice } from '@/lib/utils';

interface PropertiesTableProps {
  properties: PropertyWithSubmission[];
  total: number;
  userRole: UserRole;
  userId: string;
}

export function PropertiesTable({
  properties,
  total,
  userRole,
  userId,
}: PropertiesTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [submissionFilter, setSubmissionFilter] = useState<string>('all');

  const isAdmin = userRole === USER_ROLES.ADMIN;
  const isAgent = userRole === USER_ROLES.AGENT;

  // Filter properties
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      searchQuery === '' ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || property.status === statusFilter;

    const matchesSubmission =
      submissionFilter === 'all' ||
      property.submission_status === submissionFilter;

    return matchesSearch && matchesStatus && matchesSubmission;
  });

  const handleToggleActive = async (propertyId: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/admin/properties/toggle-active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, isActive: !currentActive }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error toggling property:', error);
    }
  };

  const handleToggleFeatured = async (propertyId: string, currentFeatured: boolean) => {
    try {
      const res = await fetch('/api/admin/properties/toggle-featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, isFeatured: !currentFeatured }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por título o ciudad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="venta">Venta</SelectItem>
                <SelectItem value="arriendo">Arriendo</SelectItem>
              </SelectContent>
            </Select>

            {/* Submission Status Filter (Admin only) */}
            {isAdmin && (
              <Select value={submissionFilter} onValueChange={setSubmissionFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="approved">Aprobadas</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="rejected">Rechazadas</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Create Button */}
            {(isAdmin || userRole === USER_ROLES.USER) && (
              <Button asChild>
                <Link href="/admin/propiedades/nueva">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Propiedad
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Mostrando {filteredProperties.length} de {total} propiedades
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Propiedad</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              {isAdmin && <TableHead>Enviado por</TableHead>}
              {(isAdmin || isAgent) && <TableHead>Agente</TableHead>}
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 7 : 5}
                  className="text-center py-10 text-gray-500"
                >
                  No se encontraron propiedades
                </TableCell>
              </TableRow>
            ) : (
              filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  {/* Property Info */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Building2 className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {property.title}
                          {property.is_featured && (
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.city} • {property.property_type}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell>
                    <Badge
                      variant={
                        property.status === 'venta' ? 'default' : 'secondary'
                      }
                    >
                      {property.status === 'venta' ? 'Venta' : 'Arriendo'}
                    </Badge>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="font-medium">
                    {formatPrice(property.price)}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Submission Status */}
                      <Badge
                        className={cn(
                          SUBMISSION_STATUS_COLORS[property.submission_status]
                        )}
                      >
                        {property.submission_status === 'approved' && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {property.submission_status === 'pending' && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {property.submission_status === 'rejected' && (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {SUBMISSION_STATUS_LABELS[property.submission_status]}
                      </Badge>

                      {/* Active Status */}
                      {property.submission_status === 'approved' && (
                        <Badge
                          variant={property.is_active ? 'default' : 'outline'}
                          className={cn(
                            property.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'text-gray-500'
                          )}
                        >
                          {property.is_active ? 'Activa' : 'Inactiva'}
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* Submitted By (Admin only) */}
                  {isAdmin && (
                    <TableCell>
                      {property.submitter ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {property.submitter.full_name || property.submitter.email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                  )}

                  {/* Agent */}
                  {(isAdmin || isAgent) && (
                    <TableCell>
                      {property.agent ? (
                        <span className="text-sm">
                          {property.agent.first_name} {property.agent.last_name}
                        </span>
                      ) : (
                        <span className="text-gray-400">Sin asignar</span>
                      )}
                    </TableCell>
                  )}

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/propiedades/${property.slug}`} target="_blank">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver en portal
                          </Link>
                        </DropdownMenuItem>

                        {(isAdmin ||
                          property.submitted_by === userId) && (
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/propiedades/${property.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                        )}

                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleActive(property.id, property.is_active)
                              }
                            >
                              <Power className="h-4 w-4 mr-2" />
                              {property.is_active ? 'Desactivar' : 'Activar'}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleFeatured(
                                  property.id,
                                  property.is_featured
                                )
                              }
                            >
                              <Star className="h-4 w-4 mr-2" />
                              {property.is_featured
                                ? 'Quitar destacado'
                                : 'Destacar'}
                            </DropdownMenuItem>

                            {property.submission_status === 'pending' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/admin/propiedades/pendientes?id=${property.id}`}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Revisar
                                  </Link>
                                </DropdownMenuItem>
                              </>
                            )}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
