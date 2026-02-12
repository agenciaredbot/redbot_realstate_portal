import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { toggleBlogFeatured } from '@/lib/supabase/blog-queries';
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

    // Only admins can toggle featured status
    if (profile.role !== USER_ROLES.ADMIN) {
      return NextResponse.json(
        { error: 'No tienes permisos para modificar posts' },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (!body.postId) {
      return NextResponse.json(
        { error: 'ID del post es requerido' },
        { status: 400 }
      );
    }

    const post = await toggleBlogFeatured(body.postId);

    return NextResponse.json({
      success: true,
      post,
      message: post?.is_featured
        ? 'Post marcado como destacado'
        : 'Post quitado de destacados',
    });
  } catch (error) {
    console.error('Error toggling blog featured status:', error);
    return NextResponse.json(
      { error: 'Error al cambiar el estado del post' },
      { status: 500 }
    );
  }
}
