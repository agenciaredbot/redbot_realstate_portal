import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/auth';
import { USER_ROLES } from '@/types/admin';
import { PropertyForm } from '../PropertyForm';
import { getAgents } from '@/lib/supabase/queries';

export const dynamic = 'force-dynamic';

export default async function NewPropertyPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/login');
  }

  // Get agents list for assignment (only for admins)
  const agents = profile.role === USER_ROLES.ADMIN ? await getAgents() : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nueva Propiedad</h1>
        <p className="text-gray-500">
          {profile.role === USER_ROLES.USER
            ? 'Envía tu propiedad para revisión y publicación'
            : 'Crea una nueva propiedad en el portal'}
        </p>
      </div>

      {/* Property Form */}
      <PropertyForm
        mode="create"
        userRole={profile.role}
        userId={profile.id}
        agents={agents}
      />
    </div>
  );
}
