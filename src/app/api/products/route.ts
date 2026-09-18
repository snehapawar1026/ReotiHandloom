import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/storeManager';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const fabric = searchParams.get('fabric');
  const weaveType = searchParams.get('weaveType');
  const borderType = searchParams.get('borderType');
  const color = searchParams.get('color');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  const bestSeller = searchParams.get('bestSeller');
  const trending = searchParams.get('trending');
  const inStock = searchParams.get('inStock');
  const sort = searchParams.get('sort');
  const includeAll = searchParams.get('includeAll') === 'true';

  let storeProducts = getAllProducts() || [];

  if (category) {
    storeProducts = storeProducts.filter(
      (p) => p.category?.slug === category || p.categoryId === category || (p.category as any)?.parent?.slug === category
    );
  } else if (!includeAll) {
    storeProducts = storeProducts.filter(
      (p) =>
        p.category?.slug !== 'semi-maheshwari-sarees' &&
        p.category?.slug !== 'semi-maheshwari' &&
        p.categoryId !== 'semi-maheshwari-sarees-id'
    );
  }
  if (fabric) {
    storeProducts = storeProducts.filter((p) => p.fabric?.toLowerCase().includes(fabric.toLowerCase()));
  }
  if (weaveType) {
    storeProducts = storeProducts.filter((p) => p.weaveType?.toLowerCase().includes(weaveType.toLowerCase()));
  }
  if (borderType) {
    storeProducts = storeProducts.filter((p) => p.borderType?.toLowerCase().includes(borderType.toLowerCase()));
  }
  if (color) {
    storeProducts = storeProducts.filter((p) => p.color?.toLowerCase().includes(color.toLowerCase()));
  }
  if (featured === 'true') {
    storeProducts = storeProducts.filter((p) => p.isFeatured);
  }
  if (bestSeller === 'true') {
    storeProducts = storeProducts.filter((p) => p.isBestSeller);
  }
  if (trending === 'true') {
    storeProducts = storeProducts.filter((p) => p.isTrending);
  }
  if (inStock === 'true') {
    storeProducts = storeProducts.filter((p) => !p.isOutOfStock);
  }
  if (minPrice) {
    storeProducts = storeProducts.filter((p) => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    storeProducts = storeProducts.filter((p) => p.price <= parseFloat(maxPrice));
  }
  if (search) {
    const q = search.toLowerCase();
    storeProducts = storeProducts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.fabric?.toLowerCase().includes(q) ||
        p.color?.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-low') storeProducts.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') storeProducts.sort((a, b) => b.price - a.price);
  if (sort === 'rating') storeProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sort === 'discount') storeProducts.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));

  return NextResponse.json({ success: true, products: storeProducts, count: storeProducts.length });
}
