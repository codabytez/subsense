import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "api.dicebear.com" }],
  },
  env: {
    APP_VERSION: process.env.npm_package_version ?? "1.0.0",
  },
};

export default nextConfig;
