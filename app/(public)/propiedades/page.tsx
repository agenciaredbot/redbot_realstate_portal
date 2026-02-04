import { Suspense } from 'react';
import { PropiedadesContent } from './PropiedadesContent';
import { getProperties, getAgents, getCities } from '@/lib/supabase/queries';

// Loading skeleton for Suspense fallback
function PropiedadesLoading() {
  return (
    <div className="min-h-screen bg-luxus-cream pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Page Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-5 w-72 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Skeleton */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-luxus space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </aside>

          {/* Grid Skeleton */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-luxus p-4 mb-6">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-luxus">
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

async function PropiedadesDataFetcher() {
  // Fetch all data from Supabase
  const [properties, agents, cities] = await Promise.all([
    getProperties(),
    getAgents(),
    getCities(),
  ]);

  // Create agents map
  const agentsMap = agents.reduce(
    (acc, agent) => {
      acc[agent.id] = {
        id: agent.id,
        slug: agent.slug,
        first_name: agent.first_name,
        last_name: agent.last_name,
        full_name: `${agent.first_name} ${agent.last_name}`,
        photo_url: agent.photo_url,
      };
      return acc;
    },
    {} as Record<string, any>
  );

  return (
    <PropiedadesContent
      initialProperties={properties}
      agentsMap={agentsMap}
      availableCities={cities}
    />
  );
}

export default function PropiedadesPage() {
  return (
    <Suspense fallback={<PropiedadesLoading />}>
      <PropiedadesDataFetcher />
    </Suspense>
  );
}
