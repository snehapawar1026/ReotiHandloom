import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentic Maheshwari Sarees & Suits Collection | Reoti Handloom',
  description:
    'Shop authentic handcrafted Maheshwari Sarees, Silk-Cotton, Pure Silk, Tissue Zari, Katan Silk & Garbha Reshami directly from 3rd generation master weavers in Maheshwar. Free Express Shipping across India.',
  keywords: [
    'Buy Maheshwari Sarees Online',
    'Silk Cotton Maheshwari Sarees',
    'Pure Silk Sarees Maheshwar',
    'Tissue Zari Saree Online',
    'Garbha Reshami Sarees',
    'Handloom Sarees with Price',
    'Maheshwari Suits and Dress Materials',
    'Authentic Maheshwari Sarees Cash on Delivery',
  ],
  alternates: {
    canonical: 'https://reotihandloom.com/products',
  },
  openGraph: {
    title: 'Authentic Maheshwari Sarees Collection | Reoti Handloom',
    description:
      'Explore handwoven Maheshwari silk sarees crafted on traditional pit looms in Maheshwar. 100% certified authentic handloom.',
    url: 'https://reotihandloom.com/products',
    siteName: 'Reoti Handloom',
    type: 'website',
    images: [
      {
        url: 'https://reotihandloom.com/uploads/maheshwari_legacy_banner.png',
        width: 1200,
        height: 630,
        alt: 'Reoti Handloom Authentic Maheshwari Sarees Collection',
      },
    ],
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
