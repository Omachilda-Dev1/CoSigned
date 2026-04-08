import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for wagmi/viem — they use Node.js modules
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

export default nextConfig;
