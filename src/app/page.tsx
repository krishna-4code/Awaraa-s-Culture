import { Hero } from "@/components/Hero";
import { BrandStory } from "@/components/BrandStory";
import { Craft } from "@/components/Craft";
import { Collection } from "@/components/Collection";
import { Community } from "@/components/Community";
import { FloatingShoeMotif } from "@/components/FloatingShoeMotif";
import { ShoeCursorTrail } from "@/components/ShoeCursorTrail";

export default function Home() {
  return (
    <main className="min-h-screen bg-bright-canvas text-bright-ink relative overflow-hidden">
      {/* Sitewide Background Shoe Motif Layer & Desktop Cursor Trail */}
      <FloatingShoeMotif />
      <ShoeCursorTrail />

      {/* Main Page Sections */}
      <Hero />
      <BrandStory />
      <Craft />
      <Collection />
      <Community />
    </main>
  );
}
