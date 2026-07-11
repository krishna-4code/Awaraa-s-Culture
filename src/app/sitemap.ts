import { MetadataRoute } from 'next';
import { getCollection } from '@/lib/commerce';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getCollection();
  
  // We don't have a getProducts list function yet, but in a real app
  // we would fetch all product slugs here. For now we will mock it 
  // based on the categories since our mock API maps handles exactly.
  const productRoutes = categories.map((cat) => ({
    url: `${SITE_URL}/products/${cat.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticRoutes = [
    '',
    '/about',
    '/story',
    '/contact',
    '/privacy',
    '/terms',
    '/faq'
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.5,
  }));

  return [...staticRoutes, ...productRoutes];
}
