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
  const description = p.description || 'Authentic Handwoven Maheshwari Saree directly from 3rd generation master weavers of Maheshwar, Madhya Pradesh. Pure handloom craftsmanship.';
  const link = baseUrl + '/products/' + (p.slug || p.id);
  
  let imageUrl = p.images && p.images.length > 0 ? p.images[0] : (p.image || '/logo.png');
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = baseUrl + (imageUrl.startsWith('/') ? '' : '/') + imageUrl;
  }

  const price = Number(p.price || 0).toFixed(2);
  const inStock = p.inStock !== false && (p.inventoryCount === undefined || p.inventoryCount > 0);
  const availability = inStock ? 'in_stock' : 'out_of_stock';
  const categoryName = (p.category && p.category.name) || 'Maheshwari Sarees';

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
