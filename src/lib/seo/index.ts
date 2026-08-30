import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

const SITE_NAME = "Awaraa's Culture";

export function generatePageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title: `${title} — ${SITE_NAME}`,
    description,
    alternates: {
      canonical: `${SITE_URL}${path}`,
    },
    openGraph: {
      title: `${title} — ${SITE_NAME}`,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${SITE_NAME}`,
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
    : `Shop ${product.name} from Awaraa's Culture — street-tested footwear crafted for Delhi NCR. Honest comfort, zero hype markups, built for daily movement.`;

  return {
    title: `${product.name} — ${SITE_NAME}`,
    description,
    alternates: {
      canonical: `${SITE_URL}/products/${product.handle}`,
    },
    openGraph: {
      title: `${product.name} — ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/products/${product.handle}`,
      siteName: SITE_NAME,
      images: product.imageUrl ? [{ url: product.imageUrl, width: 1000, height: 1000, alt: product.name }] : [],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — ${SITE_NAME}`,
      description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}
