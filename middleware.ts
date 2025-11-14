import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Normalizează URL-urile la lowercase pentru a evita probleme de case-sensitivity
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Excludem rutele unde nu vrem să intervenim
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images') ||
    pathname === '/robots.txt' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Dacă există majuscule în cale, redirectăm la varianta lowercase
  if (/[A-Z]/.test(pathname)) {
    url.pathname = pathname.toLowerCase();
    // păstrăm query string
    url.search = req.nextUrl.search;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
