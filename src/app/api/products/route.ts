import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
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

    return NextResponse.json({ success: true, products, count: products.length });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
