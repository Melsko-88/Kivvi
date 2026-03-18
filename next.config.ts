import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dzi8whann/**",
      },
    ],
  },
  serverExternalPackages: ["jspdf"],
};

export default nextConfig;
