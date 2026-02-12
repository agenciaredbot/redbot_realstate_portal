import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getUserProfile } from '@/lib/supabase/auth';
import { getBlogPostById } from '@/lib/supabase/blog-queries';
import { USER_ROLES } from '@/types/admin';
import { formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Calendar,
  User,
  Tag,
  BarChart3,
  FileText,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogPostActions } from './BlogPostActions';
import { MarkdownContent } from '@/components/blog/MarkdownContent';

export const dynamic = 'force-dynamic';

interface BlogDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const profile = await getUserProfile();
  const { id } = await params;

  if (!profile) {
    redirect('/login');
  }

  // Only admins can access this page
  if (profile.role !== USER_ROLES.ADMIN) {
    redirect('/admin/dashboard');
  }

  const post = await getBlogPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 line-clamp-1">
              {post.title}
            </h1>
            <p className="text-gray-500 text-sm">ID: {post.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={post.is_published ? 'default' : 'secondary'}
            className={
              post.is_published
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }
          >
            {post.is_published ? (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Publicado
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Borrador
              </>
            )}
          </Badge>
          {post.is_featured && (
            <Badge className="bg-yellow-100 text-yellow-800">
              <Star className="h-3 w-3 mr-1 fill-yellow-500" />
              Destacado
            </Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <BlogPostActions post={post} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Imagen Destacada</CardTitle>
            </CardHeader>
            <CardContent>
              {post.featured_image ? (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                  <div className="text-center text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-2" />
                    <p>Sin imagen</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Excerpt */}
          {post.excerpt && (
            <Card>
              <CardHeader>
                <CardTitle>Extracto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{post.excerpt}</p>
              </CardContent>
            </Card>
          )}

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Contenido</CardTitle>
            </CardHeader>
            <CardContent>
              {post.content ? (
                <MarkdownContent content={post.content} />
              ) : (
                <p className="text-gray-400 italic">Sin contenido</p>
              )}
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Meta Título</p>
                <p className="font-medium">
                  {post.meta_title || post.title}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Meta Descripción</p>
                <p className="text-gray-600">
                  {post.meta_description || post.excerpt || 'Sin descripción'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Button asChild className="w-full">
                <Link href={`/admin/blog/${post.id}/editar`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Artículo
                </Link>
              </Button>
              {post.is_published && (
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver en Portal
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Creado:</span>
                <span>{formatDate(post.created_at)}</span>
              </div>

              {post.published_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Publicado:</span>
                  <span>{formatDate(post.published_at)}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Autor:</span>
                <span>{post.author_name || 'Sin autor'}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Vistas:</span>
                <span>{post.views_count || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              {post.category ? (
                <Badge variant="outline">{post.category}</Badge>
              ) : (
                <span className="text-gray-400">Sin categoría</span>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Etiquetas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadatos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Slug</span>
                <span className="font-mono text-xs truncate max-w-[150px]">
                  {post.slug}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Actualizado</span>
                <span>{formatDate(post.updated_at)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
