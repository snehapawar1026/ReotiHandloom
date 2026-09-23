import { MetadataRoute } from 'next';
import { getStoreData } from '@/lib/storeManager';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reotihandloom.com';
  const data = getStoreData();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/wholesale`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/policies/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/policies/return-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/policies/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/policies/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Category URLs
  const categoryRoutes: MetadataRoute.Sitemap = (data.categories || [])
    .filter((c: any) => !c.isHidden && c.slug)
    .map((c: any) => ({
      url: `${baseUrl}/products?category=${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));

  // Dynamic Product URLs
  const productRoutes: MetadataRoute.Sitemap = (data.products || [])
    .filter((p: any) => !p.isHidden && (p.slug || p.id))
    .map((p: any) => ({
      url: `${baseUrl}/products/${p.slug || p.id}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: p.isFeatured || p.isBestSeller ? 0.9 : 0.8,
    }));

  // Dynamic Blog URLs
  const blogRoutes: MetadataRoute.Sitemap = (data.blogs || [])
    .filter((b: any) => b.published !== false && (b.slug || b.id))
    .map((b: any) => ({
      url: `${baseUrl}/blogs/${b.slug || b.id}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
