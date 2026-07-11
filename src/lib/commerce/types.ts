export interface CommerceProduct {
  id: string;
  handle: string;
  name: string;
  price: string;
  description: string;
  materials: string[];
  variants: Array<{ id: string; title: string; available: boolean }>;
  images: Array<{ url: string; altText: string }>;
  shippingPolicy: string;
  returnPolicy: string;
  careInstructions: string;
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
