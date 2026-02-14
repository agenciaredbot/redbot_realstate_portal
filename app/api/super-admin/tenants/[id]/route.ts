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

// GET - Get a single tenant by ID
export async function GET(
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

    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return NextResponse.json(
      { error: 'Error fetching tenant' },
      { status: 500 }
    );
  }
}

// PATCH - Update a tenant
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isSuperAdmin = await checkSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const supabase = createAdminClient();

    // Check if tenant exists
    const { data: existing } = await supabase
      .from('tenants')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // If slug is being changed, check it doesn't conflict
    if (body.slug) {
      const { data: slugExists } = await supabase
        .from('tenants')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', id)
        .single();

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // If subdomain is being changed, check it doesn't conflict
    if (body.subdomain) {
      const { data: subdomainExists } = await supabase
        .from('tenants')
        .select('id')
        .eq('subdomain', body.subdomain)
        .neq('id', id)
        .single();

      if (subdomainExists) {
        return NextResponse.json(
          { error: 'Subdomain already exists' },
          { status: 400 }
        );
      }
    }

    // If domain is being changed, check it doesn't conflict
    if (body.domain) {
      const { data: domainExists } = await supabase
        .from('tenants')
        .select('id')
        .eq('domain', body.domain)
        .neq('id', id)
        .single();

      if (domainExists) {
        return NextResponse.json(
          { error: 'Domain already exists' },
          { status: 400 }
        );
      }
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      'name', 'slug', 'subdomain', 'domain',
      'logo_url', 'logo_dark_url', 'favicon_url',
      'primary_color', 'secondary_color', 'accent_color',
      'company_name', 'company_email', 'company_phone', 'company_address', 'company_whatsapp',
      'social_links', 'template', 'plan', 'plan_expires_at',
      'max_properties', 'max_agents', 'max_storage_mb',
      'features', 'seo_title', 'seo_description', 'seo_keywords',
      'og_image_url', 'manifest_url',
      'ghl_location_id', 'ghl_api_key',
      'is_active', 'settings'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Update features based on plan if plan is being changed
    if (body.plan && !body.features) {
      updateData.features = {
        blog: body.plan !== 'free',
        projects: body.plan !== 'free',
        testimonials: true,
        analytics: body.plan === 'professional' || body.plan === 'enterprise',
        custom_domain: body.plan === 'professional' || body.plan === 'enterprise',
        white_label: body.plan === 'enterprise',
        api_access: body.plan === 'enterprise',
      };
    }

    const { data, error } = await supabase
      .from('tenants')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating tenant:', error);
    return NextResponse.json(
      { error: 'Error updating tenant' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a tenant
export async function DELETE(
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

    // Prevent deleting the default tenant
    if (id === '00000000-0000-0000-0000-000000000001') {
      return NextResponse.json(
        { error: 'Cannot delete the default tenant' },
        { status: 400 }
      );
    }

    // Check if tenant exists
    const { data: existing } = await supabase
      .from('tenants')
      .select('id, name')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Delete tenant (CASCADE will delete related data)
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Tenant "${existing.name}" deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting tenant:', error);
    return NextResponse.json(
      { error: 'Error deleting tenant' },
      { status: 500 }
    );
  }
}
