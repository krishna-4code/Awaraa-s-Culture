import { Metadata } from 'next';

const SITE_NAME = "Awaraa's Culture";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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
  return {
    title: `${product.name} — ${SITE_NAME}`,
    description: product.description,
    alternates: {
      canonical: `${SITE_URL}/products/${product.handle}`,
    },
    openGraph: {
      title: `${product.name} — ${SITE_NAME}`,
      description: product.description,
      url: `${SITE_URL}/products/${product.handle}`,
      siteName: SITE_NAME,
      images: product.imageUrl ? [{ url: product.imageUrl, width: 1000, height: 1000, alt: product.name }] : [],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — ${SITE_NAME}`,
      description: product.description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}
