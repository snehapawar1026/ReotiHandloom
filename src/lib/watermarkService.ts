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

        <!-- 1. Central Diagonal Luxury Watermark -->
        <g transform="translate(${centerX}, ${centerY}) rotate(-24)">
          <!-- Lotus Heritage Motif -->
          <g transform="translate(0, -${fontSizeTitle * 1.35}) scale(${lotusScale})">
            <path class="lotusIcon" d="M0 -35 C-12 -12 -30 10 -60 18 C-30 20 -12 10 0 35 C12 10 30 20 60 18 C30 10 12 -12 0 -35 Z" />
            <circle cx="0" cy="-5" r="3.5" fill="rgba(255,255,255,0.7)" />
          </g>

          <!-- Main Brand Heading -->
          <text y="0" font-size="${fontSizeTitle}px" class="titleText">
            ✦ REOTI HANDLOOM ✦
          </text>

          <!-- Subtitle / Authenticity Line -->
          <text y="${fontSizeTitle * 0.85}" font-size="${fontSizeSub}px" class="subText">
            AUTHENTIC MAHESHWARI HERITAGE
          </text>

          <!-- Divider with Traditional Flourish -->
          <line x1="-${fontSizeTitle * 3.5}" y1="${fontSizeTitle * 1.25}" x2="-${fontSizeTitle * 0.5}" y2="${fontSizeTitle * 1.25}" class="accentLine" />
          <circle cx="0" cy="${fontSizeTitle * 1.25}" r="3" fill="rgba(255,255,255,0.7)" />
          <line x1="${fontSizeTitle * 0.5}" y1="${fontSizeTitle * 1.25}" x2="${fontSizeTitle * 3.5}" y2="${fontSizeTitle * 1.25}" class="accentLine" />

          <!-- Tagline -->
          <text y="${fontSizeTitle * 1.75}" font-size="${Math.round(fontSizeSub * 0.95)}px" class="taglineText">
            Tradition Woven with Love • Direct From Maheshwar Looms
          </text>
        </g>

        <!-- 2. Bottom-Right Security Copyright Badge -->
        <g transform="translate(${width - 24}, ${height - 24})">
          <rect x="-${fontSizeCorner * 18}" y="-${fontSizeCorner * 2.2}" width="${fontSizeCorner * 18}" height="${fontSizeCorner * 2.6}" rx="${fontSizeCorner * 0.5}" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.4)" stroke-width="1" />
          <text x="-${fontSizeCorner * 9}" y="-${fontSizeCorner * 0.4}" font-size="${fontSizeCorner}px" text-anchor="middle" class="cornerText">
            © REOTI HANDLOOM • MAHESHWAR
          </text>
        </g>

        <!-- 3. Top-Left Handloom Trust Mark -->
        <g transform="translate(24, 36)">
          <rect x="0" y="-${fontSizeCorner * 1.4}" width="${fontSizeCorner * 16}" height="${fontSizeCorner * 2.2}" rx="${fontSizeCorner * 0.4}" fill="rgba(0,0,0,0.30)" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
          <text x="${fontSizeCorner * 8}" y="${fontSizeCorner * 0.2}" font-size="${fontSizeCorner * 0.9}px" text-anchor="middle" class="cornerText">
            ✦ 100% PURE HANDLOOM MARK ✦
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
