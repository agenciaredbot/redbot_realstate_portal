import { Suspense } from 'react';
import { createAdminClient } from '@/lib/supabase/server';
import { TenantsSearch } from '@/components/super-admin/TenantsSearch';
import type { Tenant } from '@/types/tenant';

interface TenantWithStats extends Tenant {
  stats: {
    properties: number;
    agents: number;
    users: number;
  };
}

// Get all tenants with their stats
async function getAllTenantsWithStats(): Promise<TenantWithStats[]> {
  const supabase = createAdminClient();

  // Get all tenants
  const { data: tenants, error } = await supabase
    .from('tenants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tenants:', error);
    return [];
  }

  // Get stats for all tenants in parallel
  const tenantsWithStats = await Promise.all(
    (tenants as Tenant[]).map(async (tenant) => {
      const [propertiesResult, agentsResult, usersResult] = await Promise.all([
        supabase.from('properties').select('id', { count: 'exact', head: true }).eq('tenant_id', tenant.id),
        supabase.from('agents').select('id', { count: 'exact', head: true }).eq('tenant_id', tenant.id),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('tenant_id', tenant.id),
      ]);

      return {
        ...tenant,
        stats: {
          properties: propertiesResult.count || 0,
          agents: agentsResult.count || 0,
          users: usersResult.count || 0,
        },
      };
    })
  );

  return tenantsWithStats;
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
  const tenants = await getAllTenantsWithStats();

  return <TenantsSearch tenants={tenants} />;
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
