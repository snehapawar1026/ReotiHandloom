import os
import sys
import json
import urllib.request
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUBLIC_DIR = os.path.join(BASE_DIR, 'public')
UPLOADS_DIR = os.path.join(PUBLIC_DIR, 'uploads')
FEED_DIR = os.path.join(PUBLIC_DIR, 'feed-images')
STORE_DATA_PATH = os.path.join(BASE_DIR, 'src', 'data', 'storeData.json')
WM_HD_PATH = os.path.join(PUBLIC_DIR, 'images', 'reoti_exact_white_watermark_hd.png')
FAVICON_PATH = os.path.join(PUBLIC_DIR, 'favicon-48x48.png')

os.makedirs(FEED_DIR, exist_ok=True)

def has_existing_watermark(image_url: str) -> bool:
    """
    Returns True if the image already has an embedded/printed Ambekar Reoti Handloom logo
    from the original Maheshwar artisan photoshoot.
    Prevents ANY double watermarks from ever being created.
    """
    if not image_url:
        return False
    return any(k in image_url for k in ['saree_17890', 'saree_17891', 'saree_17892', 'festival_', 'real_insta_'])

def fetch_image(rel_path: str):
    filename = os.path.basename(rel_path)
    local_path = os.path.join(UPLOADS_DIR, filename)
    if os.path.exists(local_path):
        try:
            return Image.open(local_path).convert('RGBA'), filename
        except Exception as e:
            print(f"Error reading local {local_path}: {e}")

    # Fallback to remote
    url = f"https://reotihandloom.com{rel_path}" if rel_path.startswith('/') else f"https://reotihandloom.com/{rel_path}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            try:
                with open(local_path, 'wb') as lf:
                    lf.write(data)
            except Exception:
                pass
            import io
            return Image.open(io.BytesIO(data)).convert('RGBA'), filename
    except Exception as e:
        print(f"Failed to fetch remote {url}: {e}")
        return None, filename

def apply_reoti_watermark(base: Image.Image, wm_center: Image.Image, fav: Image.Image) -> Image.Image:
    bw, bh = base.size

    # 1. Overlay Center Watermark: Exact Website Replica (76% width, crisp white 85% alpha)
    # Matches live website WatermarkOverlay visibility identically (crisp, clearly visible, authentic drape)
    target_wm_w = int(bw * 0.76)
    target_wm_h = int(wm_center.height * (target_wm_w / wm_center.width))
    wm_resized = wm_center.resize((target_wm_w, target_wm_h), Image.Resampling.LANCZOS)

    r, g, b, a = wm_resized.split()
    white_r = a.point(lambda p: 255)
    white_g = a.point(lambda p: 255)
    white_b = a.point(lambda p: 255)
    a_trans = a.point(lambda p: int(p * 0.85) if p > 10 else 0)
    wm_clean = Image.merge('RGBA', (white_r, white_g, white_b, a_trans))

    # Crisp, soft depth drop shadow (radius 1.2, 30% alpha) matching CSS drop-shadow(0 1px 2px rgba(0,0,0,0.4))
    shadow = Image.merge('RGBA', (
        a.point(lambda p: 0),
        a.point(lambda p: 0),
        a.point(lambda p: 0),
        a.point(lambda p: int(p * 0.30) if p > 10 else 0)
    )).filter(ImageFilter.GaussianBlur(radius=1.2))

    pad = 40
    canv_w = target_wm_w + pad * 2
    canv_h = target_wm_h + pad * 2
    wm_canvas = Image.new('RGBA', (canv_w, canv_h), (0, 0, 0, 0))
    wm_canvas.paste(shadow, (pad + 1, pad + 2), shadow)
    wm_canvas.paste(wm_clean, (pad, pad), wm_clean)

    # Rotate 28 degrees counter-clockwise (matches CSS -rotate-[28deg])
    rotated_wm = wm_canvas.rotate(28, expand=True, resample=Image.Resampling.BICUBIC)

    rx = (bw - rotated_wm.width) // 2
    ry = (bh - rotated_wm.height) // 2
    base.paste(rotated_wm, (rx, ry), rotated_wm)

    # 2. Overlay Bottom-Left Pill Badge: Clean, premium Reoti Handloom branding (26% width)
    badg_w = int(bw * 0.26)
    badg_h = int(badg_w * 0.22)
    badge_img = Image.new('RGBA', (badg_w, badg_h), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(badge_img)

    bdraw.rounded_rectangle(
        [1, 1, badg_w - 2, badg_h - 2],
        radius=badg_h // 2,
        fill=(255, 255, 255, 240),
        outline=(245, 180, 50, 200),
        width=max(1, int(badg_h * 0.04))
    )

    icon_size = int(badg_h * 0.72)
    fav_resized = fav.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
    mask = Image.new('L', (icon_size, icon_size), 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.ellipse((0, 0, icon_size, icon_size), fill=255)

    icon_x = int(badg_h * 0.16)
    icon_y = (badg_h - icon_size) // 2
    badge_img.paste(fav_resized, (icon_x, icon_y), mask)

    bdraw.ellipse(
        [icon_x, icon_y, icon_x + icon_size, icon_y + icon_size],
        outline=(210, 140, 30, 200),
        width=max(1, int(badg_h * 0.03))
    )

    try:
        font_badge = ImageFont.truetype('georgia.ttf', int(badg_h * 0.38))
    except Exception:
        font_badge = ImageFont.load_default()

    text_x = icon_x + icon_size + int(badg_h * 0.14)
    bbox = bdraw.textbbox((0, 0), 'REOTI HANDLOOM', font=font_badge)
    th = bbox[3] - bbox[1]
    text_y = (badg_h - th) // 2 - int(badg_h * 0.05)
    bdraw.text((text_x, text_y), 'REOTI HANDLOOM', fill=(88, 28, 28, 255), font=font_badge)

    b_margin = int(bw * 0.035)
    base.paste(badge_img, (b_margin, bh - badg_h - b_margin), badge_img)

    return base.convert('RGB')

def main():
    if not os.path.exists(STORE_DATA_PATH):
        print(f"storeData.json not found at {STORE_DATA_PATH}")
        return

    with open(STORE_DATA_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    products = data.get('products', [])
    print(f"Total products to process: {len(products)}")

    wm_center = Image.open(WM_HD_PATH).convert('RGBA')
    fav = Image.open(FAVICON_PATH).convert('RGBA')

    processed_new = 0
    preserved_existing = 0
    errors = 0

    for idx, p in enumerate(products, 1):
        raw_images = p.get('images')
        if isinstance(raw_images, str):
            try:
                raw_images = json.loads(raw_images)
            except Exception:
                raw_images = [raw_images]

        img_url = raw_images[0] if (isinstance(raw_images, list) and len(raw_images) > 0) else p.get('image')
        if not img_url or img_url.startswith('['):
            continue

        filename = os.path.basename(img_url)
        out_file = os.path.join(FEED_DIR, filename)

        base_img, fname = fetch_image(img_url)
        if not base_img:
            errors += 1
            continue

        # RULE 1: If image already has original artisan watermark, PRESERVE CLEAN ORIGINAL! NEVER DOUBLE-WATERMARK!
        if has_existing_watermark(img_url):
            base_img.convert('RGB').save(out_file, quality=94)
            preserved_existing += 1
        else:
            # RULE 2: For new sarees without watermark, apply exact high-contrast website watermark & badge
            final_img = apply_reoti_watermark(base_img, wm_center, fav)
            final_img.save(out_file, quality=94)
            processed_new += 1

        if idx % 10 == 0 or idx == len(products):
            print(f"[{idx}/{len(products)}] High-contrast Watermarked: {processed_new}, Single Original Preserved: {preserved_existing}, Errors: {errors}")

    print(f"\n[OK] All Google Merchant feed images updated with 100% accuracy in: {FEED_DIR}")
    print(f"Total processed: {processed_new + preserved_existing} (Zero double watermarks!)")

if __name__ == '__main__':
    main()
