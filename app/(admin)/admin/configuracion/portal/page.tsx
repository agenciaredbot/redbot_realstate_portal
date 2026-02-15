'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Building2,
  Palette,
  FileText,
  Image as ImageIcon,
  Phone,
  Globe,
  Save,
  Loader2,
  Upload,
  Eye,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from 'lucide-react';

interface TenantConfig {
  id: string;
  name: string;
  slug: string;

  // Branding
  logo_url: string | null;
  logo_dark_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  accent_color_2: string;

  // Contact
  company_name: string | null;
  company_email: string | null;
  company_phone: string | null;
  company_address: string | null;
  company_whatsapp: string | null;

  // Social
  social_links: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };

  // Hero section
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;

  // About section
  about_title: string | null;
  about_description: string | null;
  about_image_url: string | null;
  about_stats: {
    properties?: string;
    clients?: string;
    years?: string;
    agents?: string;
  };

  // Footer
  footer_description: string | null;
  footer_copyright: string | null;

  // SEO
  seo_title: string | null;
  seo_description: string | null;
}

const colorPresets = [
  { name: 'Dorado', color: '#C9A962' },
  { name: 'Azul', color: '#2563EB' },
  { name: 'Verde', color: '#059669' },
  { name: 'Rojo', color: '#DC2626' },
  { name: 'Púrpura', color: '#7C3AED' },
  { name: 'Negro', color: '#171717' },
  { name: 'Naranja', color: '#EA580C' },
  { name: 'Rosa', color: '#DB2777' },
];

export default function PortalConfigPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingLogoDark, setUploadingLogoDark] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);

  const [config, setConfig] = useState<TenantConfig | null>(null);

  useEffect(() => {
    loadTenantConfig();
  }, []);

  const loadTenantConfig = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get user's profile to find tenant_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (!profile?.tenant_id) {
        toast.error('No se encontró el tenant');
        return;
      }

      // Get tenant config
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', profile.tenant_id)
        .single();

      if (error) throw error;

      setConfig({
        ...tenant,
        social_links: tenant.social_links || {},
        about_stats: tenant.about_stats || { properties: '0', clients: '0', years: '0', agents: '0' },
      });
    } catch (error) {
      console.error('Error loading config:', error);
      toast.error('Error al cargar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (
    file: File,
    fieldName: 'logo_url' | 'logo_dark_url' | 'favicon_url' | 'hero_image_url' | 'about_image_url',
    setUploading: (v: boolean) => void
  ) => {
    if (!config) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${config.id}/${fieldName.replace('_url', '')}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('tenant-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('tenant-assets')
        .getPublicUrl(fileName);

      setConfig(prev => prev ? { ...prev, [fieldName]: publicUrl } : null);
      toast.success('Imagen subida correctamente');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('tenants')
        .update({
          // Branding
          logo_url: config.logo_url,
          logo_dark_url: config.logo_dark_url,
          favicon_url: config.favicon_url,
          primary_color: config.primary_color,
          secondary_color: config.secondary_color,
          accent_color: config.accent_color,
          accent_color_2: config.accent_color_2,

          // Contact
          company_name: config.company_name,
          company_email: config.company_email,
          company_phone: config.company_phone,
          company_address: config.company_address,
          company_whatsapp: config.company_whatsapp,

          // Social
          social_links: config.social_links,

          // Hero
          hero_title: config.hero_title,
          hero_subtitle: config.hero_subtitle,
          hero_image_url: config.hero_image_url,

          // About
          about_title: config.about_title,
          about_description: config.about_description,
          about_image_url: config.about_image_url,
          about_stats: config.about_stats,

          // Footer
          footer_description: config.footer_description,
          footer_copyright: config.footer_copyright,

          // SEO
          seo_title: config.seo_title,
          seo_description: config.seo_description,

          updated_at: new Date().toISOString(),
        })
        .eq('id', config.id);

      if (error) throw error;

      toast.success('Configuración guardada correctamente');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-luxus-gold" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se pudo cargar la configuración</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración del Portal</h1>
          <p className="text-gray-500">Personaliza la apariencia y contenido de tu sitio web</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.open(`https://${config.slug}.redbot.app`, '_blank')}>
            <Eye className="h-4 w-4 mr-2" />
            Ver Portal
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-luxus-gold hover:bg-luxus-gold/90">
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Marca
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contenido
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contacto
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            SEO
          </TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          {/* Logo Section */}
          <div className="bg-white rounded-xl border p-6 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-luxus-gold" />
              Logos e Imágenes
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Logo Principal */}
              <div>
                <Label>Logo Principal</Label>
                <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center">
                  {config.logo_url ? (
                    <img src={config.logo_url} alt="Logo" className="max-h-20 mx-auto mb-2" />
                  ) : (
                    <div className="h-20 flex items-center justify-center text-gray-400">
                      <ImageIcon className="h-10 w-10" />
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'logo_url', setUploadingLogo);
                      }}
                      disabled={uploadingLogo}
                    />
                    <span className="text-sm text-luxus-gold hover:underline">
                      {uploadingLogo ? 'Subiendo...' : 'Cambiar logo'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Logo Dark */}
              <div>
                <Label>Logo Oscuro (opcional)</Label>
                <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center bg-gray-900">
                  {config.logo_dark_url ? (
                    <img src={config.logo_dark_url} alt="Logo Dark" className="max-h-20 mx-auto mb-2" />
                  ) : (
                    <div className="h-20 flex items-center justify-center text-gray-500">
                      <ImageIcon className="h-10 w-10" />
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'logo_dark_url', setUploadingLogoDark);
                      }}
                      disabled={uploadingLogoDark}
                    />
                    <span className="text-sm text-luxus-gold hover:underline">
                      {uploadingLogoDark ? 'Subiendo...' : 'Cambiar logo'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Favicon */}
              <div>
                <Label>Favicon</Label>
                <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center">
                  {config.favicon_url ? (
                    <img src={config.favicon_url} alt="Favicon" className="h-16 w-16 mx-auto mb-2" />
                  ) : (
                    <div className="h-20 flex items-center justify-center text-gray-400">
                      <ImageIcon className="h-10 w-10" />
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'favicon_url', setUploadingFavicon);
                      }}
                      disabled={uploadingFavicon}
                    />
                    <span className="text-sm text-luxus-gold hover:underline">
                      {uploadingFavicon ? 'Subiendo...' : 'Cambiar favicon'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Colors Section */}
          <div className="bg-white rounded-xl border p-6 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="h-5 w-5 text-luxus-gold" />
              Colores
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Primary Color */}
              <div>
                <Label>Color Primario</Label>
                <p className="text-sm text-gray-500 mb-3">Color principal de tu marca</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => setConfig(prev => prev ? { ...prev, primary_color: preset.color } : null)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        config.primary_color === preset.color ? 'border-gray-900 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.primary_color}
                    onChange={(e) => setConfig(prev => prev ? { ...prev, primary_color: e.target.value } : null)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={config.primary_color}
                    onChange={(e) => setConfig(prev => prev ? { ...prev, primary_color: e.target.value } : null)}
                    className="w-32"
                    placeholder="#C9A962"
                  />
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <Label>Color de Acento</Label>
                <p className="text-sm text-gray-500 mb-3">Color secundario para destacar elementos</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => setConfig(prev => prev ? { ...prev, accent_color_2: preset.color } : null)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        config.accent_color_2 === preset.color ? 'border-gray-900 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.accent_color_2 || '#2563EB'}
                    onChange={(e) => setConfig(prev => prev ? { ...prev, accent_color_2: e.target.value } : null)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={config.accent_color_2 || '#2563EB'}
                    onChange={(e) => setConfig(prev => prev ? { ...prev, accent_color_2: e.target.value } : null)}
                    className="w-32"
                    placeholder="#2563EB"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-3">Vista previa</p>
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  className="px-6 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: config.primary_color }}
                >
                  Botón Primario
                </button>
                <button
                  className="px-6 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: config.accent_color_2 || '#2563EB' }}
                >
                  Botón Acento
                </button>
                <span className="font-semibold" style={{ color: config.primary_color }}>
                  Texto destacado
                </span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          {/* Hero Section */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h3 className="text-lg font-semibold">Sección Hero (Inicio)</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hero_title">Título Principal</Label>
                  <Input
                    id="hero_title"
                    value={config.hero_title || ''}
                    onChange={(e) => setConfig(prev => prev ? { ...prev, hero_title: e.target.value } : null)}
                    placeholder="Encuentra Tu Propiedad Ideal"
                  />
                </div>
                <div>
                  <Label htmlFor="hero_subtitle">Subtítulo</Label>
                  <Textarea
                    id="hero_subtitle"
                    value={config.hero_subtitle || ''}
                    onChange={(e) => setConfig(prev => prev ? { ...prev, hero_subtitle: e.target.value } : null)}
                    placeholder="Explora nuestra amplia selección de propiedades..."
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <Label>Imagen de Fondo (opcional)</Label>
                <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center h-[140px] flex flex-col items-center justify-center">
                  {config.hero_image_url ? (
                    <>
                      <img src={config.hero_image_url} alt="Hero" className="max-h-20 mx-auto mb-2 rounded" />
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, 'hero_image_url', setUploadingHeroImage);
                          }}
                        />
                        <span className="text-sm text-luxus-gold hover:underline">Cambiar imagen</span>
                      </label>
                    </>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'hero_image_url', setUploadingHeroImage);
                        }}
                      />
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-500">
                        {uploadingHeroImage ? 'Subiendo...' : 'Subir imagen'}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h3 className="text-lg font-semibold">Sección Sobre Nosotros</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="about_title">Título</Label>
                  <Input
                    id="about_title"
                    value={config.about_title || ''}
                    onChange={(e) => setConfig(prev => prev ? { ...prev, about_title: e.target.value } : null)}
                    placeholder="Sobre Nosotros"
                  />
                </div>
                <div>
                  <Label htmlFor="about_description">Descripción</Label>
                  <Textarea
                    id="about_description"
                    value={config.about_description || ''}
                    onChange={(e) => setConfig(prev => prev ? { ...prev, about_description: e.target.value } : null)}
                    placeholder="Somos una inmobiliaria comprometida..."
                    rows={5}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Estadísticas</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-500">Propiedades</Label>
                    <Input
                      value={config.about_stats?.properties || ''}
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        about_stats: { ...prev.about_stats, properties: e.target.value }
                      } : null)}
                      placeholder="250+"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Clientes</Label>
                    <Input
                      value={config.about_stats?.clients || ''}
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        about_stats: { ...prev.about_stats, clients: e.target.value }
                      } : null)}
                      placeholder="500+"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Años</Label>
                    <Input
                      value={config.about_stats?.years || ''}
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        about_stats: { ...prev.about_stats, years: e.target.value }
                      } : null)}
                      placeholder="10+"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Agentes</Label>
                    <Input
                      value={config.about_stats?.agents || ''}
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        about_stats: { ...prev.about_stats, agents: e.target.value }
                      } : null)}
                      placeholder="15+"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h3 className="text-lg font-semibold">Pie de Página (Footer)</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="footer_description">Descripción del Footer</Label>
                <Textarea
                  id="footer_description"
                  value={config.footer_description || ''}
                  onChange={(e) => setConfig(prev => prev ? { ...prev, footer_description: e.target.value } : null)}
                  placeholder="Tu socio confiable en el mercado inmobiliario..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="footer_copyright">Texto de Copyright</Label>
                <Input
                  id="footer_copyright"
                  value={config.footer_copyright || ''}
                  onChange={(e) => setConfig(prev => prev ? { ...prev, footer_copyright: e.target.value } : null)}
                  placeholder="© 2024 Todos los derechos reservados."
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h3 className="text-lg font-semibold">Información de Contacto</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name">Nombre de la Empresa</Label>
                <Input
                  id="company_name"
                  value={config.company_name || ''}
                  onChange={(e) => setConfig(prev => prev ? { ...prev, company_name: e.target.value } : null)}
                  placeholder="Mi Inmobiliaria S.A."
                />
              </div>
              <div>
                <Label htmlFor="company_email">Email</Label>
                <Input
                  id="company_email"
                  type="email"
                  value={config.company_email || ''}
                  onChange={(e) => setConfig(prev => prev ? { ...prev, company_email: e.target.value } : null)}
                  placeholder="contacto@miinmobiliaria.com"
                />
              </div>
              <div>
                <Label htmlFor="company_phone">Teléfono</Label>
                <Input
                  id="company_phone"
                  value={config.company_phone || ''}
                  onChange={(e) => setConfig(prev => prev ? { ...prev, company_phone: e.target.value } : null)}
                  placeholder="+57 300 123 4567"
                />
              </div>
              <div>
                <Label htmlFor="company_whatsapp">WhatsApp</Label>
                <Input
                  id="company_whatsapp"
                  value={config.company_whatsapp || ''}
                  onChange={(e) => setConfig(prev => prev ? { ...prev, company_whatsapp: e.target.value } : null)}
                  placeholder="+57 300 123 4567"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="company_address">Dirección</Label>
                <Textarea
                  id="company_address"
                  value={config.company_address || ''}
                  onChange={(e) => setConfig(prev => prev ? { ...prev, company_address: e.target.value } : null)}
                  placeholder="Calle Principal #123, Ciudad"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h3 className="text-lg font-semibold">Redes Sociales</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Facebook className="h-5 w-5 text-blue-600" />
                <Input
                  value={config.social_links?.facebook || ''}
                  onChange={(e) => setConfig(prev => prev ? {
                    ...prev,
                    social_links: { ...prev.social_links, facebook: e.target.value }
                  } : null)}
                  placeholder="https://facebook.com/tuinmobiliaria"
                />
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="h-5 w-5 text-pink-600" />
                <Input
                  value={config.social_links?.instagram || ''}
                  onChange={(e) => setConfig(prev => prev ? {
                    ...prev,
                    social_links: { ...prev.social_links, instagram: e.target.value }
                  } : null)}
                  placeholder="https://instagram.com/tuinmobiliaria"
                />
              </div>
              <div className="flex items-center gap-3">
                <Linkedin className="h-5 w-5 text-blue-700" />
                <Input
                  value={config.social_links?.linkedin || ''}
                  onChange={(e) => setConfig(prev => prev ? {
                    ...prev,
                    social_links: { ...prev.social_links, linkedin: e.target.value }
                  } : null)}
                  placeholder="https://linkedin.com/company/tuinmobiliaria"
                />
              </div>
              <div className="flex items-center gap-3">
                <Twitter className="h-5 w-5 text-sky-500" />
                <Input
                  value={config.social_links?.twitter || ''}
                  onChange={(e) => setConfig(prev => prev ? {
                    ...prev,
                    social_links: { ...prev.social_links, twitter: e.target.value }
                  } : null)}
                  placeholder="https://twitter.com/tuinmobiliaria"
                />
              </div>
              <div className="flex items-center gap-3">
                <Youtube className="h-5 w-5 text-red-600" />
                <Input
                  value={config.social_links?.youtube || ''}
                  onChange={(e) => setConfig(prev => prev ? {
                    ...prev,
                    social_links: { ...prev.social_links, youtube: e.target.value }
                  } : null)}
                  placeholder="https://youtube.com/@tuinmobiliaria"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h3 className="text-lg font-semibold">Optimización para Buscadores (SEO)</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="seo_title">Título SEO</Label>
                <Input
                  id="seo_title"
                  value={config.seo_title || ''}
                  onChange={(e) => setConfig(prev => prev ? { ...prev, seo_title: e.target.value } : null)}
                  placeholder="Mi Inmobiliaria | Propiedades en Venta y Arriendo"
                />
                <p className="text-xs text-gray-500 mt-1">Aparece en la pestaña del navegador y resultados de Google</p>
              </div>
              <div>
                <Label htmlFor="seo_description">Descripción SEO</Label>
                <Textarea
                  id="seo_description"
                  value={config.seo_description || ''}
                  onChange={(e) => setConfig(prev => prev ? { ...prev, seo_description: e.target.value } : null)}
                  placeholder="Encuentra las mejores propiedades en venta y arriendo. Casas, apartamentos y más..."
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">Descripción que aparece en los resultados de búsqueda (máx. 160 caracteres)</p>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-3">Vista previa en Google</p>
              <div className="bg-white p-4 rounded border">
                <p className="text-blue-700 text-lg hover:underline cursor-pointer">
                  {config.seo_title || config.name || 'Título de tu sitio'}
                </p>
                <p className="text-green-700 text-sm">
                  {config.slug}.redbot.app
                </p>
                <p className="text-gray-600 text-sm">
                  {config.seo_description || 'Descripción de tu sitio web...'}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
