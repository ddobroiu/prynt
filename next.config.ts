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
    ];
  },
};

module.exports = nextConfig;