import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/auth';
import { getAdminProperties } from '@/lib/supabase/admin-queries';
import { USER_ROLES } from '@/types/admin';
import { PropertiesTable } from './PropertiesTable';

export const dynamic = 'force-dynamic';

export default async function PropertiesPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/login');
  }

  // Fetch properties based on role
  let properties;
  let total = 0;

  if (profile.role === USER_ROLES.ADMIN) {
    // Admin sees all properties
    const result = await getAdminProperties({ limit: 50 });
    properties = result.properties;
    total = result.total;
  } else if (profile.role === USER_ROLES.AGENT && profile.agent_id) {
    // Agent sees only assigned properties
    const result = await getAdminProperties({
      agentId: profile.agent_id,
      limit: 50,
    });
    properties = result.properties;
    total = result.total;
  } else {
    // User sees only their submitted properties
    const result = await getAdminProperties({ limit: 50 });
    // Filter by submitted_by (handled by RLS, but we still filter here)
    properties = result.properties.filter(
      (p) => p.submitted_by === profile.id
    );
    total = properties.length;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {profile.role === USER_ROLES.USER
              ? 'Mis Propiedades'
              : 'Propiedades'}
          </h1>
          <p className="text-gray-500">
            {profile.role === USER_ROLES.ADMIN
              ? 'Gestiona todas las propiedades del portal'
              : profile.role === USER_ROLES.AGENT
                ? 'Propiedades asignadas a ti'
                : 'Propiedades que has enviado para publicar'}
          </p>
        </div>
      </div>

      {/* Properties Table */}
      <PropertiesTable
        properties={properties}
        total={total}
        userRole={profile.role}
        userId={profile.id}
      />
    </div>
  );
}
