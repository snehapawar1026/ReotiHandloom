import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getStoreData, getAllCategories, isSemiMaheshwari, isSuitProduct } from '@/lib/storeManager';
import { ProductsClient } from './ProductsClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Maheshwari Silk Sarees माहेश्वरी साड़ियाँ | Pure Silk Cotton Handloom Collection - Reoti Handloom',
  description:
    'Shop authentic handcrafted Maheshwari Silk Sarees, Pure Silk, Silk Cotton, Garbha Reshami, Tissue Zari & Bagh Print Sarees directly from 3rd generation master weavers in Maheshwar. Best Maheshwari Saree Price, Free Delivery & COD across India.',
  keywords: [
    'maheshwari silk sarees',
    'maheshwari saree',
    'maheshwari sarees',
    'maheshwari cotton silk saree',
    'pure maheshwari silk saree',
    'maheshwari saree price',
    'reshmi saree',
    'garbha reshami silk saree',
    'checks sarees',
    'checked saree',
    'bagh print saree',
    'bagh suits',
    'maheshwari silk suit',
    'tissue maheshwari saree',
    'silver border saree',
    'maheshwari silk dress material online',
    'maheshwar sarees',
    'महेश्वरी साड़ी',
    'Reoti Handloom Maheshwar',
  ],
  alternates: {
    canonical: 'https://reotihandloom.com/products',
  },
};

export default function ProductsPage() {
  const storeData = getStoreData();
  const allCategories = getAllCategories() || [];
  const parentCategories = allCategories.filter(
    (c: any) => (c.isParent || !c.parentId) && !c.isHidden
  );
  
  // Default store products strictly excluding Semi Maheshwari & Suits for the main view
  const storeProducts = storeData.products || [];
  const handloomProducts = storeProducts.filter((p: any) => {
    return !isSemiMaheshwari(p, allCategories) && !isSuitProduct(p, allCategories);
  });

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm font-serif font-bold text-[#581C1C]">
          Loading Maheshwari Handloom Collection...
        </div>
      }
    >
      <ProductsClient
        initialProducts={handloomProducts.length > 0 ? handloomProducts : storeProducts}
        initialCategories={allCategories.filter((c: any) => !c.isHidden)}
        initialParentCategories={parentCategories}
      />
    </Suspense>
  );
}
