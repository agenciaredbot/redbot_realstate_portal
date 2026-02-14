'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Globe,
  Palette,
  Settings,
  Save,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type { Tenant } from '@/types/tenant';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditarTenantPage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [tenantId, setTenantId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    subdomain: '',
    domain: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    primary_color: '#C9A962',
    secondary_color: '#1A1A1A',
    plan: 'starter',
    max_properties: 50,
    max_agents: 5,
    max_storage_mb: 1000,
    logo_url: '',
    favicon_url: '',
    seo_title: '',
    seo_description: '',
  });

  useEffect(() => {
    const fetchTenant = async () => {
      const { id } = await params;
      setTenantId(id);

      try {
        const response = await fetch(`/api/super-admin/tenants/${id}`);
        if (!response.ok) {
          throw new Error('Tenant no encontrado');
        }
        const tenant: Tenant = await response.json();

        setFormData({
          name: tenant.name || '',
          slug: tenant.slug || '',
          subdomain: tenant.subdomain || '',
          domain: tenant.domain || '',
          company_email: tenant.company_email || '',
          company_phone: tenant.company_phone || '',
          company_address: tenant.company_address || '',
          primary_color: tenant.primary_color || '#C9A962',
          secondary_color: tenant.secondary_color || '#1A1A1A',
          plan: tenant.plan || 'starter',
          max_properties: tenant.max_properties || 50,
          max_agents: tenant.max_agents || 5,
          max_storage_mb: tenant.max_storage_mb || 1000,
          logo_url: tenant.logo_url || '',
          favicon_url: tenant.favicon_url || '',
          seo_title: tenant.seo_title || '',
          seo_description: tenant.seo_description || '',
        });
      } catch (error) {
        console.error('Error fetching tenant:', error);
        toast.error('Error al cargar el tenant');
        router.push('/super-admin/tenants');
      } finally {
        setFetching(false);
      }
    };

    fetchTenant();
  }, [params, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/super-admin/tenants/${tenantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar tenant');
      }

      toast.success('Tenant actualizado exitosamente');
      router.push(`/super-admin/tenants/${tenantId}`);
    } catch (error) {
      console.error('Error updating tenant:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar tenant');
    } finally {
      setLoading(false);
    }
  };

  // Plan limits
  const planLimits: Record<string, { properties: number; agents: number; storage: number }> = {
    free: { properties: 10, agents: 2, storage: 500 },
    starter: { properties: 50, agents: 5, storage: 1000 },
    professional: { properties: 200, agents: 20, storage: 5000 },
    enterprise: { properties: 999999, agents: 999999, storage: 50000 },
  };

  const handlePlanChange = (plan: string) => {
    const limits = planLimits[plan];
    setFormData({
      ...formData,
      plan,
      max_properties: limits.properties,
      max_agents: limits.agents,
      max_storage_mb: limits.storage,
    });
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/super-admin/tenants/${tenantId}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver al Tenant
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar Tenant</h1>
        <p className="text-gray-500 mt-1">Modifica la configuración de {formData.name}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Información Básica</h2>
              <p className="text-sm text-gray-500">Datos principales del tenant</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Inmobiliaria *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Inmobiliaria ABC"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (identificador único) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="inmobiliaria-abc"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_email">Email de Contacto</Label>
              <Input
                id="company_email"
                type="email"
                value={formData.company_email}
                onChange={(e) => setFormData({ ...formData, company_email: e.target.value })}
                placeholder="info@inmobiliaria.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_phone">Teléfono de Contacto</Label>
              <Input
                id="company_phone"
                value={formData.company_phone}
                onChange={(e) => setFormData({ ...formData, company_phone: e.target.value })}
                placeholder="+57 300 000 0000"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="company_address">Dirección</Label>
              <Input
                id="company_address"
                value={formData.company_address}
                onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                placeholder="Calle 123 #45-67, Ciudad"
              />
            </div>
          </div>
        </div>

        {/* Domain Config */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Configuración de Dominio</h2>
              <p className="text-sm text-gray-500">Subdominio o dominio personalizado</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdominio</Label>
              <div className="flex items-center">
                <Input
                  id="subdomain"
                  value={formData.subdomain}
                  onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                  placeholder="abc"
                  className="rounded-r-none"
                />
                <span className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-500">
                  .redbot.io
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Dominio Personalizado (opcional)</Label>
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                placeholder="www.inmobiliariaabc.com"
              />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Palette className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Branding</h2>
              <p className="text-sm text-gray-500">Colores y logos de la marca</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Color Primario</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="primary_color"
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <Input
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  placeholder="#C9A962"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_color">Color Secundario</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="secondary_color"
                  value={formData.secondary_color}
                  onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <Input
                  value={formData.secondary_color}
                  onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                  placeholder="#1A1A1A"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">URL del Logo</Label>
              <Input
                id="logo_url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="favicon_url">URL del Favicon</Label>
              <Input
                id="favicon_url"
                value={formData.favicon_url}
                onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 mb-3">Vista previa de colores:</p>
            <div className="flex items-center gap-4">
              <div
                className="w-32 h-12 rounded flex items-center justify-center text-white font-medium text-sm"
                style={{ backgroundColor: formData.primary_color }}
              >
                Primario
              </div>
              <div
                className="w-32 h-12 rounded flex items-center justify-center text-white font-medium text-sm"
                style={{ backgroundColor: formData.secondary_color }}
              >
                Secundario
              </div>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Globe className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">SEO</h2>
              <p className="text-sm text-gray-500">Optimización para motores de búsqueda</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="seo_title">Título SEO</Label>
              <Input
                id="seo_title"
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                placeholder="Inmobiliaria ABC - Propiedades en Venta y Arriendo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_description">Descripción SEO</Label>
              <textarea
                id="seo_description"
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                placeholder="Encuentra las mejores propiedades en venta y arriendo..."
                className="w-full px-3 py-2 border rounded-md text-sm min-h-[80px]"
              />
            </div>
          </div>
        </div>

        {/* Plan & Limits */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Settings className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Plan y Límites</h2>
              <p className="text-sm text-gray-500">Configuración de suscripción</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Plan de Suscripción</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['free', 'starter', 'professional', 'enterprise'].map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => handlePlanChange(plan)}
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${
                      formData.plan === plan
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold capitalize">{plan}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {planLimits[plan].properties === 999999
                        ? 'Ilimitado'
                        : `${planLimits[plan].properties} props`}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="max_properties">Máx. Propiedades</Label>
                <Input
                  id="max_properties"
                  type="number"
                  value={formData.max_properties}
                  onChange={(e) => setFormData({ ...formData, max_properties: parseInt(e.target.value) })}
                  min={1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_agents">Máx. Agentes</Label>
                <Input
                  id="max_agents"
                  type="number"
                  value={formData.max_agents}
                  onChange={(e) => setFormData({ ...formData, max_agents: parseInt(e.target.value) })}
                  min={1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_storage_mb">Almacenamiento (MB)</Label>
                <Input
                  id="max_storage_mb"
                  type="number"
                  value={formData.max_storage_mb}
                  onChange={(e) => setFormData({ ...formData, max_storage_mb: parseInt(e.target.value) })}
                  min={100}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link href={`/super-admin/tenants/${tenantId}`}>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
