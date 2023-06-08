/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["imagedelivery.net"],
  },
  experimental: {
    reactRoot: true,
  },
};

module.exports = nextConfig;
