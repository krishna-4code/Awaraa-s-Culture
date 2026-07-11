import { CommerceProduct } from './types';

export async function getProduct(handle: string): Promise<CommerceProduct | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    id: `mock_id_${handle}`,
    handle: handle,
    name: `PRODUCT NAME FOR ${handle.toUpperCase()}`,
    price: "PRICE: e.g. ₹4,500",
    description: "Built for movement, designed for stillness. This pair represents our standard for daily reliability, featuring honest materials and uncompromising comfort.",
    materials: [
      "MATERIAL 1: e.g. Full-grain leather upper",
      "MATERIAL 2: e.g. High-density EVA midsole",
      "MATERIAL 3: e.g. Rubber traction outsole"
    ],
    variants: [
      { id: "v1", title: "7", available: true },
      { id: "v2", title: "8", available: true },
      { id: "v3", title: "9", available: true },
      { id: "v4", title: "10", available: true },
      { id: "v5", title: "11", available: false },
      { id: "v6", title: "12", available: true }
    ],
    images: [
      { url: "https://picsum.photos/seed/main/1000/1000", altText: "Main product placeholder" },
      { url: "https://picsum.photos/seed/detail1/800/800", altText: "Detail shot 1" },
      { url: "https://picsum.photos/seed/detail2/800/800", altText: "Detail shot 2" }
    ],
    shippingPolicy: "TO CONFIRM: Shipping threshold or policy",
    returnPolicy: "TO CONFIRM: Return window (e.g. 14 days, unworn)",
    careInstructions: "TO CONFIRM: Care instructions based on material"
  };
}
