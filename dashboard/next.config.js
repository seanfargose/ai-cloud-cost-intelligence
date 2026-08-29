/** @type {import('next').NextConfig} */
const backendUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://ai-cost-intelligence-backend-iupk.onrender.com';

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/health',
        destination: `${backendUrl}/health`,
      },
    ];
  },
};

module.exports = nextConfig;