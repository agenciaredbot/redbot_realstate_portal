import { Suspense } from 'react';
import Link from 'next/link';
import {
  Building2,
  Plus,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  ExternalLink,
  Settings,
  Trash2,
  Globe,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Tenant } from '@/types/tenant';

// Get all tenants
async function getAllTenants() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tenants:', error);
    return [];
  }

  return data as Tenant[];
}

// Get tenant stats
async function getTenantStats(tenantId: string) {
  const supabase = createAdminClient();

  const [propertiesResult, agentsResult, usersResult] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
    supabase.from('agents').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
  ]);

  return {
    properties: propertiesResult.count || 0,
    agents: agentsResult.count || 0,
    users: usersResult.count || 0,
  };
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

// Tenant Row Component
async function TenantRow({ tenant }: { tenant: Tenant }) {
  const stats = await getTenantStats(tenant.id);

  const tenantUrl = tenant.domain
    ? `https://${tenant.domain}`
    : tenant.subdomain
    ? `https://${tenant.subdomain}.redbot.io`
    : null;

  return (
    <tr className="hover:bg-gray-50">
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
          <div className="text-gray-900">{stats.properties} propiedades</div>
          <div className="text-gray-500">{stats.agents} agentes • {stats.users} usuarios</div>
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
}

// Tenants Table Loading
function TenantsLoading() {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Tenants Table Content
async function TenantsTable() {
  const tenants = await getAllTenants();

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Todos los Tenants</h2>
          <p className="text-sm text-gray-500">{tenants.length} tenants registrados</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar tenants..."
              className="pl-9 w-64"
            />
          </div>
          <Link href="/super-admin/tenants/nuevo">
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Tenant
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      {tenants.length === 0 ? (
        <div className="p-12 text-center">
          <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tenants</h3>
          <p className="text-gray-500 mb-6">Comienza creando tu primer tenant</p>
          <Link href="/super-admin/tenants/nuevo">
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Crear Tenant
            </Button>
          </Link>
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
              {tenants.map((tenant) => (
                <Suspense
                  key={tenant.id}
                  fallback={
                    <tr>
                      <td colSpan={6} className="px-6 py-4">
                        <div className="h-10 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  }
                >
                  <TenantRow tenant={tenant} />
                </Suspense>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function TenantsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Tenants</h1>
        <p className="text-gray-500 mt-1">Administra las inmobiliarias registradas en la plataforma</p>
      </div>

      <Suspense fallback={<TenantsLoading />}>
        <TenantsTable />
      </Suspense>
    </div>
  );
}
