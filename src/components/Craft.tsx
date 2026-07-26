import { Placeholder } from "@/components/Placeholder";
import Image from "next/image";

export function Craft() {
  return (
    <section className="w-full bg-charcoal text-sand flex flex-col md:flex-row border-t border-umber relative">
      
      {/* Photography Sticky Left (Bottom on mobile, Sticky Left on Desktop) */}
      <div className="w-full md:w-1/2 md:sticky md:top-0 h-[50vh] md:h-screen order-2 md:order-1 -ml-8 md:-ml-24 z-0">
        <div className="absolute inset-0 bg-umber w-full h-full md:rounded-r-3xl overflow-hidden shadow-2xl">
          <Image 
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80" 
            alt="Craft and sourcing process" 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Text Scrolling Right (Top on Mobile, Scrolling Right on Desktop) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:pr-24 md:pl-12 py-24 md:py-[20vh] gap-16 relative z-10 order-1 md:order-2">
        <div>
          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] uppercase tracking-wide text-dust leading-none mb-8">
            Honest Craft,<br/>No Illusions
          </h2>
          <div className="flex flex-col gap-6 max-w-xl">
            <h3 className="font-sans text-sm uppercase tracking-widest text-clay border-b border-umber pb-2">
              Our Sourcing Model
            </h3>
            <p className="font-sans text-lg leading-relaxed text-sand">
              We don&apos;t own factories or pretend to stitch every sole by hand. We are curators first. 
              We partner with trusted, established wholesalers to select footwear that meets a strict 
              standard for durability, daily comfort, and quiet confidence. Premium shouldn&apos;t require a markup.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          <h3 className="font-sans text-sm uppercase tracking-widest text-clay border-b border-umber pb-2 max-w-sm">
            The Standard
          </h3>
          
          <div className="flex flex-col gap-4 max-w-xl">
            {/* Amber Glass Cards */}
            <div className="p-6 bg-umber/30 backdrop-blur-md border border-umber/20 flex items-start gap-4 rounded-2xl shadow-xl">
              <span className="text-clay mt-1 text-xl font-display">01</span>
              <p className="font-sans text-dust"><Placeholder text="TO CONFIRM: Specific material check e.g. Top-grain leather inspection" /></p>
            </div>
            <div className="p-6 bg-umber/30 backdrop-blur-md border border-umber/20 flex items-start gap-4 rounded-2xl shadow-xl">
              <span className="text-clay mt-1 text-xl font-display">02</span>
              <p className="font-sans text-dust"><Placeholder text="TO CONFIRM: Sole durability/flexibility requirement" /></p>
            </div>
            <div className="p-6 bg-umber/30 backdrop-blur-md border border-umber/20 flex items-start gap-4 rounded-2xl shadow-xl">
              <span className="text-clay mt-1 text-xl font-display">03</span>
              <p className="font-sans text-dust"><Placeholder text="TO CONFIRM: Internal cushioning standard" /></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
