'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ContactSubmissionWithDetails, UserRole } from '@/types/admin';
import { USER_ROLES } from '@/types/admin';
import {
  Mail,
  Phone,
  MessageSquare,
  MoreHorizontal,
  Search,
  Building2,
  User,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
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
import { cn, formatDate } from '@/lib/utils';

interface LeadsTableProps {
  submissions: ContactSubmissionWithDetails[];
  total: number;
  userRole: UserRole;
  agentId: string | null;
}

const LEAD_STATUSES = {
  nuevo: { label: 'Nuevo', color: 'bg-blue-100 text-blue-800', icon: Clock },
  contactado: { label: 'Contactado', color: 'bg-yellow-100 text-yellow-800', icon: MessageSquare },
  en_seguimiento: { label: 'En Seguimiento', color: 'bg-purple-100 text-purple-800', icon: User },
  convertido: { label: 'Convertido', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  descartado: { label: 'Descartado', color: 'bg-gray-100 text-gray-800', icon: XCircle },
};

export function LeadsTable({
  submissions,
  total,
  userRole,
  agentId,
}: LeadsTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = userRole === USER_ROLES.ADMIN;

  // Filter submissions
  const filteredSubmissions = submissions.filter((submission) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      submission.first_name.toLowerCase().includes(searchLower) ||
      submission.last_name.toLowerCase().includes(searchLower) ||
      submission.email.toLowerCase().includes(searchLower) ||
      submission.phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === 'all' || submission.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (submissionId: string, newStatus: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/leads/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(LEAD_STATUSES).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Mostrando {filteredSubmissions.length} de {total} leads
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contacto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Propiedad</TableHead>
              <TableHead>Estado</TableHead>
              {isAdmin && <TableHead>Agente</TableHead>}
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 7 : 6}
                  className="text-center py-10 text-gray-500"
                >
                  No se encontraron leads
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => {
                const statusInfo = LEAD_STATUSES[submission.status as keyof typeof LEAD_STATUSES] ||
                  LEAD_STATUSES.nuevo;
                const StatusIcon = statusInfo.icon;

                return (
                  <TableRow key={submission.id}>
                    {/* Contact Info */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">
                          {submission.first_name} {submission.last_name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          <a
                            href={`mailto:${submission.email}`}
                            className="hover:text-primary"
                          >
                            {submission.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          <a
                            href={`tel:${submission.phone}`}
                            className="hover:text-primary"
                          >
                            {submission.phone}
                          </a>
                        </div>
                      </div>
                    </TableCell>

                    {/* Inquiry Type */}
                    <TableCell>
                      <Badge variant="outline">{submission.inquiry_type}</Badge>
                    </TableCell>

                    {/* Property */}
                    <TableCell>
                      {submission.property ? (
                        <Link
                          href={`/propiedades/${submission.property.slug}`}
                          target="_blank"
                          className="flex items-center gap-2 text-sm hover:text-primary"
                        >
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="line-clamp-1 max-w-[150px]">
                            {submission.property.title}
                          </span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge className={cn(statusInfo.color)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>

                    {/* Agent (Admin only) */}
                    {isAdmin && (
                      <TableCell>
                        {submission.agent ? (
                          <span className="text-sm">
                            {submission.agent.first_name}{' '}
                            {submission.agent.last_name}
                          </span>
                        ) : (
                          <span className="text-gray-400">Sin asignar</span>
                        )}
                      </TableCell>
                    )}

                    {/* Date */}
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {formatDate(submission.created_at)}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={isLoading}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* View Message */}
                          {submission.message && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  alert(`Mensaje:\n\n${submission.message}`)
                                }
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Ver mensaje
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}

                          {/* Status Actions */}
                          {Object.entries(LEAD_STATUSES).map(
                            ([key, { label }]) => (
                              <DropdownMenuItem
                                key={key}
                                onClick={() =>
                                  handleUpdateStatus(submission.id, key)
                                }
                                disabled={submission.status === key}
                              >
                                Marcar como {label}
                              </DropdownMenuItem>
                            )
                          )}

                          {/* Contact Links */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <a href={`mailto:${submission.email}`}>
                              <Mail className="h-4 w-4 mr-2" />
                              Enviar email
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a
                              href={`https://wa.me/${submission.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              WhatsApp
                            </a>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
