import { CommerceProduct } from './types';

export const MOCK_PRODUCTS: CommerceProduct[] = [
  {
    id: "sb-dunks",
    handle: "sb-dunks",
    name: "SB Dunks",
    price: "₹2,999",
    description: "Iconic streetwear silhouette engineered for all-day urban movement. Dual-density cushioning and reinforced grip outer sole provide supreme stability.",
    materials: [
      "Full-grain premium leather and synthetic upper",
      "High-rebound EVA midsole for step-in comfort",
      "Anti-slip hexagonal rubber traction outsole",
      "Breathable padded mesh collar & lining"
    ],
    variants: [
      { id: "sb-dunks-uk7", title: "UK 7", available: true, size: "7", color: "White" },
      { id: "sb-dunks-uk8", title: "UK 8", available: true, size: "8", color: "White" },
      { id: "sb-dunks-uk9", title: "UK 9", available: true, size: "9", color: "White" },
      { id: "sb-dunks-uk10", title: "UK 10", available: true, size: "10", color: "White" },
      { id: "sb-dunks-uk11", title: "UK 11", available: true, size: "11", color: "White" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80",
        altText: "SB Dunks - Front Angle"
      },
      {
        url: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
        altText: "SB Dunks - Profile Shot"
      }
    ],
    shippingPolicy: "Free express shipping across India on all orders. Dispatched within 24 hours.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Wipe clean with a damp cloth. Use standard sneaker cleaner for scuffs. Air dry only."
  },
  {
    id: "awaraa-street-glide",
    handle: "awaraa-street-glide",
    name: "Awaraa Street Glide",
    price: "₹2,999",
    description: "Low-profile street silhouette crafted for everyday street wear. Minimalist profile engineered for flexible ankle motion and sustained durability.",
    materials: [
      "Premium suede and recycled canvas combination",
      "Flexible vulcanized natural rubber sole",
      "Ortho-comfort foam insole",
      "Reinforced double-stitched toe box"
    ],
    variants: [
      { id: "awaraa-street-glide-uk6", title: "UK 6", available: true, size: "6", color: "Black" },
      { id: "awaraa-street-glide-uk7", title: "UK 7", available: true, size: "7", color: "Black" },
      { id: "awaraa-street-glide-uk8", title: "UK 8", available: true, size: "8", color: "Black" },
      { id: "awaraa-street-glide-uk9", title: "UK 9", available: true, size: "9", color: "Black" },
      { id: "awaraa-street-glide-uk10", title: "UK 10", available: true, size: "10", color: "Black" },
      { id: "awaraa-street-glide-uk11", title: "UK 11", available: true, size: "11", color: "Black" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80",
        altText: "Awaraa Street Glide - Front Profile"
      },
      {
        url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
        altText: "Awaraa Street Glide - Profile Shot"
      },
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        altText: "Awaraa Street Glide - Detail View"
      }
    ],
    shippingPolicy: "Free express shipping across India on all orders. Dispatched within 24 hours.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Brush suede gently with a suede brush. Avoid submerging in water."
  },
  {
    id: "waffle-brown",
    handle: "waffle-brown",
    name: "Waffle Brown",
    price: "₹3,199",
    description: "Heritage runner styling reimagined in rich earthy tones. Features lightweight waffle-traction sole and breathable mesh panels for all-day comfort.",
    materials: [
      "Earth-tone nubuck suede and woven nylon mesh",
      "Classic waffle lug traction rubber sole",
      "Ergonomic shock-absorbing arch support insole",
      "Vintage-styled padded foam tongue"
    ],
    variants: [
      { id: "waffle-brown-uk7", title: "UK 7", available: true, size: "7", color: "Tan" },
      { id: "waffle-brown-uk8", title: "UK 8", available: true, size: "8", color: "Tan" },
      { id: "waffle-brown-uk9", title: "UK 9", available: true, size: "9", color: "Tan" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80",
        altText: "Waffle Brown - Profile Angle"
      },
      {
        url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
        altText: "Waffle Brown - Detail View"
      }
    ],
    shippingPolicy: "Free express shipping across India on all orders. Dispatched within 24 hours.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Wipe with damp cloth and use dedicated suede foam cleaner."
  },
  {
    id: "lv-sneakers",
    handle: "lv-sneakers",
    name: "LV Sneakers",
    price: "₹3,499",
    description: "High-end urban fashion sneaker blending runway aesthetics with robust street comfort. Monogram-accented panels and cushioned cupsole.",
    materials: [
      "Smooth micro-fiber leather with embossed texture",
      "Reinforced rubber cupsole with anti-abrasion tread",
      "Soft calfskin-touch interior lining",
      "Padded tongue with gold foil branding"
    ],
    variants: [
      { id: "lv-sneakers-uk7", title: "UK 7", available: true, size: "7", color: "White" },
      { id: "lv-sneakers-uk8", title: "UK 8", available: true, size: "8", color: "White" },
      { id: "lv-sneakers-uk9", title: "UK 9", available: true, size: "9", color: "White" },
      { id: "lv-sneakers-uk10", title: "UK 10", available: true, size: "10", color: "White" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80",
        altText: "LV Sneakers - Studio View"
      }
    ],
    shippingPolicy: "Free express shipping across India on all orders. Dispatched within 24 hours.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Wipe gently with leather cleaning wipe. Do not machine wash."
  },
  {
    id: "awaraa-pace-high",
    handle: "awaraa-pace-high",
    name: "Awaraa Pace High",
    price: "₹3,299",
    description: "High-top stability silhouette with breathable canvas upper, padded ankle collar, and ergonomic heel cushion for rougher surfaces.",
    materials: [
      "12oz heavy-duty organic canvas upper",
      "Ergonomic shock-absorbing heel counter",
      "High-grip chevron lugged rubber outsole",
      "Padded collar with heel pull-tab"
    ],
    variants: [
      { id: "awaraa-pace-high-uk6", title: "UK 6", available: true, size: "6", color: "Black" },
      { id: "awaraa-pace-high-uk7", title: "UK 7", available: true, size: "7", color: "Black" },
      { id: "awaraa-pace-high-uk8", title: "UK 8", available: true, size: "8", color: "Black" },
      { id: "awaraa-pace-high-uk9", title: "UK 9", available: true, size: "9", color: "Black" },
      { id: "awaraa-pace-high-uk10", title: "UK 10", available: true, size: "10", color: "Black" },
      { id: "awaraa-pace-high-uk11", title: "UK 11", available: true, size: "11", color: "Black" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80",
        altText: "Awaraa Pace High - Angle View"
      },
      {
        url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
        altText: "Awaraa Pace High - Side Shot"
      }
    ],
    shippingPolicy: "Free express shipping across India on all orders. Dispatched within 24 hours.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Spot clean canvas with mild soap. Air dry in shade."
  },
  {
    id: "nb-sports",
    handle: "nb-sports",
    name: "NB Sports",
    price: "₹3,499",
    description: "Athletic lifestyle runner engineered with lightweight breathable mesh, shock-dampening heel cup, and multi-surface grip.",
    materials: [
      "Technical breathable sport mesh with synthetic overlays",
      "High-rebound molded EVA foam midsole",
      "Durable non-marking rubber outsole",
      "Removable contoured orthotic footbed"
    ],
    variants: [
      { id: "nb-sports-uk7", title: "UK 7", available: true, size: "7", color: "White" },
      { id: "nb-sports-uk8", title: "UK 8", available: true, size: "8", color: "White" },
      { id: "nb-sports-uk9", title: "UK 9", available: true, size: "9", color: "White" },
      { id: "nb-sports-uk10", title: "UK 10", available: true, size: "10", color: "White" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80",
        altText: "NB Sports - Hero Angle"
      }
    ],
    shippingPolicy: "Free express shipping across India on all orders. Dispatched within 24 hours.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Hand wash with mild detergent. Air dry naturally."
  }
];

export function findMockProduct(identifier: string): CommerceProduct | undefined {
  if (!identifier) return undefined;
  const normalized = identifier.toLowerCase().trim();
  return MOCK_PRODUCTS.find(p => 
    p.id.toLowerCase() === normalized || 
    p.handle.toLowerCase() === normalized ||
    p.name.toLowerCase() === normalized ||
    p.variants.some(v => v.id.toLowerCase() === normalized)
  );
}

export function findMockVariant(variantOrProductId: string): { product: CommerceProduct; variant: { id: string; title: string; available: boolean } } | undefined {
  if (!variantOrProductId) return undefined;
  const normalized = variantOrProductId.toLowerCase().trim();
  
  // 1. Try matching variant id directly
  for (const product of MOCK_PRODUCTS) {
    const variant = product.variants.find(v => v.id.toLowerCase() === normalized);
    if (variant) {
      return { product, variant };
    }
  }

  // 2. If not matched by variant id, match product by id/handle/name
  const product = findMockProduct(variantOrProductId);
  if (product && product.variants.length > 0) {
    const defaultVariant = product.variants.find(v => v.title === 'UK 8') || product.variants[0];
    return { product, variant: defaultVariant };
  }

  // 3. Try partial prefix match
  for (const product of MOCK_PRODUCTS) {
    if (normalized.startsWith(product.id.toLowerCase()) || normalized.startsWith(product.handle.toLowerCase())) {
      const defaultVariant = product.variants.find(v => v.title === 'UK 8') || product.variants[0];
      return { product, variant: defaultVariant };
    }
  }

  return undefined;
}
