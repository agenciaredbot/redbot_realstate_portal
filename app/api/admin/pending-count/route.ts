import { NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { getPendingPropertiesCount } from '@/lib/supabase/admin-queries';
import { USER_ROLES } from '@/types/admin';

export async function GET() {
  try {
    const profile = await getUserProfile();

    if (!profile) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Solo admins pueden ver el conteo de pendientes
    if (profile.role !== USER_ROLES.ADMIN) {
      return NextResponse.json({ count: 0 });
    }

    const count = await getPendingPropertiesCount();

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching pending count:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
