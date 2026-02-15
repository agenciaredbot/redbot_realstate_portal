import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Admin client to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Reserved subdomains that cannot be used
const RESERVED_SUBDOMAINS = [
  'www',
  'app',
  'api',
  'admin',
  'super-admin',
  'dashboard',
  'login',
  'registro',
  'blog',
  'help',
  'support',
  'mail',
  'email',
  'ftp',
  'cdn',
  'assets',
  'static',
  'dev',
  'staging',
  'test',
  'demo',
  'sandbox',
];

// Validate subdomain format
function isValidSubdomain(subdomain: string): boolean {
  // 3-30 characters, lowercase letters, numbers, and hyphens
  // Cannot start or end with hyphen
  const regex = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;
  return regex.test(subdomain) || (subdomain.length >= 3 && subdomain.length <= 30 && /^[a-z0-9]+$/.test(subdomain));
}

// Generate slug from company name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Multiple hyphens to single
    .replace(/^-|-$/g, '') // Trim hyphens
    .substring(0, 50);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      companyName,
      subdomain,
      fullName,
      email,
      password,
      phone,
    } = body;

    // =====================================================
    // VALIDATION
    // =====================================================

    // Required fields
    if (!companyName || !subdomain || !fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos requeridos deben ser completados' },
        { status: 400 }
      );
    }

    // Validate subdomain format
    const normalizedSubdomain = subdomain.toLowerCase().trim();
    if (!isValidSubdomain(normalizedSubdomain)) {
      return NextResponse.json(
        { error: 'El subdominio debe tener entre 3-30 caracteres, solo letras minúsculas, números y guiones' },
        { status: 400 }
      );
    }

    // Check reserved subdomains
    if (RESERVED_SUBDOMAINS.includes(normalizedSubdomain)) {
      return NextResponse.json(
        { error: 'Este subdominio está reservado. Por favor elige otro.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El formato del email no es válido' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // =====================================================
    // CHECK FOR EXISTING RECORDS
    // =====================================================

    // Check if subdomain is already taken
    const { data: existingSubdomain } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('subdomain', normalizedSubdomain)
      .single();

    if (existingSubdomain) {
      return NextResponse.json(
        { error: 'Este subdominio ya está en uso. Por favor elige otro.' },
        { status: 400 }
      );
    }

    // Check if email is already registered
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const emailExists = existingUser?.users?.some(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      return NextResponse.json(
        { error: 'Este email ya está registrado. ¿Quieres iniciar sesión?' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = generateSlug(companyName);
    const { data: existingSlug } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingSlug) {
      // Add random suffix if slug exists
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // =====================================================
    // CREATE TENANT
    // =====================================================

    const trialExpiresAt = new Date();
    trialExpiresAt.setDate(trialExpiresAt.getDate() + 14); // 14-day trial

    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert({
        name: companyName.trim(),
        slug,
        subdomain: normalizedSubdomain,
        plan: 'free',
        plan_expires_at: trialExpiresAt.toISOString(),
        max_properties: 5,
        max_agents: 1,
        max_storage_mb: 100,
        features: {
          blog: false,
          projects: false,
          testimonials: true,
          analytics: false,
          custom_domain: false,
          white_label: false,
          api_access: false,
        },
        is_active: true,
        company_name: companyName.trim(),
        company_phone: phone || null,
      })
      .select()
      .single();

    if (tenantError || !tenant) {
      console.error('Error creating tenant:', tenantError);
      return NextResponse.json(
        { error: 'Error al crear la inmobiliaria. Por favor intenta de nuevo.' },
        { status: 500 }
      );
    }

    // =====================================================
    // CREATE USER (Admin of the tenant)
    // =====================================================

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true, // Auto-confirm since we're not doing email verification
      user_metadata: {
        full_name: fullName.trim(),
        tenant_id: tenant.id,
      },
    });

    if (authError || !authUser.user) {
      // Rollback: delete tenant if user creation fails
      await supabaseAdmin.from('tenants').delete().eq('id', tenant.id);

      console.error('Error creating user:', authError);
      return NextResponse.json(
        { error: 'Error al crear el usuario. Por favor intenta de nuevo.' },
        { status: 500 }
      );
    }

    // =====================================================
    // UPDATE PROFILE (set as admin of tenant)
    // =====================================================

    // Wait a bit for the trigger to create the profile
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        phone: phone || null,
        role: 1, // ADMIN role
        tenant_id: tenant.id,
        is_active: true,
      })
      .eq('id', authUser.user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      // Don't rollback here, the user is created, they can fix profile later
    }

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,
      message: 'Inmobiliaria creada exitosamente',
      data: {
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          subdomain: tenant.subdomain,
        },
        user: {
          id: authUser.user.id,
          email: authUser.user.email,
        },
        redirectUrl: `https://${normalizedSubdomain}.redbot.app/admin/onboarding`,
      },
    });
  } catch (error) {
    console.error('Register tenant error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
