import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/auth';
import { getAllProfiles } from '@/lib/supabase/admin-queries';
import { USER_ROLES } from '@/types/admin';
import { UsersTable } from './UsersTable';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/login');
  }

  // Only admins can access this page
  if (profile.role !== USER_ROLES.ADMIN) {
    redirect('/admin/dashboard');
  }

  // Fetch all profiles
  const { profiles, total } = await getAllProfiles({ limit: 100 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-gray-500">
          Gestiona los usuarios registrados en el portal
        </p>
      </div>

      {/* Users Table */}
      <UsersTable users={profiles} total={total} />
    </div>
  );
}
