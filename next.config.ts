import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
  },
  allowedDevOrigins: ["*.ngrok-free.app"],
  poweredByHeader: false,
};

if (process.env.STANDALONE_OUTPUT_MODE === "yes") {
  nextConfig.output = "standalone";
}

export default nextConfig;
