import { CommerceProduct } from './types';

export const MOCK_PRODUCTS: CommerceProduct[] = [
  {
    id: "nb-sports",
    handle: "nb-sports",
    name: "NB Sports",
    price: "₹1,199",
    description: "Athletic lifestyle runner engineered with lightweight breathable mesh, high-rebound molded EVA foam midsole, and multi-surface grip.",
    materials: [
      "Technical breathable sport mesh with synthetic overlays",
      "High-rebound molded EVA foam midsole",
      "Durable non-marking rubber traction outsole",
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
        url: "/shoes/nb_sports/1.png",
        altText: "NB Sports - Angle 1"
      },
      {
        url: "/shoes/nb_sports/2.jpeg",
        altText: "NB Sports - Angle 2"
      },
      {
        url: "/shoes/nb_sports/3.jpeg",
        altText: "NB Sports - Angle 3"
      },
      {
        url: "/shoes/nb_sports/4.jpeg",
        altText: "NB Sports - Angle 4"
      }
    ],
    shippingPolicy: "Free express shipping across India on prepaid orders. Dispatched within 24 hours.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Wipe clean with a damp cloth. Air dry naturally away from direct heat."
  },
  {
    id: "sb-dunks",
    handle: "sb-dunks",
    name: "SB Dunks",
    price: "₹1,399",
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
        url: "/shoes/dunks/Gemini_Generated_Image_upq1p1upq1p1upq1.png",
        altText: "SB Dunks - Front Hero View"
      },
      {
        url: "/shoes/dunks/WhatsApp Image 2026-08-18 at 6.51.46 PM.jpeg",
        altText: "SB Dunks - Studio Angle"
      },
      {
        url: "/shoes/dunks/WhatsApp Image 2026-08-18 at 6.51.46 PM (1).jpeg",
        altText: "SB Dunks - Side Profile"
      }
    ],
    shippingPolicy: "Free express shipping across India on prepaid orders. Dispatched within 24 hours.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Wipe clean with a damp cloth. Use standard sneaker cleaner for scuffs. Air dry only."
  },
  {
    id: "waffle-brown",
    handle: "waffle-brown",
    name: "Waffle Brown",
    price: "₹1,599",
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
        url: "/shoes/waffel_brown/Gemini_Generated_Image_wosh4ywosh4ywosh.png",
        altText: "Waffle Brown - Hero Profile"
      }
    ],
    shippingPolicy: "Free express shipping across India on prepaid orders. Dispatched within 24 hours.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Wipe with damp cloth and use dedicated suede foam cleaner."
  },
  {
    id: "lv-sneakers",
    handle: "lv-sneakers",
    name: "LV Sneakers",
    price: "₹1,099",
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
        url: "/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.46 PM.jpeg",
        altText: "LV Sneakers - Studio View"
      },
      {
        url: "/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.47 PM.jpeg",
        altText: "LV Sneakers - Side Profile"
      },
      {
        url: "/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.47 PM (1).jpeg",
        altText: "LV Sneakers - Detail Angle"
      }
    ],
    shippingPolicy: "Free express shipping across India on prepaid orders. Dispatched within 24 hours.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Wipe gently with leather cleaning wipe. Do not machine wash."
  },
  {
    id: "nb-sneakers",
    handle: "nb-sneakers",
    name: "NB Sneakers",
    price: "₹1,249",
    description: "Street-forward retro athletic runner with dual-tone paneled leather, responsive foam cushion, and non-slip rubber outsole.",
    materials: [
      "Layered micro-fiber leather & perforated toe box",
      "Dual-density cushioned EVA midsole",
      "Reinforced heel counter for structural stability",
      "Padded sport tongue with heritage label"
    ],
    variants: [
      { id: "nb-sneakers-uk7", title: "UK 7", available: true, size: "7", color: "White" },
      { id: "nb-sneakers-uk8", title: "UK 8", available: true, size: "8", color: "White" },
      { id: "nb-sneakers-uk9", title: "UK 9", available: true, size: "9", color: "White" },
      { id: "nb-sneakers-uk10", title: "UK 10", available: true, size: "10", color: "White" },
    ],
    images: [
      {
        url: "/shoes/nb_sneakers/1.png",
        altText: "NB Sneakers - Hero Angle"
      }
    ],
    shippingPolicy: "Free express shipping across India on prepaid orders. Dispatched within 24 hours.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Wipe clean with a damp cloth. Air dry in shade."
  },
  {
    id: "sports",
    handle: "sports",
    name: "Sports",
    price: "₹999",
    description: "Ultra-lightweight everyday runner designed for daily commute, high-flexibility walking, and zero fatigue wear.",
    materials: [
      "Breathable engineered knit textile upper",
      "Ultra-light flexible EVA sole",
      "Cushioned memory-foam insole",
      "Elastic slip-on collar with secure lacing"
    ],
    variants: [
      { id: "sports-uk7", title: "UK 7", available: true, size: "7", color: "Grey" },
      { id: "sports-uk8", title: "UK 8", available: true, size: "8", color: "Grey" },
      { id: "sports-uk9", title: "UK 9", available: true, size: "9", color: "Grey" },
      { id: "sports-uk10", title: "UK 10", available: true, size: "10", color: "Grey" },
    ],
    images: [
      {
        url: "/shoes/sports/1.jpeg",
        altText: "Sports - Angle 1"
      },
      {
        url: "/shoes/sports/2.jpeg",
        altText: "Sports - Angle 2"
      },
      {
        url: "/shoes/sports/3.jpeg",
        altText: "Sports - Angle 3"
      },
      {
        url: "/shoes/sports/4.jpeg",
        altText: "Sports - Angle 4"
      }
    ],
    shippingPolicy: "Free express shipping across India on prepaid orders. Dispatched within 24 hours.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Machine washable on delicate cold cycle. Air dry only."
  },
  {
    id: "sketchers-sports",
    handle: "sketchers-sports",
    name: "Sketchers Sports",
    price: "₹1,579",
    description: "Plush all-day walking shoe featuring high-rebound cushioning, responsive arch support, and rugged street tread.",
    materials: [
      "Reinforced mesh upper with synthetic side braces",
      "Shock-absorbing segmented EVA midsole",
      "High-traction rubber pod outsole",
      "Breathable moisture-wicking sockliner"
    ],
    variants: [
      { id: "sketchers-sports-uk8", title: "UK 8", available: true, size: "8", color: "Tan" },
      { id: "sketchers-sports-uk9", title: "UK 9", available: true, size: "9", color: "Tan" },
      { id: "sketchers-sports-uk10", title: "UK 10", available: true, size: "10", color: "Tan" },
      { id: "sketchers-sports-uk11", title: "UK 11", available: true, size: "11", color: "Tan" },
      { id: "sketchers-sports-uk12", title: "UK 12", available: true, size: "12", color: "Tan" },
    ],
    images: [
      {
        url: "/shoes/sketchers/Gemini_Generated_Image_iptr9iptr9iptr9i.png",
        altText: "Sketchers Sports - Hero View"
      }
    ],
    shippingPolicy: "Free express shipping across India on prepaid orders. Dispatched within 24 hours.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Spot clean with damp cloth and mild soap. Air dry."
  },
  {
    id: "brooks",
    handle: "brooks",
    name: "Brooks",
    price: "₹1,399",
    description: "High-performance endurance walking shoe with structured heel stabilizer, responsive road cushioning, and high-abrasion rubber tread.",
    materials: [
      "Heavy-duty double jacquard breathable mesh",
      "Bio-cushioned responsive midsole compound",
      "Blown rubber crash pad outsole",
      "3D Fit Print saddle for secure midfoot lockdown"
    ],
    variants: [
      { id: "brooks-uk7", title: "UK 7", available: true, size: "7", color: "Black" },
      { id: "brooks-uk8", title: "UK 8", available: true, size: "8", color: "Black" },
      { id: "brooks-uk9", title: "UK 9", available: true, size: "9", color: "Black" },
      { id: "brooks-uk10", title: "UK 10", available: true, size: "10", color: "Black" },
    ],
    images: [
      {
        url: "/shoes/brooks/Gemini_Generated_Image_7ol72i7ol72i7ol7.png",
        altText: "Brooks - Hero Studio Angle"
      }
    ],
    shippingPolicy: "Free express shipping across India on prepaid orders. Dispatched within 24 hours.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Hand wash with mild detergent. Air dry away from heat sources."
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
