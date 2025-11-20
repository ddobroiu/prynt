import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Activează noul sistem de cache din Next.js 16
    // dynamicIO: true, // Notă: Verifică documentația dacă acest flag e necesar specific pentru build-ul tău, de obicei 'use cache' funcționează out-of-the-box în canary/16+ pentru funcții server
    
    // Turbopack options (deja implicit în v16, dar configurabil)
    turbo: {
      // Aici poți adăuga reguli specifice de rezolvare module dacă ai nevoie
    },
    serverActions: {
      bodySizeLimit: '10mb', // Util pentru upload-ul de fișiere grafice mari
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // Header de securitate standard
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;