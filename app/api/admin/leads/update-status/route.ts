import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/supabase/auth';
import { updateSubmissionStatus } from '@/lib/supabase/admin-queries';
import { USER_ROLES } from '@/types/admin';

export async function POST(request: NextRequest) {
  try {
    const profile = await getUserProfile();

    if (!profile) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Only admins and agents can update lead status
    if (profile.role === USER_ROLES.USER) {
      return NextResponse.json({ error: 'No tienes permisos para esta acción' }, { status: 403 });
    }

    const { submissionId, status, notes } = await request.json();

    if (!submissionId) {
      return NextResponse.json({ error: 'ID de lead requerido' }, { status: 400 });
    }

    if (!status) {
      return NextResponse.json({ error: 'Estado requerido' }, { status: 400 });
    }

    const validStatuses = ['nuevo', 'contactado', 'en_seguimiento', 'convertido', 'descartado'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Estado no válido' }, { status: 400 });
    }

    const { data, error } = await updateSubmissionStatus(submissionId, status, notes);

    if (error) {
      console.error('Error updating lead status:', error);
      return NextResponse.json({ error: 'Error al actualizar el estado' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in update lead status API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
