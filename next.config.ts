import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // FIX: Adăugăm @react-pdf/renderer la pachete externe pentru a evita erorile de build
  serverExternalPackages: ['@react-pdf/renderer'],

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
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