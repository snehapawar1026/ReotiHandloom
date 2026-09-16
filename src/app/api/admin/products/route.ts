import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createProductInStore, updateProductInStore, deleteProductInStore } from '@/lib/storeManager';

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

      const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

      await prisma.product.create({
        data: {
          id: savedProduct.id,
          title,
          slug: savedProduct.slug,
          description: description || title,
          price: parseFloat(price),
          originalPrice: parseFloat(originalPrice),
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
          isOutOfStock: isOutOfStock || false,
          stock: isOutOfStock ? 0 : (stock ? parseInt(stock) : 15),
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

      const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

      await prisma.product.update({
        where: { id },
        data: {
          ...(title && {
            title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          }),
          ...(description !== undefined && { description }),
          ...(price !== undefined && { price: parseFloat(price) }),
          ...(originalPrice !== undefined && { originalPrice: parseFloat(originalPrice) }),
          ...(originalPrice && price && { discountPercent }),
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
          ...(isOutOfStock !== undefined && { isOutOfStock, stock: isOutOfStock ? 0 : 15 }),
          ...(stock !== undefined && { stock: parseInt(stock) }),
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
