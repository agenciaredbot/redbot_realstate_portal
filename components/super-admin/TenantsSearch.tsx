'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  ExternalLink,
  Settings,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Tenant } from '@/types/tenant';

interface TenantWithStats extends Tenant {
  stats: {
    properties: number;
    agents: number;
    users: number;
  };
}

interface TenantsSearchProps {
  tenants: TenantWithStats[];
}

// Plan Badge Component
function PlanBadge({ plan }: { plan: string }) {
  const colors: Record<string, string> = {
    enterprise: 'bg-purple-100 text-purple-700 border-purple-200',
    professional: 'bg-blue-100 text-blue-700 border-blue-200',
    starter: 'bg-green-100 text-green-700 border-green-200',
    free: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${colors[plan] || colors.free}`}>
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  );
}

// Status Badge Component
function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
      isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      {isActive ? (
        <>
          <CheckCircle className="w-3 h-3" />
          Activo
        </>
      ) : (
        <>
          <XCircle className="w-3 h-3" />
          Inactivo
        </>
      )}
    </span>
  );
}

export function TenantsSearch({ tenants }: TenantsSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter tenants
  const filteredTenants = tenants.filter((tenant) => {
    // Search filter
    const searchMatch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.subdomain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.company_email?.toLowerCase().includes(searchTerm.toLowerCase());

    // Plan filter
    const planMatch = planFilter === 'all' || tenant.plan === planFilter;

    // Status filter
    const statusMatch =
      statusFilter === 'all' ||
      (statusFilter === 'active' && tenant.is_active) ||
      (statusFilter === 'inactive' && !tenant.is_active);

    return searchMatch && planMatch && statusMatch;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Todos los Tenants</h2>
            <p className="text-sm text-gray-500">
              {filteredTenants.length} de {tenants.length} tenants
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>

            {/* Plan Filter */}
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">Todos los planes</option>
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>

            <Link href="/super-admin/tenants/nuevo">
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Tenant
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredTenants.length === 0 ? (
        <div className="p-12 text-center">
          <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          {searchTerm || planFilter !== 'all' || statusFilter !== 'all' ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sin resultados</h3>
              <p className="text-gray-500 mb-6">No se encontraron tenants con los filtros aplicados</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setPlanFilter('all');
                  setStatusFilter('all');
                }}
              >
                Limpiar filtros
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tenants</h3>
              <p className="text-gray-500 mb-6">Comienza creando tu primer tenant</p>
              <Link href="/super-admin/tenants/nuevo">
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Tenant
                </Button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dominio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estadísticas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTenants.map((tenant) => {
                const tenantUrl = tenant.domain
                  ? `https://${tenant.domain}`
                  : tenant.subdomain
                  ? `https://${tenant.subdomain}.redbot.io`
                  : null;

                return (
                  <tr key={tenant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {tenant.logo_url ? (
                          <img
                            src={tenant.logo_url}
                            alt={tenant.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: tenant.primary_color + '20' }}
                          >
                            <Building2 className="w-5 h-5" style={{ color: tenant.primary_color }} />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/super-admin/tenants/${tenant.id}`}
                            className="font-medium text-gray-900 hover:text-red-600"
                          >
                            {tenant.name}
                          </Link>
                          <p className="text-sm text-gray-500">{tenant.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {tenantUrl ? (
                        <a
                          href={tenantUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Globe className="w-4 h-4" />
                          {tenant.domain || `${tenant.subdomain}.redbot.io`}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">Sin dominio</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <PlanBadge plan={tenant.plan} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{tenant.stats.properties} propiedades</div>
                        <div className="text-gray-500">
                          {tenant.stats.agents} agentes • {tenant.stats.users} usuarios
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge isActive={tenant.is_active} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/super-admin/tenants/${tenant.id}`}>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
