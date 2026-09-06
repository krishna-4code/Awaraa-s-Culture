import { Hero } from "@/components/Hero";
import { BrandStory } from "@/components/BrandStory";
import { Craft } from "@/components/Craft";
import { Collection } from "@/components/Collection";
import { Community } from "@/components/Community";
import { StickyStack } from "@/components/StickyStack";
import { getProducts } from "@/lib/commerce/products";
import { getCollection } from "@/lib/commerce/collections";
import { BRAND_NAME, BRAND_DESCRIPTION } from "@/lib/constants";

export const metadata = {
  title: { absolute: BRAND_NAME },
  description: BRAND_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
};

export default async function Home() {
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollection(),
  ]);

  return (
    <main className="min-h-screen bg-transparent text-bright-ink">
      {/* Sticky pinned stack — each section is wrapped in its own 100svh track so it
          only becomes sticky (bottom of the screen) once its content is fully scrolled,
          then the next track slides its section over the previous one */}
      <StickyStack>
        <div className="min-h-svh">
          <Hero />
        </div>
        <div className="min-h-svh">
          <BrandStory />
        </div>
        <div className="min-h-svh">
          <Craft />
        </div>
        <div className="min-h-svh">
          <Collection initialProducts={products} initialCollections={collections} />
        </div>
        <div className="min-h-svh">
          <Community />
        </div>
      </StickyStack>
    </main>
  );
}
