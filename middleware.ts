import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

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

  // Obtener usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Rutas públicas de autenticación
  const publicAuthRoutes = ['/login', '/registro', '/forgot-password'];
  const isPublicAuthRoute = publicAuthRoutes.includes(pathname);

  // Proteger rutas /admin
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
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    // Retry una vez si no existe (race condition de registro)
    // El trigger que crea el profile puede no haber terminado aún
    if (!profile) {
      console.log('[Middleware] Profile not found, retrying after 300ms...');
      await new Promise((resolve) => setTimeout(resolve, 300));
      const retry = await supabaseAdmin
        .from('profiles')
        .select('role, is_active')
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

    // Control de acceso basado en rol
    const adminOnlyRoutes = [
      '/admin/usuarios',
      '/admin/agentes',
      '/admin/configuracion',
      '/admin/propiedades/pendientes',
    ];

    // Admin (role 1) - acceso total
    if (profile.role === 1) {
      return supabaseResponse;
    }

    // Agent (role 2) - acceso limitado
    if (profile.role === 2) {
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
