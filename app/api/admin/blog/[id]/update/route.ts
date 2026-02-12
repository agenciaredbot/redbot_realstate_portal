import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { updateBlogPost, getBlogPostById, checkSlugExists } from '@/lib/supabase/blog-queries';
import { USER_ROLES } from '@/types/admin';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check authentication
    const profile = await getUserProfile();

    if (!profile) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Only admins can update blog posts
    if (profile.role !== USER_ROLES.ADMIN) {
      return NextResponse.json(
        { error: 'No tienes permisos para editar posts' },
        { status: 403 }
      );
    }

    // Check if post exists
    const existingPost = await getBlogPostById(id);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: 'El título es requerido' },
        { status: 400 }
      );
    }

    // Check slug uniqueness if changed
    if (body.slug && body.slug !== existingPost.slug) {
      const slugExists = await checkSlugExists(body.slug, id);
      if (slugExists) {
        return NextResponse.json(
          { error: 'El slug ya está en uso' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      title: body.title.trim(),
      excerpt: body.excerpt?.trim() || null,
      content: body.content || null,
      featured_image: body.featured_image || null,
      category: body.category || null,
      tags: body.tags || [],
      meta_title: body.meta_title?.trim() || null,
      meta_description: body.meta_description?.trim() || null,
      is_published: body.is_published || false,
      is_featured: body.is_featured || false,
    };

    // Update slug if provided
    if (body.slug) {
      updateData.slug = body.slug.trim();
    }

    // Set published_at if publishing for the first time
    if (body.is_published && !existingPost.published_at) {
      updateData.published_at = new Date().toISOString();
    }

    const post = await updateBlogPost(id, updateData);

    return NextResponse.json({
      success: true,
      post,
      message: 'Post actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el post' },
      { status: 500 }
    );
  }
}
