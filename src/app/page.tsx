import { Hero } from "@/components/Hero";
import { BrandStory } from "@/components/BrandStory";
import { Craft } from "@/components/Craft";
import { Collection } from "@/components/Collection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <BrandStory />
      <Craft />
      <Collection />
    </main>
  );
}
