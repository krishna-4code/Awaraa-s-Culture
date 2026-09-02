import { Hero } from "@/components/Hero";
import { BrandStory } from "@/components/BrandStory";
import { Craft } from "@/components/Craft";
import { Collection } from "@/components/Collection";
import { Community } from "@/components/Community";
import { getProducts } from "@/lib/commerce/products";
import { getCollection } from "@/lib/commerce/collections";
import { BRAND_NAME, BRAND_TAGLINE, BRAND_DESCRIPTION } from "@/lib/constants";

export const metadata = {
  title: `${BRAND_NAME} — ${BRAND_TAGLINE}`,
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
    <main className="min-h-screen bg-transparent text-bright-ink relative overflow-hidden">
      {/* Main Page Sections */}
      <Hero />
      <BrandStory />
      <Craft />
      <Collection initialProducts={products} initialCollections={collections} />
      <Community />
    </main>
  );
}
