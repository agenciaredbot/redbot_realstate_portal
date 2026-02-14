import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Star,
  Home,
  Award,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { getAgentWithProperties, getAllAgentSlugs } from '@/lib/supabase/queries';
import { Property } from '@/types';

interface AgentDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params
export async function generateStaticParams() {
  const slugs = await getAllAgentSlugs();
  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

// Generate metadata
export async function generateMetadata({
  params,
}: AgentDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const agentData = await getAgentWithProperties(slug);

  if (!agentData) {
    return {
      title: 'Agente no encontrado | Redbot Real Estate',
    };
  }

  const fullName = `${agentData.first_name} ${agentData.last_name}`;
  const bio = agentData.bio || '';

  return {
    title: `${fullName} - ${agentData.role} | Redbot Real Estate`,
    description: bio.substring(0, 160) || `Agente inmobiliario ${fullName}`,
    openGraph: {
      title: `${fullName} - ${agentData.role}`,
      description: bio.substring(0, 160) || `Agente inmobiliario ${fullName}`,
      images: agentData.photo_url ? [agentData.photo_url] : [],
      type: 'profile',
    },
  };
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { slug } = await params;
  const agentData = await getAgentWithProperties(slug);

  if (!agentData) {
    notFound();
  }

  // Build compatible agent object from Supabase data
  const agent = {
    ...agentData,
    full_name: `${agentData.first_name} ${agentData.last_name}`,
    title: agentData.role || 'Agente Inmobiliario',
    city: 'Colombia',
    bio: agentData.bio || 'Agente inmobiliario profesional con experiencia en el mercado colombiano.',
    rating: null as number | null,
    reviews_count: null as number | null,
    properties_count: agentData.properties?.length || 0,
    sales_count: 0,
    whatsapp: agentData.social_links?.whatsapp || null,
    office_address: null as string | null,
  };
  const agentProperties = agentData.properties || [];
  const yearsExperience = agentData.years_experience || 0;

  return (
    <div className="min-h-screen bg-luxus-cream pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center gap-2 text-luxus-gray">
            <li>
              <Link href="/" className="hover:text-luxus-gold">
                Inicio
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/agentes" className="hover:text-luxus-gold">
                Agentes
              </Link>
            </li>
            <li>/</li>
            <li className="text-luxus-dark">{agent.full_name}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Agent Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-luxus overflow-hidden sticky top-24">
              {/* Photo */}
              <div className="relative aspect-square">
                <Image
                  src={agent.photo_url}
                  alt={agent.full_name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="p-6">
                <h1 className="text-2xl font-bold text-luxus-dark font-heading">
                  {agent.full_name}
                </h1>
                <p className="text-luxus-gold font-medium">{agent.title}</p>

                {/* Location */}
                <div className="flex items-center gap-2 text-luxus-gray mt-3">
                  <MapPin className="w-4 h-4" />
                  <span>{agent.city}</span>
                </div>

                {/* Rating */}
                {agent.rating && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(agent.rating!)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{agent.rating}</span>
                    {agent.reviews_count && (
                      <span className="text-sm text-luxus-gray">
                        ({agent.reviews_count} reseñas)
                      </span>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-luxus-gray-light">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-luxus-gold">
                      {agent.properties_count}
                    </div>
                    <div className="text-xs text-luxus-gray">Propiedades</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-luxus-gold">
                      {agent.sales_count || 0}
                    </div>
                    <div className="text-xs text-luxus-gray">Vendidas</div>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3 mt-6">
                  <Button
                    asChild
                    className="w-full bg-luxus-gold hover:bg-luxus-gold-dark text-white"
                  >
                    <a href={`tel:${agent.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      {agent.phone}
                    </a>
                  </Button>

                  {agent.whatsapp && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-green-500 text-green-600 hover:bg-green-50"
                    >
                      <a
                        href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                  )}

                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-luxus-gray-light"
                  >
                    <a href={`mailto:${agent.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar Email
                    </a>
                  </Button>
                </div>

                {/* Social Links */}
                {agent.social_links && Object.keys(agent.social_links).length > 0 && (
                  <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-luxus-gray-light">
                    {agent.social_links.facebook && (
                      <a
                        href={agent.social_links.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-luxus-cream rounded-full flex items-center justify-center hover:bg-luxus-gold hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                    )}
                    {agent.social_links.instagram && (
                      <a
                        href={agent.social_links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-luxus-cream rounded-full flex items-center justify-center hover:bg-luxus-gold hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                    )}
                    {agent.social_links.linkedin && (
                      <a
                        href={agent.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-luxus-cream rounded-full flex items-center justify-center hover:bg-luxus-gold hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-xl shadow-luxus p-6">
              <h2 className="text-xl font-semibold text-luxus-dark mb-4 font-heading flex items-center gap-2">
                <span className="w-8 h-1 bg-luxus-gold rounded-full" />
                Acerca de {agent.first_name}
              </h2>
              <p className="text-luxus-gray leading-relaxed whitespace-pre-line">
                {agent.bio}
              </p>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-luxus-gray-light">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-luxus-cream flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-luxus-gold" />
                  </div>
                  <div>
                    <span className="text-xs text-luxus-gray block">Experiencia</span>
                    <span className="font-semibold text-luxus-dark">
                      {yearsExperience}+ años
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-luxus-cream flex items-center justify-center">
                    <Home className="w-5 h-5 text-luxus-gold" />
                  </div>
                  <div>
                    <span className="text-xs text-luxus-gray block">Especialidad</span>
                    <span className="font-semibold text-luxus-dark">
                      {agent.city}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-luxus-cream flex items-center justify-center">
                    <Award className="w-5 h-5 text-luxus-gold" />
                  </div>
                  <div>
                    <span className="text-xs text-luxus-gray block">Verificado</span>
                    <span className="font-semibold text-green-600">
                      Agente Certificado
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Address */}
            {agent.office_address && (
              <div className="bg-white rounded-xl shadow-luxus p-6">
                <h2 className="text-xl font-semibold text-luxus-dark mb-4 font-heading flex items-center gap-2">
                  <span className="w-8 h-1 bg-luxus-gold rounded-full" />
                  Oficina
                </h2>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-luxus-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-luxus-dark">{agent.office_address}</p>
                    <p className="text-luxus-gray">{agent.city}, Colombia</p>
                  </div>
                </div>
              </div>
            )}

            {/* Agent Properties */}
            {agentProperties.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-luxus-dark mb-6 font-heading flex items-center gap-2">
                  <span className="w-8 h-1 bg-luxus-gold rounded-full" />
                  Propiedades de {agent.first_name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {agentProperties.slice(0, 4).map((property: Property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      agent={{
                        full_name: agent.full_name,
                        photo_url: agent.photo_url,
                      }}
                    />
                  ))}
                </div>
                {agentProperties.length > 4 && (
                  <div className="mt-6 text-center">
                    <Link
                      href={`/propiedades?agent=${agent.id}`}
                      className="inline-flex items-center gap-2 text-luxus-gold hover:text-luxus-gold-dark font-medium"
                    >
                      Ver todas las propiedades ({agentProperties.length})
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {agentProperties.length === 0 && (
              <div className="bg-white rounded-xl shadow-luxus p-8 text-center">
                <Home className="w-12 h-12 text-luxus-gray-light mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-luxus-dark mb-2">
                  Sin propiedades activas
                </h3>
                <p className="text-luxus-gray">
                  Este agente no tiene propiedades activas en este momento.
                  Contactalo para conocer las oportunidades disponibles.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
