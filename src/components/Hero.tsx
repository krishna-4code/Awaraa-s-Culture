"use client";

import Link from "next/link";
import Image from "next/image";
import { MarkerUnderline } from "./MarkerUnderline";

export function Hero() {
  return (
    <section className="relative w-full pt-28 pb-20 px-6 bg-transparent text-bright-ink overflow-hidden">
      {/* Background Decorative Playful Blobs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-bright-sun/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-bright-coral/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Floating CPG Sticker Badges (Bricolage Grotesque font-accent) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <span className="cpg-badge bg-bright-sun text-bright-ink font-accent font-semibold tracking-wide animate-sticker-float">
            <span>⚡</span>
            <span>Delhi NCR Tested</span>
          </span>
          <span className="cpg-badge bg-bright-lime text-white font-accent font-semibold tracking-wide animate-sticker-float" style={{ animationDelay: "0.8s" }}>
            <span>👟</span>
            <span>Honest Comfort</span>
          </span>
        </div>

        {/* Poster-Style Headline with Reusable MarkerUnderline */}
        <h1 className="font-display font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-tight text-bright-ink leading-[0.95] mb-6 uppercase">
          Wander Without{" "}
          <MarkerUnderline
            text="LIMITS."
            annotation="Built to last"
            strokeColor="#FF5E1E"
          />
        </h1>

        {/* Plus Jakarta Sans Subtitle */}
        <p className="font-sans text-lg md:text-2xl text-bright-muted max-w-2xl font-medium mb-10 leading-relaxed">
          Street-tested footwear built for movement & honest comfort. Zero hype markups, pure craft.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link href="/#squad" className="cpg-button-primary text-base">
            <span>Explore The Squad</span>
            <span className="text-lg">➔</span>
          </Link>
          <Link href="/#matrix" className="cpg-button-secondary text-base">
            <span>Why Comfort First?</span>
          </Link>
        </div>

        {/* Layered CPG Product Card Entrance */}
        <div className="w-full max-w-4xl relative">
          <Link
            href="/products/nb-sports"
            className="cpg-card cpg-card-diecut shadow-[0_20px_50px_rgba(17,24,39,0.06)] overflow-hidden relative group border border-bright-ink/15 block"
          >
            {/* Card Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-b from-bright-card to-bright-canvas opacity-90" />

            <div className="relative z-10 py-12 px-6 flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Details */}
              <div className="text-left max-w-sm">
                <span className="cpg-badge bg-bright-amber text-white font-accent mb-3">
                  Featured Kick
                </span>
                <h3 className="font-display font-bold text-3xl md:text-4xl text-bright-ink mb-2 group-hover:text-bright-amber transition-colors">
                  NB Sports
                </h3>
                <p className="font-sans text-sm text-bright-muted mb-4 leading-relaxed">
                  Technical breathable sport mesh with high-rebound molded EVA foam midsole for all-day urban movement.
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-display font-extrabold text-2xl text-bright-amber">
                    ₹ 1,199
                  </span>
                  <span className="font-sans text-xs font-semibold text-bright-muted bg-white/90 px-3 py-1 rounded-full border border-bright-ink/10 tracking-wide">
                    High-Rebound EVA
                  </span>
                </div>
              </div>

              {/* Center Cutout Product Graphic with Real Image */}
              <div className="relative w-64 h-64 flex items-center justify-center bg-bright-sun/30 rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                <Image
                  src="/shoes/nb_sports/1.png"
                  alt="NB Sports Featured Kick"
                  fill
                  unoptimized
                  priority
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-3 bg-bright-amber/95 text-white text-xs font-accent font-bold px-3 py-1 rounded-full shadow-md">
                  NB Sports
                </div>
              </div>

              {/* Right Details */}
              <div className="flex flex-col gap-3">
                <div className="cpg-card !p-4 bg-white/90 shadow-sm text-left border-l-4 border-l-bright-lime">
                  <div className="font-sans text-xs font-bold text-bright-muted uppercase tracking-wider">Wearability</div>
                  <div className="font-display font-bold text-lg text-bright-ink">Zero Break-In Time</div>
                </div>
                <div className="cpg-card !p-4 bg-white/90 shadow-sm text-left border-l-4 border-l-bright-coral">
                  <div className="font-sans text-xs font-bold text-bright-muted uppercase tracking-wider">Community Rating</div>
                  <div className="font-display font-bold text-lg text-bright-ink">⭐ 4.9 / 5.0</div>
                </div>
              </div>

            </div>
          </Link>
        </div>

      </div>

      {/* Marquee Ticker */}
      <div className="mt-16 -mx-6 bg-bright-ink text-white py-3.5 overflow-hidden border-y border-bright-amber" aria-hidden="true">
        <div className="flex whitespace-nowrap animate-marquee-infinite font-sans text-xs md:text-sm font-bold uppercase tracking-widest gap-8">
          <span>✦ REAL COMFORT FIRST</span>
          <span>✦ DUAL-DENSITY EVA FOAM</span>
          <span>✦ ZERO HYPE MARKUPS</span>
          <span>✦ DELHI NCR CRAFTED</span>
          <span>✦ REAL COMFORT FIRST</span>
          <span>✦ DUAL-DENSITY EVA FOAM</span>
          <span>✦ ZERO HYPE MARKUPS</span>
          <span>✦ DELHI NCR CRAFTED</span>
        </div>
      </div>
    </section>
  );
}
