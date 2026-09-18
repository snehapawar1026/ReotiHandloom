import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAllProducts, getProductBySlugOrId } from '@/lib/storeManager';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || '').trim().toLowerCase();

  try {
    // 1. Try finding by exact slug, decoded slug, or id in Prisma database
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

    // 2. Fallback in DB: If not found, fetch all products and find matching slug/title
    if (!product) {
      const allProducts = await prisma.product.findMany({
        include: {
          category: true,
          reviews: { orderBy: { createdAt: 'desc' } },
        },
      });

      product =
        allProducts.find(
          (p: any) =>
            p.slug.toLowerCase().trim() === decodedSlug ||
            p.id === slug ||
            p.title.toLowerCase().includes(decodedSlug.replace(/-/g, ' '))
        ) || null;
    }

    if (product) {
      // Fetch color variants
      let colorVariants: any[] = [];
      if (product.designCode) {
        colorVariants = await prisma.product.findMany({
          where: { designCode: product.designCode },
        });
      } else {
        colorVariants = await prisma.product.findMany({
          where: {
            categoryId: product.categoryId,
            fabric: product.fabric,
            weaveType: product.weaveType,
          },
        });
      }

      if (colorVariants.length <= 1) {
        colorVariants = await prisma.product.findMany({
          where: { categoryId: product.categoryId },
          take: 6,
        });
      }

      // Fetch related products
      const relatedProducts = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          NOT: { id: product.id },
        },
        take: 4,
      });

      return NextResponse.json({ success: true, product, colorVariants, relatedProducts });
    }
  } catch (error: any) {
    console.warn('[FALLBACK] Serving product slug from storeManager:', error.message);
  }

  // --- SAFE FALLBACK TO storeManager ---
  const allProds = getAllProducts();
  let fallbackProduct = getProductBySlugOrId(slug);

  if (!fallbackProduct && allProds.length > 0) {
    fallbackProduct = allProds[0];
  }

  if (!fallbackProduct) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }

  // Find color variants in storeManager
  let colorVariants = allProds.filter(
    (p) =>
      (fallbackProduct.designCode && p.designCode === fallbackProduct.designCode) ||
      (p.categoryId === fallbackProduct.categoryId && p.fabric === fallbackProduct.fabric)
  );

  if (colorVariants.length <= 1) {
    colorVariants = allProds.filter((p) => p.categoryId === fallbackProduct.categoryId).slice(0, 6);
  }
  if (colorVariants.length === 0) {
    colorVariants = [fallbackProduct];
  }

  // Find related products in storeManager
  let relatedProducts = allProds
    .filter((p) => p.categoryId === fallbackProduct.categoryId && p.id !== fallbackProduct.id)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    relatedProducts = allProds.filter((p) => p.id !== fallbackProduct.id).slice(0, 4);
  }

  return NextResponse.json({
    success: true,
    product: {
      ...fallbackProduct,
      reviews: fallbackProduct.reviews || [],
    },
    colorVariants,
    relatedProducts,
  });
}
