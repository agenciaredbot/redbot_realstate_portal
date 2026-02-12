import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserProfile } from '@/lib/supabase/auth';
import { getBlogPosts, getBlogStats, getBlogCategories } from '@/lib/supabase/blog-queries';
import { USER_ROLES } from '@/types/admin';
import { Plus, FileText, Eye, EyeOff, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogPostsTable } from './BlogPostsTable';

export const dynamic = 'force-dynamic';

export default async function BlogAdminPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/login');
  }

  // Only admins can access blog management
  if (profile.role !== USER_ROLES.ADMIN) {
    redirect('/admin/dashboard');
  }

  const [posts, stats, categories] = await Promise.all([
    getBlogPosts(),
    getBlogStats(),
    getBlogCategories(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-500">
            Gestiona los artículos del blog
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Artículo
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
                <p className="text-sm text-gray-500">Publicados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <EyeOff className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.drafts}</p>
                <p className="text-sm text-gray-500">Borradores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
                <p className="text-sm text-gray-500">Destacados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Todos los Artículos</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogPostsTable
            posts={posts}
            categories={categories.map((c) => c.name)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
