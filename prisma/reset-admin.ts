import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaBetterSqlite3({ url: 'file:dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Resetting Admin credentials...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@reotihandloom.com' },
    update: {
      password: 'Hariom@2618',
      role: 'admin',
      name: 'Reoti Admin',
    },
    create: {
      name: 'Reoti Admin',
      email: 'admin@reotihandloom.com',
      password: 'Hariom@2618',
      phone: '9826000000',
      role: 'admin',
    },
  });

  console.log('SUCCESS: Admin User updated to:');
  console.log('Email:', admin.email);
  console.log('Password:', admin.password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
