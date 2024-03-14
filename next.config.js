/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["www.elsworthartworks.com"],
    /* for >= 12.3
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.elsworthartworks.com",
        port: "",
        pathname: "/images/**",
      },
    ],
    */
  },
};

module.exports = nextConfig;
