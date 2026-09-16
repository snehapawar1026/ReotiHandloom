import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

  try {
    const where: any = {};

    if (category) {
      where.OR = [
        { category: { slug: category } },
        { category: { parent: { slug: category } } },
      ];
    }
    if (fabric) {
      where.fabric = { contains: fabric };
    }
    if (weaveType) {
      where.weaveType = { contains: weaveType };
    }
    if (borderType) {
      where.borderType = { contains: borderType };
    }
    if (color) {
      where.color = { contains: color };
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (bestSeller === 'true') {
      where.isBestSeller = true;
    }
    if (trending === 'true') {
      where.isTrending = true;
    }
    if (inStock === 'true') {
      where.isOutOfStock = false;
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { fabric: { contains: search } },
        { color: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') orderBy = { price: 'asc' };
    if (sort === 'price-high') orderBy = { price: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };
    if (sort === 'discount') orderBy = { discountPercent: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
      },
    });

    if (products && products.length > 0) {
      return NextResponse.json({ success: true, products, count: products.length });
    }
  } catch (error: any) {
    console.warn('[FALLBACK] Serving products from storeManager:', error.message);
  }

  // File-based storeManager fallback
  let storeProducts = getAllProducts();

  if (category) {
    storeProducts = storeProducts.filter(
      (p) => p.category?.slug === category || p.categoryId === category || (p.category as any)?.parent?.slug === category
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
