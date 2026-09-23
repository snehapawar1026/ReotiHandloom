import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, getProductBySlugOrId, getStoreData, isSemiMaheshwari } from '@/lib/storeManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const allProds = getAllProducts();
  const allCats = getStoreData().categories || [];
  const product = getProductBySlugOrId(slug);

  if (!product) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }

  const isCurrentSemi = isSemiMaheshwari(product, allCats);

  // Candidate pool strictly matches the category realm (Semi vs Authentic Handloom)
  const candidatePool = allProds.filter((p) => {
    if (p.id === product.id) return false;
    const isP_Semi = isSemiMaheshwari(p, allCats);
    return isCurrentSemi ? isP_Semi : !isP_Semi;
  });

  const currentDesign = product.designCode?.trim().toLowerCase();

  // Find color variants strictly based on exact designCode matching
  let colorVariants: any[] = [];
  if (currentDesign) {
    colorVariants = candidatePool.filter(
      (p) => p.designCode && p.designCode.trim().toLowerCase() === currentDesign
    );
  } else {
    // If product has no designCode, only match other items with no designCode having exact same category & fabric
    colorVariants = candidatePool.filter(
      (p) => !p.designCode && p.categoryId === product.categoryId && p.fabric === product.fabric
    );
  }

  // Ensure current product is always in colorVariants
  if (!colorVariants.some((p) => p.id === product.id)) {
    colorVariants = [product, ...colorVariants];
  }

  // Find related products (Customers Also Liked)
  // 1. First priority: Same category items from candidate pool
  let relatedProducts = candidatePool
    .filter((p) => p.categoryId === product.categoryId)
    .slice(0, 4);

  // 2. Second priority: Fill remaining slots strictly from the same candidate pool (Never cross Semi vs Handloom!)
  if (relatedProducts.length < 4) {
    const existingIds = new Set(relatedProducts.map((p) => p.id));
    const moreRelated = candidatePool
      .filter((p) => !existingIds.has(p.id))
      .slice(0, 4 - relatedProducts.length);
    relatedProducts = [...relatedProducts, ...moreRelated];
  }

  return NextResponse.json(
    {
      success: true,
      product: {
        ...product,
        reviews: product.reviews || [],
      },
      colorVariants,
      relatedProducts,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }
  );
}

