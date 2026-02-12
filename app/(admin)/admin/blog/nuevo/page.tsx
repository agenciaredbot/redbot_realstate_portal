import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/auth';
import { getBlogCategories } from '@/lib/supabase/blog-queries';
import { USER_ROLES } from '@/types/admin';
import { BlogForm } from '../BlogForm';

export const dynamic = 'force-dynamic';

export default async function NewBlogPostPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/login');
  }

  // Only admins can create blog posts
  if (profile.role !== USER_ROLES.ADMIN) {
    redirect('/admin/dashboard');
  }

  const categories = await getBlogCategories();

  return (
    <BlogForm
      mode="create"
      categories={categories}
    />
  );
}
