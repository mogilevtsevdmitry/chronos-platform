/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/chronos',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/:path*`,
      },
    ];
  },
};
module.exports = nextConfig;
