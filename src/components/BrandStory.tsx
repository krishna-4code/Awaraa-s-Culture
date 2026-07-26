"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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
    <section ref={containerRef} className="relative w-full bg-charcoal text-dust flex flex-col md:flex-row pt-32 pb-24 z-10 overflow-hidden">
      
      {/* Massive Text (Pinned Left on Desktop, Top on Mobile) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:pl-24 md:pr-12 gap-16 relative z-20 pb-16 md:pb-0">
        <div ref={textRef} className="flex flex-col gap-6">
          <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] uppercase tracking-wide text-clay leading-none">
            The Wanderer
          </h2>
          <p className="font-sans text-lg md:text-xl leading-relaxed text-sand max-w-xl">
            <strong className="text-dust">Awaraa</strong> (आवारा) means wanderer. Someone always in motion—geographically, culturally, socially. 
            We build footwear for the restless who know exactly where they&apos;re going. Comfort, durability, and quiet confidence rather than logo-driven status.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="font-sans text-sm uppercase tracking-widest text-sand border-b border-umber pb-2 max-w-sm">
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

      {/* Photography Overflowing Right (Bottom on Mobile, Right on Desktop) */}
      <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-screen -mr-8 md:-mr-24">
        {/* Full color, zero grayscale */}
        <div className="absolute inset-0 bg-umber w-full h-full md:rounded-l-3xl overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80" 
            alt="The wanderer in motion" 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
