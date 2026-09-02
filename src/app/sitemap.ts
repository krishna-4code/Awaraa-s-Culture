import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/commerce/products';
import { getCollection } from '@/lib/commerce/collections';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollection(),
  ]);

  // Real product routes based on live Sanity handles / catalog
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/products/${p.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Collection / Category routes
  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${SITE_URL}/collections/${c.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Public indexable content & legal routes.
  // Private / utility pages (/cart, /login, /admin, /studio) are intentionally excluded.
  const staticRoutes: MetadataRoute.Sitemap = [
    { route: '', priority: 1.0, changeFrequency: 'daily' as const },
    { route: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { route: '/shipping', priority: 0.6, changeFrequency: 'monthly' as const },
    { route: '/returns', priority: 0.6, changeFrequency: 'monthly' as const },
    { route: '/privacy', priority: 0.5, changeFrequency: 'monthly' as const },
    { route: '/terms', priority: 0.5, changeFrequency: 'monthly' as const },
  ].map(({ route, priority, changeFrequency }) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}