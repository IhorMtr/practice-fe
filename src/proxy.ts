import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const { nextUrl, cookies } = req;

  const pathname = nextUrl.pathname;
  const refreshToken = cookies.get('refreshToken')?.value;

  const isAuthRoute = pathname === '/auth' || pathname.startsWith('/auth/');

  if (!refreshToken && !isAuthRoute) {
    const url = nextUrl.clone();
    url.pathname = '/auth/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (refreshToken && isAuthRoute) {
    const url = nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
