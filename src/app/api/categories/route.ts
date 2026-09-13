import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parentOnly = searchParams.get('parentOnly') === 'true';
    const includeHidden = searchParams.get('includeHidden') === 'true';

    const where: any = {};
    if (!includeHidden) {
      where.OR = [
        { isHidden: false },
        { isHidden: null },
      ];
    }

    if (parentOnly) {
      where.AND = [
        {
          OR: [
            { isParent: true },
            { parentId: null },
          ],
        },
      ];
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        children: true,
        parent: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    try {
      const categories = await prisma.category.findMany({
        where: { parentId: null },
        include: {
          children: true,
          parent: true,
          _count: {
            select: { products: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
      return NextResponse.json({ success: true, categories });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, image, bannerImage, slug: customSlug, parentId, isParent, isHidden } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Category name is required.' }, { status: 400 });
    }

    const slug = (customSlug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        bannerImage: bannerImage || null,
        parentId: parentId || null,
        isParent: isParent ?? !parentId,
        isHidden: isHidden ?? false,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, description, image, bannerImage, slug: customSlug, parentId, isParent, isHidden } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required.' }, { status: 400 });
    }

    const updateData: any = {};
    if (name) {
      updateData.name = name;
      updateData.slug = (customSlug || name)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (bannerImage !== undefined) updateData.bannerImage = bannerImage;
    if (parentId !== undefined) updateData.parentId = parentId;
    if (isParent !== undefined) updateData.isParent = isParent;
    if (isHidden !== undefined) updateData.isHidden = isHidden;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required.' }, { status: 400 });
    }

    const count = await prisma.product.count({
      where: { categoryId: id },
    });

    if (count > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete category: ${count} saree product(s) are currently assigned to this category. Please reassign or remove those products first.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
