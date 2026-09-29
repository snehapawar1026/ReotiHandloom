import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export async function applyWatermarkToImageBuffer(inputBuffer: Buffer): Promise<Buffer> {
  try {
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    const width = metadata.width || 1200;
    const height = metadata.height || 1600;

    const watermarkPngPath = path.join(process.cwd(), 'public', 'images', 'reoti_exact_white_watermark_hd.png');
    if (fs.existsSync(watermarkPngPath)) {
      const targetWatermarkWidth = Math.min(width * 0.7, 850);
      
      const rotatedWatermark = await sharp(watermarkPngPath)
        .resize({ width: Math.round(targetWatermarkWidth) })
        .rotate(-28, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer();

      const watermarkedBuffer = await image
        .composite([
          {
            input: rotatedWatermark,
            gravity: 'center',
          },
        ])
        .jpeg({ quality: 92, mozjpeg: true })
        .toBuffer();

      return watermarkedBuffer;
    }

    return inputBuffer;
  } catch (error) {
    console.error('[WatermarkService] Error applying watermark, returning original buffer:', error);
    return inputBuffer;
  }
}
