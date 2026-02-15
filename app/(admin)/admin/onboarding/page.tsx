'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2,
  Upload,
  Palette,
  Home,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Image as ImageIcon,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TenantData {
  id: string;
  name: string;
  logo_url?: string;
  primary_color?: string;
  company_email?: string;
  company_phone?: string;
  company_address?: string;
  company_whatsapp?: string;
}

const steps = [
  { id: 1, title: 'Bienvenida', icon: Building2 },
  { id: 2, title: 'Logo', icon: ImageIcon },
  { id: 3, title: 'Contacto', icon: Phone },
  { id: 4, title: 'Colores', icon: Palette },
  { id: 5, title: '¡Listo!', icon: Check },
];

const colorPresets = [
  { name: 'Dorado Luxus', color: '#C9A962' },
  { name: 'Azul Corporativo', color: '#2563EB' },
  { name: 'Verde Esmeralda', color: '#059669' },
  { name: 'Rojo Elegante', color: '#DC2626' },
  { name: 'Púrpura Real', color: '#7C3AED' },
  { name: 'Negro Clásico', color: '#171717' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [formData, setFormData] = useState({
    logo_url: '',
    primary_color: '#C9A962',
    company_email: '',
    company_phone: '',
    company_address: '',
    company_whatsapp: '',
  });

  // Load tenant data
  useEffect(() => {
    const loadTenant = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        // Get profile to find tenant_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('tenant_id')
          .eq('id', user.id)
          .single();

        if (!profile?.tenant_id) {
          router.push('/admin/dashboard');
          return;
        }

        // Get tenant data
        const { data: tenantData } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', profile.tenant_id)
          .single();

        if (tenantData) {
          setTenant(tenantData);
          setFormData({
            logo_url: tenantData.logo_url || '',
            primary_color: tenantData.primary_color || '#C9A962',
            company_email: tenantData.company_email || '',
            company_phone: tenantData.company_phone || '',
            company_address: tenantData.company_address || '',
            company_whatsapp: tenantData.company_whatsapp || '',
          });
        }
      } catch (error) {
        console.error('Error loading tenant:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTenant();
  }, [supabase, router]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tenant) return;

    setUploadingLogo(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${tenant.id}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('tenant-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('tenant-assets').getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, logo_url: publicUrl }));
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Error al subir el logo. Por favor intenta de nuevo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const saveProgress = async () => {
    if (!tenant) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('tenants')
        .update({
          logo_url: formData.logo_url || null,
          primary_color: formData.primary_color,
          company_email: formData.company_email || null,
          company_phone: formData.company_phone || null,
          company_address: formData.company_address || null,
          company_whatsapp: formData.company_whatsapp || null,
        })
        .eq('id', tenant.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = async () => {
    await saveProgress();
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishOnboarding = async () => {
    await saveProgress();
    router.push('/admin/dashboard');
  };

  const skipOnboarding = () => {
    router.push('/admin/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-luxus-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                      isActive && 'bg-luxus-gold text-white',
                      isCompleted && 'bg-green-500 text-white',
                      !isActive && !isCompleted && 'bg-gray-200 text-gray-500'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'w-12 lg:w-24 h-1 mx-2',
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <span
                key={step.id}
                className={cn(
                  'text-xs',
                  currentStep === step.id
                    ? 'text-luxus-gold font-medium'
                    : 'text-gray-500'
                )}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-luxus-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-10 w-10 text-luxus-gold" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Bienvenido a Redbot, {tenant?.name}!
              </h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Vamos a configurar tu portal inmobiliario en solo unos minutos.
                Podrás cambiar todo esto después desde la configuración.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={skipOnboarding}>
                  Saltar por ahora
                </Button>
                <Button
                  className="bg-luxus-gold hover:bg-luxus-gold/90"
                  onClick={nextStep}
                >
                  Comenzar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Logo */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Sube tu Logo
              </h2>
              <p className="text-gray-600 mb-6">
                Tu logo aparecerá en el encabezado de tu portal.
              </p>

              <div className="flex flex-col items-center">
                {/* Logo preview */}
                <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center mb-4 overflow-hidden bg-gray-50">
                  {formData.logo_url ? (
                    <img
                      src={formData.logo_url}
                      alt="Logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <Upload className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">Sin logo</p>
                    </div>
                  )}
                </div>

                {/* Upload button */}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={uploadingLogo}
                  />
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    {uploadingLogo ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    <span>{uploadingLogo ? 'Subiendo...' : 'Subir logo'}</span>
                  </div>
                </label>

                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG o SVG. Máximo 2MB. Recomendado: 400x200px
                </p>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Atrás
                </Button>
                <Button
                  className="bg-luxus-gold hover:bg-luxus-gold/90"
                  onClick={nextStep}
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Info */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Información de Contacto
              </h2>
              <p className="text-gray-600 mb-6">
                Esta información aparecerá en tu portal para que los clientes
                puedan contactarte.
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="company_email">Email de contacto</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="company_email"
                      type="email"
                      placeholder="contacto@tuinmobiliaria.com"
                      value={formData.company_email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          company_email: e.target.value,
                        }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company_phone">Teléfono</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="company_phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={formData.company_phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          company_phone: e.target.value,
                        }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company_whatsapp">WhatsApp</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="company_whatsapp"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={formData.company_whatsapp}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          company_whatsapp: e.target.value,
                        }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company_address">Dirección</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Textarea
                      id="company_address"
                      placeholder="Calle Principal #123, Ciudad"
                      value={formData.company_address}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          company_address: e.target.value,
                        }))
                      }
                      className="pl-10 min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Atrás
                </Button>
                <Button
                  className="bg-luxus-gold hover:bg-luxus-gold/90"
                  onClick={nextStep}
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Colors */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Elige tus Colores
              </h2>
              <p className="text-gray-600 mb-6">
                Selecciona el color principal de tu marca.
              </p>

              {/* Color presets */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.color}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        primary_color: preset.color,
                      }))
                    }
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all',
                      formData.primary_color === preset.color
                        ? 'border-gray-900 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div
                      className="w-full h-12 rounded-lg mb-2"
                      style={{ backgroundColor: preset.color }}
                    />
                    <p className="text-sm text-gray-700">{preset.name}</p>
                  </button>
                ))}
              </div>

              {/* Custom color */}
              <div className="flex items-center gap-4">
                <Label>Color personalizado:</Label>
                <input
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      primary_color: e.target.value,
                    }))
                  }
                  className="w-12 h-12 rounded-lg cursor-pointer"
                />
                <Input
                  value={formData.primary_color}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      primary_color: e.target.value,
                    }))
                  }
                  className="w-32"
                />
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                <div className="flex gap-4">
                  <button
                    className="px-6 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: formData.primary_color }}
                  >
                    Botón Principal
                  </button>
                  <span
                    className="font-semibold"
                    style={{ color: formData.primary_color }}
                  >
                    Texto destacado
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Atrás
                </Button>
                <Button
                  className="bg-luxus-gold hover:bg-luxus-gold/90"
                  onClick={nextStep}
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 5 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Tu portal está listo!
              </h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Ya puedes comenzar a agregar propiedades y personalizar tu portal.
                Recuerda que tienes 14 días de prueba gratis.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
                <p className="text-sm text-amber-800">
                  <strong>Próximo paso:</strong> Agrega tu primera propiedad para
                  que los clientes puedan ver tu inventario.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin/dashboard')}
                >
                  Ir al Dashboard
                </Button>
                <Button
                  className="bg-luxus-gold hover:bg-luxus-gold/90"
                  onClick={() => router.push('/admin/propiedades/nueva')}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Agregar mi primera propiedad
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Skip link */}
        {currentStep > 1 && currentStep < 5 && (
          <p className="text-center mt-4 text-sm text-gray-500">
            <button
              onClick={skipOnboarding}
              className="hover:text-gray-700 underline"
            >
              Saltar configuración y ir al dashboard
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
