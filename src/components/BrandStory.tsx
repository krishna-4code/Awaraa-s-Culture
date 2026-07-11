"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function BrandStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1,
      }
    });

    tl.fromTo(textRef.current, 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1 }
    )
    .fromTo(valuesRef.current?.children || [], 
      { opacity: 0, x: -20 }, 
      { opacity: 1, x: 0, duration: 1, stagger: 0.2 },
      "-=0.5"
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen bg-charcoal text-dust flex items-center justify-end px-8 md:px-24 py-24 z-10 overflow-hidden">
      {/* The canvas from the Hero section will visually appear on the left because it is pinned and moves left. */}
      {/* This section contains the text that fades in on the right. */}
      
      <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col gap-12 relative z-20">
        <div ref={textRef} className="flex flex-col gap-6">
          <h2 className="font-display text-4xl md:text-5xl uppercase tracking-wide text-clay">
            The Wanderer
          </h2>
          <p className="font-sans text-lg md:text-xl leading-relaxed text-sand">
            <strong className="text-dust">Awaraa</strong> (आवारा) means wanderer. Someone always in motion—geographically, culturally, socially. 
            We build footwear for the restless who know exactly where they're going. Comfort, durability, and quiet confidence rather than logo-driven status.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="font-sans text-sm uppercase tracking-widest text-sand border-b border-umber pb-2">
            Our Core Values
          </h3>
          <ul ref={valuesRef} className="font-display text-2xl md:text-3xl flex flex-col gap-4">
            <li className="flex items-center gap-4">
              <span className="text-clay text-lg">01</span> Quality before profit
            </li>
            <li className="flex items-center gap-4">
              <span className="text-clay text-lg">02</span> Customer before transaction
            </li>
            <li className="flex items-center gap-4">
              <span className="text-clay text-lg">03</span> Comfort before trends
            </li>
            <li className="flex items-center gap-4">
              <span className="text-clay text-lg">04</span> Honesty before marketing
            </li>
            <li className="flex items-center gap-4">
              <span className="text-clay text-lg">05</span> Long-term loyalty
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
