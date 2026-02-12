import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { createProject, checkProjectSlugExists, generateProjectSlug } from '@/lib/supabase/project-queries';
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

    // Only admins can create projects
    if (profile.role !== USER_ROLES.ADMIN) {
      return NextResponse.json(
        { error: 'No tienes permisos para crear proyectos' },
        { status: 403 }
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

    // Generate slug from name if not provided
    let slug = body.slug?.trim();
    if (!slug) {
      slug = generateProjectSlug(body.name);
    }

    // Check if slug exists
    const slugExists = await checkProjectSlugExists(slug);
    if (slugExists) {
      // Append timestamp to make unique
      slug = `${slug}-${Date.now()}`;
    }

    // Prepare project data
    const projectData = {
      name: body.name.trim(),
      slug,
      developer: body.developer?.trim() || null,
      description_short: body.description_short?.trim() || null,
      description: body.description?.trim() || null,
      status: body.status || 'en_construccion',
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
      is_featured: body.is_featured || false,
      is_active: body.is_active !== false, // Default to true
    };

    const project = await createProject(projectData);

    return NextResponse.json({
      success: true,
      project,
      message: 'Proyecto creado exitosamente',
    });
  } catch (error) {
    console.error('Error creating project:', error);
    const errorMessage = error instanceof Error
      ? error.message
      : 'Error desconocido al crear el proyecto';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
