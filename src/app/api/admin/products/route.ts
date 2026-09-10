import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      price,
      originalPrice,
      fabric,
      weaveType,
      borderType,
      color,
      lengthWithBlouse,
      categoryId,
      images,
      isFeatured,
      isBestSeller,
      stock,
    } = body;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description: description || title,
        price: parseFloat(price),
        originalPrice: parseFloat(originalPrice),
        discountPercent,
        fabric: fabric || 'Silk Cotton',
        weaveType: weaveType || 'Chatai Border',
        borderType: borderType || 'Gold Zari',
        color: color || 'Crimson Red',
        lengthWithBlouse: lengthWithBlouse || '6.3 Meters (With Blouse Piece)',
        categoryId,
        images: typeof images === 'string' ? images : JSON.stringify(images),
        isFeatured: isFeatured || false,
        isBestSeller: isBestSeller || false,
        stock: stock ? parseInt(stock) : 15,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      description,
      price,
      originalPrice,
      fabric,
      weaveType,
      borderType,
      color,
      lengthWithBlouse,
      categoryId,
      images,
      isFeatured,
      isBestSeller,
      stock,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required for editing.' }, { status: 400 });
    }

    const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

    const product = await prisma.product.update({
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
        ...(lengthWithBlouse && { lengthWithBlouse }),
        ...(categoryId && { categoryId }),
        ...(images !== undefined && { images: typeof images === 'string' ? images : JSON.stringify(images) }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isBestSeller !== undefined && { isBestSeller }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
      },
    });

    return NextResponse.json({ success: true, product });
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

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
