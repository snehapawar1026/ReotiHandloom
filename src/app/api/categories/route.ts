import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getAllCategories,
  createCategoryInStore,
  updateCategoryInStore,
  deleteCategoryInStore,
} from '@/lib/storeManager';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parentOnly = searchParams.get('parentOnly') === 'true';
  const includeHidden = searchParams.get('includeHidden') === 'true';

  try {
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

    if (categories && categories.length > 0) {
      return NextResponse.json({ success: true, categories });
    }
  } catch (error: any) {
    console.warn('[FALLBACK] Serving categories from storeManager:', error.message);
  }

  let allCats = getAllCategories();
  if (!includeHidden) {
    allCats = allCats.filter((c) => !c.isHidden);
  }
  if (parentOnly) {
    allCats = allCats.filter((c) => c.isParent || !c.parentId);
  }

  return NextResponse.json({ success: true, categories: allCats });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Category name is required.' }, { status: 400 });
    }

    // 1. Save in storeManager
    const newCategory = createCategoryInStore(body);

    // 2. Try Prisma
    try {
      await prisma.category.create({
        data: {
          id: newCategory.id,
          name: newCategory.name,
          slug: newCategory.slug,
          description: newCategory.description,
          image: newCategory.image,
          bannerImage: newCategory.bannerImage,
          parentId: newCategory.parentId,
          isParent: newCategory.isParent,
          isHidden: newCategory.isHidden,
        },
      });
    } catch (prismaErr: any) {
      console.warn('[Category POST] Prisma notice:', prismaErr.message);
    }

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required.' }, { status: 400 });
    }

    // 1. Update in storeManager
    const updatedCategory = updateCategoryInStore(id, body);

    // 2. Try Prisma
    try {
      const { name, description, image, bannerImage, slug: customSlug, parentId, isParent, isHidden } = body;
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

      await prisma.category.update({
        where: { id },
        data: updateData,
      });
    } catch (prismaErr: any) {
      console.warn('[Category PUT] Prisma notice:', prismaErr.message);
    }

    return NextResponse.json({ success: true, category: updatedCategory });
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

    // 1. Delete in storeManager (will throw if products exist)
    deleteCategoryInStore(id);

    // 2. Try Prisma
    try {
      await prisma.category.delete({
        where: { id },
      });
    } catch (prismaErr: any) {
      console.warn('[Category DELETE] Prisma notice:', prismaErr.message);
    }

    return NextResponse.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
