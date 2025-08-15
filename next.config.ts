import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["placehold.co"], // ✅ whitelist the domain
  },
};

export default nextConfig;
