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
      'picsum.photos', // Allowing picsum.photos for doctor images
      'via.placeholder.com', // Allowing placeholder.com for fallback images
      'th.bing.com',
      'images.unsplash.com',
      's3-alpha-sig.figma.com',
      'i.pinimg.com'
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
