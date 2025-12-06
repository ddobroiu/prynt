import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server packages that should not be bundled
  serverExternalPackages: ['@react-pdf/renderer', 'puppeteer'],
  
  // Configure for modern browsers (ES2020+)
  env: {
    BROWSERSLIST_ENV: 'modern',
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Transpilation target for modern browsers (eliminates polyfills)
  transpilePackages: [],
  
  // SWC compiler options for modern browsers
  // This tells Next.js to NOT transpile modern JS features
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    
    // Modern JavaScript features for browsers that support them natively
    esmExternals: true,
    
    // Optimize for modern browsers - reduces bundle size
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    
    // CSS optimizations
    optimizeCss: true,
    cssChunking: 'strict',
  },
  
  // Turbopack configuration for modern browsers
  turbopack: {
    resolveAlias: {
      // Modern JavaScript targeting to eliminate polyfills
    },
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: '</_next/static/css/app/layout.css>; rel=preload; as=style, <https://www.googletagmanager.com>; rel=preconnect, <https://res.cloudinary.com>; rel=preconnect',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/globals.css',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/css/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;