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
            imageUrl: imageUrl || '/shoes/nb_sports/1.png',
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
      description: "Built for the daily commute and beyond. Lightweight EVA cushioning and effortless movement for everyday routines.",
      imageUrl: "/shoes/nb_sports/1.png"
    },
    { 
      id: "street-kicks", 
      handle: "street-kicks",
      title: "Street Kicks", 
      description: "Low-profile street silhouettes crafted for NCR pavement. Bold styling, durable materials, and zero hype markups.",
      imageUrl: "/shoes/dunks/Gemini_Generated_Image_upq1p1upq1p1upq1.png"
    },
    { 
      id: "terrain-comfort", 
      handle: "terrain-comfort",
      title: "Terrain Comfort", 
      description: "Ergonomic heel cushion and rugged traction built for diverse urban paths and extended exploration.",
      imageUrl: "/shoes/waffel_brown/Gemini_Generated_Image_wosh4ywosh4ywosh.png"
    }
  ];
}

export async function getCollectionByHandle(handle: string): Promise<CommerceCollection | null> {
  const collections = await getCollection();
  const normalized = handle.toLowerCase().trim();
  const found = collections.find((c) => c.handle.toLowerCase() === normalized || c.id.toLowerCase() === normalized);
  return found || null;
}

