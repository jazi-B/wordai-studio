import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)!;

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/editor') || 
                          request.nextUrl.pathname.startsWith('/documents') ||
                          request.nextUrl.pathname.startsWith('/dashboard');

  const isDemoRoute = request.nextUrl.pathname.startsWith('/editor/demo-');

  if (isProtectedRoute && !session && !isDemoRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in, don't allow them to see login/register pages
  if (session && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/editor/:path*', '/documents/:path*', '/dashboard/:path*', '/login', '/register'],
};
