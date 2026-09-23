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
  let imageUrl = '';

  if (Array.isArray(p.images) && p.images.length > 0) {
    imageUrl = p.images[0];
  } else if (typeof p.images === 'string' && p.images.trim()) {
    try {
      const parsed = JSON.parse(p.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        imageUrl = parsed[0];
      } else if (typeof parsed === 'string') {
        imageUrl = parsed;
      } else {
        imageUrl = p.images;
      }
    } catch {
      imageUrl = p.images;
    }
  }

  if (!imageUrl && p.image) {
    imageUrl = p.image;
  }

  if (!imageUrl || imageUrl === '[' || imageUrl === '[]' || imageUrl === 'null') {
    imageUrl = '/logo.png';
  }

  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }

  return imageUrl;
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reotihandloom.com';
  const data = getStoreData();
  const products = (data.products || []).filter((p: any) => !p.isHidden);

  const itemsXml = products
    .map((p: any) => {
      const id = p.id || p.slug;
      const title = p.title || 'Maheshwari Handloom Saree';
      const description =
        p.description ||
        `Authentic Handwoven Maheshwari Saree directly from 3rd generation master weavers of Maheshwar, Madhya Pradesh. Pure handloom craftsmanship.`;
      const link = `${baseUrl}/products/${p.slug || p.id}`;
      const imageUrl = getProductImageUrl(p, baseUrl);
      const price = Number(p.price || 0).toFixed(2);
      const inStock = p.inStock !== false && (p.inventoryCount === undefined || p.inventoryCount > 0);
      const availability = inStock ? 'in_stock' : 'out_of_stock';
      const categoryName = p.category?.name || 'Maheshwari Sarees';

      return `    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description.replace(/<[^>]*>?/gm, '').slice(0, 5000))}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${price} INR</g:price>
      <g:brand>Reoti Handloom</g:brand>
      <g:google_product_category>Apparel &amp; Accessories &gt; Clothing &gt; Traditional &amp; Ceremonial Clothing &gt; Sarees</g:google_product_category>
      <g:product_type>${escapeXml(`Apparel &gt; Sarees &gt; ${categoryName}`)}</g:product_type>
      <g:material>Mulberry Silk &amp; Mercerised Cotton</g:material>
      <g:identifier_exists>no</g:identifier_exists>
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
