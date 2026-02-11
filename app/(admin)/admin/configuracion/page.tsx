import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/auth';
import { USER_ROLES } from '@/types/admin';
import { SettingsForm } from './SettingsForm';

export const dynamic = 'force-dynamic';

export default async function ConfiguracionPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/login');
  }

  // Only admins can access this page
  if (profile.role !== USER_ROLES.ADMIN) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500">
          Gestiona la configuración general del portal
        </p>
      </div>

      {/* Settings Form */}
      <SettingsForm />
    </div>
  );
}
