'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Agent } from '@/types';
import type { UserRole } from '@/types/admin';
import { USER_ROLES } from '@/types/admin';
import {
  Building2,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Save,
  ArrowLeft,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

interface PropertyFormProps {
  mode: 'create' | 'edit';
  userRole: UserRole;
  userId: string;
  agents: Agent[];
  initialData?: {
    id?: string;
    title?: string;
    description?: string;
    property_type?: string;
    status?: string;
    price?: number;
    city?: string;
    neighborhood?: string;
    address?: string;
    bedrooms?: number;
    bathrooms?: number;
    square_meters?: number;
    amenities?: string[];
    agent_id?: string;
  };
}

const PROPERTY_TYPES = [
  'Apartamento',
  'Casa',
  'Oficina',
  'Local Comercial',
  'Bodega',
  'Lote',
  'Finca',
  'Penthouse',
  'Estudio',
];

const CITIES = [
  'Bogotá',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Bucaramanga',
  'Santa Marta',
  'Pereira',
  'Manizales',
  'Ibagué',
];

const AMENITIES = [
  'Parqueadero',
  'Piscina',
  'Gimnasio',
  'Zonas Verdes',
  'Portería 24h',
  'Ascensor',
  'Terraza',
  'Balcón',
  'Vista Panorámica',
  'Depósito',
  'Zona BBQ',
  'Salón Comunal',
  'Cancha de Tenis',
  'Zona de Niños',
  'Cuarto de Servicio',
];

export function PropertyForm({
  mode,
  userRole,
  userId,
  agents,
  initialData = {},
}: PropertyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    property_type: initialData.property_type || '',
    status: initialData.status || 'venta',
    price: initialData.price || 0,
    city: initialData.city || '',
    neighborhood: initialData.neighborhood || '',
    address: initialData.address || '',
    bedrooms: initialData.bedrooms || 0,
    bathrooms: initialData.bathrooms || 0,
    square_meters: initialData.square_meters || 0,
    amenities: initialData.amenities || [],
    agent_id: initialData.agent_id || '',
  });

  const isAdmin = userRole === USER_ROLES.ADMIN;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    setError('');
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.title.trim()) {
      setError('El título es requerido');
      setIsLoading(false);
      return;
    }

    if (!formData.property_type) {
      setError('El tipo de propiedad es requerido');
      setIsLoading(false);
      return;
    }

    if (!formData.city) {
      setError('La ciudad es requerida');
      setIsLoading(false);
      return;
    }

    if (formData.price <= 0) {
      setError('El precio debe ser mayor a 0');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint =
        mode === 'create'
          ? '/api/admin/properties/create'
          : `/api/admin/properties/${initialData.id}/update`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submitted_by: userRole === USER_ROLES.USER ? userId : null,
          submission_status: userRole === USER_ROLES.USER ? 'pending' : 'approved',
        }),
      });

      if (res.ok) {
        router.push('/admin/propiedades');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Error al guardar la propiedad');
      }
    } catch (err) {
      console.error('Error saving property:', err);
      setError('Error al guardar la propiedad');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* User Notice */}
      {userRole === USER_ROLES.USER && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Tu propiedad será revisada por un administrador antes de ser
            publicada. Te notificaremos cuando sea aprobada.
          </p>
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la Propiedad *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Apartamento moderno en Chapinero"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe la propiedad..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Propiedad *</Label>
              <Select
                value={formData.property_type}
                onValueChange={(v) => handleSelectChange('property_type', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Operación *</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => handleSelectChange('status', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="arriendo">Arriendo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  Precio (COP) *
                </div>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price || ''}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ubicación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ciudad *</Label>
              <Select
                value={formData.city}
                onValueChange={(v) => handleSelectChange('city', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Barrio / Sector</Label>
              <Input
                id="neighborhood"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                placeholder="Ej: Chapinero Alto"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ej: Calle 100 #15-20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Characteristics */}
      <Card>
        <CardHeader>
          <CardTitle>Características</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-gray-400" />
                  Habitaciones
                </div>
              </Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min="0"
                value={formData.bedrooms || ''}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-gray-400" />
                  Baños
                </div>
              </Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                min="0"
                value={formData.bathrooms || ''}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="square_meters">
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4 text-gray-400" />
                  Área (m²)
                </div>
              </Label>
              <Input
                id="square_meters"
                name="square_meters"
                type="number"
                min="0"
                value={formData.square_meters || ''}
                onChange={handleChange}
              />
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {AMENITIES.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onCheckedChange={() => handleAmenityToggle(amenity)}
                />
                <label
                  htmlFor={amenity}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agent Assignment (Admin only) */}
      {isAdmin && agents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Asignar Agente</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={formData.agent_id}
              onValueChange={(v) => handleSelectChange('agent_id', v)}
            >
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Seleccionar agente..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin asignar</SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.first_name} {agent.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/propiedades">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancelar
          </Link>
        </Button>

        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading
            ? 'Guardando...'
            : mode === 'create'
              ? userRole === USER_ROLES.USER
                ? 'Enviar para Revisión'
                : 'Crear Propiedad'
              : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}
