import { Hero } from "@/components/Hero";
import { BrandStory } from "@/components/BrandStory";
import { Craft } from "@/components/Craft";
import { Collection } from "@/components/Collection";
import { Community } from "@/components/Community";
import { getProducts, getCollection } from "@/lib/commerce";

export const metadata = {
  title: "Street-Tested Footwear for Daily Movement",
  description:
    "Awaraa's Culture crafts honest, street-tested footwear for Delhi NCR — real comfort, zero hype markups, built for daily movement. Wander without limits.",
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
