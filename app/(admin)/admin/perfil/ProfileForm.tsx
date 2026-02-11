'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Profile } from '@/types/admin';
import { USER_ROLES, ROLE_LABELS } from '@/types/admin';
import {
  User,
  Mail,
  Phone,
  Shield,
  Save,
  Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    phone: profile.phone || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess('Perfil actualizado correctamente');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Error al actualizar el perfil');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (role: number) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'bg-red-100 text-red-800';
      case USER_ROLES.AGENT:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-xl bg-primary text-white">
                  {getInitials(profile.full_name, profile.email)}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border hover:bg-gray-50"
                title="Cambiar foto"
              >
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            {/* Name & Email */}
            <div className="mt-4 text-center">
              <h3 className="font-semibold text-lg text-gray-900">
                {profile.full_name || 'Sin nombre'}
              </h3>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>

            {/* Role Badge */}
            <Badge className={cn('mt-3', getRoleBadgeColor(profile.role))}>
              <Shield className="h-3 w-3 mr-1" />
              {ROLE_LABELS[profile.role]}
            </Badge>

            {/* Member Since */}
            <p className="text-xs text-gray-400 mt-4">
              Miembro desde{' '}
              {new Date(profile.created_at).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  Correo Electrónico
                </div>
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">
                El correo electrónico no puede ser modificado
              </p>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  Nombre Completo
                </div>
              </Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  Teléfono
                </div>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+57 300 123 4567"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Contraseña</h4>
              <p className="text-sm text-gray-500">
                Última actualización: Desconocida
              </p>
            </div>
            <Button variant="outline" disabled>
              Cambiar Contraseña
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            La funcionalidad de cambio de contraseña estará disponible próximamente
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
