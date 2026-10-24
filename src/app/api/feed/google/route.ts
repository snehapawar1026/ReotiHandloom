import { NextResponse } from 'next/server';
import { getStoreData } from '@/lib/storeManager';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getProductImageUrl(p: any, baseUrl: string): string {
  let rawPath = '';

  if (Array.isArray(p.images) && p.images.length > 0) {
    rawPath = p.images[0];
  } else if (typeof p.images === 'string' && p.images.trim()) {
    try {
      const parsed = JSON.parse(p.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        rawPath = parsed[0];
      } else if (typeof parsed === 'string') {
        rawPath = parsed;
      } else {
        rawPath = p.images;
      }
    } catch {
      rawPath = p.images;
    }
  }

  if (!rawPath && p.image) {
    rawPath = p.image;
  }

  if (!rawPath || rawPath === '[' || rawPath === '[]' || rawPath === 'null') {
    return `${baseUrl}/logo.png`;
  }

  if (rawPath.startsWith('http')) {
    if (rawPath.includes('reotihandloom.com')) {
      try {
        const url = new URL(rawPath);
        const cleanFilename = url.pathname.replace(/^\/?(public\/)?(uploads\/)?/, '');
        return `${baseUrl}/api/feed/image?file=${encodeURIComponent(cleanFilename)}`;
      } catch {
        return rawPath;
      }
    }
    return rawPath;
  }

  const cleanFilename = rawPath.replace(/^\/?(public\/)?(uploads\/)?/, '');
  return `${baseUrl}/api/feed/image?file=${encodeURIComponent(cleanFilename)}`;
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reotihandloom.com';
  const data = getStoreData();
  const products = (data.products || []).filter((p: any) => !p.isHidden);

  const itemsXml = products
    .map((p: any) => {
      const id = p.id || p.slug;
      const title = p.title || 'Maheshwari Handloom Saree';
      const rawDesc = p.description ? p.description.replace(/<[^>]*>?/gm, '').trim() : '';
      const fabric = p.fabric || (p.category?.name?.toLowerCase().includes('semi') ? 'Semi Maheshwari Silk Cotton' : 'Pure Silk Cotton Handloom');
      const weave = p.weaveType || p.border || 'Authentic Pit Loom Weave with Zari Border';
      const color = p.color || (p.colors && p.colors[0]) || 'Multicolor';
      
      const link = `${baseUrl}/products/${p.slug || p.id}`;
      const imageUrl = getProductImageUrl(p, baseUrl);
      const price = Number(p.price || 0).toFixed(2);
      const inStock = p.inStock !== false && (p.inventoryCount === undefined || p.inventoryCount > 0);
      const availability = inStock ? 'in_stock' : 'out_of_stock';
      const categoryName = p.category?.name || 'Maheshwari Sarees';
      const richDescription = `${p.title || 'Maheshwari Handloom Saree'}. ${rawDesc ? rawDesc + '. ' : ''}Handcrafted in Maheshwar, MP by traditional master weavers of Reoti Handloom (Est. 1960). Fabric: ${fabric}. Craft: ${weave}. Features lightweight breathable drape, authentic reversible Zari border, and royal Ahilyabai Holkar heritage motifs. Comes with unstitched blouse piece. 100% Genuine Handloom Guarantee.`;

      let cleanTitle = (p.title || 'Maheshwari Handloom Saree').trim();
      if (!cleanTitle.toLowerCase().includes('maheshwari')) {
        cleanTitle = `${cleanTitle} - Maheshwari Saree`;
      }
      if (!cleanTitle.toLowerCase().includes('reoti')) {
        cleanTitle = `${cleanTitle} | Reoti Handloom`;
      }
      const googleTitle = cleanTitle;

      return `    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(googleTitle.slice(0, 150))}</g:title>
      <g:description>${escapeXml(richDescription.slice(0, 5000))}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${price} INR</g:price>
      <g:brand>Reoti Handloom</g:brand>
      <g:color>${escapeXml(color)}</g:color>
      <g:gender>female</g:gender>
      <g:age_group>adult</g:age_group>
      <g:google_product_category>Apparel &amp; Accessories &gt; Clothing &gt; Traditional &amp; Ceremonial Clothing &gt; Sarees</g:google_product_category>
      <g:product_type>${escapeXml(`Apparel &gt; Traditional &gt; Sarees &gt; ${categoryName}`)}</g:product_type>
      <g:material>${escapeXml(fabric)}</g:material>
      <g:product_highlight>Handwoven by 3rd Generation Master Weavers in Maheshwar</g:product_highlight>
      <g:product_highlight>Feather-Light Silk Cotton Drape with Reversible Zari Border</g:product_highlight>
      <g:product_highlight>Direct from Loom to Wardrobe with Authenticity Guarantee</g:product_highlight>
      <g:identifier_exists>no</g:identifier_exists>
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Express Delivery Across India</g:service>
        <g:price>0.00 INR</g:price>
      </g:shipping>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Reoti Handloom - Authentic Maheshwari Sarees</title>
    <link>${baseUrl}</link>
    <description>Heritage Maheshwari Handloom Sarees handcrafted directly on pit looms in Maheshwar since 1960.</description>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
