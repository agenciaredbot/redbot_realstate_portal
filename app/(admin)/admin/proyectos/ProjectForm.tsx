'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { ProjectDB, ProjectStatusDB } from '@/types/project-db';
import { PROJECT_STATUS_LABELS, AMENITIES_LIST } from '@/types/project-db';
import {
  Save,
  Eye,
  ArrowLeft,
  Image as ImageIcon,
  X,
  Loader2,
  Star,
  MapPin,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProjectFormProps {
  mode: 'create' | 'edit';
  initialData?: ProjectDB;
}

const UNIT_TYPES = [
  'Estudio',
  '1 Habitacion',
  '2 Habitaciones',
  '3 Habitaciones',
  '4 Habitaciones',
  'Penthouse',
  'Duplex',
  'Loft',
];

export function ProjectForm({ mode, initialData }: ProjectFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Basic Info
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [developer, setDeveloper] = useState(initialData?.developer || '');
  const [descriptionShort, setDescriptionShort] = useState(initialData?.description_short || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState<ProjectStatusDB>(initialData?.status || 'preventa');

  // Location
  const [city, setCity] = useState(initialData?.city || '');
  const [neighborhood, setNeighborhood] = useState(initialData?.neighborhood || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [latitude, setLatitude] = useState(initialData?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(initialData?.longitude?.toString() || '');

  // Pricing & Units
  const [priceFrom, setPriceFrom] = useState(initialData?.price_from?.toString() || '');
  const [priceTo, setPriceTo] = useState(initialData?.price_to?.toString() || '');
  const [priceCurrency, setPriceCurrency] = useState(initialData?.price_currency || 'COP');
  const [totalUnits, setTotalUnits] = useState(initialData?.total_units?.toString() || '');
  const [availableUnits, setAvailableUnits] = useState(initialData?.available_units?.toString() || '');
  const [unitTypes, setUnitTypes] = useState<string[]>(initialData?.unit_types || []);
  const [areaFrom, setAreaFrom] = useState(initialData?.area_from?.toString() || '');
  const [areaTo, setAreaTo] = useState(initialData?.area_to?.toString() || '');
  const [completionDate, setCompletionDate] = useState(initialData?.completion_date || '');

  // Media
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [logoUrl, setLogoUrl] = useState(initialData?.logo_url || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url || '');
  const [brochureUrl, setBrochureUrl] = useState(initialData?.brochure_url || '');

  // Features
  const [amenities, setAmenities] = useState<string[]>(initialData?.amenities || []);
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

  // Auto-generate slug from name
  useEffect(() => {
    if (mode === 'create' && name && !initialData?.slug) {
      const generatedSlug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 200);
      setSlug(generatedSlug);
    }
  }, [name, mode, initialData?.slug]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          alert('Por favor selecciona imagenes validas');
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert('Las imagenes no deben superar los 5MB');
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'project-images');

        const res = await fetch('/api/admin/upload/image', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setImages((prev) => [...prev, data.url]);
        } else {
          const data = await res.json();
          alert(data.error || 'Error al subir la imagen');
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error al subir las imagenes');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen valida');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'project-images');

      const res = await fetch('/api/admin/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setLogoUrl(data.url);
      } else {
        const data = await res.json();
        alert(data.error || 'Error al subir el logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Error al subir el logo');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleUnitType = (type: string) => {
    setUnitTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (publish: boolean) => {
    if (!name.trim()) {
      alert('El nombre del proyecto es requerido');
      return;
    }

    if (!city.trim()) {
      alert('La ciudad es requerida');
      return;
    }

    setIsLoading(true);

    try {
      const projectData = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        developer: developer.trim() || null,
        description_short: descriptionShort.trim() || null,
        description: description.trim() || null,
        status,
        city: city.trim(),
        neighborhood: neighborhood.trim() || null,
        address: address.trim() || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        price_from: priceFrom ? parseInt(priceFrom) : null,
        price_to: priceTo ? parseInt(priceTo) : null,
        price_currency: priceCurrency,
        total_units: totalUnits ? parseInt(totalUnits) : null,
        available_units: availableUnits ? parseInt(availableUnits) : null,
        unit_types: unitTypes.length > 0 ? unitTypes : null,
        area_from: areaFrom ? parseInt(areaFrom) : null,
        area_to: areaTo ? parseInt(areaTo) : null,
        completion_date: completionDate || null,
        images: images.length > 0 ? images : null,
        logo_url: logoUrl || null,
        video_url: videoUrl || null,
        brochure_url: brochureUrl || null,
        amenities: amenities.length > 0 ? amenities : null,
        is_featured: isFeatured,
        is_active: publish ? true : isActive,
      };

      const url =
        mode === 'create'
          ? '/api/admin/projects/create'
          : `/api/admin/projects/${initialData?.id}/update`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/proyectos/${data.project.id}`);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al guardar el proyecto');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error al guardar el proyecto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/proyectos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Nuevo Proyecto' : 'Editar Proyecto'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Borrador
          </Button>
          <Button
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            {isLoading ? 'Guardando...' : 'Publicar'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informacion Basica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre del Proyecto *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Torres del Parque"
                  />
                </div>
                <div>
                  <Label htmlFor="developer">Desarrollador</Label>
                  <Input
                    id="developer"
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    placeholder="Constructora Elite"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="slug">URL (Slug)</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="torres-del-parque"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se generara automaticamente del nombre si se deja vacio
                </p>
              </div>

              <div>
                <Label htmlFor="status">Estado del Proyecto</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as ProjectStatusDB)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="descriptionShort">Descripcion Corta</Label>
                <Textarea
                  id="descriptionShort"
                  value={descriptionShort}
                  onChange={(e) => setDescriptionShort(e.target.value)}
                  placeholder="Breve descripcion del proyecto..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Descripcion Completa</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripcion detallada del proyecto..."
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ubicacion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bogota"
                  />
                </div>
                <div>
                  <Label htmlFor="neighborhood">Barrio / Sector</Label>
                  <Input
                    id="neighborhood"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Chapinero Alto"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Direccion</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Carrera 7 #70-40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitud</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="4.6486"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitud</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="-74.0628"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Units */}
          <Card>
            <CardHeader>
              <CardTitle>Precios y Unidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="priceFrom">Precio Desde</Label>
                  <Input
                    id="priceFrom"
                    type="number"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    placeholder="450000000"
                  />
                </div>
                <div>
                  <Label htmlFor="priceTo">Precio Hasta</Label>
                  <Input
                    id="priceTo"
                    type="number"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    placeholder="1200000000"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Moneda</Label>
                  <Select value={priceCurrency} onValueChange={setPriceCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COP">COP</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalUnits">Total Unidades</Label>
                  <Input
                    id="totalUnits"
                    type="number"
                    value={totalUnits}
                    onChange={(e) => setTotalUnits(e.target.value)}
                    placeholder="180"
                  />
                </div>
                <div>
                  <Label htmlFor="availableUnits">Unidades Disponibles</Label>
                  <Input
                    id="availableUnits"
                    type="number"
                    value={availableUnits}
                    onChange={(e) => setAvailableUnits(e.target.value)}
                    placeholder="45"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="areaFrom">Area Desde (m²)</Label>
                  <Input
                    id="areaFrom"
                    type="number"
                    value={areaFrom}
                    onChange={(e) => setAreaFrom(e.target.value)}
                    placeholder="65"
                  />
                </div>
                <div>
                  <Label htmlFor="areaTo">Area Hasta (m²)</Label>
                  <Input
                    id="areaTo"
                    type="number"
                    value={areaTo}
                    onChange={(e) => setAreaTo(e.target.value)}
                    placeholder="180"
                  />
                </div>
                <div>
                  <Label htmlFor="completionDate">Fecha de Entrega</Label>
                  <Input
                    id="completionDate"
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Tipos de Unidad</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {UNIT_TYPES.map((type) => (
                    <Badge
                      key={type}
                      variant={unitTypes.includes(type) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleUnitType(type)}
                    >
                      {type}
                      {unitTypes.includes(type) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AMENITIES_LIST.map((amenity) => (
                  <div key={amenity.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity.value}
                      checked={amenities.includes(amenity.value)}
                      onCheckedChange={() => toggleAmenity(amenity.value)}
                    />
                    <label
                      htmlFor={amenity.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {amenity.label}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Media Links */}
          <Card>
            <CardHeader>
              <CardTitle>Enlaces de Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="videoUrl">URL de Video (YouTube)</Label>
                <Input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div>
                <Label htmlFor="brochureUrl">URL de Brochure (PDF)</Label>
                <Input
                  id="brochureUrl"
                  value={brochureUrl}
                  onChange={(e) => setBrochureUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Images */}
          <Card>
            <CardHeader>
              <CardTitle>Imagenes del Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {images.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          <Image
                            src={url}
                            alt={`Imagen ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {index === 0 && (
                          <Badge className="absolute bottom-1 left-1 text-xs">
                            Principal
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? (
                      <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                    ) : (
                      <>
                        <Plus className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Agregar imagenes</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Developer Logo */}
          <Card>
            <CardHeader>
              <CardTitle>Logo del Desarrollador</CardTitle>
            </CardHeader>
            <CardContent>
              {logoUrl ? (
                <div className="relative">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-50">
                    <Image
                      src={logoUrl}
                      alt="Logo"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setLogoUrl('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                    ) : (
                      <>
                        <ImageIcon className="h-6 w-6 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-500">Subir logo</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                    disabled={isUploading}
                  />
                </label>
              )}
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Opciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Label htmlFor="featured">Destacado</Label>
                </div>
                <Switch
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-500" />
                  <Label htmlFor="active">Activo</Label>
                </div>
                <Switch
                  id="active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
