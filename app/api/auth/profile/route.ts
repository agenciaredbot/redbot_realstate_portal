import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Verificar autenticación con cliente regular (usa cookies)
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('[API /auth/profile] Not authenticated:', authError?.message);
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log('[API /auth/profile] Fetching profile for user:', user.id);

    // Usar admin client para obtener perfil (bypasea RLS)
    const adminClient = createAdminClient();
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      // PGRST116 = no rows found
      if (profileError.code === 'PGRST116') {
        console.log('[API /auth/profile] Profile not found, may need creation');
        return NextResponse.json({ profile: null }, { status: 200 });
      }
      console.error('[API /auth/profile] Error fetching profile:', profileError.message);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    console.log('[API /auth/profile] Profile found:', profile?.email);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('[API /auth/profile] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
