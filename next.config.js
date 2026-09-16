/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  serverExternalPackages: ['@prisma/client', 'better-sqlite3', '@prisma/adapter-better-sqlite3'],
};

module.exports = nextConfig;
