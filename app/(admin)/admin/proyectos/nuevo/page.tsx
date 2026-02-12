import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/auth';
import { USER_ROLES } from '@/types/admin';
import { ProjectForm } from '../ProjectForm';

export const dynamic = 'force-dynamic';

export default async function NewProjectPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/login');
  }

  // Only admins can create projects
  if (profile.role !== USER_ROLES.ADMIN) {
    redirect('/admin/dashboard');
  }

  return <ProjectForm mode="create" />;
}
