import { NextRequest, NextResponse } from 'next/server';
import { getBlogBySlugOrId, updateBlogInStore, deleteBlogInStore, getAllBlogs } from '@/lib/storeManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const blog = getBlogBySlugOrId(slug);

    if (!blog) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }

    const all = getAllBlogs();
    const relatedBlogs = all.filter((b: any) => b.id !== blog.id).slice(0, 3);

    return NextResponse.json(
      { success: true, blog, relatedBlogs },
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

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const existing = getBlogBySlugOrId(slug);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }

    const body = await req.json();
    const updated = updateBlogInStore(existing.id, body);
    return NextResponse.json({ success: true, blog: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const existing = getBlogBySlugOrId(slug);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }

    deleteBlogInStore(existing.id);
    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
