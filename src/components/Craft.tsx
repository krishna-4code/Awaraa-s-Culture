"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Placeholder } from "@/components/Placeholder";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Craft() {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      if (statementRef.current && comparisonRef.current) {
        gsap.set([statementRef.current, comparisonRef.current], { opacity: 1, y: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      // Bold Statement entrance
      gsap.fromTo(
        statementRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statementRef.current,
            start: "top 80%",
          },
        }
      );

      // Stat comparison callout entrance
      gsap.fromTo(
        comparisonRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: comparisonRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-dark-secondary text-warm-white py-28 md:py-40 px-6 sm:px-12 md:px-20 lg:px-24 border-t border-dark-surface relative overflow-hidden"
    >
      {/* Canvas Thread Motif Accent Line */}
      <div className="absolute top-0 right-12 md:right-32 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold-accent/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-28">
        
        {/* SUB-SECTION 1: Rogue & Rosy "The First of Its Kind" Bold Single-Statement Moment */}
        <div
          ref={statementRef}
          className="flex flex-col gap-8 text-center items-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-accent/10 border border-gold-accent/30 text-gold-accent text-xs font-sans uppercase tracking-[0.25em]">
            <span>Craft & Philosophy</span>
          </div>

          <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.8rem)] uppercase tracking-wide leading-[1.08] text-warm-white">
            Curation Over Illusion.
          </h2>

          <p className="font-sans text-lg sm:text-xl md:text-2xl text-muted-grey leading-relaxed font-light">
            We don&apos;t own factories or pretend to hand-stitch every sole. We are <strong className="text-warm-white font-medium">curators first</strong>—selecting footwear from trusted, established wholesalers with an unyielding standard for durability, daily comfort, and quiet confidence. Premium craft without status markup.
          </p>

          <div className="w-24 h-[1px] bg-gold-accent/40 mt-2" />
        </div>

        {/* SUB-SECTION 2: OLIPOP Stat-Comparison Callout Table */}
        <div ref={comparisonRef} className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-dark-surface pb-6">
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold-accent font-semibold block mb-2">
                Honest Comparison
              </span>
              <h3 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-warm-white">
                The Quality Benchmark
              </h3>
            </div>
            <p className="font-sans text-sm text-muted-grey max-w-md">
              An transparent look at our curation criteria compared to traditional status-focused labels.
            </p>
          </div>

          {/* Comparison Cards / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Awaraa's Culture Card (Gold Accent Highlighted) */}
            <div className="bg-dark-surface/90 border border-gold-accent/40 rounded-2xl p-8 sm:p-10 flex flex-col gap-8 relative shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 bg-gold-accent text-dark-bg text-xs font-sans font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
                Awaraa&apos;s Culture
              </div>

              <h4 className="font-display text-2xl uppercase tracking-wide text-warm-white border-b border-dark-surface pb-4">
                Our Curation Standard
              </h4>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-xs uppercase tracking-widest text-gold-accent font-semibold">
                    01. Sourcing Model
                  </span>
                  <p className="font-sans text-base text-warm-white">
                    Direct wholesale curation from vetted masters. Zero artificial scarcity.
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-sans text-xs uppercase tracking-widest text-gold-accent font-semibold">
                    02. Material Benchmark
                  </span>
                  <div className="font-sans text-base text-warm-white">
                    <Placeholder text="TO CONFIRM: Top-grain leather & high-density TPU sole spec" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-sans text-xs uppercase tracking-widest text-gold-accent font-semibold">
                    03. Pricing Philosophy
                  </span>
                  <p className="font-sans text-base text-warm-white">
                    Fair, price-conscious pricing targeted for Delhi NCR youth (18–25).
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-sans text-xs uppercase tracking-widest text-gold-accent font-semibold">
                    04. Wearability Testing
                  </span>
                  <div className="font-sans text-base text-warm-white">
                    <Placeholder text="TO CONFIRM: All-day street cushioning & break-in metric" />
                  </div>
                </div>
              </div>
            </div>

            {/* Traditional Status Brands Card */}
            <div className="bg-dark-bg/80 border border-dark-surface rounded-2xl p-8 sm:p-10 flex flex-col gap-8 relative">
              <div className="absolute top-0 right-0 bg-dark-surface text-muted-grey text-xs font-sans font-medium uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
                Status Labels
              </div>

              <h4 className="font-display text-2xl uppercase tracking-wide text-muted-grey border-b border-dark-surface pb-4">
                Traditional Status Model
              </h4>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-xs uppercase tracking-widest text-muted-grey font-semibold">
                    01. Sourcing Model
                  </span>
                  <p className="font-sans text-base text-muted-grey">
                    Engineered exclusivity, hype drops, and manufactured waitlists.
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-sans text-xs uppercase tracking-widest text-muted-grey font-semibold">
                    02. Material Benchmark
                  </span>
                  <div className="font-sans text-base text-muted-grey">
                    <Placeholder text="TO CONFIRM: Mixed synthetic fillers behind big logos" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-sans text-xs uppercase tracking-widest text-muted-grey font-semibold">
                    03. Pricing Philosophy
                  </span>
                  <p className="font-sans text-base text-muted-grey">
                    5x–10x brand equity markup driven by status signaling.
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-sans text-xs uppercase tracking-widest text-muted-grey font-semibold">
                    04. Wearability Testing
                  </span>
                  <div className="font-sans text-base text-muted-grey">
                    <Placeholder text="TO CONFIRM: Aesthetic priority over long-term ergonomics" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
