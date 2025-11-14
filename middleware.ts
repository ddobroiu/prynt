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
