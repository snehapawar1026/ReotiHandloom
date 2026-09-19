import { NextRequest, NextResponse } from 'next/server';
import {
  getAllCategories,
  createCategoryInStore,
  updateCategoryInStore,
  deleteCategoryInStore,
} from '@/lib/storeManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parentOnly = searchParams.get('parentOnly') === 'true';
  const includeHidden = searchParams.get('includeHidden') === 'true';

  let allCats = getAllCategories() || [];
  if (!includeHidden) {
    allCats = allCats.filter((c) => !c.isHidden);
  }
  if (parentOnly) {
    allCats = allCats.filter((c) => c.isParent || !c.parentId);
  }

  return NextResponse.json(
    { success: true, categories: allCats },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Category name is required.' }, { status: 400 });
    }
    const newCategory = createCategoryInStore(body);
    return NextResponse.json({ success: true, category: newCategory });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Category ID is required.' }, { status: 400 });
    }
    const updatedCategory = updateCategoryInStore(body.id, body);
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
    deleteCategoryInStore(id);
    return NextResponse.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
