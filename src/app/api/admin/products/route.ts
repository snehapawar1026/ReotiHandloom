import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createProductInStore, updateProductInStore, deleteProductInStore } from '@/lib/storeManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Always create in storeManager JSON database for 100% guarantee
    const savedProduct = createProductInStore(body);

    // 2. Also try Prisma database (if running)
    try {
      const {
        title,
        description,
        price,
        originalPrice,
        fabric,
        weaveType,
        borderType,
        color,
        blouseColor,
        designCode,
        lengthWithBlouse,
        categoryId,
        images,
        isFeatured,
        isBestSeller,
        isTrending,
        stock,
        isOutOfStock,
      } = body;

      const numPrice = parseFloat(price) || 0;
      const numOriginalPrice = (originalPrice !== undefined && originalPrice !== null && originalPrice !== '') ? parseFloat(originalPrice) : numPrice;
      const discountPercent = numOriginalPrice > numPrice ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100) : 0;

      await prisma.product.create({
        data: {
          id: savedProduct.id,
          title,
          slug: savedProduct.slug,
          description: description || title,
          price: numPrice,
          originalPrice: numOriginalPrice,
          discountPercent,
          fabric: fabric || 'Silk Cotton',
          weaveType: weaveType || 'Garbha Reshami Border',
          borderType: borderType || 'Gold Zari',
          color: color || 'Crimson Red',
          blouseColor: blouseColor || null,
          designCode: designCode || null,
          lengthWithBlouse: lengthWithBlouse || '6.3 Meters (With Blouse Piece)',
          categoryId: categoryId || savedProduct.categoryId,
          images: typeof images === 'string' ? images : JSON.stringify(images),
          isFeatured: isFeatured || false,
          isBestSeller: isBestSeller || false,
          isTrending: isTrending || false,
          isOutOfStock: Boolean(isOutOfStock),
          stock: (stock !== undefined && stock !== null && stock !== '') ? parseInt(stock) : null,
        },
      });
    } catch (prismaErr: any) {
      console.warn('[Admin Product POST] Prisma notice:', prismaErr.message);
    }

    return NextResponse.json({ success: true, product: savedProduct });
  } catch (error: any) {
    console.error('Error in product create:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required for editing.' }, { status: 400 });
    }

    // 1. Update in storeManager
    const updatedProduct = updateProductInStore(id, body);

    // 2. Also try Prisma
    try {
      const {
        title,
        description,
        price,
        originalPrice,
        fabric,
        weaveType,
        borderType,
        color,
        blouseColor,
        designCode,
        lengthWithBlouse,
        categoryId,
        images,
        isFeatured,
        isBestSeller,
        isTrending,
        stock,
        isOutOfStock,
      } = body;

      const numPrice = price !== undefined ? parseFloat(price) : undefined;
      let numOriginalPrice: number | undefined = undefined;
      if (originalPrice !== undefined) {
        numOriginalPrice = (originalPrice !== null && originalPrice !== '') ? parseFloat(originalPrice) : (numPrice || 0);
      }
      let discountPercent: number | undefined = undefined;
      if (numOriginalPrice !== undefined && numPrice !== undefined) {
        discountPercent = numOriginalPrice > numPrice ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100) : 0;
      }

      let parsedStock: number | null | undefined = undefined;
      if (stock !== undefined) {
        parsedStock = (stock !== null && stock !== '') ? parseInt(stock) : null;
      }

      await prisma.product.update({
        where: { id },
        data: {
          ...(title !== undefined && {
            title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          }),
          ...(description !== undefined && { description }),
          ...(numPrice !== undefined && { price: numPrice }),
          ...(numOriginalPrice !== undefined && { originalPrice: numOriginalPrice }),
          ...(discountPercent !== undefined && { discountPercent }),
          ...(fabric && { fabric }),
          ...(weaveType && { weaveType }),
          ...(borderType && { borderType }),
          ...(color && { color }),
          ...(blouseColor !== undefined && { blouseColor }),
          ...(designCode !== undefined && { designCode }),
          ...(lengthWithBlouse && { lengthWithBlouse }),
          ...(categoryId && { category: { connect: { id: categoryId } } }),
          ...(images !== undefined && { images: typeof images === 'string' ? images : JSON.stringify(images) }),
          ...(isFeatured !== undefined && { isFeatured }),
          ...(isBestSeller !== undefined && { isBestSeller }),
          ...(isTrending !== undefined && { isTrending }),
          ...(isOutOfStock !== undefined && { isOutOfStock }),
          ...(parsedStock !== undefined && { stock: parsedStock }),
        },
      });
    } catch (prismaErr: any) {
      console.warn('[Admin Product PUT] Prisma notice:', prismaErr.message);
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    // 1. Delete from storeManager
    deleteProductInStore(id);

    // 2. Try Prisma
    try {
      await prisma.product.delete({
        where: { id },
      });
    } catch (prismaErr: any) {
      console.warn('[Admin Product DELETE] Prisma notice:', prismaErr.message);
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
