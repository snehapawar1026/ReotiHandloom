import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, userName, userEmail, rating, comment, image } = body;

    if (!productId || !userName || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Please provide name, rating stars, and review comment.' },
        { status: 400 }
      );
    }

    // 1. Create the new review
    const review = await prisma.review.create({
      data: {
        productId,
        userName,
        userEmail: userEmail || null,
        rating: parseInt(rating),
        comment,
        image: image || null,
        verified: true,
      },
    });

    // 2. Fetch all reviews for this product to recalculate rating stats
    const allReviews = await prisma.review.findMany({
      where: { productId },
    });

    const totalCount = allReviews.length;
    const avgRating =
      allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalCount;
    const roundedRating = Math.round(avgRating * 10) / 10;

    // 3. Update the Product model with new rating & review count
    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: roundedRating,
        reviewCount: totalCount,
      },
    });

    return NextResponse.json({
      success: true,
      review,
      newRating: roundedRating,
      newReviewCount: totalCount,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
