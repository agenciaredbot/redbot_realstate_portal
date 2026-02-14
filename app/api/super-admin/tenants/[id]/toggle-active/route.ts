import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase/server';
import { USER_ROLES } from '@/types/admin';

// Check if user is super admin
async function checkSuperAdmin(): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  const supabaseAdmin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role === USER_ROLES.SUPER_ADMIN;
}

// POST - Toggle tenant active status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isSuperAdmin = await checkSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const supabase = createAdminClient();

    // Prevent toggling the default tenant
    if (id === '00000000-0000-0000-0000-000000000001') {
      return NextResponse.json(
        { error: 'Cannot deactivate the default tenant' },
        { status: 400 }
      );
    }

    // Get current status
    const { data: tenant, error: fetchError } = await supabase
      .from('tenants')
      .select('id, name, is_active')
      .eq('id', id)
      .single();

    if (fetchError || !tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Toggle the status
    const newStatus = !tenant.is_active;

    const { data, error } = await supabase
      .from('tenants')
      .update({ is_active: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      is_active: newStatus,
      message: `Tenant "${tenant.name}" ${newStatus ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling tenant status:', error);
    return NextResponse.json(
      { error: 'Error toggling tenant status' },
      { status: 500 }
    );
  }
}
