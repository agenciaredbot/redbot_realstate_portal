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

// GET - List all tenants
export async function GET() {
  try {
    const isSuperAdmin = await checkSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json(
      { error: 'Error fetching tenants' },
      { status: 500 }
    );
  }
}

// POST - Create a new tenant
export async function POST(request: NextRequest) {
  try {
    const isSuperAdmin = await checkSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const supabase = createAdminClient();

    // Validate required fields
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', body.slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Check if subdomain already exists
    if (body.subdomain) {
      const { data: existingSubdomain } = await supabase
        .from('tenants')
        .select('id')
        .eq('subdomain', body.subdomain)
        .single();

      if (existingSubdomain) {
        return NextResponse.json(
          { error: 'Subdomain already exists' },
          { status: 400 }
        );
      }
    }

    // Create tenant
    const tenantData = {
      name: body.name,
      slug: body.slug,
      subdomain: body.subdomain || body.slug,
      domain: body.domain || null,
      company_email: body.company_email || null,
      company_phone: body.company_phone || null,
      primary_color: body.primary_color || '#C9A962',
      secondary_color: body.secondary_color || '#1A1A1A',
      plan: body.plan || 'starter',
      max_properties: body.max_properties || 50,
      max_agents: body.max_agents || 5,
      max_storage_mb: body.max_storage_mb || 1000,
      features: {
        blog: body.plan !== 'free',
        projects: body.plan !== 'free',
        testimonials: true,
        analytics: body.plan === 'professional' || body.plan === 'enterprise',
        custom_domain: body.plan === 'professional' || body.plan === 'enterprise',
        white_label: body.plan === 'enterprise',
        api_access: body.plan === 'enterprise',
      },
      is_active: true,
    };

    const { data, error } = await supabase
      .from('tenants')
      .insert([tenantData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating tenant:', error);
    return NextResponse.json(
      { error: 'Error creating tenant' },
      { status: 500 }
    );
  }
}
