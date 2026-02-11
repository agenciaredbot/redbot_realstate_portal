import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/auth';
import { getAdminProperties } from '@/lib/supabase/admin-queries';
import { USER_ROLES } from '@/types/admin';
import { PendingPropertiesList } from './PendingPropertiesList';

export const dynamic = 'force-dynamic';

export default async function PendingPropertiesPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/login');
  }

  // Only admins can access this page
  if (profile.role !== USER_ROLES.ADMIN) {
    redirect('/admin/dashboard');
  }

  // Fetch pending properties
  const { properties, total } = await getAdminProperties({
    submissionStatus: 'pending',
    limit: 50,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Propiedades Pendientes
        </h1>
        <p className="text-gray-500">
          Revisa y aprueba las propiedades enviadas por usuarios
        </p>
      </div>

      {/* Pending Properties List */}
      <PendingPropertiesList properties={properties} total={total} />
    </div>
  );
}
