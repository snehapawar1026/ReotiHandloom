import { NextResponse } from 'next/server';
import storeData from '@/data/storeData.json';

const DEFAULT_POSTS = storeData.instaPosts || [];

export async function GET() {
  return NextResponse.json({ success: true, posts: DEFAULT_POSTS, source: 'default' });
}

import { getStoreData, saveStoreData } from '@/lib/storeManager';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { image, caption, likes, postUrl } = body;

    const data = getStoreData();
    const newPost = {
      id: 'insta_' + Date.now(),
      handle: 'reoti_handloom',
      image: image || '/uploads/saree_1789062703690_a4mpx.jpeg',
      caption: caption || 'Maheshwari Handloom Saree • @reoti_handloom',
      likes: likes || '1,850',
      postUrl: postUrl || 'https://www.instagram.com/reoti_handloom',
      createdAt: new Date().toISOString(),
    };

    const updatedPosts = [newPost, ...(data.instaPosts || [])];
    saveStoreData({ instaPosts: updatedPosts });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    const data = getStoreData();
    const updatedPosts = (data.instaPosts || []).filter((p: any) => p.id !== id);
    saveStoreData({ instaPosts: updatedPosts });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

