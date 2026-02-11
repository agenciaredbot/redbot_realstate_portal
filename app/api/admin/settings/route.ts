import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { getSiteSettings, updateSiteSettings } from '@/lib/supabase/admin-queries';
import { USER_ROLES } from '@/types/admin';

export async function GET() {
  try {
    const profile = await getUserProfile();

    if (!profile) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Solo admins pueden ver configuración
    if (profile.role !== USER_ROLES.ADMIN) {
      return NextResponse.json({ error: 'No tienes permisos para esta acción' }, { status: 403 });
    }

    const settings = await getSiteSettings();

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await getUserProfile();

    if (!profile) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Solo admins pueden modificar configuración
    if (profile.role !== USER_ROLES.ADMIN) {
      return NextResponse.json({ error: 'No tienes permisos para esta acción' }, { status: 403 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Datos de configuración inválidos' }, { status: 400 });
    }

    const { data, error } = await updateSiteSettings(settings);

    if (error) {
      console.error('Error updating settings:', error);
      return NextResponse.json({ error: 'Error al guardar configuración' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in settings API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
