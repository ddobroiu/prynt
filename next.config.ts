/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Rewrites for generic category images to ensure paths always resolve
  async rewrites() {
    // Keep existing image rewrites and add landing rewrites so nested landing
    // routes under /pliante map to top-level material pages (avoid 404s).
    return [
      { source: "/products/flayere/1.jpg", destination: "/placeholder.png" },
      { source: "/products/tapet/1.jpg", destination: "/placeholder.png" },
      // Landing rewrites: /pliante/<slug> -> /<slug> (for materials like plexiglass, alucobond)
      { source: "/pliante/plexiglass", destination: "/plexiglass" },
      { source: "/pliante/alucobond", destination: "/alucobond" },
      { source: "/pliante/pvc-forex", destination: "/pvc-forex" },
      { source: "/pliante/polipropilena", destination: "/polipropilena" },
      { source: "/pliante/carton", destination: "/carton" },
      // Also map top-level material routes to the nested landing (in case deploy lacks top-level pages)
      { source: "/plexiglass", destination: "/pliante/plexiglass" },
      { source: "/alucobond", destination: "/pliante/alucobond" },
      { source: "/pvc-forex", destination: "/pliante/pvc-forex" },
      { source: "/polipropilena", destination: "/pliante/polipropilena" },
      { source: "/carton", destination: "/pliante/carton" },
      // Explicit uppercase/titlecase mappings to handle case-sensitive prod filesystems
      { source: "/Plexiglass", destination: "/pliante/plexiglass" },
      { source: "/Plexiglass/:path*", destination: "/pliante/plexiglass/:path*" },
      { source: "/Alucobond", destination: "/pliante/alucobond" },
      { source: "/Alucobond/:path*", destination: "/pliante/alucobond/:path*" },
      { source: "/Pvc-forex", destination: "/pliante/pvc-forex" },
      { source: "/Pvc-forex/:path*", destination: "/pliante/pvc-forex/:path*" },
      { source: "/Polipropilena", destination: "/pliante/polipropilena" },
      { source: "/Polipropilena/:path*", destination: "/pliante/polipropilena/:path*" },
      { source: "/Carton", destination: "/pliante/carton" },
      { source: "/Carton/:path*", destination: "/pliante/carton/:path*" },
    ];
  },
};

module.exports = nextConfig;