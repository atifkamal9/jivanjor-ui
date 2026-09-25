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
};

export default nextConfig;
