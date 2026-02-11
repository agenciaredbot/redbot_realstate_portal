import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { updateProfileRole } from '@/lib/supabase/admin-queries';
import { USER_ROLES, type UserRole } from '@/types/admin';

export async function POST(request: NextRequest) {
  try {
    const profile = await getUserProfile();

    if (!profile) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Only admins can change roles
    if (profile.role !== USER_ROLES.ADMIN) {
      return NextResponse.json({ error: 'No tienes permisos para esta acción' }, { status: 403 });
    }

    const { userId, role } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    if (!role || ![1, 2, 3].includes(role)) {
      return NextResponse.json({ error: 'Rol no válido' }, { status: 400 });
    }

    // Prevent admin from changing their own role
    if (userId === profile.id) {
      return NextResponse.json({ error: 'No puedes cambiar tu propio rol' }, { status: 400 });
    }

    const { data, error } = await updateProfileRole(userId, role as UserRole);

    if (error) {
      console.error('Error changing user role:', error);
      return NextResponse.json({ error: 'Error al cambiar el rol del usuario' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in change role API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
