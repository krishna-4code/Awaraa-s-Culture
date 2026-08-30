import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/commerce/products';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  // Real product routes based on live Sanity handles
  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/products/${p.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Only routes with a real, functioning, indexable content page behind them.
  // Utility pages (/cart, /login) are intentionally excluded — /login has
  // noindex metadata and /cart is a client-only user-session page.
  // Every URL here must return HTTP 200.
  const staticRoutes = [
    '',
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