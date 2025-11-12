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
    return [
      { source: "/products/flayere/1.jpg", destination: "/placeholder.png" },
      { source: "/products/tapet/1.jpg", destination: "/placeholder.png" },
    ];
  },
};

module.exports = nextConfig;