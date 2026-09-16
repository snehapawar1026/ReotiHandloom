import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import storeData from '@/data/storeData.json';

const DEFAULT_POSTS = storeData.instaPosts || [];

const getInstaModel = () => {
  try {
    return (prisma as any)?.instaPost || (prisma as any)?.InstaPost;
  } catch (e) {
    return null;
  }
};

export async function GET() {
  // 1. Try fetching via Meta Instagram Graph API if INSTAGRAM_ACCESS_TOKEN is configured in environment
  const token = process.env.INSTAGRAM_ACCESS_TOKEN || process.env.INSTAGRAM_TOKEN;
  if (token) {
    try {
      const graphRes = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count&access_token=${token}&limit=12`,
        { next: { revalidate: 3600 } }
      );
      if (graphRes.ok) {
        const graphData = await graphRes.json();
        if (graphData.data && graphData.data.length > 0) {
          const apiPosts = graphData.data.map((item: any) => ({
            id: item.id,
            handle: 'reoti_handloom',
            image: item.media_url || item.thumbnail_url,
            postUrl: item.permalink || 'https://www.instagram.com/reoti_handloom',
            caption: item.caption || 'Maheshwari Handloom Saree • @reoti_handloom',
            likes: item.like_count ? item.like_count.toLocaleString() : '1,840',
          }));
          return NextResponse.json({ success: true, posts: apiPosts, source: 'instagram-api' });
        }
      }
    } catch (err) {
      console.error('Instagram Graph API fetch error:', err);
    }
  }

  // 2. Try fetching database posts configured by seller in admin panel
  try {
    const model = getInstaModel();
    if (model) {
      const dbPosts = await model.findMany({
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ],
      });

      if (dbPosts && dbPosts.length > 0) {
        return NextResponse.json({ success: true, posts: dbPosts, source: 'database' });
      }
    }
  } catch (err) {
    // Database query failed, proceed to live Instagram fetch
  }

  // 3. Try fetching live Instagram public feed for @reoti_handloom
  try {
    const instaRes = await fetch('https://www.instagram.com/reoti_handloom/?__a=1&__d=dis', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache live feed for 1 hour
    });

    if (instaRes.ok) {
      const data = await instaRes.json();
      const edges = data?.graphql?.user?.edge_owner_to_timeline_media?.edges;

      if (edges && edges.length > 0) {
        const livePosts = edges.slice(0, 8).map((edge: any) => ({
          id: edge.node.id,
          handle: 'reoti_handloom',
          image: edge.node.display_url || edge.node.thumbnail_src,
          postUrl: `https://www.instagram.com/p/${edge.node.shortcode}/`,
          caption: edge.node.edge_media_to_caption?.edges[0]?.node?.text || 'Maheshwari Handloom Saree • @reoti_handloom',
          likes: (edge.node.edge_liked_by?.count || 1840).toLocaleString(),
        }));

        return NextResponse.json({ success: true, posts: livePosts, source: 'instagram-live' });
      }
    }
  } catch (err) {
    console.error('Instagram live fetch notice:', err);
  }

  // 4. Fallback to authentic default posts
  return NextResponse.json({ success: true, posts: DEFAULT_POSTS, source: 'default' });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { image, caption, likes, postUrl } = body;

    if (!postUrl && !image) {
      return NextResponse.json({ success: false, error: 'Instagram Post URL or Image is required' }, { status: 400 });
    }

    // Auto scrape details if postUrl is provided and image/caption are missing or default
    if (postUrl && (!image || !caption)) {
      try {
        const scrapeRes = await fetch(postUrl, {
          headers: {
            'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          },
        });
        if (scrapeRes.ok) {
          const html = await scrapeRes.text();
          const ogImg = html.match(/<meta property="og:image" content="([^"]+)"/i);
          const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/i);

          if (ogImg && !image) {
            const cdnUrl = ogImg[1].replace(/&amp;/g, '&');
            try {
              const imgRes = await fetch(cdnUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
              });
              if (imgRes.ok) {
                const buffer = Buffer.from(await imgRes.arrayBuffer());
                const fs = require('fs');
                const path = require('path');
                const filename = `real_insta_${Date.now()}.jpg`;
                const savePath = path.join(process.cwd(), 'public/uploads', filename);
                fs.writeFileSync(savePath, buffer);
                image = `/uploads/${filename}`;
              } else {
                image = cdnUrl;
              }
            } catch (err) {
              image = cdnUrl;
            }
          }

          if (ogDesc && !caption) {
            const rawDesc = ogDesc[1].replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
            const likesMatch = rawDesc.match(/([0-9,]+)\s+likes/i);
            if (likesMatch && (!likes || likes === '1,850')) {
              likes = likesMatch[1];
            }
            caption = rawDesc.split('- reoti_handloom')[1] || rawDesc;
            caption = caption.replace(/^[^:]*:\s*/, '').trim();
          }
        }
      } catch (err) {
        console.error('Scrape error:', err);
      }
    }

    if (!image) {
      image = '/uploads/saree_1789062703690_a4mpx.jpeg';
    }
    if (!caption) {
      caption = 'Maheshwari Handloom Saree • @reoti_handloom';
    }

    const model = getInstaModel();
    if (!model) {
      return NextResponse.json({ success: false, error: 'InstaPost database model not initialized' }, { status: 500 });
    }

    const post = await model.create({
      data: {
        handle: 'reoti_handloom',
        image,
        caption,
        likes: likes || '1,850',
        postUrl: postUrl || 'https://www.instagram.com/reoti_handloom',
      },
    });

    return NextResponse.json({ success: true, post });
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

    const model = getInstaModel();
    if (model) {
      await model.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
