import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300;

function getTargetUploadPaths(filename: string): string[] {
  const candidates = [
    path.join(process.cwd(), 'public', 'uploads', filename),
    path.join(process.cwd(), 'uploads', filename),
    path.join(process.cwd(), '..', 'public', 'uploads', filename),
    path.join('/home/fbaqsmhn/reotihandloom/public/uploads', filename),
  ];

  const validPaths: string[] = [];
  for (const p of candidates) {
    try {
      const dir = path.dirname(p);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (!validPaths.includes(p)) {
        validPaths.push(p);
      }
    } catch (e) {
      // ignore
    }
  }

  return validPaths.length > 0
    ? validPaths
    : [path.join(process.cwd(), 'public', 'uploads', filename)];
}

export async function POST(req: NextRequest) {
  try {
    const filenameParam = req.nextUrl.searchParams.get('filename');

    // =========================================================================
    // 1. Direct Binary Upload Mode (?filename=...)
    // =========================================================================
    if (filenameParam) {
      const originalName = decodeURIComponent(filenameParam);
      const fileNameLower = originalName.toLowerCase();

      const isVideo =
        fileNameLower.endsWith('.mp4') ||
        fileNameLower.endsWith('.webm') ||
        fileNameLower.endsWith('.mov') ||
        fileNameLower.endsWith('.mkv') ||
        fileNameLower.endsWith('.avi') ||
        fileNameLower.endsWith('.m4v') ||
        fileNameLower.endsWith('.3gp') ||
        fileNameLower.endsWith('.ogv');

      const arrayBuffer = await req.arrayBuffer();
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        return NextResponse.json(
          { success: false, error: 'Uploaded file is empty (0 bytes)' },
          { status: 400 }
        );
      }

      const rawBuffer = Buffer.from(arrayBuffer);
      let filename = '';

      if (isVideo) {
        const extMatch = fileNameLower.match(/\.([a-z0-9]+)$/);
        const ext = extMatch ? extMatch[1] : 'mp4';
        filename = `video_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
      } else {
        const extMatch = fileNameLower.match(/\.(jpg|jpeg|png|webp|gif|avif)$/);
        const ext = extMatch ? extMatch[1] : 'jpg';
        filename = `saree_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext === 'png' ? 'png' : 'jpg'}`;
      }

      const targetPaths = getTargetUploadPaths(filename);
      for (const p of targetPaths) {
        try {
          await writeFile(p, rawBuffer);
        } catch (writeErr) {
          console.error(`[Upload API] Error writing to ${p}:`, writeErr);
        }
      }

      const fileUrl = `/uploads/${filename}`;
      return NextResponse.json({
        success: true,
        url: fileUrl,
        urls: [fileUrl],
        filename,
        size: rawBuffer.length,
      });
    }

    // =========================================================================
    // 2. Chunked Upload or FormData / Multipart Upload Mode
    // =========================================================================
    const formData = await req.formData();

    // Check if this is a chunked slice upload (for large videos)
    const isChunked = formData.has('uploadId') && formData.has('chunkIndex');
    if (isChunked) {
      const uploadId = (formData.get('uploadId') as string) || `upload_${Date.now()}`;
      const fileName = (formData.get('fileName') as string) || 'video.mp4';
      const chunkIndex = parseInt(formData.get('chunkIndex') as string, 10);
      const totalChunks = parseInt(formData.get('totalChunks') as string, 10);
      const chunkFile = formData.get('chunk') as File;

      if (!chunkFile || isNaN(chunkIndex) || isNaN(totalChunks)) {
        return NextResponse.json({ success: false, error: 'Invalid chunk data' }, { status: 400 });
      }

      const chunkBuffer = Buffer.from(await chunkFile.arrayBuffer());
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const tempChunkPath = path.join(uploadsDir, `chunk_${uploadId}.tmp`);

      if (chunkIndex === 0) {
        fs.writeFileSync(tempChunkPath, chunkBuffer);
      } else {
        fs.appendFileSync(tempChunkPath, chunkBuffer);
      }

      // If last chunk, finalize into final filename
      if (chunkIndex === totalChunks - 1) {
        const fileNameLower = fileName.toLowerCase();
        const isVideo =
          fileNameLower.endsWith('.mp4') ||
          fileNameLower.endsWith('.webm') ||
          fileNameLower.endsWith('.mov') ||
          fileNameLower.endsWith('.mkv') ||
          fileNameLower.endsWith('.avi') ||
          fileNameLower.endsWith('.m4v') ||
          fileNameLower.endsWith('.3gp') ||
          fileNameLower.endsWith('.ogv');

        let finalFilename = '';
        if (isVideo) {
          const extMatch = fileNameLower.match(/\.([a-z0-9]+)$/);
          const ext = extMatch ? extMatch[1] : 'mp4';
          finalFilename = `video_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
        } else {
          const extMatch = fileNameLower.match(/\.(jpg|jpeg|png|webp|gif|avif)$/);
          const ext = extMatch ? extMatch[1] : 'jpg';
          finalFilename = `saree_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext === 'png' ? 'png' : 'jpg'}`;
        }

        const completeData = fs.readFileSync(tempChunkPath);
        const targetPaths = getTargetUploadPaths(finalFilename);
        for (const p of targetPaths) {
          try {
            fs.writeFileSync(p, completeData);
          } catch (e) {}
        }

        try {
          fs.unlinkSync(tempChunkPath);
        } catch (e) {}

        const finalUrl = `/uploads/${finalFilename}`;
        return NextResponse.json({
          success: true,
          url: finalUrl,
          urls: [finalUrl],
          filename: finalFilename,
        });
      }

      return NextResponse.json({
        success: true,
        chunkReceived: chunkIndex + 1,
        totalChunks,
      });
    }

    // Standard Multipart Files
    const rawFiles =
      formData.getAll('files').length > 0
        ? formData.getAll('files')
        : formData.getAll('file');

    const files = rawFiles.filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid files provided for upload' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileNameLower = (file.name || '').toLowerCase();
      const fileTypeLower = (file.type || '').toLowerCase();

      const isVideo =
        fileTypeLower.startsWith('video/') ||
        fileNameLower.endsWith('.mp4') ||
        fileNameLower.endsWith('.webm') ||
        fileNameLower.endsWith('.mov') ||
        fileNameLower.endsWith('.mkv') ||
        fileNameLower.endsWith('.avi') ||
        fileNameLower.endsWith('.m4v') ||
        fileNameLower.endsWith('.3gp') ||
        fileNameLower.endsWith('.ogv');

      const arrayBuffer = await file.arrayBuffer();
      const rawBuffer = Buffer.from(arrayBuffer);

      let filename = '';

      if (isVideo) {
        const extMatch = fileNameLower.match(/\.([a-z0-9]+)$/);
        const ext = extMatch ? extMatch[1] : 'mp4';
        filename = `video_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
      } else {
        const extMatch = fileNameLower.match(/\.(jpg|jpeg|png|webp|gif|avif)$/);
        const ext = extMatch ? extMatch[1] : 'jpg';
        filename = `saree_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext === 'png' ? 'png' : 'jpg'}`;
      }

      const targetPaths = getTargetUploadPaths(filename);
      for (const p of targetPaths) {
        try {
          await writeFile(p, rawBuffer);
        } catch (writeErr) {
          console.error(`[Upload API] Error writing to ${p}:`, writeErr);
        }
      }

      uploadedUrls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error: any) {
    console.error('[Upload API] Global upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Server failed to process uploaded file',
      },
      { status: 500 }
    );
  }
}
