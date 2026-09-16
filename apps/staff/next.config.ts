import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@mebo/database",
    "@mebo/loyalty",
    "@mebo/member",
    "@mebo/receipt",
    "@mebo/ui",
    "@mebo/whatsapp"
  ]
};

export default nextConfig;
