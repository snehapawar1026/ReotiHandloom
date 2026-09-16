const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting production build and zip packaging...');

// 1. Run Next.js production build
execSync('npx next build', { stdio: 'inherit' });

// 2. Python zip script filtering out dev temp cache and locks
const zipScript = `import zipfile, os
zip_p = r'../deploy_final.zip'
items = ['.next', 'public', 'prisma', 'dev.db', 'seed_categories.json', 'seed_products.json', 'server.js', 'package.json', 'package-lock.json', 'next.config.js']

if os.path.exists(zip_p):
    try:
        os.remove(zip_p)
    except:
        pass

z = zipfile.ZipFile(zip_p, 'w', zipfile.ZIP_DEFLATED)
for item in items:
    if not os.path.exists(item):
        continue
    if os.path.isdir(item):
        for root, dirs, files in os.walk(item):
            # Skip local dev cache & locks
            if os.path.basename(root) == 'dev' or 'dev/cache' in root.replace('\\\\', '/'):
                continue
            for file in files:
                if 'lock' in file.lower():
                    continue
                fp = os.path.join(root, file)
                try:
                    z.write(fp, os.path.relpath(fp, '.'))
                except Exception as e:
                    print(f"Skipped file {file}: {e}")
    else:
        try:
            z.write(item, item)
        except Exception as e:
            print(f"Skipped file {item}: {e}")

z.close()
print('SUCCESS: Zip created cleanly at d:\\\\Reoti_Handloom\\\\deploy_final.zip!')
`;

fs.writeFileSync('temp_zip.py', zipScript);

try {
  execSync('python temp_zip.py', { stdio: 'inherit' });
} finally {
  try {
    fs.unlinkSync('temp_zip.py');
  } catch (e) {}
}
