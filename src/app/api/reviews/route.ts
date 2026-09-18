import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStoreData, addReviewToStore } from '@/lib/storeManager';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    const storeData = getStoreData();
    const product = storeData.products.find((p) => p.id === productId);
    let reviews = (storeData.reviews || []).filter((r: any) => r.productId === productId);
    if (product && Array.isArray(product.reviews) && product.reviews.length > 0) {
      reviews = [...product.reviews, ...reviews.filter((r: any) => !product.reviews.some((pr: any) => pr.id === r.id))];
    }

    // Try Prisma DB fallback
    try {
      const dbReviews = await prisma.review.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc' },
      });
      if (dbReviews && dbReviews.length > 0) {
        reviews = dbReviews;
      }
    } catch (e) {}

    return NextResponse.json({ success: true, reviews: reviews || [] });
  } catch (error: any) {
    return NextResponse.json({ success: true, reviews: [] });
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

    // 1. Save in storeManager
    const review = addReviewToStore({
      productId,
      userName,
      author: userName,
      userEmail: userEmail || null,
      rating: parseInt(rating),
      comment,
      image: image || null,
    });

    const storeData = getStoreData();
    const updatedProd = storeData.products.find((p) => p.id === productId);
    const roundedRating = updatedProd?.rating || parseInt(rating);
    const totalCount = updatedProd?.reviewCount || 1;

    // 2. Try saving to Prisma DB in background
    try {
      await prisma.review.create({
        data: {
          id: review.id,
          productId,
          userName,
          userEmail: userEmail || null,
          rating: parseInt(rating),
          comment,
          image: image || null,
          verified: true,
        },
      });

      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: roundedRating,
          reviewCount: totalCount,
        },
      }).catch(() => {});
    } catch (prismaErr: any) {
      console.warn('[Reviews POST] Prisma notice:', prismaErr.message);
    }

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

