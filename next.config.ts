import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.jivanjor.com",
      },
      {
        protocol: "https",
        hostname: "uat.jivanjor.com",
      },
      {
        protocol: "https",
        hostname: "zdbomxhhjijzorcmcfee.storage.supabase.co",
      },
      {
        protocol: "https",
        hostname: "www.youtube.com"
      }
    ],
  },
  async rewrites() {
    const backendUrl =
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "https://jivanjor-server.onrender.com/api";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl.replace(/\/+$/, "")}/:path*`,
      },
    ];
  },
};

export default nextConfig;
