import { CommerceProduct } from './types';
import { sanityClient } from '@/sanity/client';
import { urlForImage } from '@/sanity/image';
import { findMockProduct, MOCK_PRODUCTS } from './mockData';

const SINGLE_PRODUCT_QUERY = `
  *[_type == "product" && (slug.current == $handle || _id == $handle) && !isPlaceholder][0] {
    _id,
    name,
    "handle": slug.current,
    price,
    description,
    materials,
    shippingPolicy,
    returnPolicy,
    careInstructions,
    variants[] {
      _key,
      size,
      color,
      colorHex,
      stock
    },
    images[] {
      asset,
      alt
    },
    "collectionSlug": collection->slug.current
  }
`;

const ALL_PRODUCTS_QUERY = `
  *[_type == "product" && !isPlaceholder] | order(_createdAt desc) {
    _id,
    name,
    "handle": slug.current,
    price,
    description,
    materials,
    shippingPolicy,
    returnPolicy,
    careInstructions,
    variants[] {
      _key,
      size,
      color,
      colorHex,
      stock
    },
    images[] {
      asset,
      alt
    },
    "collectionSlug": collection->slug.current
  }
`;

function mapSanityProduct(doc: any): CommerceProduct {
  const handle = doc.handle || doc._id || 'unknown';
  const mockFallback = findMockProduct(handle) || findMockProduct(doc.name);

  let images = (doc.images || []).map((img: any) => {
    let url = '';
    try {
      url = img?.asset ? urlForImage(img.asset).url() : '';
    } catch {
      url = '';
    }
    return {
      url: url,
      altText: img?.alt || doc.name || 'Product Image',
    };
  }).filter((img: { url: string }) => Boolean(img.url));

  if (images.length === 0 && mockFallback && mockFallback.images.length > 0) {
    images = mockFallback.images;
  }

  const variants = (doc.variants || []).map((v: any) => {
    // IMPORTANT: default to 0 (out of stock) if stock is undefined/null.
    // Defaulting to a non-zero value would show sold-out items as available.
    const stock = typeof v.stock === 'number' ? v.stock : 0;
    const title = v.color ? `${v.size || 'Standard'} / ${v.color}` : v.size || 'Standard';
    // IMPORTANT: namespace the variant ID with the product handle so it's globally unique
    const rawKey = v._key || `${v.size}_${v.color}`;
    const variantId = `${handle}__${rawKey}`;
    return {
      id: variantId,
      title,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex,
      stock,
      available: stock > 0,
    };
  });

  // Fallback variant if none configured in CMS
  if (variants.length === 0) {
    variants.push({
      id: `${handle}__default`,
      title: 'Standard',
      available: true,
    });
  }

  const formattedPrice = typeof doc.price === 'number'
    ? `₹${doc.price.toLocaleString('en-IN')}`
    : doc.price || '₹2,999';

  return {
    // Use handle as canonical ID (not Sanity's _id) so cart matching is always consistent
    id: handle,
    handle: handle,
    // _sanityId is the actual Sanity document _id — used by inventory operations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _sanityId: doc._id,
    name: doc.name,
    price: formattedPrice,
    description: doc.description || '',
    materials: doc.materials || ['Full-grain leather', 'Dual-density EVA midsole', 'Rubber outsole'],
    variants,
    images: images.length > 0 ? images : (mockFallback?.images || [
      {
        url: '/shoes/nb_sports/Gemini_Generated_Image_1h2b5y1h2b5y1h2b.png',
        altText: doc.name,
      }
    ]),
    shippingPolicy: doc.shippingPolicy || 'Free shipping across India on prepaid orders.',
    returnPolicy: doc.returnPolicy || '14-day returns for unworn products.',
    careInstructions: doc.careInstructions || 'Wipe clean with a damp cloth. Avoid direct heat.',
    collectionSlug: doc.collectionSlug,
  };
}

export async function getProduct(handle: string): Promise<CommerceProduct | null> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

  if (projectId && projectId !== 'your_sanity_project_id' && projectId !== 'placeholder') {
    try {
      // next.tags allows revalidateTag('products') to purge this cache after inventory changes
      const doc = await sanityClient.fetch(SINGLE_PRODUCT_QUERY, { handle }, {
        next: { tags: ['products', `product-${handle}`], revalidate: 60 }
      });
      if (doc) {
        return mapSanityProduct(doc);
      }
    } catch (e) {
      console.warn(`[Sanity] Failed to fetch product "${handle}", checking mock catalog:`, e);
    }
  } else {
    console.warn(`[Commerce] NEXT_PUBLIC_SANITY_PROJECT_ID not configured. Using local mock product for "${handle}".`);
  }

  // Explicit fallback to local catalog when Sanity is not connected or document not found
  const mock = findMockProduct(handle);
  return mock || null;
}

export async function getProducts(): Promise<CommerceProduct[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

  if (projectId && projectId !== 'your_sanity_project_id' && projectId !== 'placeholder') {
    try {
      const docs = await sanityClient.fetch(ALL_PRODUCTS_QUERY, {}, {
        next: { tags: ['products'], revalidate: 60 }
      });
      if (Array.isArray(docs) && docs.length > 0) {
        return docs.map(mapSanityProduct);
      }
    } catch (e) {
      console.warn('[Sanity] Failed to fetch product listings, falling back to mock catalog:', e);
    }
  } else {
    console.warn('[Commerce] NEXT_PUBLIC_SANITY_PROJECT_ID not configured. Using mock product catalog.');
  }

  return MOCK_PRODUCTS;
}
