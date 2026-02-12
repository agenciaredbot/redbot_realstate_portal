import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { toggleProjectFeatured } from '@/lib/supabase/project-queries';
import { USER_ROLES } from '@/types/admin';

export async function POST(request: NextRequest) {
  try {
    const profile = await getUserProfile();

    if (!profile) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Only admins can toggle featured
    if (profile.role !== USER_ROLES.ADMIN) {
      return NextResponse.json(
        { error: 'No tienes permisos para esta accion' },
        { status: 403 }
      );
    }

    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: 'ID del proyecto es requerido' },
        { status: 400 }
      );
    }

    const project = await toggleProjectFeatured(projectId);

    return NextResponse.json({
      success: true,
      project,
      message: project?.is_featured
        ? 'Proyecto marcado como destacado'
        : 'Proyecto desmarcado como destacado',
    });
  } catch (error) {
    console.error('Error toggling project featured:', error);
    const errorMessage = error instanceof Error
      ? error.message
      : 'Error desconocido al cambiar estado destacado';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
