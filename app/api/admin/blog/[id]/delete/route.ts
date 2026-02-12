import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { deleteBlogPost, getBlogPostById } from '@/lib/supabase/blog-queries';
import { createAdminClient } from '@/lib/supabase/server';
import { USER_ROLES } from '@/types/admin';

export async function DELETE(
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

    // Only admins can delete blog posts
    if (profile.role !== USER_ROLES.ADMIN) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar posts' },
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

    // Delete featured image from storage if exists
    if (existingPost.featured_image) {
      try {
        const supabase = createAdminClient();
        const url = new URL(existingPost.featured_image);
        const pathParts = url.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];

        if (fileName) {
          await supabase.storage
            .from('blog-images')
            .remove([fileName]);
        }
      } catch (storageError) {
        console.error('Error deleting blog image from storage:', storageError);
        // Continue with post deletion even if image deletion fails
      }
    }

    // Delete the post
    await deleteBlogPost(id);

    return NextResponse.json({
      success: true,
      message: 'Post eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el post' },
      { status: 500 }
    );
  }
}
