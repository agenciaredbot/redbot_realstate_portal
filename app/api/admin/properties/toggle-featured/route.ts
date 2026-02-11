import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { togglePropertyFeatured } from '@/lib/supabase/admin-queries';
import { USER_ROLES } from '@/types/admin';

export async function POST(request: NextRequest) {
  try {
    const profile = await getUserProfile();

    if (!profile) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Only admins can toggle featured status
    if (profile.role !== USER_ROLES.ADMIN) {
      return NextResponse.json({ error: 'No tienes permisos para esta acción' }, { status: 403 });
    }

    const { propertyId, isFeatured } = await request.json();

    if (!propertyId) {
      return NextResponse.json({ error: 'ID de propiedad requerido' }, { status: 400 });
    }

    if (typeof isFeatured !== 'boolean') {
      return NextResponse.json({ error: 'Estado requerido' }, { status: 400 });
    }

    const { data, error } = await togglePropertyFeatured(propertyId, isFeatured);

    if (error) {
      console.error('Error toggling property featured:', error);
      return NextResponse.json({ error: 'Error al cambiar estado destacado' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in toggle featured API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
