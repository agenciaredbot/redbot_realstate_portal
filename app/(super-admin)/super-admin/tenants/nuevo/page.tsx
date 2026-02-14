'use client';

import { useState } from 'react';
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

export default function NuevoTenantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    subdomain: '',
    domain: '',
    company_email: '',
    company_phone: '',
    primary_color: '#C9A962',
    secondary_color: '#1A1A1A',
    plan: 'starter',
    max_properties: 50,
    max_agents: 5,
    max_storage_mb: 1000,
  });

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    setFormData({
      ...formData,
      name: value,
      slug,
      subdomain: slug,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/super-admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear tenant');
      }

      toast.success('Tenant creado exitosamente');
      router.push(`/super-admin/tenants/${result.id}`);
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear tenant');
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
        <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Tenant</h1>
        <p className="text-gray-500 mt-1">Registra una nueva inmobiliaria en la plataforma</p>
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
                onChange={(e) => handleNameChange(e.target.value)}
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
              <p className="text-sm text-gray-500">Colores de la marca</p>
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
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 mb-3">Vista previa:</p>
            <div className="flex items-center gap-4">
              <div
                className="w-32 h-12 rounded flex items-center justify-center text-white font-medium text-sm"
                style={{ backgroundColor: formData.primary_color }}
              >
                Botón primario
              </div>
              <div
                className="w-32 h-12 rounded flex items-center justify-center text-white font-medium text-sm"
                style={{ backgroundColor: formData.secondary_color }}
              >
                Texto oscuro
              </div>
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
          <Link href="/super-admin/tenants">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Crear Tenant
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
