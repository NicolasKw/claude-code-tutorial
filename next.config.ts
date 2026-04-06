import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['postgres'],
  basePath: '/claude-code-mastery',
};

export default nextConfig;
