import { Hero } from "@/components/Hero";
import { BrandStory } from "@/components/BrandStory";
import { Craft } from "@/components/Craft";
import { Collection } from "@/components/Collection";
import { Community } from "@/components/Community";

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-bg text-warm-white">
      <Hero />
      <BrandStory />
      <Craft />
      <Collection />
      <Community />
    </main>
  );
}
