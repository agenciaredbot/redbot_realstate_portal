import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  ArrowRight,
  CheckCircle,
  Globe,
  BarChart3,
  Users,
  MessageSquare,
  Palette,
  Zap,
  Shield,
  Star,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Globe,
    title: 'Tu Propio Portal Web',
    description:
      'Obtén un sitio web profesional con tu subdominio personalizado o conecta tu propio dominio.',
  },
  {
    icon: Building2,
    title: 'Gestión de Propiedades',
    description:
      'Publica, edita y organiza todas tus propiedades desde un panel intuitivo y fácil de usar.',
  },
  {
    icon: MessageSquare,
    title: 'Captura de Leads',
    description:
      'Recibe consultas directamente en tu panel. Nunca pierdas un cliente potencial.',
  },
  {
    icon: Users,
    title: 'Gestión de Agentes',
    description:
      'Asigna propiedades a tus agentes y permite que cada uno gestione su cartera.',
  },
  {
    icon: Palette,
    title: 'Personalización Total',
    description:
      'Personaliza colores, logo y estilo para que tu portal refleje la identidad de tu marca.',
  },
  {
    icon: BarChart3,
    title: 'Analíticas',
    description:
      'Conoce qué propiedades generan más interés y optimiza tu estrategia de ventas.',
  },
];

const plans = [
  {
    name: 'Gratis',
    price: '$0',
    period: '/mes',
    description: 'Perfecto para empezar',
    features: [
      'Hasta 5 propiedades',
      '1 usuario',
      'Subdominio .redbot.app',
      'Soporte por email',
    ],
    cta: 'Comenzar Gratis',
    highlighted: false,
  },
  {
    name: 'Profesional',
    price: '$49',
    period: '/mes',
    description: 'Para inmobiliarias en crecimiento',
    features: [
      'Propiedades ilimitadas',
      'Hasta 5 agentes',
      'Dominio personalizado',
      'Blog integrado',
      'Analíticas avanzadas',
      'Soporte prioritario',
    ],
    cta: 'Prueba 14 días gratis',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Contactar',
    period: '',
    description: 'Para grandes operaciones',
    features: [
      'Todo en Profesional',
      'Agentes ilimitados',
      'API access',
      'White label',
      'Integraciones CRM',
      'Soporte dedicado',
    ],
    cta: 'Contactar Ventas',
    highlighted: false,
  },
];

const testimonials = [
  {
    name: 'María González',
    role: 'CEO, Inmobiliaria Premium',
    content:
      'Redbot transformó nuestra presencia online. En una semana teníamos nuestro portal funcionando y recibiendo contactos de calidad.',
    avatar: 'MG',
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Director, CasaLux Properties',
    content:
      'La facilidad de uso es increíble. Mis agentes pueden publicar propiedades sin ningún conocimiento técnico.',
    avatar: 'CR',
  },
  {
    name: 'Ana Martínez',
    role: 'Fundadora, InverHome',
    content:
      'El mejor ROI que hemos tenido. Cancelamos 3 herramientas diferentes y ahora solo usamos Redbot.',
    avatar: 'AM',
  },
];

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/redbot-logo.png"
                alt="Redbot"
                width={140}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">
                Características
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">
                Precios
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900">
                Testimonios
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link href="/registro-inmobiliaria">
                <Button className="bg-luxus-gold hover:bg-luxus-gold/90">
                  Crear mi Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-luxus-gold/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-luxus-gold/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-luxus-gold/10 text-luxus-gold px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              La plataforma #1 para inmobiliarias
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Tu Portal Inmobiliario
              <br />
              <span className="text-luxus-gold">Profesional en Minutos</span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Crea tu sitio web, gestiona propiedades, captura leads y haz crecer
              tu negocio inmobiliario. Todo en una sola plataforma.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/registro-inmobiliaria">
                <Button
                  size="lg"
                  className="bg-luxus-gold hover:bg-luxus-gold/90 text-white px-8 py-6 text-lg font-semibold group"
                >
                  Comenzar Gratis
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Ver Demo
              </Button>
            </div>

            <p className="text-sm text-gray-400">
              ✓ Sin tarjeta de crédito &nbsp;&nbsp; ✓ 14 días de prueba &nbsp;&nbsp; ✓
              Cancela cuando quieras
            </p>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="bg-gradient-to-b from-white/10 to-transparent p-1 rounded-2xl">
              <div className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 border-b border-slate-600/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-gray-400">
                      tu-inmobiliaria.redbot.app
                    </span>
                  </div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <div className="text-center">
                    <Building2 className="h-16 w-16 text-luxus-gold/50 mx-auto mb-4" />
                    <p className="text-gray-400">Vista previa del dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500 mb-8">
            Inmobiliarias que confían en Redbot
          </p>
          <div className="flex items-center justify-center gap-12 opacity-50 flex-wrap">
            <span className="text-xl font-semibold text-gray-400">InmoPremium</span>
            <span className="text-xl font-semibold text-gray-400">CasaLux</span>
            <span className="text-xl font-semibold text-gray-400">PropiedadesTop</span>
            <span className="text-xl font-semibold text-gray-400">InverHome</span>
            <span className="text-xl font-semibold text-gray-400">RealtyPro</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para tu inmobiliaria
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Una plataforma completa para gestionar tu negocio inmobiliario de
              principio a fin.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl border border-gray-200 hover:border-luxus-gold/50 hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-luxus-gold/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-luxus-gold/20 transition-colors">
                    <Icon className="h-6 w-6 text-luxus-gold" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comienza en 3 simples pasos
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-luxus-gold text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Regístrate</h3>
              <p className="text-gray-600">
                Crea tu cuenta en menos de 2 minutos. Sin tarjeta de crédito.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-luxus-gold text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Personaliza</h3>
              <p className="text-gray-600">
                Agrega tu logo, colores y configura tu portal a tu gusto.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-luxus-gold text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Publica</h3>
              <p className="text-gray-600">
                Agrega tus propiedades y comienza a recibir leads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planes simples y transparentes
            </h2>
            <p className="text-lg text-gray-600">
              Elige el plan que mejor se adapte a tu negocio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-slate-900 text-white ring-4 ring-luxus-gold scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="text-center mb-4">
                    <span className="bg-luxus-gold text-white text-xs font-semibold px-3 py-1 rounded-full">
                      MÁS POPULAR
                    </span>
                  </div>
                )}
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    plan.highlighted ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    plan.highlighted ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span
                    className={`text-4xl font-bold ${
                      plan.highlighted ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={plan.highlighted ? 'text-gray-300' : 'text-gray-500'}
                  >
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle
                        className={`h-5 w-5 ${
                          plan.highlighted ? 'text-luxus-gold' : 'text-green-500'
                        }`}
                      />
                      <span
                        className={plan.highlighted ? 'text-gray-200' : 'text-gray-600'}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/registro-inmobiliaria">
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? 'bg-luxus-gold hover:bg-luxus-gold/90 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-luxus-gold/10 flex items-center justify-center">
                    <span className="text-luxus-gold font-semibold text-sm">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para hacer crecer tu inmobiliaria?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Únete a cientos de inmobiliarias que ya usan Redbot para potenciar sus
            ventas.
          </p>
          <Link href="/registro-inmobiliaria">
            <Button
              size="lg"
              className="bg-luxus-gold hover:bg-luxus-gold/90 text-white px-10 py-6 text-lg font-semibold"
            >
              Crear mi Portal Gratis
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Image
              src="/images/redbot-logo.png"
              alt="Redbot"
              width={120}
              height={35}
              className="h-8 w-auto brightness-0 invert"
            />
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white">
                Términos
              </a>
              <a href="#" className="hover:text-white">
                Privacidad
              </a>
              <a href="#" className="hover:text-white">
                Contacto
              </a>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} Redbot. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
