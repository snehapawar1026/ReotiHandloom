import path from 'path';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Invalidate cached Prisma instance if schema models or fields were updated
if (globalForPrisma.prisma && (
  !(globalForPrisma.prisma as any).instaPost ||
  !(globalForPrisma.prisma as any).product ||
  !(globalForPrisma.prisma as any)._runtimeDataModel?.models?.Product?.fields?.some((f: any) => f.name === 'isTrending') ||
  !(globalForPrisma.prisma as any)._runtimeDataModel?.models?.Category?.fields?.some((f: any) => f.name === 'parentId') ||
  !(globalForPrisma.prisma as any)._runtimeDataModel?.models?.Category?.fields?.some((f: any) => f.name === 'isParent')
)) {
  globalForPrisma.prisma = undefined;
}

const dbPath = path.resolve(process.cwd(), 'prisma/dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
