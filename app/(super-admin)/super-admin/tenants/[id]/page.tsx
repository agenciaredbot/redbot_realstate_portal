import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Globe,
  Users,
  Home,
  FileText,
  Settings,
  ExternalLink,
  Mail,
  Phone,
  Calendar,
  Shield,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import type { Tenant } from '@/types/tenant';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Get tenant by ID
async function getTenantById(id: string): Promise<Tenant | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching tenant:', error);
    return null;
  }

  return data as Tenant;
}

// Get tenant statistics
async function getTenantStats(tenantId: string) {
  const supabase = createAdminClient();

  const [
    propertiesResult,
    agentsResult,
    usersResult,
    leadsResult,
    projectsResult,
    blogResult,
  ] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
    supabase.from('agents').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
    supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
  ]);

  return {
    properties: propertiesResult.count || 0,
    agents: agentsResult.count || 0,
    users: usersResult.count || 0,
    leads: leadsResult.count || 0,
    projects: projectsResult.count || 0,
    blogPosts: blogResult.count || 0,
  };
}

// Get recent users for tenant
async function getTenantUsers(tenantId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email, role, is_active, created_at')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching tenant users:', error);
    return [];
  }

  return data || [];
}

// Stats Card Component
function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-100',
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
}

// Role labels
const roleLabels: Record<number, string> = {
  0: 'Super Admin',
  1: 'Admin',
  2: 'Agente',
  3: 'Usuario',
};

// Tenant Detail Content
async function TenantDetailContent({ id }: { id: string }) {
  const [tenant, stats, users] = await Promise.all([
    getTenantById(id),
    getTenantStats(id),
    getTenantUsers(id),
  ]);

  if (!tenant) {
    notFound();
  }

  const tenantUrl = tenant.domain
    ? `https://${tenant.domain}`
    : tenant.subdomain
    ? `https://${tenant.subdomain}.redbot.io`
    : null;

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div
          className="h-32"
          style={{
            background: `linear-gradient(135deg, ${tenant.primary_color} 0%, ${tenant.secondary_color} 100%)`,
          }}
        />
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-12">
            <div className="flex items-end gap-4">
              {tenant.logo_url ? (
                <img
                  src={tenant.logo_url}
                  alt={tenant.name}
                  className="w-24 h-24 rounded-xl border-4 border-white bg-white object-cover shadow-lg"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-xl border-4 border-white bg-white flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: tenant.primary_color + '20' }}
                >
                  <Building2 className="w-10 h-10" style={{ color: tenant.primary_color }} />
                </div>
              )}
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{tenant.name}</h1>
                <p className="text-gray-500">{tenant.slug}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                tenant.is_active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {tenant.is_active ? 'Activo' : 'Inactivo'}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                tenant.plan === 'enterprise'
                  ? 'bg-purple-100 text-purple-700'
                  : tenant.plan === 'professional'
                  ? 'bg-blue-100 text-blue-700'
                  : tenant.plan === 'starter'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Propiedades"
          value={stats.properties}
          icon={Home}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        <StatsCard
          title="Agentes"
          value={stats.agents}
          icon={Users}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        <StatsCard
          title="Usuarios"
          value={stats.users}
          icon={Shield}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        <StatsCard
          title="Proyectos"
          value={stats.projects}
          icon={Building2}
          iconColor="text-amber-600"
          iconBg="bg-amber-100"
        />
        <StatsCard
          title="Blog Posts"
          value={stats.blogPosts}
          icon={FileText}
          iconColor="text-pink-600"
          iconBg="bg-pink-100"
        />
        <StatsCard
          title="Leads"
          value={stats.leads}
          icon={Mail}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-100"
        />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tenant Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Tenant</h2>
          <div className="space-y-4">
            {tenantUrl && (
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Sitio web</p>
                  <a
                    href={tenantUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    {tenant.domain || `${tenant.subdomain}.redbot.io`}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
            {tenant.company_email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{tenant.company_email}</p>
                </div>
              </div>
            )}
            {tenant.company_phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="text-gray-900">{tenant.company_phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Fecha de registro</p>
                <p className="text-gray-900">
                  {new Date(tenant.created_at).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Límites del Plan</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Propiedades</span>
                  <span className="text-gray-900">{stats.properties} / {tenant.max_properties}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${Math.min((stats.properties / tenant.max_properties) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Agentes</span>
                  <span className="text-gray-900">{stats.agents} / {tenant.max_agents}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${Math.min((stats.agents / tenant.max_agents) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Usuarios Recientes</h2>
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay usuarios registrados</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                      {user.first_name?.[0] || user.email?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Sin nombre'}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-gray-500">
                      {roleLabels[user.role] || 'Usuario'}
                    </span>
                    <p className={`text-xs ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {user.is_active ? 'Activo' : 'Inactivo'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Editar Configuración
          </Button>
          <Button variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Impersonar Admin
          </Button>
          {tenant.is_active ? (
            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
              Desactivar Tenant
            </Button>
          ) : (
            <Button variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50">
              Activar Tenant
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading skeleton
function TenantDetailLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="h-32 bg-gray-200" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-12">
            <div className="w-24 h-24 rounded-xl bg-gray-300" />
            <div className="mb-2">
              <div className="h-6 bg-gray-200 rounded w-48 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border p-4">
            <div className="h-12 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function TenantDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/super-admin/tenants"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver a Tenants
        </Link>
      </div>

      <Suspense fallback={<TenantDetailLoading />}>
        <TenantDetailContent id={id} />
      </Suspense>
    </div>
  );
}
