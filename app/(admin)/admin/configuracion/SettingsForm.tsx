'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Save,
  Settings,
  Palette,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [generalSettings, setGeneralSettings] = useState({
    site_name: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    whatsapp: '',
    address: '',
  });

  const [socialSettings, setSocialSettings] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
  });

  const [seoSettings, setSeoSettings] = useState({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    google_analytics: '',
  });

  // Fetch settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const { settings } = await res.json();

          // Populate general settings
          setGeneralSettings({
            site_name: settings.site_name || 'Redbot Real Estate',
            site_description: settings.site_description || 'Portal inmobiliario lider en Colombia',
            contact_email: settings.contact_email || 'info@redbot-realestate.com',
            contact_phone: settings.contact_phone || '+57 300 123 4567',
            whatsapp: settings.whatsapp || '+57 300 123 4567',
            address: settings.address || 'Calle 100 #15-20, Bogota, Colombia',
          });

          // Populate social settings
          setSocialSettings({
            facebook: settings.facebook || '',
            instagram: settings.instagram || '',
            twitter: settings.twitter || '',
            linkedin: settings.linkedin || '',
            youtube: settings.youtube || '',
          });

          // Populate SEO settings
          setSeoSettings({
            meta_title: settings.meta_title || 'Redbot Real Estate - Propiedades en Colombia',
            meta_description: settings.meta_description || 'Encuentra las mejores propiedades en venta y arriendo en Colombia.',
            meta_keywords: settings.meta_keywords || 'propiedades, inmuebles, colombia, venta, arriendo',
            google_analytics: settings.google_analytics || '',
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setIsFetching(false);
      }
    }

    fetchSettings();
  }, []);

  const saveSettings = async (settingsToSave: Record<string, string>) => {
    setIsLoading(true);
    setSuccess('');
    setError('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsToSave }),
      });

      if (res.ok) {
        setSuccess('Configuracion guardada correctamente');
      } else {
        const data = await res.json();
        setError(data.error || 'Error al guardar configuracion');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Error de conexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(generalSettings);
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(socialSettings);
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(seoSettings);
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
        <TabsTrigger value="general" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          General
        </TabsTrigger>
        <TabsTrigger value="social" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Redes
        </TabsTrigger>
        <TabsTrigger value="seo" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          SEO
        </TabsTrigger>
      </TabsList>

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* General Settings */}
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Informacion General</CardTitle>
            <CardDescription>
              Configura la informacion basica del portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveGeneral} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="site_name">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      Nombre del Sitio
                    </div>
                  </Label>
                  <Input
                    id="site_name"
                    value={generalSettings.site_name}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        site_name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      Email de Contacto
                    </div>
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={generalSettings.contact_email}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        contact_email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      Telefono
                    </div>
                  </Label>
                  <Input
                    id="contact_phone"
                    value={generalSettings.contact_phone}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        contact_phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      WhatsApp
                    </div>
                  </Label>
                  <Input
                    id="whatsapp"
                    value={generalSettings.whatsapp}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        whatsapp: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      Direccion
                    </div>
                  </Label>
                  <Input
                    id="address"
                    value={generalSettings.address}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        address: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="site_description">Descripcion del Sitio</Label>
                  <Textarea
                    id="site_description"
                    value={generalSettings.site_description}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        site_description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Social Settings */}
      <TabsContent value="social">
        <Card>
          <CardHeader>
            <CardTitle>Redes Sociales</CardTitle>
            <CardDescription>
              Configura los enlaces a tus redes sociales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveSocial} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="facebook">
                    <div className="flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-gray-400" />
                      Facebook
                    </div>
                  </Label>
                  <Input
                    id="facebook"
                    type="url"
                    placeholder="https://facebook.com/..."
                    value={socialSettings.facebook}
                    onChange={(e) =>
                      setSocialSettings({
                        ...socialSettings,
                        facebook: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-gray-400" />
                      Instagram
                    </div>
                  </Label>
                  <Input
                    id="instagram"
                    type="url"
                    placeholder="https://instagram.com/..."
                    value={socialSettings.instagram}
                    onChange={(e) =>
                      setSocialSettings({
                        ...socialSettings,
                        instagram: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-gray-400" />
                      Twitter / X
                    </div>
                  </Label>
                  <Input
                    id="twitter"
                    type="url"
                    placeholder="https://twitter.com/..."
                    value={socialSettings.twitter}
                    onChange={(e) =>
                      setSocialSettings({
                        ...socialSettings,
                        twitter: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      LinkedIn
                    </div>
                  </Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/..."
                    value={socialSettings.linkedin}
                    onChange={(e) =>
                      setSocialSettings({
                        ...socialSettings,
                        linkedin: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* SEO Settings */}
      <TabsContent value="seo">
        <Card>
          <CardHeader>
            <CardTitle>Configuracion SEO</CardTitle>
            <CardDescription>
              Optimiza tu sitio para motores de busqueda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveSeo} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Titulo Meta (SEO)</Label>
                  <Input
                    id="meta_title"
                    value={seoSettings.meta_title}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        meta_title: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Recomendado: 50-60 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Descripcion Meta (SEO)</Label>
                  <Textarea
                    id="meta_description"
                    value={seoSettings.meta_description}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        meta_description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Recomendado: 150-160 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_keywords">Palabras Clave</Label>
                  <Input
                    id="meta_keywords"
                    value={seoSettings.meta_keywords}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        meta_keywords: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Separadas por comas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google_analytics">
                    Google Analytics ID
                  </Label>
                  <Input
                    id="google_analytics"
                    placeholder="G-XXXXXXXXXX"
                    value={seoSettings.google_analytics}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        google_analytics: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
