'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2, Building2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/admin/dashboard';
  const errorParam = searchParams.get('error');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.error) {
        setError(
          result.error.message === 'Invalid login credentials'
            ? 'Email o contraseña incorrectos'
            : result.error.message
        );
        setIsLoading(false);
        return;
      }

      // Redirect to intended page
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError('Ocurrió un error al iniciar sesión');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      {/* Logo */}
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <Building2 className="h-10 w-10 text-luxus-gold" />
          <span className="text-2xl font-bold text-gray-900">
            Redbot<span className="text-luxus-gold">Admin</span>
          </span>
        </Link>
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Iniciar Sesión
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Accede al panel de administración
        </p>
      </div>

      {/* Error messages */}
      {errorParam === 'account_inactive' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Tu cuenta está desactivada. Contacta al administrador.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Login form */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="mt-1"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-luxus-gold focus:ring-luxus-gold border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Recordarme
            </label>
          </div>

          <div className="text-sm">
            <Link
              href="/admin/forgot-password"
              className="font-medium text-luxus-gold hover:text-luxus-gold-dark"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-luxus-gold hover:bg-luxus-gold-dark text-white"
          disabled={isLoading || authLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </Button>
      </form>

      {/* Back to site */}
      <div className="text-center">
        <Link
          href="/"
          className="text-sm text-gray-600 hover:text-luxus-gold"
        >
          ← Volver al sitio principal
        </Link>
      </div>
    </div>
  );
}

function LoginFormFallback() {
  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <div className="h-10 w-10 mx-auto bg-gray-200 rounded animate-pulse" />
        <div className="mt-6 h-8 w-48 mx-auto bg-gray-200 rounded animate-pulse" />
        <div className="mt-2 h-4 w-64 mx-auto bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-luxus-gold/20 to-luxus-dark/80" />
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200"
          alt="Real Estate"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h3 className="text-3xl font-bold mb-4">
              Gestiona tu negocio inmobiliario
            </h3>
            <p className="text-lg opacity-90">
              Administra propiedades, agentes, leads y más desde un solo lugar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
