/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["imagedelivery.net"],
  },
  experimental: {
    reactRoot: true,
    /*     runtime: "nodejs",
    serverComponents: true, */
  },
};

module.exports = nextConfig;
