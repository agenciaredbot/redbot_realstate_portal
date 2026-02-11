import { getUserProfile } from '@/lib/supabase/auth';
import {
  getAdminDashboardStats,
  getAgentDashboardStats,
  getUserDashboardStats,
} from '@/lib/supabase/admin-queries';
import { USER_ROLES } from '@/types/admin';
import { AdminDashboard } from './AdminDashboard';
import { AgentDashboard } from './AgentDashboard';
import { UserDashboard } from './UserDashboard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const profile = await getUserProfile();

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Error al cargar el perfil</p>
      </div>
    );
  }

  // Fetch stats based on role
  if (profile.role === USER_ROLES.ADMIN) {
    const stats = await getAdminDashboardStats();
    return <AdminDashboard stats={stats} />;
  }

  if (profile.role === USER_ROLES.AGENT && profile.agent_id) {
    const stats = await getAgentDashboardStats(profile.agent_id);
    return <AgentDashboard stats={stats} />;
  }

  // User dashboard
  const stats = await getUserDashboardStats(profile.id);
  return <UserDashboard stats={stats} />;
}
