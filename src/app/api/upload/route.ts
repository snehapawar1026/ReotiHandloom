import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawFiles = formData.getAll('files').length > 0
      ? formData.getAll('files')
      : formData.getAll('file');

    const files = rawFiles.filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ success: false, error: 'No image files provided' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || '.jpg';
      const filename = `saree_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      await writeFile(filePath, buffer);
      uploadedUrls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error: any) {
    console.error('Error uploading image(s):', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
