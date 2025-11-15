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
  // Rewrites for generic category images and landing routes.
  // Generate rewrites programmatically from `lib/landingData` so we cover
  // lowercase, TitleCase and nested variants automatically.
  async rewrites() {
    const staticRewrites = [
      { source: "/products/flayere/1.jpg", destination: "/placeholder.png" },
      { source: "/products/tapet/1.jpg", destination: "/placeholder.png" },
    ];

    // Dynamically import the landing routes (avoid top-level import issues)
    let landingRoutes: Array<{ category: string; slug: string }> = [];
    try {
      // Importing TS module at build-time in next.config.ts is acceptable
      // because Next will run this file in a Node environment during build.
      const ld = await import('./lib/landingData');
      if (ld && typeof ld.listAllLandingRoutes === 'function') {
        landingRoutes = ld.listAllLandingRoutes();
      }
    } catch (e) {
      // If dynamic import fails, fall back to an empty list and rely on manual rewrites above
      console.warn('next.config: failed to import landingData for rewrites', e);
      landingRoutes = [];
    }

    const dynamicRewrites: Array<{ source: string; destination: string }> = [];
    for (const r of landingRoutes) {
      const slug = String(r.slug);
      // nested -> top-level
      dynamicRewrites.push({ source: `/${r.category}/${slug}`, destination: `/${slug}` });
      // top-level -> nested (fallback)
      dynamicRewrites.push({ source: `/${slug}`, destination: `/${r.category}/${slug}` });
      // TitleCase variant for first segment (e.g. /Alucobond)
      const title = slug.charAt(0).toUpperCase() + slug.slice(1);
      dynamicRewrites.push({ source: `/${title}`, destination: `/${r.category}/${slug}` });
      dynamicRewrites.push({ source: `/${title}/:path*`, destination: `/${r.category}/${slug}/:path*` });
      // Also map TitleCase nested variant
      dynamicRewrites.push({ source: `/${r.category}/${title}`, destination: `/${r.category}/${slug}` });
    }

    return [...staticRewrites, ...dynamicRewrites];
  },
};

module.exports = nextConfig;