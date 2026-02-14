import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

// Default tenant ID for Redbot
const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

// User roles
const USER_ROLES = {
  SUPER_ADMIN: 0,
  ADMIN: 1,
  AGENT: 2,
  USER: 3,
} as const;

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Cliente regular para verificar autenticación (usa cookies)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Cliente admin para queries de profile (bypasea RLS)
  // IMPORTANTE: Esta key solo se usa en el servidor, nunca se expone al cliente
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // =====================================================
  // MULTI-TENANT: Resolve tenant from hostname
  // =====================================================
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0]; // Remove port for local dev

  let tenantId: string = DEFAULT_TENANT_ID;
  let tenantSlug: string = 'redbot';

  // Skip tenant resolution for localhost/development
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    // Try to resolve tenant from custom domain
    let { data: tenant } = await supabaseAdmin
      .from('tenants')
      .select('id, slug, is_active')
      .eq('domain', hostname)
      .eq('is_active', true)
      .single();

    // If not found, try subdomain
    if (!tenant) {
      const parts = hostname.split('.');
      if (parts.length >= 2) {
        const subdomain = parts[0];

        // Skip common subdomains
        if (!['www', 'app', 'api', 'admin'].includes(subdomain)) {
          const { data: subdomainTenant } = await supabaseAdmin
            .from('tenants')
            .select('id, slug, is_active')
            .eq('subdomain', subdomain)
            .eq('is_active', true)
            .single();

          tenant = subdomainTenant;
        }
      }
    }

    if (tenant) {
      tenantId = tenant.id;
      tenantSlug = tenant.slug;
    }
  }

  // Set tenant info in headers for downstream use
  supabaseResponse.headers.set('x-tenant-id', tenantId);
  supabaseResponse.headers.set('x-tenant-slug', tenantSlug);

  // Obtener usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // =====================================================
  // SUPER-ADMIN ROUTES: /super-admin/*
  // Only accessible by role 0 (Super Admin)
  // =====================================================
  if (pathname.startsWith('/super-admin')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== USER_ROLES.SUPER_ADMIN) {
      // Not a super admin - redirect to regular admin
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    if (profile.is_active === false) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'account_inactive');
      return NextResponse.redirect(loginUrl);
    }

    return supabaseResponse;
  }

  // Rutas públicas de autenticación
  const publicAuthRoutes = ['/login', '/registro', '/forgot-password'];
  const isPublicAuthRoute = publicAuthRoutes.includes(pathname);

  // =====================================================
  // ADMIN ROUTES: /admin/*
  // =====================================================
  if (pathname.startsWith('/admin')) {
    if (!user) {
      // No autenticado - redirigir a login con URL de retorno
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Usar admin client para profile query (bypasea RLS)
    // Esto evita el problema donde auth.uid() no está disponible en el servidor
    let { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role, is_active, tenant_id')
      .eq('id', user.id)
      .single();

    // Retry una vez si no existe (race condition de registro)
    // El trigger que crea el profile puede no haber terminado aún
    if (!profile) {
      console.log('[Middleware] Profile not found, retrying after 300ms...');
      await new Promise((resolve) => setTimeout(resolve, 300));
      const retry = await supabaseAdmin
        .from('profiles')
        .select('role, is_active, tenant_id')
        .eq('id', user.id)
        .single();
      profile = retry.data;
    }

    // Si aún no hay profile después del retry, redirigir con error
    if (!profile) {
      console.error(
        '[Middleware] Profile not found after retry for user:',
        user.id
      );
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'profile_not_found');
      return NextResponse.redirect(loginUrl);
    }

    // Verificar que la cuenta esté activa
    if (profile.is_active === false) {
      console.log('[Middleware] Account inactive for user:', user.id);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'account_inactive');
      return NextResponse.redirect(loginUrl);
    }

    // =====================================================
    // TENANT VALIDATION
    // Super Admin (role 0) can access any tenant
    // Others must match the current tenant
    // =====================================================
    if (profile.role !== USER_ROLES.SUPER_ADMIN) {
      // Regular users must belong to the current tenant
      if (profile.tenant_id !== tenantId) {
        console.log(
          '[Middleware] Tenant mismatch:',
          `user tenant: ${profile.tenant_id}, current tenant: ${tenantId}`
        );
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'tenant_mismatch');
        return NextResponse.redirect(loginUrl);
      }
    }

    // Control de acceso basado en rol
    const adminOnlyRoutes = [
      '/admin/usuarios',
      '/admin/agentes',
      '/admin/configuracion',
      '/admin/propiedades/pendientes',
    ];

    // Super Admin (role 0) - acceso total a todo
    if (profile.role === USER_ROLES.SUPER_ADMIN) {
      return supabaseResponse;
    }

    // Admin (role 1) - acceso total a su tenant
    if (profile.role === USER_ROLES.ADMIN) {
      return supabaseResponse;
    }

    // Agent (role 2) - acceso limitado
    if (profile.role === USER_ROLES.AGENT) {
      const isAdminOnlyRoute = adminOnlyRoutes.some((route) =>
        pathname.startsWith(route)
      );
      if (isAdminOnlyRoute) {
        // Redirigir a dashboard si intenta acceder a rutas de admin
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return supabaseResponse;
    }

    // User (role 3) - acceso muy limitado
    if (profile.role === USER_ROLES.USER) {
      const userAllowedRoutes = [
        '/admin/dashboard',
        '/admin/propiedades/nueva',
        '/admin/propiedades/mis-propiedades',
        '/admin/perfil',
      ];

      const isAllowed = userAllowedRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + '/')
      );

      if (!isAllowed) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return supabaseResponse;
    }
  }

  // Redirigir de login/registro si ya está autenticado
  if (isPublicAuthRoute && user) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|fonts|api).*)',
  ],
};
