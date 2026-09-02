import { CommerceProduct } from './types';

export const MOCK_PRODUCTS: CommerceProduct[] = [
  {
    id: "aero-tide",
    handle: "aero-tide",
    name: "Aero Tide",
    price: "₹1,099",
    description: "White performance runner with aqua/turquoise sculpted sole, engineered with lightweight breathable mesh, high-rebound molded EVA foam midsole, and multi-surface grip.",
    materials: [
      "Technical breathable sport mesh with synthetic overlays",
      "High-rebound molded EVA foam midsole",
      "Durable non-marking rubber traction outsole",
      "Removable contoured orthotic footbed"
    ],
    variants: [
      { id: "aero-tide-uk7", title: "UK 7", available: true, size: "7", color: "White" },
      { id: "aero-tide-uk8", title: "UK 8", available: true, size: "8", color: "White" },
      { id: "aero-tide-uk9", title: "UK 9", available: true, size: "9", color: "White" },
      { id: "aero-tide-uk10", title: "UK 10", available: true, size: "10", color: "White" },
    ],
    images: [
      {
        url: "/shoes/nb_sports/1.png",
        altText: "Aero Tide - Angle 1"
      },
      {
        url: "/shoes/nb_sports/2.jpeg",
        altText: "Aero Tide - Angle 2"
      },
      {
        url: "/shoes/nb_sports/3.jpeg",
        altText: "Aero Tide - Angle 3"
      },
      {
        url: "/shoes/nb_sports/4.jpeg",
        altText: "Aero Tide - Angle 4"
      }
    ],
    shippingPolicy: "Delhi delivery: ₹100 flat. Outside Delhi: Book Porter on own charges.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Wipe clean with a damp cloth. Air dry naturally away from direct heat."
  },
  {
    id: "cocoa-drift",
    handle: "cocoa-drift",
    name: "Cocoa Drift",
    price: "₹1,199",
    description: "Cream/off-white retro sneaker with dark brown side accent, engineered for all-day urban movement. Dual-density cushioning and reinforced grip outer sole provide supreme stability.",
    materials: [
      "Full-grain premium leather and synthetic upper",
      "High-rebound EVA midsole for step-in comfort",
      "Anti-slip hexagonal rubber traction outsole",
      "Breathable padded mesh collar & lining"
    ],
    variants: [
      { id: "cocoa-drift-uk7", title: "UK 7", available: true, size: "7", color: "White" },
      { id: "cocoa-drift-uk8", title: "UK 8", available: true, size: "8", color: "White" },
      { id: "cocoa-drift-uk9", title: "UK 9", available: true, size: "9", color: "White" },
      { id: "cocoa-drift-uk10", title: "UK 10", available: true, size: "10", color: "White" },
      { id: "cocoa-drift-uk11", title: "UK 11", available: true, size: "11", color: "White" },
    ],
    images: [
      {
        url: "/shoes/dunks/Gemini_Generated_Image_upq1p1upq1p1upq1.png",
        altText: "Cocoa Drift - Front Hero View"
      },
      {
        url: "/shoes/dunks/WhatsApp Image 2026-08-18 at 6.51.46 PM.jpeg",
        altText: "Cocoa Drift - Studio Angle"
      },
      {
        url: "/shoes/dunks/WhatsApp Image 2026-08-18 at 6.51.46 PM (1).jpeg",
        altText: "Cocoa Drift - Side Profile"
      }
    ],
    shippingPolicy: "Delhi delivery: ₹100 flat. Outside Delhi: Book Porter on own charges.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Wipe clean with a damp cloth. Use standard sneaker cleaner for scuffs. Air dry only."
  },
  {
    id: "earthline",
    handle: "earthline",
    name: "Earthline",
    price: "₹1,399",
    description: "Tan/brown retro sneaker with dark swoosh-like side accent and gum sole, reimagined in rich earthy tones. Features lightweight waffle-traction sole and breathable mesh panels.",
    materials: [
      "Earth-tone nubuck suede and woven nylon mesh",
      "Classic waffle lug traction rubber sole",
      "Ergonomic shock-absorbing arch support insole",
      "Vintage-styled padded foam tongue"
    ],
    variants: [
      { id: "earthline-uk7", title: "UK 7", available: true, size: "7", color: "Tan" },
      { id: "earthline-uk8", title: "UK 8", available: true, size: "8", color: "Tan" },
      { id: "earthline-uk9", title: "UK 9", available: true, size: "9", color: "Tan" },
    ],
    images: [
      {
        url: "/shoes/waffel_brown/Gemini_Generated_Image_wosh4ywosh4ywosh.png",
        altText: "Earthline - Hero Profile"
      }
    ],
    shippingPolicy: "Delhi delivery: ₹100 flat. Outside Delhi: Book Porter on own charges.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Wipe with damp cloth and use dedicated suede foam cleaner."
  },
  {
    id: "shadow-crest",
    handle: "shadow-crest",
    name: "Shadow Crest",
    price: "₹1,099",
    description: "Black/grey low-top with suede overlays and chunky classic sole, blending runway aesthetics with robust street comfort. Monogram-accented panels and cushioned cupsole.",
    materials: [
      "Smooth micro-fiber leather with embossed texture",
      "Reinforced rubber cupsole with anti-abrasion tread",
      "Soft calfskin-touch interior lining",
      "Padded tongue with gold foil branding"
    ],
    variants: [
      { id: "shadow-crest-uk7", title: "UK 7", available: true, size: "7", color: "White" },
      { id: "shadow-crest-uk8", title: "UK 8", available: true, size: "8", color: "White" },
      { id: "shadow-crest-uk9", title: "UK 9", available: true, size: "9", color: "White" },
      { id: "shadow-crest-uk10", title: "UK 10", available: true, size: "10", color: "White" },
    ],
    images: [
      {
        url: "/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.46 PM.jpeg",
        altText: "Shadow Crest - Studio View"
      },
      {
        url: "/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.47 PM.jpeg",
        altText: "Shadow Crest - Side Profile"
      },
      {
        url: "/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.47 PM (1).jpeg",
        altText: "Shadow Crest - Detail Angle"
      }
    ],
    shippingPolicy: "Delhi delivery: ₹100 flat. Outside Delhi: Book Porter on own charges.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Wipe gently with leather cleaning wipe. Do not machine wash."
  },
  {
    id: "dune-runner",
    handle: "dune-runner",
    name: "Dune Runner",
    price: "₹1,149",
    description: "Cream/white retro low-top with grey suede overlays and gum sole. Street-forward athletic runner with dual-tone paneled leather, responsive foam cushion, and non-slip rubber outsole.",
    materials: [
      "Layered micro-fiber leather & perforated toe box",
      "Dual-density cushioned EVA midsole",
      "Reinforced heel counter for structural stability",
      "Padded sport tongue with heritage label"
    ],
    variants: [
      { id: "dune-runner-uk7", title: "UK 7", available: true, size: "7", color: "White" },
      { id: "dune-runner-uk8", title: "UK 8", available: true, size: "8", color: "White" },
      { id: "dune-runner-uk9", title: "UK 9", available: true, size: "9", color: "White" },
      { id: "dune-runner-uk10", title: "UK 10", available: true, size: "10", color: "White" },
    ],
    images: [
      {
        url: "/shoes/nb_sneakers/1.png",
        altText: "Dune Runner - Hero Angle"
      }
    ],
    shippingPolicy: "Delhi delivery: ₹100 flat. Outside Delhi: Book Porter on own charges.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Wipe clean with a damp cloth. Air dry in shade."
  },
  {
    id: "moss-velocity",
    handle: "moss-velocity",
    name: "Moss Velocity",
    price: "₹999",
    description: "Sage/olive green performance runner with futuristic sole. Ultra-lightweight everyday runner designed for daily commute, high-flexibility walking, and zero fatigue wear.",
    materials: [
      "Breathable engineered knit textile upper",
      "Ultra-light flexible EVA sole",
      "Cushioned memory-foam insole",
      "Elastic slip-on collar with secure lacing"
    ],
    variants: [
      { id: "moss-velocity-uk7", title: "UK 7", available: true, size: "7", color: "Grey" },
      { id: "moss-velocity-uk8", title: "UK 8", available: true, size: "8", color: "Grey" },
      { id: "moss-velocity-uk9", title: "UK 9", available: true, size: "9", color: "Grey" },
      { id: "moss-velocity-uk10", title: "UK 10", available: true, size: "10", color: "Grey" },
    ],
    images: [
      {
        url: "/shoes/sports/1.jpeg",
        altText: "Moss Velocity - Angle 1"
      },
      {
        url: "/shoes/sports/2.jpeg",
        altText: "Moss Velocity - Angle 2"
      },
      {
        url: "/shoes/sports/3.jpeg",
        altText: "Moss Velocity - Angle 3"
      },
      {
        url: "/shoes/sports/4.jpeg",
        altText: "Moss Velocity - Angle 4"
      }
    ],
    shippingPolicy: "Delhi delivery: ₹100 flat. Outside Delhi: Book Porter on own charges.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Machine washable on delicate cold cycle. Air dry only."
  },
  {
    id: "sand-drift",
    handle: "sand-drift",
    name: "Sand Drift",
    price: "₹1,479",
    description: "Beige/cream lightweight running shoe with white cushioned sole. Plush all-day walking shoe featuring high-rebound cushioning, responsive arch support, and rugged street tread.",
    materials: [
      "Reinforced mesh upper with synthetic side braces",
      "Shock-absorbing segmented EVA midsole",
      "High-traction rubber pod outsole",
      "Breathable moisture-wicking sockliner"
    ],
    variants: [
      { id: "sand-drift-uk8", title: "UK 8", available: true, size: "8", color: "Tan" },
      { id: "sand-drift-uk9", title: "UK 9", available: true, size: "9", color: "Tan" },
      { id: "sand-drift-uk10", title: "UK 10", available: true, size: "10", color: "Tan" },
      { id: "sand-drift-uk11", title: "UK 11", available: true, size: "11", color: "Tan" },
      { id: "sand-drift-uk12", title: "UK 12", available: true, size: "12", color: "Tan" },
    ],
    images: [
      {
        url: "/shoes/sketchers/Gemini_Generated_Image_iptr9iptr9iptr9i.png",
        altText: "Sand Drift - Hero View"
      }
    ],
    shippingPolicy: "Delhi delivery: ₹100 flat. Outside Delhi: Book Porter on own charges.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Spot clean with damp cloth and mild soap. Air dry."
  },
  {
    id: "midnight-flow",
    handle: "midnight-flow",
    name: "Midnight Flow",
    price: "₹1,349",
    description: "Black performance runner with blue accent and chunky white cushioning. High-performance endurance walking shoe with structured heel stabilizer, responsive road cushioning, and high-abrasion rubber tread.",
    materials: [
      "Heavy-duty double jacquard breathable mesh",
      "Bio-cushioned responsive midsole compound",
      "Blown rubber crash pad outsole",
      "3D Fit Print saddle for secure midfoot lockdown"
    ],
    variants: [
      { id: "midnight-flow-uk7", title: "UK 7", available: true, size: "7", color: "Black" },
      { id: "midnight-flow-uk8", title: "UK 8", available: true, size: "8", color: "Black" },
      { id: "midnight-flow-uk9", title: "UK 9", available: true, size: "9", color: "Black" },
      { id: "midnight-flow-uk10", title: "UK 10", available: true, size: "10", color: "Black" },
    ],
    images: [
      {
        url: "/shoes/brooks/Gemini_Generated_Image_7ol72i7ol72i7ol7.png",
        altText: "Midnight Flow - Hero Studio Angle"
      }
    ],
    shippingPolicy: "Delhi delivery: ₹100 flat. Outside Delhi: Book Porter on own charges.",
    returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
    careInstructions: "Hand wash with mild detergent. Air dry away from heat sources."
  }
];

const LEGACY_ALIASES: Record<string, string> = {
  'nb-sneakers': 'dune-runner',
  'nb-sports': 'aero-tide',
  'brooks': 'midnight-flow',
  'skechers-sports': 'sand-drift',
  'sketchers-sports': 'sand-drift',
  'sketchers': 'sand-drift',
  'skechers': 'sand-drift',
  'sports': 'moss-velocity',
  'waffle-brown': 'earthline',
  'waffel-brown': 'earthline',
  'lv-sneakers': 'shadow-crest',
  'sb-dunks': 'cocoa-drift',
  'dunks': 'cocoa-drift',
};

export function findMockProduct(identifier: string): CommerceProduct | undefined {
  if (!identifier) return undefined;
  const normalized = identifier.toLowerCase().trim();
  const resolvedId = LEGACY_ALIASES[normalized] || normalized;

  return MOCK_PRODUCTS.find(p => 
    p.id.toLowerCase() === resolvedId || 
    p.handle.toLowerCase() === resolvedId ||
    p.name.toLowerCase() === resolvedId ||
    p.id.toLowerCase() === normalized ||
    p.handle.toLowerCase() === normalized ||
    p.name.toLowerCase() === normalized ||
    p.variants.some(v => v.id.toLowerCase() === normalized || v.id.toLowerCase() === resolvedId)
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

