import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

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
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Public auth routes that don't require authentication
  const publicAuthRoutes = ['/login', '/registro'];
  const isPublicAuthRoute = publicAuthRoutes.includes(pathname);

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    if (!user) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Get user profile to check role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    // If there's an error fetching profile (not just no rows), log it
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('[Middleware] Error fetching profile:', profileError);
    }

    // Only redirect to account_inactive if profile exists AND is_active is explicitly false
    if (profile && profile.is_active === false) {
      // User account is inactive - redirect to login with error
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'account_inactive');
      return NextResponse.redirect(loginUrl);
    }

    // If profile doesn't exist yet, allow access (profile will be created by trigger)
    if (!profile) {
      console.log('[Middleware] Profile not found for user, allowing access');
      return supabaseResponse;
    }

    // Role-based route protection
    const adminOnlyRoutes = [
      '/admin/usuarios',
      '/admin/agentes',
      '/admin/configuracion',
      '/admin/propiedades/pendientes',
    ];

    const agentRoutes = [
      '/admin/dashboard',
      '/admin/propiedades',
      '/admin/leads',
      '/admin/perfil',
    ];

    // Admin (role 1) can access everything
    if (profile.role === 1) {
      return supabaseResponse;
    }

    // Agent (role 2) can access agent routes + some property routes
    if (profile.role === 2) {
      const isAdminOnlyRoute = adminOnlyRoutes.some((route) =>
        pathname.startsWith(route)
      );
      if (isAdminOnlyRoute) {
        // Redirect to dashboard if trying to access admin-only routes
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return supabaseResponse;
    }

    // User (role 3) can only access limited routes
    if (profile.role === 3) {
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

  // Redirect from login/registro if already authenticated
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
