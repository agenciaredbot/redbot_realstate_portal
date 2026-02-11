import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { togglePropertyActive } from '@/lib/supabase/admin-queries';
import { USER_ROLES } from '@/types/admin';

export async function POST(request: NextRequest) {
  try {
    const profile = await getUserProfile();

    if (!profile) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Only admins can toggle property status
    if (profile.role !== USER_ROLES.ADMIN) {
      return NextResponse.json({ error: 'No tienes permisos para esta acción' }, { status: 403 });
    }

    const { propertyId, isActive } = await request.json();

    if (!propertyId) {
      return NextResponse.json({ error: 'ID de propiedad requerido' }, { status: 400 });
    }

    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'Estado requerido' }, { status: 400 });
    }

    const { data, error } = await togglePropertyActive(propertyId, isActive);

    if (error) {
      console.error('Error toggling property active:', error);
      return NextResponse.json({ error: 'Error al cambiar estado de la propiedad' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in toggle active API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
