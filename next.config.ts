import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'example.com',
      'i.pinimg.com',
      'images.unsplash.com',
      'cdn.example.com',
      'mycdn.com',
      'assets.example.com', 
      'images.pexels.com',
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, net: false, tls: false };
    }
    return config;
  }
};

export default nextConfig;
