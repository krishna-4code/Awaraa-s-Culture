import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { BRAND_NAME } from '@/lib/constants';

export function generatePageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title: `${title} — ${BRAND_NAME}`,
    description,
    alternates: {
      canonical: `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`,
    },
    openGraph: {
      title: `${title} — ${BRAND_NAME}`,
      description,
      url: `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`,
      siteName: BRAND_NAME,
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${BRAND_NAME}`,
      description,
    },
  };
}

export function generateProductMetadata(product: { name: string; description: string; handle: string; imageUrl?: string }): Metadata {
  // Ensure description is never empty — fall back to a branded sentence if Sanity field is blank.
  const description = product.description?.trim()
    ? product.description.length > 160
      ? product.description.slice(0, 157) + '...'
      : product.description
    : `Shop ${product.name} from ${BRAND_NAME} — street-tested footwear crafted for Delhi NCR. Honest comfort, zero hype markups, built for daily movement.`;

  return {
    title: `${product.name} — ${BRAND_NAME}`,
    description,
    alternates: {
      canonical: `${SITE_URL}/products/${product.handle}`,
    },
    openGraph: {
      title: `${product.name} — ${BRAND_NAME}`,
      description,
      url: `${SITE_URL}/products/${product.handle}`,
      siteName: BRAND_NAME,
      images: product.imageUrl ? [{ url: product.imageUrl, width: 1000, height: 1000, alt: product.name }] : [],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — ${BRAND_NAME}`,
      description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export function generateCollectionMetadata(collection: { title: string; description: string; handle: string; imageUrl?: string }): Metadata {
  const description = collection.description?.trim()
    ? collection.description
    : `Explore the ${collection.title} collection from ${BRAND_NAME}. Engineered for everyday movement with honest materials and real comfort.`;

  return {
    title: `${collection.title} — ${BRAND_NAME}`,
    description,
    alternates: {
      canonical: `${SITE_URL}/collections/${collection.handle}`,
    },
    openGraph: {
      title: `${collection.title} — ${BRAND_NAME}`,
      description,
      url: `${SITE_URL}/collections/${collection.handle}`,
      siteName: BRAND_NAME,
      images: collection.imageUrl ? [{ url: collection.imageUrl, width: 1200, height: 630, alt: collection.title }] : [],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${collection.title} — ${BRAND_NAME}`,
      description,
      images: collection.imageUrl ? [collection.imageUrl] : [],
    },
  };
}

