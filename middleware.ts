import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { listAllLandingRoutes } from './lib/landingData';

// Build canonical slug set from landing catalog (normalized hyphen form)
const canonicalSlugs = new Set(listAllLandingRoutes().map((r) => String(r.slug).toLowerCase()));

// Middleware purpose:
// - Do not touch API or _next/static assets
// - For top-level landing/product slugs, perform a case-insensitive match against
//   `canonicalSlugs` and internally rewrite the request to the canonical slug
//   so both `/Plexiglass` and `/plexiglass` (and `_`/`-` variants) serve the same page.
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  // CORS handling for API routes: allow requests from local dev clients (e.g. localhost:8081)
  // - Respond to preflight OPTIONS with the appropriate headers
  // - For other API requests, append Access-Control-Allow-Origin header
  if (pathname.startsWith('/api')) {
    const origin = req.headers.get('origin') || '';
    const allowedOrigin = origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1') ? origin : process.env.NEXT_PUBLIC_ALLOWED_ORIGIN || '';

    // Preflight
    if (req.method === 'OPTIONS') {
      const headers = new Headers();
      if (allowedOrigin) headers.set('Access-Control-Allow-Origin', allowedOrigin);
      else headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return new NextResponse(null, { status: 204, headers });
    }

    // For actual API responses, continue but attach CORS header
    const res = NextResponse.next();
    if (allowedOrigin) res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    else res.headers.set('Access-Control-Allow-Origin', '*');
    return res;
  }

  // Exclude paths we should not rewrite
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images') ||
    pathname === '/robots.txt' ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/account')
  ) {
    return NextResponse.next();
  }

  // Trim leading/trailing slashes and split
  const trimmed = pathname.replace(/^\/+/,'').replace(/\/+$/,'');
  if (!trimmed) return NextResponse.next();
  const parts = trimmed.split('/');
  const first = parts[0];
  const rest = parts.slice(1).join('/');
  const firstNormalized = String(first).toLowerCase().replace(/_/g, '-');

  // If requested slug matches a canonical slug (case-insensitive) but differs
  // in actual characters, rewrite internally to the canonical lowercase/hyphen slug.
  if (canonicalSlugs.has(firstNormalized)) {
    const canonical = '/' + firstNormalized + (rest ? '/' + rest : '');
    // If the requested pathname is already the canonical path, no-op
    if (pathname === canonical) return NextResponse.next();
    // Rewrite internally to the canonical path (URL stays the same in browser)
    const target = req.nextUrl.clone();
    target.pathname = canonical;
    target.search = req.nextUrl.search;
    return NextResponse.rewrite(target);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
