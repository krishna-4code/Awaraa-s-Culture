import { CommerceCollection } from './types';
import { commerceFetch } from './client';

const getCollectionsQuery = `
  query getCollections {
    collections(first: 10) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            url
          }
        }
      }
    }
  }
`;

export async function getCollection(): Promise<CommerceCollection[]> {
  try {
    const { body } = await commerceFetch<any>({
      query: getCollectionsQuery,
      tags: ['collections'],
    });

    const edges = body.data?.collections?.edges;
    if (!edges || edges.length === 0) return [];

    return edges.map(({ node }: any) => ({
      id: node.id,
      handle: node.handle,
      title: node.title,
      description: node.description,
      imageUrl: node.image?.url || "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"
    }));
  } catch (e) {
    console.error('Failed to fetch collections:', e);
    // Fallback if Shopify isn't populated yet during development
    return [
      { 
        id: "mock_everyday", 
        handle: "everyday",
        title: "Everyday", 
        description: "Built for the daily commute and beyond. Subtle, enduring, necessary.",
        imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"
      },
      { 
        id: "mock_formal", 
        handle: "formal",
        title: "Formal", 
        description: "Sharp, structural, and uncompromising for the moments that require it.",
        imageUrl: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80"
      },
      { 
        id: "mock_weekend", 
        handle: "weekend",
        title: "Weekend", 
        description: "Easy movement for unstructured time.",
        imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
      }
    ];
  }
}
