/**
 * src/lib/commerce/productImages.ts
 *
 * Centralized product image resolver for Awaraa's Culture.
 * Ensures the exact, correct first image and gallery for each shoe are always displayed
 * in shoe cards, detail pages, cart drawers, cart pages, and order summaries.
 */

export interface ProductImageItem {
  url: string;
  altText: string;
}

export const SHOE_GALLERIES: Record<string, ProductImageItem[]> = {
  'sketchers-sports': [
    { url: '/shoes/sketchers/Gemini_Generated_Image_iptr9iptr9iptr9i.png', altText: 'Sketchers Sports - Hero View' }
  ],
  'nb-sports': [
    { url: '/shoes/nb_sports/1.png', altText: 'NB Sports - Angle 1' },
    { url: '/shoes/nb_sports/2.jpeg', altText: 'NB Sports - Angle 2' },
    { url: '/shoes/nb_sports/3.jpeg', altText: 'NB Sports - Angle 3' },
    { url: '/shoes/nb_sports/4.jpeg', altText: 'NB Sports - Angle 4' }
  ],
  'nb-sneakers': [
    { url: '/shoes/nb_sneakers/1.png', altText: 'NB Sneakers - Hero Angle' }
  ],
  'sb-dunks': [
    { url: '/shoes/dunks/Gemini_Generated_Image_upq1p1upq1p1upq1.png', altText: 'SB Dunks - Front Hero View' },
    { url: '/shoes/dunks/WhatsApp Image 2026-08-18 at 6.51.46 PM.jpeg', altText: 'SB Dunks - Studio Angle' },
    { url: '/shoes/dunks/WhatsApp Image 2026-08-18 at 6.51.46 PM (1).jpeg', altText: 'SB Dunks - Side Profile' }
  ],
  'waffle-brown': [
    { url: '/shoes/waffel_brown/Gemini_Generated_Image_wosh4ywosh4ywosh.png', altText: 'Waffle Brown - Hero Profile' }
  ],
  'lv-sneakers': [
    { url: '/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.46 PM.jpeg', altText: 'LV Sneakers - Studio View' },
    { url: '/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.47 PM.jpeg', altText: 'LV Sneakers - Side Profile' },
    { url: '/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.47 PM (1).jpeg', altText: 'LV Sneakers - Detail Angle' }
  ],
  'brooks': [
    { url: '/shoes/brooks/Gemini_Generated_Image_7ol72i7ol72i7ol7.png', altText: 'Brooks - Hero Studio Angle' }
  ],
  'sports': [
    { url: '/shoes/sports/1.jpeg', altText: 'Sports - Angle 1' },
    { url: '/shoes/sports/2.jpeg', altText: 'Sports - Angle 2' },
    { url: '/shoes/sports/3.jpeg', altText: 'Sports - Angle 3' },
    { url: '/shoes/sports/4.jpeg', altText: 'Sports - Angle 4' }
  ]
};

function normalizeText(text?: string): string {
  return (text || '').toLowerCase().trim();
}

/**
 * Match specific shoe key without false substring collisions (e.g. 'sports' vs 'sketchers-sports').
 */
export function matchShoeKey(handleOrId: string, nameOrTitle: string): string | null {
  const h = normalizeText(handleOrId);
  const n = normalizeText(nameOrTitle);

  // 1. Specific multi-word or distinct brand names first
  if (h === 'sketchers-sports' || h === 'sketchers' || n.includes('sketcher') || n.includes('skecher')) {
    return 'sketchers-sports';
  }
  if (h === 'nb-sports' || (n.includes('nb') && n.includes('sport')) || n.includes('new balance sport')) {
    return 'nb-sports';
  }
  if (h === 'nb-sneakers' || (n.includes('nb') && n.includes('sneaker')) || n.includes('new balance sneaker')) {
    return 'nb-sneakers';
  }
  if (h === 'sb-dunks' || h === 'dunks' || n.includes('dunk')) {
    return 'sb-dunks';
  }
  if (h === 'waffle-brown' || h.includes('waffel') || h.includes('waffle') || n.includes('waffle') || n.includes('waffel')) {
    return 'waffle-brown';
  }
  if (h === 'lv-sneakers' || h === 'lv' || n.includes('lv') || n.includes('louis')) {
    return 'lv-sneakers';
  }
  if (h === 'brooks' || n.includes('brook')) {
    return 'brooks';
  }
  
  // 2. Pure standalone 'sports' only (when it is NOT Sketchers or NB)
  if (h === 'sports' || n === 'sports' || n === 'sport' || n === 'daily sports') {
    return 'sports';
  }

  // 3. Exact key match fallback
  for (const key of Object.keys(SHOE_GALLERIES)) {
    if (h === key) return key;
    const normalizedKey = key.replace(/[-_]/g, ' ');
    if (n === normalizedKey) return key;
  }

  return null;
}

/**
 * Resolves full gallery of images for a shoe card or detail page.
 */
export function getProductGalleryImages(product: {
  id?: string;
  handle?: string;
  name?: string;
  title?: string;
  images?: Array<{ url: string; altText?: string }>;
  image?: string;
} | null | undefined): ProductImageItem[] {
  if (!product) return SHOE_GALLERIES['nb-sports'];

  const nameOrTitle = product.name || product.title || '';
  const handleOrId = product.handle || product.id || '';

  // 1. If product has real custom Sanity CDN images, use them
  if (product.images && product.images.length > 0) {
    const validCdnImages = product.images.filter(
      img => img.url && (img.url.startsWith('http') || img.url.startsWith('https://cdn.sanity.io'))
    );
    if (validCdnImages.length > 0) {
      return validCdnImages.map(img => ({
        url: img.url,
        altText: img.altText || product.name || product.title || 'Product Image'
      }));
    }
  }

  // 2. Look up matching shoe gallery by handle or name
  const matchedKey = matchShoeKey(handleOrId, nameOrTitle);
  if (matchedKey && SHOE_GALLERIES[matchedKey]) {
    return SHOE_GALLERIES[matchedKey];
  }

  // 3. If product has direct local images array that are valid and non-placeholder
  if (product.images && product.images.length > 0) {
    const validLocalImages = product.images.filter(
      img => img.url && !img.url.includes('placeholder')
    );
    if (validLocalImages.length > 0) {
      return validLocalImages.map(img => ({
        url: img.url,
        altText: img.altText || product.name || product.title || 'Product Image'
      }));
    }
  }

  // 4. Single image property fallback
  if (product.image) {
    return [{ url: product.image, altText: product.name || product.title || 'Product Image' }];
  }

  return SHOE_GALLERIES['nb-sports'];
}

/**
 * Resolves the primary first image URL for a shoe.
 */
export function getProductPrimaryImage(product: {
  id?: string;
  handle?: string;
  name?: string;
  title?: string;
  images?: Array<{ url: string; altText?: string }>;
  image?: string;
} | null | undefined): string {
  const gallery = getProductGalleryImages(product);
  return gallery[0]?.url || '/shoes/nb_sports/1.png';
}
