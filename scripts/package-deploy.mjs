import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = path.resolve(process.cwd());
const parentDir = path.resolve(rootDir, '..');
const tempDir = path.join(parentDir, 'temp_deploy');
const zipFile = path.join(parentDir, 'complete_update.zip');

console.log('📦 Starting 1-Click Deployment Packaging...');

if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

fs.mkdirSync(path.join(tempDir, '.next'), { recursive: true });
fs.mkdirSync(path.join(tempDir, 'public', '_next'), { recursive: true });
fs.mkdirSync(path.join(tempDir, 'src', 'data'), { recursive: true });

// 1. Copy server.js
fs.copyFileSync(
  path.join(rootDir, '.next', 'standalone', 'server.js'),
  path.join(tempDir, 'server.js')
);

// 2. Copy .next json manifests and BUILD_ID
const nextDir = path.join(rootDir, '.next');
fs.readdirSync(nextDir).forEach((file) => {
  if (file.endsWith('.json') || file === 'BUILD_ID') {
    fs.copyFileSync(path.join(nextDir, file), path.join(tempDir, '.next', file));
  }
});

// 3. Copy .next/server and .next/static
fs.cpSync(path.join(nextDir, 'server'), path.join(tempDir, '.next', 'server'), { recursive: true });
fs.cpSync(path.join(nextDir, 'static'), path.join(tempDir, '.next', 'static'), { recursive: true });

// 4. Map static into public/_next/static for LiteSpeed/cPanel Web Server
fs.cpSync(path.join(nextDir, 'static'), path.join(tempDir, 'public', '_next', 'static'), { recursive: true });

// 5. Copy storeData.json and package.json
fs.copyFileSync(
  path.join(rootDir, 'src', 'data', 'storeData.json'),
  path.join(tempDir, 'src', 'data', 'storeData.json')
);
fs.copyFileSync(
  path.join(rootDir, 'package.json'),
  path.join(tempDir, 'package.json')
);

// 6. Create complete_update.zip
if (fs.existsSync(zipFile)) {
  fs.rmSync(zipFile, { force: true });
}

try {
  execSync(`tar.exe -a -cf "${zipFile}" -C "${tempDir}" .`, { stdio: 'inherit' });
} catch (e) {
  // Fallback to powershell Compress-Archive
  execSync(`powershell -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${zipFile}' -Force"`, { stdio: 'inherit' });
}

// Cleanup tempDir
try {
  fs.rmSync(tempDir, { recursive: true, force: true });
} catch (e) {}

const stats = fs.statSync(zipFile);
const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

console.log(`\n🎉 SUCCESS: Deployment package created at:\n👉 ${zipFile} (${sizeMb} MB)`);
console.log(`\nReady to upload and extract directly into /home/fbaqsmhn/reotihandloom on cPanel!`);
