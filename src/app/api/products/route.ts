import { NextRequest, NextResponse } from 'next/server';
import { getStoreData } from '@/lib/storeManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  const storeData = getStoreData();
  let storeProducts = storeData.products || [];
  const allCategories = storeData.categories || [];

  if (category) {
    const targetCat = allCategories.find(
      (c: any) =>
        c.slug?.toLowerCase() === category.toLowerCase() ||
        c.id === category ||
        c.name?.toLowerCase() === category.toLowerCase()
    );

    const childCatIds = targetCat
      ? allCategories.filter((c: any) => c.parentId === targetCat.id).map((c: any) => c.id)
      : [];
    const childCatSlugs = targetCat
      ? allCategories.filter((c: any) => c.parentId === targetCat.id).map((c: any) => c.slug?.toLowerCase())
      : [];

    const allowedCatIds = new Set<string>([
      category,
      ...(targetCat ? [targetCat.id] : []),
      ...childCatIds,
    ]);

    const allowedCatSlugs = new Set<string>([
      category.toLowerCase(),
      ...(targetCat ? [targetCat.slug?.toLowerCase()] : []),
      ...childCatSlugs,
    ]);

    storeProducts = storeProducts.filter((p: any) => {
      // 1. Direct ID match
      if (p.categoryId && allowedCatIds.has(p.categoryId)) return true;

      // 2. Direct Slug match
      if (p.category?.slug && allowedCatSlugs.has(p.category.slug.toLowerCase())) return true;
      if (p.category?.id && allowedCatIds.has(p.category.id)) return true;

      // 3. Check parentId in allCategories store
      const prodCat = allCategories.find(
        (c: any) => c.id === p.categoryId || c.slug?.toLowerCase() === p.category?.slug?.toLowerCase()
      );
      if (targetCat && prodCat && prodCat.parentId === targetCat.id) {
        return true;
      }

      // 4. Special fallback for "maheshwari-sarees" parent: include all authentic maheshwari child sarees
      if (category === 'maheshwari-sarees') {
        const isSemi =
          p.category?.slug === 'semi-maheshwari-sarees' ||
          p.category?.slug === 'semi-maheshwari' ||
          p.categoryId === 'semi-maheshwari-sarees-id';
        const isSuit =
          p.category?.slug?.includes('suit') ||
          p.categoryId === '62c60ff6-1568-4753-8f73-652dd1efd355' ||
          p.title?.toLowerCase().includes('suit');
        const isDupatta =
          p.category?.slug === 'dupattas' ||
          p.categoryId === '59c903c7-960f-4481-882a-9b16890a3054' ||
          p.title?.toLowerCase().includes('dupatta');
        const isChanderi =
          p.category?.slug === 'chanderi-sarees' ||
          p.categoryId === '32118f61-e48f-41f0-bcb7-dd4e599205e8' ||
          p.title?.toLowerCase().includes('chanderi');

        if (!isSemi && !isSuit && !isDupatta && !isChanderi) {
          return true;
        }
      }

      return false;
    });
  } else if (!includeAll) {
    storeProducts = storeProducts.filter(
      (p: any) =>
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

  return NextResponse.json(
    { success: true, products: storeProducts, count: storeProducts.length },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }
  );
}

