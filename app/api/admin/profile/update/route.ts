import { NextRequest, NextResponse } from 'next/server';
import { getUser, updateProfile } from '@/lib/supabase/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { full_name, phone } = await request.json();

    const { error } = await updateProfile(user.id, { full_name, phone });

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json({ error: 'Error al actualizar el perfil' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in update profile API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
