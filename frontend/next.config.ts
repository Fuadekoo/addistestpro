import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    emotion: true,
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
