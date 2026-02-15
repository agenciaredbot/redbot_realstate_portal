import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserProfile } from '@/lib/supabase/auth';
import { USER_ROLES } from '@/types/admin';
import {
  Palette,
  Globe,
  Bell,
  Shield,
  CreditCard,
  Users,
  Settings,
  ChevronRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const configSections = [
  {
    title: 'Personalización del Portal',
    description: 'Logo, colores, textos y contenido de tu sitio web',
    href: '/admin/configuracion/portal',
    icon: Palette,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'SEO y Dominio',
    description: 'Configuración de SEO y dominio personalizado',
    href: '/admin/configuracion/portal?tab=seo',
    icon: Globe,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Notificaciones',
    description: 'Configura alertas de leads y actividad',
    href: '/admin/configuracion/notificaciones',
    icon: Bell,
    color: 'bg-yellow-100 text-yellow-600',
    comingSoon: true,
  },
  {
    title: 'Seguridad',
    description: 'Contraseña y configuración de cuenta',
    href: '/admin/perfil',
    icon: Shield,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Facturación',
    description: 'Plan actual, límites y pagos',
    href: '/admin/configuracion/facturacion',
    icon: CreditCard,
    color: 'bg-orange-100 text-orange-600',
    comingSoon: true,
  },
  {
    title: 'Equipo',
    description: 'Gestiona usuarios y permisos',
    href: '/admin/usuarios',
    icon: Users,
    color: 'bg-indigo-100 text-indigo-600',
  },
];

export default async function ConfiguracionPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/login');
  }

  // Only admins can access this page
  if (profile.role !== USER_ROLES.ADMIN && profile.role !== USER_ROLES.SUPER_ADMIN) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500">
          Gestiona la configuración de tu portal inmobiliario
        </p>
      </div>

      {/* Config Sections Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {configSections.map((section) => {
          const Icon = section.icon;

          if (section.comingSoon) {
            return (
              <div
                key={section.title}
                className="relative bg-white border rounded-xl p-6 opacity-60 cursor-not-allowed"
              >
                <span className="absolute top-3 right-3 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  Próximamente
                </span>
                <div className={`w-12 h-12 rounded-xl ${section.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
            );
          }

          return (
            <Link
              key={section.title}
              href={section.href}
              className="bg-white border rounded-xl p-6 hover:border-luxus-gold hover:shadow-md transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl ${section.color} flex items-center justify-center mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-luxus-gold transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-luxus-gold group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Estado del Plan</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Plan actual</p>
            <p className="text-lg font-semibold text-gray-900">Gratuito</p>
          </div>
          <Link
            href="/admin/configuracion/facturacion"
            className="text-luxus-gold hover:underline text-sm font-medium"
          >
            Actualizar plan →
          </Link>
        </div>
      </div>
    </div>
  );
}
