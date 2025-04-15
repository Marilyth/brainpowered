import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  distDir: 'docs',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
