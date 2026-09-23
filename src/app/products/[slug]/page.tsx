import type { Metadata } from 'next';
import { getProductBySlugOrId } from '@/lib/storeManager';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlugOrId(slug);

  if (!product) {
    return {
      title: 'Maheshwari Handloom Collection | Reoti Handloom',
      description: 'Explore authentic handwoven Maheshwari sarees and suits directly from weavers of Maheshwar.',
    };
  }

  const parsedImages: string[] = JSON.parse(product.images || '[]');
  const primaryImage = parsedImages[0] || '/logo.jpg';
  const absoluteImageUrl = primaryImage.startsWith('http')
    ? primaryImage
    : `https://reotihandloom.com${primaryImage}`;

  const title = `${product.title} - Reoti Handloom`;
  const description = `₹${product.price.toLocaleString()} • Authentic ${product.fabric || 'Maheshwari Handloom'} ${
    product.color ? `(${product.color})` : ''
  }. Handcrafted with traditional Zari border directly from Maheshwar looms. Free Express Shipping!`;

  return {
    title,
    description,
    openGraph: {
      title: `${product.title} | ₹${product.price.toLocaleString()}`,
      description,
      url: `https://reotihandloom.com/products/${product.slug || slug}`,
      siteName: 'Reoti Handloom',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 800,
          alt: product.title,
          type: absoluteImageUrl.endsWith('.png') ? 'image/png' : 'image/jpeg',
        },
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | ₹${product.price.toLocaleString()}`,
      description,
      images: [absoluteImageUrl],
    },
    other: {
      'og:image:secure_url': absoluteImageUrl,
      'image': absoluteImageUrl,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlugOrId(slug);

  return <ProductDetailClient initialProduct={product} slug={slug} />;
}
