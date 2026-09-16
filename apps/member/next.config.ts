import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@mebo/database",
    "@mebo/ui"
  ]
};

export default nextConfig;
