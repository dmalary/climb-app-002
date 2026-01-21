/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.EXPRESS_URL}/api/:path*`,
      },
    ];
  },
  reactStrictMode: true,
};

export default nextConfig;
