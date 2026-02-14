import { Suspense } from 'react';
import {
  Building2,
  Users,
  Home,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/server';

// Stats Card Component
function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-100',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

// Get global stats
async function getGlobalStats() {
  const supabase = createAdminClient();

  // Get all counts in parallel
  const [
    tenantsResult,
    activeTenantsResult,
    usersResult,
    propertiesResult,
    projectsResult,
    leadsResult,
  ] = await Promise.all([
    supabase.from('tenants').select('id', { count: 'exact', head: true }),
    supabase.from('tenants').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('properties').select('id', { count: 'exact', head: true }),
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalTenants: tenantsResult.count || 0,
    activeTenants: activeTenantsResult.count || 0,
    totalUsers: usersResult.count || 0,
    totalProperties: propertiesResult.count || 0,
    totalProjects: projectsResult.count || 0,
    totalLeads: leadsResult.count || 0,
  };
}

// Get recent tenants
async function getRecentTenants() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('tenants')
    .select('id, name, slug, plan, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching recent tenants:', error);
    return [];
  }

  return data || [];
}

// Get tenant stats by plan
async function getTenantsByPlan() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('tenants')
    .select('plan');

  if (error) {
    console.error('Error fetching tenants by plan:', error);
    return {};
  }

  const planCounts: Record<string, number> = {};
  (data || []).forEach((t) => {
    planCounts[t.plan] = (planCounts[t.plan] || 0) + 1;
  });

  return planCounts;
}

// Stats Loading Skeleton
function StatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
          <div className="h-8 bg-gray-200 rounded w-16" />
        </div>
      ))}
    </div>
  );
}

// Dashboard Content
async function DashboardContent() {
  const [stats, recentTenants, planStats] = await Promise.all([
    getGlobalStats(),
    getRecentTenants(),
    getTenantsByPlan(),
  ]);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tenants"
          value={stats.totalTenants}
          subtitle={`${stats.activeTenants} activos`}
          icon={Building2}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        <StatsCard
          title="Total Usuarios"
          value={stats.totalUsers}
          icon={Users}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        <StatsCard
          title="Total Propiedades"
          value={stats.totalProperties}
          icon={Home}
          iconColor="text-amber-600"
          iconBg="bg-amber-100"
        />
        <StatsCard
          title="Total Leads"
          value={stats.totalLeads}
          icon={FileText}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tenants */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Tenants Recientes</h2>
          </div>
          <div className="divide-y">
            {recentTenants.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No hay tenants registrados
              </div>
            ) : (
              recentTenants.map((tenant) => (
                <div key={tenant.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tenant.is_active ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Building2 className={`w-5 h-5 ${
                        tenant.is_active ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{tenant.name}</p>
                      <p className="text-sm text-gray-500">{tenant.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      tenant.plan === 'enterprise'
                        ? 'bg-purple-100 text-purple-700'
                        : tenant.plan === 'professional'
                        ? 'bg-blue-100 text-blue-700'
                        : tenant.plan === 'starter'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {tenant.plan}
                    </span>
                    {tenant.is_active ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Plans Distribution */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Distribución por Plan</h2>
          </div>
          <div className="p-6 space-y-4">
            {Object.entries(planStats).length === 0 ? (
              <div className="text-center text-gray-500">
                No hay datos disponibles
              </div>
            ) : (
              Object.entries(planStats).map(([plan, count]) => {
                const total = Object.values(planStats).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

                const colors: Record<string, { bg: string; fill: string }> = {
                  enterprise: { bg: 'bg-purple-100', fill: 'bg-purple-500' },
                  professional: { bg: 'bg-blue-100', fill: 'bg-blue-500' },
                  starter: { bg: 'bg-green-100', fill: 'bg-green-500' },
                  free: { bg: 'bg-gray-100', fill: 'bg-gray-500' },
                };

                const color = colors[plan] || colors.free;

                return (
                  <div key={plan}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 capitalize">{plan}</span>
                      <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
                    </div>
                    <div className={`h-2 rounded-full ${color.bg}`}>
                      <div
                        className={`h-2 rounded-full ${color.fill}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/super-admin/tenants/nuevo"
            className="flex items-center gap-3 p-4 rounded-lg border border-dashed border-gray-300 hover:border-red-500 hover:bg-red-50 transition-colors"
          >
            <div className="p-2 bg-red-100 rounded-lg">
              <Building2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Crear Tenant</p>
              <p className="text-sm text-gray-500">Agregar nueva inmobiliaria</p>
            </div>
          </a>
          <a
            href="/super-admin/tenants"
            className="flex items-center gap-3 p-4 rounded-lg border border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Gestionar Tenants</p>
              <p className="text-sm text-gray-500">Ver y editar tenants</p>
            </div>
          </a>
          <a
            href="/super-admin/billing"
            className="flex items-center gap-3 p-4 rounded-lg border border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Ver Facturación</p>
              <p className="text-sm text-gray-500">Resumen de ingresos</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Global</h1>
        <p className="text-gray-500 mt-1">Vista general de la plataforma multi-tenant</p>
      </div>

      <Suspense fallback={<StatsLoading />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
