import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // FIX: Excludem pdfkit din procesul de bundling pentru a avea acces la fișierele de fonturi
  serverExternalPackages: ['pdfkit'],

  experimental: {
    // Activează noul sistem de cache din Next.js 16
    // dynamicIO: true, // Notă: Verifică documentația dacă acest flag e necesar specific pentru build-ul tău, de obicei 'use cache' funcționează out-of-the-box în canary/16+ pentru funcții server
    
    // Turbopack este implicit în Next.js 16, nu mai folosi cheia 'turbo' aici
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