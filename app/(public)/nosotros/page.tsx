import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Target,
  Eye,
  Heart,
  Award,
  Users,
  Building2,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AgentCard } from '@/components/agent/AgentCard';
import { MOCK_AGENTS } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Nosotros | Redbot Real Estate',
  description:
    'Conoce a Redbot Real Estate, tu aliado en el mercado inmobiliario colombiano. Descubre nuestra historia, mision, vision y equipo de expertos.',
};

const stats = [
  { icon: Building2, value: '500+', label: 'Propiedades Vendidas' },
  { icon: Users, value: '1,200+', label: 'Clientes Satisfechos' },
  { icon: Award, value: '15+', label: 'Anos de Experiencia' },
  { icon: TrendingUp, value: '98%', label: 'Satisfaccion' },
];

const values = [
  {
    icon: Heart,
    title: 'Compromiso',
    description:
      'Nos comprometemos con cada cliente para encontrar la propiedad perfecta que se ajuste a sus necesidades y presupuesto.',
  },
  {
    icon: CheckCircle,
    title: 'Transparencia',
    description:
      'Operamos con total honestidad y claridad en cada transaccion, manteniendo informados a nuestros clientes en todo momento.',
  },
  {
    icon: Award,
    title: 'Excelencia',
    description:
      'Buscamos la excelencia en cada servicio que ofrecemos, superando las expectativas de nuestros clientes.',
  },
  {
    icon: Users,
    title: 'Trabajo en Equipo',
    description:
      'Nuestro equipo trabaja de manera coordinada para brindar la mejor experiencia a cada cliente.',
  },
];

export default function NosotrosPage() {
  const featuredAgents = MOCK_AGENTS.filter((a) => a.is_active).slice(0, 4);

  return (
    <div className="min-h-screen bg-luxus-cream">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-luxus-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-luxus-gold font-medium uppercase tracking-wider text-sm mb-4">
              Sobre Nosotros
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
              Tu Aliado en el Mercado Inmobiliario
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              En Redbot Real Estate, nos dedicamos a hacer realidad el sueno de
              miles de familias colombianas de tener su hogar ideal.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6">
                <stat.icon className="w-10 h-10 text-luxus-gold mx-auto mb-3" />
                <p className="text-3xl md:text-4xl font-bold text-luxus-dark mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-luxus-gray">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600"
                      alt="Oficina Redbot"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600"
                      alt="Equipo Redbot"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              {/* Experience Badge */}
              <div className="absolute -bottom-6 -right-6 bg-luxus-gold text-white rounded-xl p-6 shadow-xl hidden md:block">
                <p className="text-4xl font-bold">15+</p>
                <p className="text-sm">Anos de Experiencia</p>
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="text-luxus-gold font-medium uppercase tracking-wider text-sm mb-2">
                Nuestra Historia
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-luxus-dark font-heading mb-6">
                Construyendo Hogares, Creando Historias
              </h2>
              <div className="space-y-4 text-luxus-gray">
                <p>
                  Redbot Real Estate nacio en 2009 con una vision clara: transformar
                  la experiencia de comprar, vender y arrendar propiedades en Colombia.
                  Desde entonces, hemos ayudado a mas de 1,200 familias a encontrar
                  el hogar de sus suenos.
                </p>
                <p>
                  Nuestro equipo de expertos combina tecnologia de vanguardia con un
                  servicio personalizado y cercano. Entendemos que cada cliente tiene
                  necesidades unicas, y nos esforzamos por ofrecer soluciones a la
                  medida.
                </p>
                <p>
                  Hoy, somos una de las inmobiliarias mas reconocidas del pais, con
                  presencia en las principales ciudades de Colombia y un portafolio
                  diverso que incluye propiedades residenciales, comerciales y de
                  inversion.
                </p>
              </div>
              <div className="mt-8">
                <Button
                  asChild
                  className="bg-luxus-gold hover:bg-luxus-gold-dark text-white"
                >
                  <Link href="/contacto">Contactanos</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-luxus-cream rounded-xl p-8">
              <div className="w-14 h-14 bg-luxus-gold/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-luxus-gold" />
              </div>
              <h3 className="text-2xl font-bold text-luxus-dark font-heading mb-4">
                Nuestra Mision
              </h3>
              <p className="text-luxus-gray">
                Facilitar el acceso a propiedades de calidad en Colombia, brindando
                un servicio integral, transparente y personalizado que genere valor
                para nuestros clientes, colaboradores y la comunidad.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-luxus-cream rounded-xl p-8">
              <div className="w-14 h-14 bg-luxus-gold/10 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-luxus-gold" />
              </div>
              <h3 className="text-2xl font-bold text-luxus-dark font-heading mb-4">
                Nuestra Vision
              </h3>
              <p className="text-luxus-gray">
                Ser la inmobiliaria lider en Colombia, reconocida por nuestra
                innovacion, integridad y excelencia en el servicio, contribuyendo
                al desarrollo del sector inmobiliario del pais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-luxus-gold font-medium uppercase tracking-wider text-sm mb-2">
              Lo Que Nos Define
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-luxus-dark font-heading">
              Nuestros Valores
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-luxus hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-luxus-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-luxus-gold" />
                </div>
                <h3 className="text-lg font-bold text-luxus-dark mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-luxus-gray">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-luxus-gold font-medium uppercase tracking-wider text-sm mb-2">
              Conoce al Equipo
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-luxus-dark font-heading mb-4">
              Nuestros Agentes
            </h2>
            <p className="text-luxus-gray max-w-2xl mx-auto">
              Un equipo de profesionales apasionados y comprometidos con tu exito
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              asChild
              variant="outline"
              className="border-luxus-gold text-luxus-gold hover:bg-luxus-gold hover:text-white"
            >
              <Link href="/agentes">Ver Todos los Agentes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-luxus-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              ¿Listo para Encontrar tu Propiedad Ideal?
            </h2>
            <p className="text-gray-300 mb-8">
              Nuestro equipo esta listo para ayudarte. Contactanos hoy y da el
              primer paso hacia tu nuevo hogar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-luxus-gold hover:bg-luxus-gold-dark text-white"
              >
                <Link href="/propiedades">Explorar Propiedades</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-luxus-dark"
              >
                <Link href="/contacto">Contactar Ahora</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
