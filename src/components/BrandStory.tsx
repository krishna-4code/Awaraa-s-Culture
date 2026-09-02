"use client";

import Image from "next/image";
import Link from "next/link";

export function BrandStory() {
  return (
    <section className="relative w-full bg-transparent text-bright-ink py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center relative z-10">
        
        {/* LEFT COLUMN: Text Content & Values */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          
          <div className="flex flex-col gap-3">
            <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold block">
              ✦ Brand Origin & Purpose
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-bright-ink leading-[0.95]">
              The Wanderer Philosophy
            </h2>
          </div>

          <p className="font-sans text-base sm:text-lg text-bright-muted leading-relaxed font-medium">
            <strong className="text-bright-ink font-bold">Awaraa</strong> (आवारा) means wanderer—someone always in motion, geographically, culturally, socially. We build footwear for those who move with intention. Honest comfort, quiet craft, and enduring quality over status-signaling.
          </p>

          <div className="flex flex-col gap-4 pt-4 border-t border-bright-ink/10">
            <h3 className="font-sans text-xs uppercase tracking-widest text-bright-muted font-bold">
              Locked Brand Principles
            </h3>

            <div className="flex flex-wrap gap-3">
              {[
                { num: "01", text: "Quality before profit", color: "bg-bright-amber text-white" },
                { num: "02", text: "Customer before transaction", color: "bg-bright-lime text-white" },
                { num: "03", text: "Comfort before trends", color: "bg-bright-coral text-white" },
                { num: "04", text: "Honesty before marketing", color: "bg-bright-sun text-bright-ink" },
                { num: "05", text: "Long-term loyalty", color: "bg-bright-ink text-white" },
              ].map((val) => (
                <div key={val.num} className="cpg-card !p-3 !rounded-xl flex items-center gap-3 bg-white border border-bright-ink/10 shadow-sm">
                  <span className={`font-sans text-xs font-bold tracking-wider px-2 py-0.5 rounded-full ${val.color}`}>
                    {val.num}
                  </span>
                  <span className="font-sans text-xs font-semibold text-bright-ink">
                    {val.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Layered Multi-Image Collage */}
        <div className="w-full lg:w-1/2 relative h-[420px] sm:h-[500px]">
          {/* Layer 1 */}
          <Link href="/#squad" className="block absolute top-0 left-0 w-[65%] h-[65%] rounded-2xl overflow-hidden shadow-lg border-4 border-white z-20 hover:scale-105 transition-transform duration-300" aria-label="Explore the squad">
            <Image
              src="/shoes/dunks/Gemini_Generated_Image_upq1p1upq1p1upq1.png"
              alt="Awaraa's Culture SB Dunks in motion"
              fill
              sizes="(max-width: 1024px) 60vw, 600px"
              className="object-cover"
            />
          </Link>

          {/* Layer 2 */}
          <Link href="/#squad" className="block absolute top-8 right-0 w-[48%] h-[50%] rounded-2xl overflow-hidden shadow-md border-4 border-white z-10 hover:scale-105 transition-transform duration-300" aria-label="Explore the squad">
            <Image
              src="/shoes/nb_sports/1.png"
              alt="NB Sports craftsmanship detail"
              fill
              sizes="(max-width: 1024px) 45vw, 440px"
              className="object-cover"
            />
          </Link>

          {/* Layer 3 */}
          <Link href="/#squad" className="block absolute bottom-0 left-[10%] w-[55%] h-[50%] rounded-2xl overflow-hidden shadow-lg border-4 border-white z-30 hover:scale-105 transition-transform duration-300" aria-label="Explore the squad">
            <Image
              src="/shoes/waffel_brown/Gemini_Generated_Image_wosh4ywosh4ywosh.png"
              alt="Waffle Brown urban footwear in Delhi NCR"
              fill
              sizes="(max-width: 1024px) 55vw, 520px"
              className="object-cover"
            />
          </Link>
        </div>

      </div>
    </section>
  );
}
