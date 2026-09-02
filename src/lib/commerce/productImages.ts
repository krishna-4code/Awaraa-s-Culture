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
  'sand-drift': [
    { url: '/shoes/sketchers/Gemini_Generated_Image_iptr9iptr9iptr9i.png', altText: "Awaraa's Culture Sand Drift running shoe in beige/cream, white cushioned sole" }
  ],
  'aero-tide': [
    { url: '/shoes/nb_sports/1.png', altText: "Awaraa's Culture Aero Tide performance runner in white with aqua sculpted sole, hero profile" },
    { url: '/shoes/nb_sports/2.jpeg', altText: "Awaraa's Culture Aero Tide runner, high-rebound EVA sole detail angle" },
    { url: '/shoes/nb_sports/3.jpeg', altText: "Awaraa's Culture Aero Tide runner, breathable mesh toe box top angle" },
    { url: '/shoes/nb_sports/4.jpeg', altText: "Awaraa's Culture Aero Tide runner, heel support and tread grip angle" }
  ],
  'dune-runner': [
    { url: '/shoes/nb_sneakers/1.png', altText: "Awaraa's Culture Dune Runner cream/white retro low-top, grey suede overlays, gum sole" }
  ],
  'cocoa-drift': [
    { url: '/shoes/dunks/Gemini_Generated_Image_upq1p1upq1p1upq1.png', altText: "Awaraa's Culture Cocoa Drift retro sneaker in cream/off-white with dark brown accent, front hero view" },
    { url: '/shoes/dunks/WhatsApp Image 2026-08-18 at 6.51.46 PM.jpeg', altText: "Awaraa's Culture Cocoa Drift, studio angle" },
    { url: '/shoes/dunks/WhatsApp Image 2026-08-18 at 6.51.46 PM (1).jpeg', altText: "Awaraa's Culture Cocoa Drift, side profile showing dual-density EVA outsole" }
  ],
  'earthline': [
    { url: '/shoes/waffel_brown/Gemini_Generated_Image_wosh4ywosh4ywosh.png', altText: "Awaraa's Culture Earthline tan/brown retro sneaker with dark swoosh-like side accent and gum sole" }
  ],
  'shadow-crest': [
    { url: '/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.46 PM.jpeg', altText: "Awaraa's Culture Shadow Crest black/grey low-top, suede overlays, chunky classic sole" },
    { url: '/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.47 PM.jpeg', altText: "Awaraa's Culture Shadow Crest, lateral side profile with monogram paneling" },
    { url: '/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.47 PM (1).jpeg', altText: "Awaraa's Culture Shadow Crest, close-up heel and cushioned cupsole angle" }
  ],
  'midnight-flow': [
    { url: '/shoes/brooks/Gemini_Generated_Image_7ol72i7ol72i7ol7.png', altText: "Awaraa's Culture Midnight Flow black performance runner, blue accent, chunky white cushioning" }
  ],
  'moss-velocity': [
    { url: '/shoes/sports/1.jpeg', altText: "Awaraa's Culture Moss Velocity sage/olive green performance runner with futuristic sole" },
    { url: '/shoes/sports/2.jpeg', altText: "Awaraa's Culture Moss Velocity runner, ultra-flexible EVA sole perspective" },
    { url: '/shoes/sports/3.jpeg', altText: "Awaraa's Culture Moss Velocity runner, slip-on knit collar detail" },
    { url: '/shoes/sports/4.jpeg', altText: "Awaraa's Culture Moss Velocity runner, rear traction grip angle" }
  ]
};

function normalizeText(text?: string): string {
  return (text || '').toLowerCase().trim();
}

/**
 * Match specific shoe key without false substring collisions (e.g. 'moss-velocity' vs 'aero-tide').
 */
export function matchShoeKey(handleOrId: string, nameOrTitle: string): string | null {
  const h = normalizeText(handleOrId);
  const n = normalizeText(nameOrTitle);

  // 1. Recommended Name & Handle matches
  if (h === 'sand-drift' || n.includes('sand drift') || h === 'sketchers-sports' || h === 'skechers-sports' || h === 'sketchers' || h === 'skechers' || n.includes('sketcher') || n.includes('skecher')) {
    return 'sand-drift';
  }
  if (h === 'aero-tide' || n.includes('aero tide') || h === 'nb-sports' || (n.includes('nb') && n.includes('sport')) || n.includes('new balance sport')) {
    return 'aero-tide';
  }
  if (h === 'dune-runner' || n.includes('dune runner') || h === 'nb-sneakers' || (n.includes('nb') && n.includes('sneaker')) || n.includes('new balance sneaker')) {
    return 'dune-runner';
  }
  if (h === 'cocoa-drift' || n.includes('cocoa drift') || h === 'sb-dunks' || h === 'dunks' || n.includes('dunk')) {
    return 'cocoa-drift';
  }
  if (h === 'earthline' || n.includes('earthline') || h === 'waffle-brown' || h.includes('waffel') || h.includes('waffle') || n.includes('waffle') || n.includes('waffel')) {
    return 'earthline';
  }
  if (h === 'shadow-crest' || n.includes('shadow crest') || h === 'lv-sneakers' || h === 'lv' || n.includes('lv') || n.includes('louis')) {
    return 'shadow-crest';
  }
  if (h === 'midnight-flow' || n.includes('midnight flow') || h === 'brooks' || n.includes('brook')) {
    return 'midnight-flow';
  }
  if (h === 'moss-velocity' || n.includes('moss velocity') || h === 'sports' || n === 'sports' || n === 'sport' || n === 'daily sports') {
    return 'moss-velocity';
  }

  // 2. Exact key match fallback
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
  if (!product) return SHOE_GALLERIES['aero-tide'];

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

  return SHOE_GALLERIES['aero-tide'];
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

