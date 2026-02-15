import { Metadata } from 'next';
import Link from 'next/link';
import { Building2, CheckCircle } from 'lucide-react';
import { RegistroInmobiliariaForm } from '@/components/public/RegistroInmobiliariaForm';

export const metadata: Metadata = {
  title: 'Crear tu Inmobiliaria | Redbot',
  description:
    'Crea tu portal inmobiliario profesional en minutos. Prueba gratis por 14 días.',
};

const benefits = [
  'Portal web profesional en tu propio subdominio',
  'Publica hasta 5 propiedades gratis',
  'Panel de administración completo',
  'Recibe leads directamente',
  'Sin tarjeta de crédito requerida',
  'Configuración en menos de 5 minutos',
];

export default function RegistroInmobiliariaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Building2 className="h-10 w-10 text-luxus-gold" />
            <span className="text-2xl font-bold text-gray-900">
              Red<span className="text-luxus-gold">bot</span>
            </span>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left side - Benefits */}
            <div className="lg:sticky lg:top-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Crea tu Portal Inmobiliario
                <span className="text-luxus-gold"> Profesional</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Únete a cientos de inmobiliarias que ya usan Redbot para potenciar
                sus ventas y alquileres.
              </p>

              {/* Benefits list */}
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <p className="text-gray-600 italic mb-4">
                  "Redbot transformó la manera en que gestionamos nuestras propiedades.
                  En menos de una semana ya teníamos nuestro portal funcionando y
                  recibiendo contactos."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-luxus-gold/10 flex items-center justify-center">
                    <span className="text-luxus-gold font-semibold">JM</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Juan Martínez</p>
                    <p className="text-sm text-gray-500">Inmobiliaria del Sur</p>
                  </div>
                </div>
              </div>

              {/* Already have account */}
              <p className="mt-6 text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  href="/login"
                  className="text-luxus-gold font-medium hover:underline"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>

            {/* Right side - Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Completa tus datos para comenzar
              </h2>
              <RegistroInmobiliariaForm />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Redbot. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
