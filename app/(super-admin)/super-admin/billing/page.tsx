import { Suspense } from 'react';
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
  Building2,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/server';

// Get billing stats
async function getBillingStats() {
  const supabase = createAdminClient();

  // Get tenants by plan
  const { data: tenants, error } = await supabase
    .from('tenants')
    .select('plan, is_active');

  if (error) {
    console.error('Error fetching billing stats:', error);
    return {
      totalTenants: 0,
      activeTenants: 0,
      planBreakdown: {},
      estimatedMRR: 0,
    };
  }

  // Plan prices (example prices in USD)
  const planPrices: Record<string, number> = {
    free: 0,
    starter: 49,
    professional: 149,
    enterprise: 499,
  };

  const planBreakdown: Record<string, number> = {};
  let estimatedMRR = 0;
  let activeTenants = 0;

  (tenants || []).forEach((tenant) => {
    planBreakdown[tenant.plan] = (planBreakdown[tenant.plan] || 0) + 1;
    if (tenant.is_active) {
      activeTenants++;
      estimatedMRR += planPrices[tenant.plan] || 0;
    }
  });

  return {
    totalTenants: tenants?.length || 0,
    activeTenants,
    planBreakdown,
    estimatedMRR,
  };
}

// Stats Card
function StatsCard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-100',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {trend && trendLabel && (
          <span className={`inline-flex items-center text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> :
             trend === 'down' ? <ArrowDown className="w-4 h-4 mr-1" /> : null}
            {trendLabel}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

// Billing Content
async function BillingContent() {
  const stats = await getBillingStats();

  const planPrices: Record<string, number> = {
    free: 0,
    starter: 49,
    professional: 149,
    enterprise: 499,
  };

  const planColors: Record<string, string> = {
    free: 'bg-gray-100 text-gray-700',
    starter: 'bg-green-100 text-green-700',
    professional: 'bg-blue-100 text-blue-700',
    enterprise: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="MRR Estimado"
          value={`$${stats.estimatedMRR.toLocaleString()}`}
          subtitle="Ingresos mensuales recurrentes"
          trend="up"
          trendLabel="+12%"
          icon={DollarSign}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        <StatsCard
          title="ARR Estimado"
          value={`$${(stats.estimatedMRR * 12).toLocaleString()}`}
          subtitle="Ingresos anuales recurrentes"
          icon={TrendingUp}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        <StatsCard
          title="Tenants Activos"
          value={stats.activeTenants}
          subtitle={`de ${stats.totalTenants} totales`}
          icon={Building2}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        <StatsCard
          title="Churn Rate"
          value="2.5%"
          subtitle="Últimos 30 días"
          trend="down"
          trendLabel="-0.5%"
          icon={Users}
          iconColor="text-amber-600"
          iconBg="bg-amber-100"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Plan */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Ingresos por Plan</h2>
          <div className="space-y-4">
            {['enterprise', 'professional', 'starter', 'free'].map((plan) => {
              const count = stats.planBreakdown[plan] || 0;
              const revenue = count * planPrices[plan];
              const percentage = stats.estimatedMRR > 0
                ? Math.round((revenue / stats.estimatedMRR) * 100)
                : 0;

              return (
                <div key={plan}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${planColors[plan]}`}>
                        {plan.charAt(0).toUpperCase() + plan.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">{count} tenants</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      ${revenue.toLocaleString()}/mes
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className={`h-2 rounded-full ${
                        plan === 'enterprise' ? 'bg-purple-500' :
                        plan === 'professional' ? 'bg-blue-500' :
                        plan === 'starter' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Total MRR</span>
              <span className="text-xl font-bold text-gray-900">${stats.estimatedMRR.toLocaleString()}/mes</span>
            </div>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Distribución de Planes</h2>

          {/* Visual representation */}
          <div className="relative pt-1">
            <div className="flex h-4 overflow-hidden text-xs rounded-full bg-gray-100">
              {['enterprise', 'professional', 'starter', 'free'].map((plan) => {
                const count = stats.planBreakdown[plan] || 0;
                const percentage = stats.totalTenants > 0
                  ? (count / stats.totalTenants) * 100
                  : 0;

                if (percentage === 0) return null;

                return (
                  <div
                    key={plan}
                    className={`flex flex-col justify-center ${
                      plan === 'enterprise' ? 'bg-purple-500' :
                      plan === 'professional' ? 'bg-blue-500' :
                      plan === 'starter' ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {['enterprise', 'professional', 'starter', 'free'].map((plan) => {
              const count = stats.planBreakdown[plan] || 0;
              const percentage = stats.totalTenants > 0
                ? Math.round((count / stats.totalTenants) * 100)
                : 0;

              return (
                <div key={plan} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    plan === 'enterprise' ? 'bg-purple-500' :
                    plan === 'professional' ? 'bg-blue-500' :
                    plan === 'starter' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">{plan}</p>
                    <p className="text-xs text-gray-500">{count} ({percentage}%)</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Table */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Precios de Planes</h3>
            <div className="space-y-2">
              {Object.entries(planPrices).map(([plan, price]) => (
                <div key={plan} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 capitalize">{plan}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {price === 0 ? 'Gratis' : `$${price}/mes`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Nota sobre Facturación</h3>
            <p className="text-sm text-blue-700 mt-1">
              Este es un resumen estimado basado en los planes asignados a cada tenant.
              Para integrar facturación real, conectar con Stripe u otro procesador de pagos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton
function BillingLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="h-12 bg-gray-200 rounded mb-4" />
            <div className="h-8 bg-gray-200 rounded w-24" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6 h-96">
          <div className="h-full bg-gray-100 rounded" />
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 h-96">
          <div className="h-full bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Facturación y Revenue</h1>
        <p className="text-gray-500 mt-1">Resumen de ingresos y distribución de planes</p>
      </div>

      <Suspense fallback={<BillingLoading />}>
        <BillingContent />
      </Suspense>
    </div>
  );
}
