/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    /* Needed for cover image in 2012-art-at-hogwarts/index.md */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.elsworthartworks.com",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
