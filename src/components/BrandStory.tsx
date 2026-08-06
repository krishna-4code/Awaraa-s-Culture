"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function BrandStory() {
  const containerRef = useRef<HTMLElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const layer4Ref = useRef<HTMLDivElement>(null);

  const textContentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const storyParaRef = useRef<HTMLParagraphElement>(null);
  const valuesHeaderRef = useRef<HTMLHeadingElement>(null);
  const valuesListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Reduced motion fallback: instantly set all elements to final visible state
      const allElements = [
        layer1Ref.current,
        layer2Ref.current,
        layer3Ref.current,
        layer4Ref.current,
        titleRef.current,
        storyParaRef.current,
        valuesHeaderRef.current,
        ...(valuesListRef.current ? Array.from(valuesListRef.current.children) : []),
      ];
      gsap.set(allElements.filter(Boolean), { opacity: 1, y: 0, x: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const collageLayers = [
        layer1Ref.current,
        layer2Ref.current,
        layer3Ref.current,
        layer4Ref.current,
      ].filter(Boolean);

      const textElements = [
        titleRef.current,
        storyParaRef.current,
        valuesHeaderRef.current,
      ].filter(Boolean);

      const valueItems = valuesListRef.current
        ? Array.from(valuesListRef.current.children)
        : [];

      // Master Sequenced Timeline
      // PHASE 1: Photography collage layers land and settle at different depths/timings
      // PHASE 2: Text & Core Values reveal AFTER the collage has completely settled
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Initial positions for collage (staggered depth & y-offsets)
      tl.fromTo(
        layer1Ref.current,
        { opacity: 0, y: 100, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out" },
        0
      )
      .fromTo(
        layer2Ref.current,
        { opacity: 0, y: 140, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: "power3.out" },
        0.15
      )
      .fromTo(
        layer3Ref.current,
        { opacity: 0, y: 120, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out" },
        0.3
      )
      .fromTo(
        layer4Ref.current,
        { opacity: 0, y: 160, scale: 0.86 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" },
        0.45
      );

      // Sequence gap: ensure photography collage has landed and settled before text reveals
      tl.fromTo(
        textElements,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.15 },
        "+=0.2" // Photography lands first, then text reveals
      );

      tl.fromTo(
        valueItems,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
        "-=0.2"
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-dark-bg text-warm-white py-24 md:py-36 px-6 sm:px-12 md:px-20 lg:px-24 overflow-hidden border-t border-dark-surface/60"
    >
      {/* Canvas Thread Motif — Continuous vertical accent thread connecting sections */}
      <div className="absolute top-0 left-8 md:left-24 bottom-0 w-[1px] bg-gradient-to-b from-gold-accent/40 via-gold-accent/15 to-transparent pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-20 items-center relative z-10">
        
        {/* LEFT COLUMN: Sequenced Text Content */}
        <div ref={textContentRef} className="w-full lg:w-1/2 flex flex-col gap-10">
          
          <div className="flex flex-col gap-4">
            {/* Subtle Gold Accent Tag */}
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-gold-accent font-semibold">
              Brand Origin
            </span>
            <h2
              ref={titleRef}
              className="font-display text-[clamp(2.5rem,5vw,5rem)] uppercase tracking-wide text-warm-white leading-[1.05]"
            >
              The Wanderer
            </h2>
          </div>

          <p
            ref={storyParaRef}
            className="font-sans text-base sm:text-lg md:text-xl leading-relaxed text-muted-grey max-w-xl"
          >
            <strong className="text-warm-white font-semibold">Awaraa</strong> (आवारा) means wanderer—someone always in motion, geographically, culturally, socially. We build footwear for those who move with intention and know exactly where they are going. Honest comfort, quiet craft, and enduring quality over status-signaling.
          </p>

          <div className="flex flex-col gap-6 pt-4 border-t border-dark-surface/80">
            <h3
              ref={valuesHeaderRef}
              className="font-sans text-xs uppercase tracking-[0.2em] text-muted-grey font-semibold"
            >
              Our Core Principles
            </h3>

            <ul ref={valuesListRef} className="font-display text-xl sm:text-2xl flex flex-col gap-4">
              <li className="flex items-center gap-4 group">
                <span className="text-gold-accent text-sm font-sans font-bold tracking-widest px-2 py-0.5 rounded bg-dark-surface/80 border border-gold-accent/20">
                  01
                </span>
                <span className="text-warm-white">Quality before profit</span>
              </li>
              <li className="flex items-center gap-4 group">
                <span className="text-gold-accent text-sm font-sans font-bold tracking-widest px-2 py-0.5 rounded bg-dark-surface/80 border border-gold-accent/20">
                  02
                </span>
                <span className="text-warm-white">Customer before transaction</span>
              </li>
              <li className="flex items-center gap-4 group">
                <span className="text-gold-accent text-sm font-sans font-bold tracking-widest px-2 py-0.5 rounded bg-dark-surface/80 border border-gold-accent/20">
                  03
                </span>
                <span className="text-warm-white">Comfort before trends</span>
              </li>
              <li className="flex items-center gap-4 group">
                <span className="text-gold-accent text-sm font-sans font-bold tracking-widest px-2 py-0.5 rounded bg-dark-surface/80 border border-gold-accent/20">
                  04
                </span>
                <span className="text-warm-white">Honesty before marketing</span>
              </li>
              <li className="flex items-center gap-4 group">
                <span className="text-gold-accent text-sm font-sans font-bold tracking-widest px-2 py-0.5 rounded bg-dark-surface/80 border border-gold-accent/20">
                  05
                </span>
                <span className="text-warm-white">Long-term loyalty</span>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Layered Multi-Image Collage (Rogue & Rosy Pattern) */}
        <div
          ref={collageRef}
          className="w-full lg:w-1/2 relative h-[480px] sm:h-[560px] md:h-[620px] w-full"
        >
          {/* Layer 1: Primary Portrait (Full Color, Top Left) */}
          <div
            ref={layer1Ref}
            className="absolute top-0 left-0 w-[68%] h-[68%] rounded-2xl overflow-hidden shadow-2xl z-20 border border-dark-surface"
          >
            <Image
              src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1000&q=80"
              alt="Awaraa's Culture wanderer in motion"
              fill
              sizes="(max-width: 768px) 70vw, 35vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Layer 2: Texture / Craft Detail (Full Color, Top Right) */}
          <div
            ref={layer2Ref}
            className="absolute top-10 right-0 w-[48%] h-[52%] rounded-2xl overflow-hidden shadow-xl z-10 border border-dark-surface"
          >
            <Image
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
              alt="Craftsmanship and premium materials"
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          </div>

          {/* Layer 3: Delhi Urban Street Context (Full Color, Bottom Left) */}
          <div
            ref={layer3Ref}
            className="absolute bottom-0 left-[8%] w-[52%] h-[48%] rounded-2xl overflow-hidden shadow-2xl z-30 border border-gold-accent/20"
          >
            <Image
              src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
              alt="Everyday urban footwear in Delhi NCR"
              fill
              sizes="(max-width: 768px) 55vw, 28vw"
              className="object-cover"
            />
          </div>

          {/* Layer 4: Close-up Sole Detail (Full Color, Bottom Right) */}
          <div
            ref={layer4Ref}
            className="absolute bottom-6 right-2 w-[44%] h-[42%] rounded-2xl overflow-hidden shadow-xl z-20 border border-dark-surface"
          >
            <Image
              src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80"
              alt="Durable sole texture detail"
              fill
              sizes="(max-width: 768px) 45vw, 22vw"
              className="object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
