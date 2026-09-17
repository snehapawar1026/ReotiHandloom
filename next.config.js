/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  serverExternalPackages: ['@prisma/client', 'better-sqlite3', '@prisma/adapter-better-sqlite3'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'X-LiteSpeed-Cache-Control',
            value: 'no-cache',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

