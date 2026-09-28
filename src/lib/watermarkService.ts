import sharp from 'sharp';

/**
 * Applies permanent, high-definition luxury watermarks onto an image buffer.
 * The watermark is embedded directly into the pixels of the image file,
 * protecting it against unauthorized downloads, saves, and screenshots.
 */
export async function applyWatermarkToImageBuffer(inputBuffer: Buffer): Promise<Buffer> {
  try {
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    const width = metadata.width || 1200;
    const height = metadata.height || 1600;

    // Calculate dynamic scaling based on image dimensions
    const baseDimension = Math.min(width, height);
    const fontSizeTitle = Math.max(22, Math.round(baseDimension * 0.052));
    const fontSizeSub = Math.max(12, Math.round(baseDimension * 0.022));
    const fontSizeCorner = Math.max(11, Math.round(baseDimension * 0.020));
    const lotusScale = Math.max(0.6, baseDimension / 1000);

    const centerX = width / 2;
    const centerY = height / 2;

    // High-Definition SVG Watermark Overlay
    const svgWatermark = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Text Drop Shadow for readability on light/dark sarees -->
          <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.65" />
          </filter>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.8" />
          </filter>
        </defs>

        <style>
          .titleText {
            font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
            font-weight: 700;
            fill: rgba(255, 255, 255, 0.62);
            letter-spacing: 0.12em;
            text-anchor: middle;
            filter: url(#shadow);
          }
          .subText {
            font-family: 'Montserrat', 'Helvetica Neue', 'Arial', sans-serif;
            font-weight: 600;
            fill: rgba(255, 255, 255, 0.58);
            letter-spacing: 0.18em;
            text-anchor: middle;
            text-transform: uppercase;
            filter: url(#shadow);
          }
          .taglineText {
            font-family: 'Playfair Display', 'Georgia', serif;
            font-style: italic;
            font-weight: 500;
            fill: rgba(255, 255, 255, 0.55);
            letter-spacing: 0.08em;
            text-anchor: middle;
            filter: url(#shadow);
          }
          .cornerText {
            font-family: 'Montserrat', 'Arial', sans-serif;
            font-weight: 700;
            fill: rgba(255, 255, 255, 0.70);
            letter-spacing: 0.14em;
            text-transform: uppercase;
            filter: url(#softGlow);
          }
          .accentLine {
            stroke: rgba(255, 255, 255, 0.55);
            stroke-width: 1.5;
            filter: url(#shadow);
          }
          .lotusIcon {
            stroke: rgba(255, 255, 255, 0.65);
            fill: rgba(255, 255, 255, 0.08);
            stroke-width: 2;
            filter: url(#shadow);
          }
        </style>

        <!-- Central Clean Luxury White Watermark -->
        <g transform="translate(${centerX}, ${centerY})">
          <!-- Main Brand Heading -->
          <text y="0" font-size="${fontSizeTitle}px" class="titleText" fill="#ffffff">
            Reoti Handloom
          </text>

          <!-- Subtitle / Authenticity Line -->
          <text y="${fontSizeTitle * 0.55}" font-size="${fontSizeSub}px" class="subText" fill="#ffffff">
            Authentic Maheshwari Saree
          </text>
        </g>
      </svg>
    `;

    // Composite SVG watermark onto image
    const watermarkedBuffer = await image
      .composite([
        {
          input: Buffer.from(svgWatermark),
          top: 0,
          left: 0,
        },
      ])
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer();

    return watermarkedBuffer;
  } catch (error) {
    console.error('[WatermarkService] Error applying watermark, returning original buffer:', error);
    return inputBuffer;
  }
}
