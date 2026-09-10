import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();

    // 1. Try finding by exact slug, decoded slug, or id
    let product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: slug },
          { slug: decodedSlug },
          { id: slug },
        ],
      },
      include: {
        category: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // 2. Fallback: If not found, fetch all products and find matching slug/title
    if (!product) {
      const allProducts = await prisma.product.findMany({
        include: {
          category: true,
          reviews: { orderBy: { createdAt: 'desc' } },
        },
      });

      product =
        allProducts.find(
          (p) =>
            p.slug.toLowerCase().trim() === decodedSlug ||
            p.id === slug ||
            p.title.toLowerCase().includes(decodedSlug.replace(/-/g, ' '))
        ) || null;
    }

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Fetch related products from the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        NOT: { id: product.id },
      },
      take: 4,
    });

    return NextResponse.json({ success: true, product, relatedProducts });
  } catch (error: any) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
