'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormData {
  companyName: string;
  subdomain: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

interface FormErrors {
  companyName?: string;
  subdomain?: string;
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export function RegistroInmobiliariaForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState<{ subdomain: string } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    subdomain: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Auto-generate subdomain from company name
  const generateSubdomain = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 30);
  };

  const handleCompanyNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      companyName: value,
      // Only auto-generate if subdomain hasn't been manually edited
      subdomain: prev.subdomain === generateSubdomain(prev.companyName)
        ? generateSubdomain(value)
        : prev.subdomain,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Company name
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'El nombre de la inmobiliaria es requerido';
    }

    // Subdomain
    if (!formData.subdomain.trim()) {
      newErrors.subdomain = 'El subdominio es requerido';
    } else if (formData.subdomain.length < 3) {
      newErrors.subdomain = 'El subdominio debe tener al menos 3 caracteres';
    } else if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]+$/.test(formData.subdomain)) {
      newErrors.subdomain = 'Solo letras minúsculas, números y guiones (no al inicio/final)';
    }

    // Full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Tu nombre es requerido';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/register-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.companyName.trim(),
          subdomain: formData.subdomain.toLowerCase().trim(),
          fullName: formData.fullName.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          phone: formData.phone.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || 'Error al crear la cuenta' });
        return;
      }

      // Success!
      setSuccess({ subdomain: data.data.tenant.subdomain });

      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = data.data.redirectUrl;
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Error de conexión. Por favor intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Inmobiliaria creada exitosamente!
        </h2>
        <p className="text-gray-600 mb-4">
          Tu portal estará disponible en:
        </p>
        <p className="text-lg font-semibold text-luxus-gold mb-6">
          {success.subdomain}.redbot.app
        </p>
        <p className="text-sm text-gray-500">
          Redirigiendo en unos segundos...
        </p>
        <div className="mt-4">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-luxus-gold" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General error */}
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

      {/* Company Info Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Información de la Inmobiliaria
        </h3>

        {/* Company Name */}
        <div>
          <Label htmlFor="companyName">Nombre de la Inmobiliaria *</Label>
          <div className="relative mt-1">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="companyName"
              type="text"
              placeholder="Ej: Inmobiliaria Premium"
              value={formData.companyName}
              onChange={(e) => handleCompanyNameChange(e.target.value)}
              className={cn('pl-10', errors.companyName && 'border-red-500')}
              disabled={isLoading}
            />
          </div>
          {errors.companyName && (
            <p className="text-sm text-red-600 mt-1">{errors.companyName}</p>
          )}
        </div>

        {/* Subdomain */}
        <div>
          <Label htmlFor="subdomain">Tu Dirección Web *</Label>
          <div className="relative mt-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="subdomain"
              type="text"
              placeholder="mi-inmobiliaria"
              value={formData.subdomain}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                }))
              }
              className={cn('pl-10 pr-28', errors.subdomain && 'border-red-500')}
              disabled={isLoading}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              .redbot.app
            </span>
          </div>
          {errors.subdomain ? (
            <p className="text-sm text-red-600 mt-1">{errors.subdomain}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              Esta será la dirección de tu portal inmobiliario
            </p>
          )}
        </div>
      </div>

      {/* Personal Info Section */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Tu Información
        </h3>

        {/* Full Name */}
        <div>
          <Label htmlFor="fullName">Nombre Completo *</Label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="fullName"
              type="text"
              placeholder="Juan Pérez"
              value={formData.fullName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
              }
              className={cn('pl-10', errors.fullName && 'border-red-500')}
              disabled={isLoading}
            />
          </div>
          {errors.fullName && (
            <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email *</Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className={cn('pl-10', errors.email && 'border-red-500')}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone (Optional) */}
        <div>
          <Label htmlFor="phone">Teléfono (Opcional)</Label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Seguridad
        </h3>

        {/* Password */}
        <div>
          <Label htmlFor="password">Contraseña *</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className={cn('pl-10 pr-10', errors.password && 'border-red-500')}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className={cn('pl-10', errors.confirmPassword && 'border-red-500')}
              disabled={isLoading}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Trial info */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>✨ Prueba gratis por 14 días</strong> - Sin tarjeta de crédito requerida.
          Incluye hasta 5 propiedades y todas las funciones básicas.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-luxus-gold hover:bg-luxus-gold/90 text-white py-6 text-lg font-semibold"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Creando tu inmobiliaria...
          </>
        ) : (
          'Crear mi Inmobiliaria Gratis'
        )}
      </Button>

      {/* Terms */}
      <p className="text-xs text-center text-gray-500">
        Al registrarte, aceptas nuestros{' '}
        <a href="/terminos" className="text-luxus-gold hover:underline">
          Términos de Servicio
        </a>{' '}
        y{' '}
        <a href="/privacidad" className="text-luxus-gold hover:underline">
          Política de Privacidad
        </a>
      </p>
    </form>
  );
}
