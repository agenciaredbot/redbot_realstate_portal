import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { createBlogPost, checkSlugExists } from '@/lib/supabase/blog-queries';
import { USER_ROLES } from '@/types/admin';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const profile = await getUserProfile();

    if (!profile) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Only admins can create blog posts
    if (profile.role !== USER_ROLES.ADMIN) {
      return NextResponse.json(
        { error: 'No tienes permisos para crear posts' },
        { status: 403 }
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

    // Generate slug from title if not provided
    let slug = body.slug?.trim();
    if (!slug) {
      slug = body.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 200);
    }

    // Check if slug exists
    const slugExists = await checkSlugExists(slug);
    if (slugExists) {
      // Append timestamp to make unique
      slug = `${slug}-${Date.now()}`;
    }

    // Prepare post data
    // Note: author_id column does not exist in DB, using author_name/author_avatar instead
    const postData = {
      title: body.title.trim(),
      slug,
      excerpt: body.excerpt?.trim() || null,
      content: body.content || null,
      featured_image: body.featured_image || null,
      author_name: profile.full_name || profile.email,
      author_avatar: profile.avatar_url || null,
      category: body.category || null,
      tags: body.tags || [],
      meta_title: body.meta_title?.trim() || null,
      meta_description: body.meta_description?.trim() || null,
      is_published: body.is_published || false,
      is_featured: body.is_featured || false,
      published_at: body.is_published ? new Date().toISOString() : null,
    };

    const post = await createBlogPost(postData);

    return NextResponse.json({
      success: true,
      post,
      message: body.is_published
        ? 'Post publicado exitosamente'
        : 'Borrador guardado exitosamente',
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    const errorMessage = error instanceof Error
      ? error.message
      : 'Error desconocido al crear el post';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
