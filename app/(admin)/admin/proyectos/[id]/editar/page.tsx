import { redirect, notFound } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/auth';
import { getProjectById } from '@/lib/supabase/project-queries';
import { USER_ROLES } from '@/types/admin';
import { ProjectForm } from '../../ProjectForm';

export const dynamic = 'force-dynamic';

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const profile = await getUserProfile();
  const { id } = await params;

  if (!profile) {
    redirect('/login');
  }

  // Only admins can edit projects
  if (profile.role !== USER_ROLES.ADMIN) {
    redirect('/admin/dashboard');
  }

  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return <ProjectForm mode="edit" initialData={project} />;
}
