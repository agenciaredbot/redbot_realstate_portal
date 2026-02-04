import { Metadata } from 'next';
import { getAgents } from '@/lib/supabase/queries';
import { AgentCard } from '@/components/agent/AgentCard';

export const metadata: Metadata = {
  title: 'Nuestros Agentes | Redbot Real Estate',
  description: 'Conoce a nuestro equipo de expertos inmobiliarios. Agentes profesionales listos para ayudarte a encontrar la propiedad perfecta.',
};

export default async function AgentesPage() {
  const agents = await getAgents();
  const activeAgents = agents.filter((agent) => agent.is_active !== false);

  // Calculate stats
  const totalSales = activeAgents.reduce((sum, a) => sum + (a.sales_count || 0), 0);
  const totalProperties = activeAgents.reduce((sum, a) => sum + (a.properties_count || 0), 0);
  const avgRating = activeAgents.length > 0
    ? (activeAgents.reduce((sum, a) => sum + (a.rating || 4.5), 0) / activeAgents.length).toFixed(1)
    : '4.5';

  return (
    <div className="min-h-screen bg-luxus-cream pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-luxus-dark font-serif mb-4">
            Nuestros Agentes
          </h1>
          <p className="text-luxus-gray max-w-2xl mx-auto">
            Contamos con un equipo de profesionales altamente calificados y con amplia experiencia
            en el mercado inmobiliario colombiano. Estamos listos para ayudarte a encontrar
            la propiedad de tus suenos.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-luxus p-6 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-luxus-gold">{activeAgents.length}</div>
              <div className="text-sm text-luxus-gray">Agentes Activos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-luxus-gold">{totalSales}+</div>
              <div className="text-sm text-luxus-gray">Propiedades Vendidas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-luxus-gold">{totalProperties}</div>
              <div className="text-sm text-luxus-gray">Propiedades Activas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-luxus-gold">{avgRating}</div>
              <div className="text-sm text-luxus-gray">Calificacion Promedio</div>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        {activeAgents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-luxus-gray">No hay agentes disponibles en este momento.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-luxus-dark rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-4">
            ¿Quieres Ser Parte de Nuestro Equipo?
          </h2>
          <p className="text-luxus-gray-light max-w-2xl mx-auto mb-6">
            Si eres un profesional inmobiliario con pasion por el servicio al cliente
            y deseas formar parte de una empresa lider en el mercado, nos encantaria conocerte.
          </p>
          <a
            href="/contacto?tipo=trabajo"
            className="inline-flex items-center gap-2 bg-luxus-gold hover:bg-luxus-gold-dark text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Enviar Solicitud
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
