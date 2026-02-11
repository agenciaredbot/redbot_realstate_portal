import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/auth';
import { ProfileForm } from './ProfileForm';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-500">
          Administra tu información personal y preferencias
        </p>
      </div>

      {/* Profile Form */}
      <ProfileForm profile={profile} />
    </div>
  );
}
