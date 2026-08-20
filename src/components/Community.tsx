"use client";

import Image from "next/image";

const MOODBOARD_PHOTOS = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    caption: "Connaught Place, Delhi",
    badge: "Connaught Place",
    spot: "Urban Transit",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
    caption: "Hauz Khas Social",
    badge: "Hauz Khas",
    spot: "Evening Movement",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    caption: "Lodhi Art District",
    badge: "Lodhi Art",
    spot: "Street Architecture",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
    caption: "Cyber Hub Gurgaon",
    badge: "Cyber Hub",
    spot: "Daily Commute",
  },
];

export function Community() {
  return (
    <section className="w-full bg-transparent text-bright-ink py-24 px-6 relative overflow-hidden border-t border-bright-ink/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-bright-ink/10 pb-8">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold block mb-2">
              ✦ Street Culture & Movement
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-bright-ink">
              On The Streets
            </h2>
          </div>
          <p className="font-sans text-base text-bright-muted max-w-md">
            Delhi NCR street style moodboard. Tag <strong className="text-bright-ink font-semibold">#AwaraasCulture</strong> on Instagram to get featured in our inaugural community drop.
          </p>
        </div>

        {/* CPG Curated Street Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {MOODBOARD_PHOTOS.map((item) => (
            <div
              key={item.id}
              className="cpg-card !p-3 group relative aspect-square bg-white rounded-2xl overflow-hidden border border-bright-ink/15 hover:border-bright-amber transition-all duration-300 shadow-sm"
            >
              <div className="w-full h-full relative rounded-xl overflow-hidden">
                <Image
                  src={item.url}
                  alt={`Street moodboard capture at ${item.caption}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                
                {/* Sticker Badge overlay */}
                <div className="absolute top-3 left-3">
                  <span className="cpg-badge bg-bright-sun text-bright-ink !text-[10px] font-sans font-bold tracking-wider">
                    {item.badge}
                  </span>
                </div>

                {/* Hover Reveal Overlay */}
                <div className="absolute inset-0 bg-bright-ink/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end gap-1 text-white">
                  <span className="font-display font-extrabold text-sm uppercase">
                    {item.caption}
                  </span>
                  <span className="font-sans text-xs font-semibold text-bright-sun tracking-wider">
                    {item.spot}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
