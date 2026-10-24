import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function resolveImagePath(filename: string): string | null {
  const cleanFilename = path.basename(filename);
  const candidates = [
    path.join(process.cwd(), 'public', 'uploads', cleanFilename),
    path.join(process.cwd(), 'uploads', cleanFilename),
    path.join(process.cwd(), 'public', cleanFilename),
    path.join('/home/fbaqsmhn/reotihandloom/public/uploads', cleanFilename),
    path.join('/home/fbaqsmhn/reotihandloom/uploads', cleanFilename),
  ];

  for (const p of candidates) {
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
        return p;
      }
    } catch {
      // ignore
    }
  }

  return null;
}

function resolveWatermarkPath(): string | null {
  const candidates = [
    path.join(process.cwd(), 'public', 'images', 'reoti_watermark_feed.png'),
    path.join(process.cwd(), 'images', 'reoti_watermark_feed.png'),
    path.join('/home/fbaqsmhn/reotihandloom/public/images', 'reoti_watermark_feed.png'),
  ];

  for (const p of candidates) {
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
        return p;
      }
    } catch {
      // ignore
    }
  }

  return null;
}

function hasExistingWatermark(filename: string): boolean {
  if (!filename) return false;
  return (
    filename.includes('saree_17890') ||
    filename.includes('saree_17891') ||
    filename.includes('saree_17892') ||
    filename.includes('festival_') ||
    filename.includes('real_insta_')
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileParam = searchParams.get('file') || searchParams.get('src') || '';

    if (!fileParam) {
      return NextResponse.json({ error: 'Missing file parameter' }, { status: 400 });
    }

    const cleanFilename = path.basename(fileParam);

    // 1. If pre-generated high-contrast feed image exists, serve it directly
    const feedCandidates = [
      path.join(process.cwd(), 'public', 'feed-images', cleanFilename),
      path.join('/home/fbaqsmhn/reotihandloom/public/feed-images', cleanFilename),
      path.join('/home/fbaqsmhn/public_html/feed-images', cleanFilename),
    ];

    for (const p of feedCandidates) {
      try {
        if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
          const feedBuf = fs.readFileSync(/*turbopackIgnore: true*/ p);
          return new NextResponse(feedBuf, {
            headers: {
              'Content-Type': 'image/jpeg',
              'Cache-Control': 'public, max-age=604800, s-maxage=604800, immutable',
            },
          });
        }
      } catch {}
    }

    const filePath = resolveImagePath(fileParam);
    if (!filePath) {
      let fallbackPath = fileParam;
      if (!fallbackPath.startsWith('/')) {
        fallbackPath = '/' + fallbackPath;
      }
      if (!fallbackPath.startsWith('/uploads') && !fallbackPath.startsWith('/images')) {
        fallbackPath = `/uploads${fallbackPath}`;
      }
      return NextResponse.redirect(new URL(fallbackPath, req.url));
    }

    const rawBuffer = fs.readFileSync(/*turbopackIgnore: true*/ filePath);

    // 2. If photo already has artisan watermark, NEVER double watermark! Return clean raw photo directly!
    if (hasExistingWatermark(cleanFilename)) {
      return new NextResponse(rawBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=604800, s-maxage=604800, immutable',
        },
      });
    }

    // Try applying Reoti Handloom watermark using sharp
    try {
      const sharp = require('sharp');
      const wmPath = resolveWatermarkPath();

      if (wmPath) {
        const meta = await sharp(rawBuffer).metadata();
        const width = meta.width || 1200;
        const wmWidth = Math.round(width * 0.76);

        const wmResized = await sharp(wmPath)
          .resize({ width: wmWidth })
          .toBuffer();

        const outputBuffer = await sharp(rawBuffer)
          .composite([{ input: wmResized, gravity: 'center' }])
          .jpeg({ quality: 88 })
          .toBuffer();

        return new NextResponse(outputBuffer, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=604800, s-maxage=604800, immutable',
          },
        });
      }
    } catch (wmError) {
      console.warn('[Feed Image Route] Sharp compositing failed, serving clean image as fallback:', wmError);
    }

    // Fallback: Return raw image buffer safely (Status 200, never 500)
    return new NextResponse(rawBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=604800, s-maxage=604800, immutable',
      },
    });
  } catch (err) {
    console.error('[Feed Image Route] Unexpected error:', err);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
