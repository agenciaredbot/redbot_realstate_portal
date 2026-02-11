import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { USER_ROLES } from '@/types/admin';

// Mapeo de tipos de propiedad del formulario a valores del ENUM de PostgreSQL
const PROPERTY_TYPE_MAP: Record<string, string> = {
  'Apartamento': 'apartamento',
  'Casa': 'casa',
  'Oficina': 'oficina',
  'Local Comercial': 'local',
  'Bodega': 'bodega',
  'Lote': 'lote',
  'Finca': 'finca',
  'Penthouse': 'apartamento',
  'Estudio': 'apartamento',
  'Consultorio': 'consultorio',
  // Valores ya en minusculas (por si vienen asi)
  'apartamento': 'apartamento',
  'casa': 'casa',
  'oficina': 'oficina',
  'local': 'local',
  'bodega': 'bodega',
  'lote': 'lote',
  'finca': 'finca',
  'consultorio': 'consultorio',
};

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .slice(0, 100); // Limit length
}

export async function POST(request: NextRequest) {
  try {
    const profile = await getUserProfile();

    if (!profile) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title?.trim()) {
      return NextResponse.json({ error: 'El título es requerido' }, { status: 400 });
    }

    if (!data.property_type) {
      return NextResponse.json({ error: 'El tipo de propiedad es requerido' }, { status: 400 });
    }

    if (!data.city) {
      return NextResponse.json({ error: 'La ciudad es requerida' }, { status: 400 });
    }

    if (!data.price || data.price <= 0) {
      return NextResponse.json({ error: 'El precio debe ser mayor a 0' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Generate unique slug
    let baseSlug = generateSlug(data.title);
    let slug = baseSlug;
    let counter = 1;

    // Check for existing slugs and make unique
    while (true) {
      const { data: existing } = await supabase
        .from('properties')
        .select('id')
        .eq('slug', slug)
        .single();

      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Determine submission status based on role
    const isAdmin = profile.role === USER_ROLES.ADMIN;
    const submissionStatus = isAdmin ? 'approved' : 'pending';
    const isActive = isAdmin;

    // Normalizar property_type al valor del ENUM
    const normalizedPropertyType = PROPERTY_TYPE_MAP[data.property_type] || 'apartamento';

    // Preparar agent_id - asegurarse de que es null si está vacío
    const agentId = isAdmin && data.agent_id && data.agent_id.trim() !== ''
      ? data.agent_id
      : null;

    console.log('Creating property with data:', {
      title: data.title,
      property_type: normalizedPropertyType,
      city: data.city,
      price: data.price,
      agent_id: agentId,
      submitted_by: isAdmin ? null : profile.id,
      submission_status: submissionStatus,
    });

    // Create property
    const { data: property, error } = await supabase
      .from('properties')
      .insert({
        title: data.title.trim(),
        slug,
        description: data.description || null,
        property_type: normalizedPropertyType,
        status: data.status || 'venta',
        price: data.price,
        city: data.city,
        neighborhood: data.neighborhood || null,
        address: data.address || null,
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        area_m2: data.square_meters || 0,
        amenities: data.amenities || [],
        agent_id: agentId,
        submitted_by: isAdmin ? null : profile.id,
        submission_status: submissionStatus,
        is_active: isActive,
        is_featured: false,
        views_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating property:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json({
        error: `Error al crear la propiedad: ${error.message}`
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    console.error('Error in create property API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
