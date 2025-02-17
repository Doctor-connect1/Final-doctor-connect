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
  async rewrites() {
    return [
      {
        source: '/api/socket',
        destination: 'http://192.168.11.12:4000',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, net: false, tls: false };
    }
    return config;
  },
};

export default nextConfig;
