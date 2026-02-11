import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/auth';
import { getContactSubmissions } from '@/lib/supabase/admin-queries';
import { USER_ROLES, type ContactSubmissionWithDetails } from '@/types/admin';
import { LeadsTable } from './LeadsTable';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/login');
  }

  // Only admins and agents can access leads
  if (profile.role === USER_ROLES.USER) {
    redirect('/admin/dashboard');
  }

  // Fetch leads based on role
  let submissions: ContactSubmissionWithDetails[] = [];
  let total = 0;

  if (profile.role === USER_ROLES.ADMIN) {
    // Admin sees all leads
    const result = await getContactSubmissions({ limit: 100 });
    submissions = result.submissions;
    total = result.total;
  } else if (profile.role === USER_ROLES.AGENT && profile.agent_id) {
    // Agent sees only assigned leads
    const result = await getContactSubmissions({
      agentId: profile.agent_id,
      limit: 100,
    });
    submissions = result.submissions;
    total = result.total;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {profile.role === USER_ROLES.AGENT ? 'Mis Leads' : 'Leads'}
        </h1>
        <p className="text-gray-500">
          {profile.role === USER_ROLES.ADMIN
            ? 'Gestiona todos los contactos y leads del portal'
            : 'Leads asignados a ti'}
        </p>
      </div>

      {/* Leads Table */}
      <LeadsTable
        submissions={submissions}
        total={total}
        userRole={profile.role}
        agentId={profile.agent_id}
      />
    </div>
  );
}
