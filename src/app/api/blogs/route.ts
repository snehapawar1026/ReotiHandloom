import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogs, createBlogInStore } from '@/lib/storeManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let blogs = getAllBlogs();

    if (category && category !== 'ALL') {
      blogs = blogs.filter((b: any) => (b.category || '').toLowerCase() === category.toLowerCase());
    }

    if (featured === 'true') {
      blogs = blogs.filter((b: any) => Boolean(b.isFeatured));
    }

    return NextResponse.json(
      { success: true, blogs },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ success: false, error: 'Blog title is required' }, { status: 400 });
    }

    const savedBlog = createBlogInStore(body);
    return NextResponse.json({ success: true, blog: savedBlog });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
