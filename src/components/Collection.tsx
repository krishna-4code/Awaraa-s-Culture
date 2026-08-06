"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCollection } from "@/lib/commerce";
import { CommerceCollection } from "@/lib/commerce/types";
import { Placeholder } from "@/components/Placeholder";

export function Collection() {
  const [categories, setCategories] = useState<CommerceCollection[]>([]);

  useEffect(() => {
    getCollection().then(data => setCategories(data));
  }, []);

  return (
    <section className="w-full bg-dark-bg text-warm-white py-28 md:py-40 px-6 sm:px-12 md:px-20 lg:px-24 border-t border-dark-surface relative overflow-hidden">
      
      {/* Canvas Thread Accent Line */}
      <div className="absolute top-0 left-12 md:left-24 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold-accent/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-dark-surface pb-8">
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-gold-accent font-semibold block mb-2">
              Meet the Squad
            </span>
            <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] uppercase tracking-wide text-warm-white leading-none">
              Curated Collections
            </h2>
          </div>
          <p className="font-sans text-sm text-muted-grey max-w-md">
            Hover over any category to reveal squad specs and details. Premium craft, zero status markup.
          </p>
        </div>

        {/* Collection Grid Showcase (OLIPOP "Meet the Squad" Adapted Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.length > 0 ? (
            categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/products/${cat.handle}`}
                className="group relative flex flex-col bg-dark-surface/60 border border-dark-surface rounded-2xl overflow-hidden transition-all duration-500 hover:border-gold-accent/60 hover:bg-dark-surface hover:shadow-[0_10px_30px_rgba(197,160,89,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent"
              >
                {/* Product Image Container */}
                <div className="w-full aspect-[4/5] relative overflow-hidden bg-dark-secondary">
                  <Image
                    src={cat.imageUrl}
                    alt={`${cat.title} category`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
                  />
                  {/* Gentle hover vignette shift */}
                  <div className="absolute inset-0 bg-dark-bg/20 opacity-40 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none" />

                  {/* Resting state category number badge */}
                  <div className="absolute top-4 left-4 bg-dark-bg/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-sans font-bold tracking-widest text-warm-white group-hover:text-gold-accent group-hover:border-gold-accent/40 border border-dark-surface transition-colors duration-300">
                    0{i + 1}
                  </div>
                </div>

                {/* Card Content & Hover Reveal Details */}
                <div className="p-6 sm:p-8 flex flex-col gap-4 flex-grow justify-between">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-2xl uppercase tracking-wide text-warm-white group-hover:text-gold-accent transition-colors duration-300">
                      {cat.title}
                    </h3>
                    <p className="font-sans text-sm text-muted-grey leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  {/* Hover Reveal Details Action Row */}
                  <div className="flex items-center justify-between pt-4 border-t border-dark-surface/80 group-hover:border-gold-accent/30 transition-colors duration-300 mt-2">
                    <span className="font-sans text-xs uppercase tracking-widest text-muted-grey group-hover:text-gold-accent transition-colors duration-300 font-semibold">
                      Explore Squad
                    </span>
                    <span className="text-muted-grey group-hover:text-gold-accent group-hover:translate-x-1 transition-all duration-300 motion-reduce:group-hover:translate-x-0">
                      &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            /* Fallback skeleton placeholders */
            [1, 2, 3].map((_, i) => (
              <div key={i} className="bg-dark-surface/60 border border-dark-surface rounded-2xl p-6 flex flex-col gap-4">
                <div className="aspect-[4/5] bg-dark-secondary rounded-xl animate-pulse" />
                <Placeholder text="Loading category data..." />
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
