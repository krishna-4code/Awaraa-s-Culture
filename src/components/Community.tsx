"use client";

import Image from "next/image";
import { Placeholder } from "@/components/Placeholder";

const COMMUNITY_PHOTOS = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    caption: "Connaught Place, Delhi",
    user: "@restless_delhi",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
    caption: "Hauz Khas Social",
    user: "@awaraa_stories",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    caption: "Lodhi Art District",
    user: "@movement.ncr",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
    caption: "Cyber Hub Gurgaon",
    user: "@quiet_craft",
  },
];

export function Community() {
  return (
    <section className="w-full bg-dark-bg text-warm-white py-28 md:py-40 px-6 sm:px-12 md:px-20 lg:px-24 border-t border-dark-surface relative overflow-hidden">
      
      {/* Canvas Thread Accent Line */}
      <div className="absolute top-0 right-16 md:right-36 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold-accent/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-dark-surface pb-8">
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-gold-accent font-semibold block mb-2">
              Community In Motion
            </span>
            <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] uppercase tracking-wide text-warm-white leading-none">
              On the Streets
            </h2>
          </div>
          <p className="font-sans text-sm text-muted-grey max-w-md">
            Real people, real movement across Delhi NCR. Tag <strong className="text-warm-white">#AwaraasCulture</strong> to be featured.
          </p>
        </div>

        {/* Rogue & Rosy Style Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {COMMUNITY_PHOTOS.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square bg-dark-surface rounded-2xl overflow-hidden border border-dark-surface hover:border-gold-accent/50 transition-all duration-500 hover:shadow-[0_8px_25px_rgba(197,160,89,0.15)]"
            >
              {/* Full color photo */}
              <Image
                src={item.url}
                alt={`Community photo at ${item.caption}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
              />

              {/* Hover Overlay Reveal */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-dark-bg/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end gap-2">
                <span className="font-display text-sm uppercase tracking-wide text-warm-white">
                  {item.caption}
                </span>
                <span className="font-sans text-xs text-gold-accent">
                  {item.user}
                </span>
                <div className="pt-2">
                  <Placeholder text="[[Customer Photo Tagged]]" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
