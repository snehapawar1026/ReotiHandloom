import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const info: Record<string, any> = {
    cwd: process.cwd(),
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
  };

  try {
    const sharp = require('sharp');
    info.sharp = 'LOADED_SUCCESS';
    info.sharpVersion = sharp.versions;
  } catch (e: any) {
    info.sharpError = e.message;
  }

  // Check upload directory candidates
  const sample = 'saree_1791914571228_p0f5d.jpg';
  const candidates = [
    path.join(process.cwd(), 'public', 'uploads', sample),
    path.join(process.cwd(), 'uploads', sample),
    path.join('/home/fbaqsmhn/reotihandloom/public/uploads', sample),
    path.join('/home/fbaqsmhn/reotihandloom/uploads', sample),
  ];

  info.foundPaths = candidates.filter((p) => {
    try {
      return fs.existsSync(/*turbopackIgnore: true*/ p);
    } catch {
      return false;
    }
  });

  return NextResponse.json(info);
}
