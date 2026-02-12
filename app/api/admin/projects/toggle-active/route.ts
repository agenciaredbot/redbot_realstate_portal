import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { toggleProjectActive } from '@/lib/supabase/project-queries';
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

    // Only admins can toggle active
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

    const project = await toggleProjectActive(projectId);

    return NextResponse.json({
      success: true,
      project,
      message: project?.is_active
        ? 'Proyecto activado'
        : 'Proyecto desactivado',
    });
  } catch (error) {
    console.error('Error toggling project active:', error);
    const errorMessage = error instanceof Error
      ? error.message
      : 'Error desconocido al cambiar estado activo';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
