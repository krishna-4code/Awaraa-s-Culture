import { CommerceCollection } from './types';
import { sanityClient } from '@/sanity/client';
import { urlForImage } from '@/sanity/image';

const COLLECTIONS_QUERY = `
  *[_type == "collection" && !isPlaceholder] | order(title asc) {
    _id,
    title,
    "handle": slug.current,
    description,
    image {
      asset,
      alt
    }
  }
`;

export async function getCollection(): Promise<CommerceCollection[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

  if (projectId && projectId !== 'your_sanity_project_id' && projectId !== 'placeholder') {
    try {
      const docs = await sanityClient.fetch(COLLECTIONS_QUERY);
      if (Array.isArray(docs) && docs.length > 0) {
        return docs.map((doc: any) => {
          let imageUrl = '';
          try {
            imageUrl = doc.image?.asset ? urlForImage(doc.image.asset).url() : '';
          } catch {
            imageUrl = '';
          }
          return {
            id: doc._id || doc.handle,
            handle: doc.handle || doc._id,
            title: doc.title,
            description: doc.description || '',
            imageUrl: imageUrl || 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
          };
        });
      }
    } catch (e) {
      console.warn('[Sanity] Failed to fetch collections from Sanity, using fallback:', e);
    }
  } else {
    console.warn('[Commerce] NEXT_PUBLIC_SANITY_PROJECT_ID not configured. Using fallback collections.');
  }

  // Fallback collections for local development without Sanity credentials
  return [
    { 
      id: "daily-walkers", 
      handle: "daily-walkers",
      title: "Daily Walkers", 
      description: "Built for the daily commute and beyond. Lightweight EVA cushioning.",
      imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
    },
    { 
      id: "street-kicks", 
      handle: "street-kicks",
      title: "Street Kicks", 
      description: "Low-profile street silhouette crafted for NCR pavement.",
      imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
    },
    { 
      id: "terrain-comfort", 
      handle: "terrain-comfort",
      title: "Terrain Comfort", 
      description: "High-top stability with ergonomic heel cushion.",
      imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80"
    }
  ];
}
