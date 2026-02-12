import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { deleteProject, getProjectById } from '@/lib/supabase/project-queries';
import { USER_ROLES } from '@/types/admin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profile = await getUserProfile();

    if (!profile) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Only admins can delete projects
    if (profile.role !== USER_ROLES.ADMIN) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar proyectos' },
        { status: 403 }
      );
    }

    // Check if project exists
    const existingProject = await getProjectById(id);
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    await deleteProject(id);

    return NextResponse.json({
      success: true,
      message: 'Proyecto eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    const errorMessage = error instanceof Error
      ? error.message
      : 'Error desconocido al eliminar el proyecto';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
