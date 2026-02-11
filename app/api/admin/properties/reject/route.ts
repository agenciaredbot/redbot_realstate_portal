import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { rejectProperty } from '@/lib/supabase/admin-queries';
import { USER_ROLES } from '@/types/admin';

export async function POST(request: NextRequest) {
  try {
    const profile = await getUserProfile();

    if (!profile) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Only admins can reject properties
    if (profile.role !== USER_ROLES.ADMIN) {
      return NextResponse.json({ error: 'No tienes permisos para esta acción' }, { status: 403 });
    }

    const { propertyId, reason } = await request.json();

    if (!propertyId) {
      return NextResponse.json({ error: 'ID de propiedad requerido' }, { status: 400 });
    }

    if (!reason || !reason.trim()) {
      return NextResponse.json({ error: 'Motivo de rechazo requerido' }, { status: 400 });
    }

    const { data, error } = await rejectProperty(propertyId, reason);

    if (error) {
      console.error('Error rejecting property:', error);
      return NextResponse.json({ error: 'Error al rechazar la propiedad' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in reject property API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
