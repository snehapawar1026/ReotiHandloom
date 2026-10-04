const fs = require('fs');
const path = require('path');

const storeData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/storeData.json'), 'utf8'));
const baseUrl = 'https://reotihandloom.com';
const products = (storeData.products || []).filter(p => !p.isHidden);

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const itemsXml = products.map(p => {
  const id = p.id || p.slug;
  const title = p.title || 'Maheshwari Handloom Saree';
  let description = (p.description || '').replace(/<[^>]*>?/gm, '').trim();
  if (!description || description.length < 20 || /^[a-z]{10,}$/i.test(description)) {
    description = `Authentic Handcrafted ${title} woven directly on traditional pit looms in Maheshwar, Madhya Pradesh with pure Mulberry silk and mercerised cotton. Features rich zari border and feather-light drape.`;
  }
  const link = baseUrl + '/products/' + (p.slug || p.id);
  
  let rawImages = p.images;
  if (typeof rawImages === 'string') {
    try {
      rawImages = JSON.parse(rawImages);
    } catch {
      rawImages = [rawImages];
    }
  }

  let imageUrl = Array.isArray(rawImages) && rawImages.length > 0 ? rawImages[0] : (p.image || '/rh-logo.png');
  if (typeof imageUrl !== 'string' || !imageUrl || imageUrl.startsWith('[')) {
    imageUrl = '/rh-logo.png';
  }
  if (!imageUrl.startsWith('http')) {
    imageUrl = baseUrl + (imageUrl.startsWith('/') ? '' : '/') + imageUrl;
  }

  const price = Number(p.price || 0).toFixed(2);
  const inStock = p.inStock !== false && (p.inventoryCount === undefined || p.inventoryCount > 0);
  const availability = inStock ? 'in_stock' : 'out_of_stock';
  const categoryName = (p.category && (typeof p.category === 'object' ? p.category.name : p.category)) || 'Maheshwari Sarees';

  return `    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description.slice(0, 5000))}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${price} INR</g:price>
      <g:brand>Reoti Handloom</g:brand>
      <g:google_product_category>Apparel &amp; Accessories &gt; Clothing &gt; Traditional &amp; Ceremonial Clothing &gt; Sarees</g:google_product_category>
      <g:product_type>${escapeXml('Apparel > Sarees > ' + categoryName)}</g:product_type>
      <g:material>Mulberry Silk &amp; Mercerised Cotton</g:material>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Reoti Handloom - Authentic Maheshwari Sarees</title>
    <link>${baseUrl}</link>
    <description>Heritage Maheshwari Handloom Sarees handcrafted directly on pit looms in Maheshwar since 1960.</description>
${itemsXml}
  </channel>
</rss>`;

fs.writeFileSync(path.join(__dirname, '../public/google-feed.xml'), xml, 'utf8');
console.log(`google-feed.xml created with ${products.length} products in public/`);
