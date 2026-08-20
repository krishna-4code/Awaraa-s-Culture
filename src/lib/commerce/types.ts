export interface CommerceVariant {
  id: string;
  title: string;
  size?: string;
  color?: string;
  colorHex?: string;
  stock?: number;
  available: boolean;
}

export interface CommerceProduct {
  id: string;
  handle: string;
  name: string;
  price: string;
  description: string;
  materials: string[];
  variants: CommerceVariant[];
  images: Array<{ url: string; altText: string }>;
  shippingPolicy: string;
  returnPolicy: string;
  careInstructions: string;
  collectionSlug?: string;
}

export interface CommerceCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface CommerceCart {
  id: string;
  checkoutUrl: string;
  lines: Array<{
    id: string;
    quantity: number;
    merchandise: { id: string; title: string; product: CommerceProduct };
  }>;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
}
