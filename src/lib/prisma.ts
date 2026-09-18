import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

function getDbPath(): string {
  const candidatePaths = [
    process.env.DATABASE_URL?.replace(/^file:/, ''),
    '/home/fbaqsmhn/reotihandloom/prisma/dev.db',
    path.resolve(process.cwd(), 'prisma/dev.db'),
    path.resolve(process.cwd(), 'reotihandloom/prisma/dev.db'),
    path.resolve(process.cwd(), 'dev.db'),
  ].filter(Boolean) as string[];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return candidatePaths[0] || path.resolve(process.cwd(), 'prisma/dev.db');
}

let prismaInstance: any = null;

try {
  // Use dynamic require so module load does not fail on Linux if better-sqlite3 is compiled for Windows
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
  const { PrismaClient } = require('@prisma/client');
  const dbPath = getDbPath();
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
} catch (e: any) {
  console.warn('[Prisma Init Warning] Native adapter unavailable, using storeManager fallback:', e?.message || e);
}

// Safe proxy: Any Prisma queries gracefully throw so that API routes catch and serve storeManager / storeData
export const prisma: any = new Proxy({} as any, {
  get(target, prop: string) {
    if (prismaInstance && prismaInstance[prop]) {
      return prismaInstance[prop];
    }
    return new Proxy({}, {
      get(_, method: string) {
        return async () => {
          throw new Error(`Prisma adapter unavailable on host for ${prop}.${method}`);
        };
      },
    });
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

