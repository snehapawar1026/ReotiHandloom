import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, getProductBySlugOrId } from '@/lib/storeManager';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
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
