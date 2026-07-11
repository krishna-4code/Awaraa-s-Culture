import { CommerceCollection } from './types';

export async function getCollection(): Promise<CommerceCollection[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { 
      id: "everyday", 
      handle: "everyday",
      title: "Everyday", 
      description: "Built for the daily commute and beyond. Subtle, enduring, necessary.",
      imageUrl: "https://picsum.photos/seed/everyday/800/1000"
    },
    { 
      id: "formal", 
      handle: "formal",
      title: "Formal", 
      description: "Sharp, structural, and uncompromising for the moments that require it.",
      imageUrl: "https://picsum.photos/seed/formal/800/1000"
    },
    { 
      id: "weekend", 
      handle: "weekend",
      title: "Weekend", 
      description: "Easy movement for unstructured time.",
      imageUrl: "https://picsum.photos/seed/weekend/800/1000"
    }
  ];
}
