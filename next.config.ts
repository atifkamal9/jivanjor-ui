import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
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
