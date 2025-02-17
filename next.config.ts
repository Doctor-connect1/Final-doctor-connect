import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [ 'example.com', // Example of a domain
      'i.pinimg.com', // Pinterest
      'images.unsplash.com', // Unsplash
      'cdn.example.com', // Another example
      'mycdn.com', // Custom CDN
      'assets.example.com', 
      'images.pexels.com',
    ],
  }, 
    optimizeFonts: false,
  async rewrites() {
    return [
      {
        source: '/api/socket',
        destination: 'http://192.168.11.12:4000',
      },
    ];
  },
  // Add hostname configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, net: false, tls: false };
    }
    return config;
  },
};

export default nextConfig;
