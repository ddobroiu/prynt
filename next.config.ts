import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server packages that should not be bundled
  serverExternalPackages: ['@react-pdf/renderer', 'puppeteer'],
  
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    
    // Modern JavaScript features for browsers that support them natively
    esmExternals: true,
    
    // Optimize for modern browsers - reduces bundle size
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
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