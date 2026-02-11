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
  // Valores ya en minusculas
  'apartamento': 'apartamento',
  'casa': 'casa',
  'oficina': 'oficina',
  'local': 'local',
  'bodega': 'bodega',
  'lote': 'lote',
  'finca': 'finca',
  'consultorio': 'consultorio',
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getUserProfile();
    const { id } = await params;

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

    // Check if property exists and user has permission
    const { data: existingProperty } = await supabase
      .from('properties')
      .select('id, submitted_by')
      .eq('id', id)
      .single();

    if (!existingProperty) {
      return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
    }

    // Check permissions: Admin can edit any, others can only edit their own
    const isAdmin = profile.role === USER_ROLES.ADMIN;
    if (!isAdmin && existingProperty.submitted_by !== profile.id) {
      return NextResponse.json({ error: 'No tienes permiso para editar esta propiedad' }, { status: 403 });
    }

    // Normalizar property_type al valor del ENUM
    const normalizedPropertyType = PROPERTY_TYPE_MAP[data.property_type] || 'apartamento';

    // Preparar agent_id - solo admins pueden asignar agentes
    const agentId = isAdmin && data.agent_id && data.agent_id.trim() !== ''
      ? data.agent_id
      : null;

    // Update property
    const { data: property, error } = await supabase
      .from('properties')
      .update({
        title: data.title.trim(),
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
        images: data.images || [],
        agent_id: agentId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating property:', error);
      return NextResponse.json({
        error: `Error al actualizar la propiedad: ${error.message}`
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    console.error('Error in update property API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
