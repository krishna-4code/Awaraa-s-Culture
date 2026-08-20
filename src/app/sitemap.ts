import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/commerce/products';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  
  // Real product routes based on live Sanity handles
  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/products/${p.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticRoutes = [
    '',
    '/cart',
    '/login',
    '/privacy',
    '/terms',
    '/contact',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
