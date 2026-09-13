const fs = require('fs');
const path = require('path');

const prismaDir = path.join(__dirname, '..', 'prisma');
const mainDb = path.join(prismaDir, 'dev.db');
const backupDir = path.join(prismaDir, 'backups');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

if (fs.existsSync(mainDb)) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `dev_backup_${timestamp}.db`);
  fs.copyFileSync(mainDb, backupPath);
  console.log(`[Database Safety] Backup created successfully: ${backupPath}`);
  
  // Also keep web/dev.db synchronized
  const rootDb = path.join(__dirname, '..', 'dev.db');
  fs.copyFileSync(mainDb, rootDb);
  console.log(`[Database Safety] Synchronized prisma/dev.db -> dev.db`);
}
