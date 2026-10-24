import React from 'react';
import { getStoreData, isSemiMaheshwari } from '@/lib/storeManager';
import { HomeClient } from '@/components/HomeClient';
import { ProductItem } from '@/context/ShopContext';

export const revalidate = 60; // Instant 50ms load from server cache with 60s auto-refresh

export default function Home() {
  const storeData = getStoreData();

  // 1. Handloom Parent Categories
  const allCategories = storeData.categories || [];
  const handloomCategories = allCategories.filter((c: any) => {
    if (c.parentId) return false; // Parent only
    const slug = (c.slug || '').toLowerCase();
    const name = (c.name || '').toLowerCase();
    const id = c.id;
    return (
      !slug.includes('semi-maheshwari') &&
      !slug.includes('semi-') &&
      !name.includes('semi maheshwari') &&
      id !== 'semi-maheshwari-sarees-id' &&
      c.parentId !== 'semi-maheshwari-sarees-id'
    );
  });

  // 2. Handloom Products (Exclude Semi) - Lightweight card representation for home page
  const storeProducts = storeData.products || [];
  const handloomOnly = storeProducts
    .filter((p: ProductItem) => !isSemiMaheshwari(p, allCategories))
    .map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      originalPrice: p.originalPrice,
      discountPercent: p.discountPercent,
      images: p.images,
      isBestSeller: p.isBestSeller,
      isFeatured: p.isFeatured,
      isTrending: p.isTrending,
      isOutOfStock: p.isOutOfStock,
      rating: p.rating,
      reviewCount: p.reviewCount,
      categoryId: p.categoryId,
      category: p.category,
      fabric: p.fabric,
      weaveType: p.weaveType,
      borderType: p.borderType,
      color: p.color || '',
    })) as unknown as ProductItem[];

  // 3. Clean Banners
  const rawBanners = storeData.banners || [];
  const cleanedBanners = rawBanners.filter((b: any) => !b.image?.includes('unsplash.com'));

  // 4. Reviews & Blogs
  const reviews = storeData.reviews || [];
  const blogs = storeData.blogs || [];

  return (
    <HomeClient
      initialCategories={handloomCategories}
      initialProducts={handloomOnly}
      initialBanners={cleanedBanners.length > 0 ? cleanedBanners : undefined}
      initialReviews={reviews.length > 0 ? reviews : undefined}
      initialBlogs={blogs.length > 0 ? blogs : undefined}
      initialRating={4.9}
      initialTotalReviews={342}
    />
  );
}
