import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const SESSION_TIMEOUT_SECONDS = 10 * 60; // 10 minutes

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow unauthenticated access to the login page
  if (pathname === '/manage-blog/login') {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const devSession = request.cookies.get('cms_admin_session')?.value;
  const lastActivity = request.cookies.get('cms_last_activity')?.value;
  const now = Date.now();

  // Check 10-minute inactivity timeout
  if (lastActivity) {
    const elapsedMs = now - Number(lastActivity);
    if (elapsedMs > SESSION_TIMEOUT_SECONDS * 1000) {
      const loginUrl = new URL('/manage-blog/login', request.url);
      loginUrl.searchParams.set('timeout', '1');
      loginUrl.searchParams.set('redirect', pathname);

      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('cms_admin_session');
      response.cookies.delete('cms_last_activity');
      return response;
    }
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user && !devSession) {
        const loginUrl = new URL('/manage-blog/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Refresh 10-minute activity window
      response.cookies.set('cms_last_activity', String(now), {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_TIMEOUT_SECONDS,
      });

      return response;
    } catch (e) {
      console.warn('Supabase auth check in middleware error:', e);
    }
  }

  // Fallback for local development
  if (!devSession) {
    const loginUrl = new URL('/manage-blog/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Slide 10-minute window for active dev session
  response.cookies.set('cms_last_activity', String(now), {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TIMEOUT_SECONDS,
  });

  return response;
}

export const config = {
  matcher: ['/manage-blog/:path*'],
};
