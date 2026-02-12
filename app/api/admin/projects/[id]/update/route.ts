import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { updateProject, getProjectById, checkProjectSlugExists } from '@/lib/supabase/project-queries';
import { USER_ROLES } from '@/types/admin';

export async function PUT(
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

    // Only admins can update projects
    if (profile.role !== USER_ROLES.ADMIN) {
      return NextResponse.json(
        { error: 'No tienes permisos para editar proyectos' },
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

    const body = await request.json();

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'El nombre del proyecto es requerido' },
        { status: 400 }
      );
    }

    if (!body.city?.trim()) {
      return NextResponse.json(
        { error: 'La ciudad es requerida' },
        { status: 400 }
      );
    }

    // Check if slug is unique (if changed)
    if (body.slug && body.slug !== existingProject.slug) {
      const slugExists = await checkProjectSlugExists(body.slug, id);
      if (slugExists) {
        return NextResponse.json(
          { error: 'El slug ya está en uso por otro proyecto' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData = {
      name: body.name.trim(),
      slug: body.slug?.trim() || existingProject.slug,
      developer: body.developer?.trim() || null,
      description_short: body.description_short?.trim() || null,
      description: body.description?.trim() || null,
      status: body.status || existingProject.status,
      completion_date: body.completion_date || null,
      delivery_date: body.delivery_date || null,
      city: body.city.trim(),
      neighborhood: body.neighborhood?.trim() || null,
      address: body.address?.trim() || null,
      latitude: body.latitude || null,
      longitude: body.longitude || null,
      price_from: body.price_from || null,
      price_to: body.price_to || null,
      price_currency: body.price_currency || 'COP',
      total_units: body.total_units || null,
      available_units: body.available_units || null,
      unit_types: body.unit_types || [],
      area_from: body.area_from || null,
      area_to: body.area_to || null,
      images: body.images || [],
      logo_url: body.logo_url || null,
      video_url: body.video_url || null,
      brochure_url: body.brochure_url || null,
      amenities: body.amenities || [],
      is_featured: body.is_featured ?? existingProject.is_featured,
      is_active: body.is_active ?? existingProject.is_active,
    };

    const project = await updateProject(id, updateData);

    return NextResponse.json({
      success: true,
      project,
      message: 'Proyecto actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error updating project:', error);
    const errorMessage = error instanceof Error
      ? error.message
      : 'Error desconocido al actualizar el proyecto';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
