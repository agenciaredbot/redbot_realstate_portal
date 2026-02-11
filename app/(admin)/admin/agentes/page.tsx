import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/auth';
import { USER_ROLES } from '@/types/admin';
import { AgentsTable } from './AgentsTable';
import { getAgents } from '@/lib/supabase/queries';

export const dynamic = 'force-dynamic';

export default async function AgentsPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/login');
  }

  // Only admins can access this page
  if (profile.role !== USER_ROLES.ADMIN) {
    redirect('/admin/dashboard');
  }

  // Fetch all agents
  const agents = await getAgents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agentes</h1>
        <p className="text-gray-500">
          Gestiona los agentes inmobiliarios del portal
        </p>
      </div>

      {/* Agents Table */}
      <AgentsTable agents={agents} />
    </div>
  );
}
