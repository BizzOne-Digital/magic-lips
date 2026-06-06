import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow opening the dev site from a phone on your local network (e.g. http://192.168.x.x:3000)
  allowedDevOrigins: ["192.168.1.21", "192.168.1.21:3000"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/logo.png",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
