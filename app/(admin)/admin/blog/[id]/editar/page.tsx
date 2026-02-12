import { redirect, notFound } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/auth';
import { getBlogPostById, getBlogCategories } from '@/lib/supabase/blog-queries';
import { USER_ROLES } from '@/types/admin';
import { BlogForm } from '../../BlogForm';

export const dynamic = 'force-dynamic';

interface EditBlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  const profile = await getUserProfile();
  const { id } = await params;

  if (!profile) {
    redirect('/login');
  }

  // Only admins can edit blog posts
  if (profile.role !== USER_ROLES.ADMIN) {
    redirect('/admin/dashboard');
  }

  const [post, categories] = await Promise.all([
    getBlogPostById(id),
    getBlogCategories(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <BlogForm
      mode="edit"
      initialData={post}
      categories={categories}
    />
  );
}
