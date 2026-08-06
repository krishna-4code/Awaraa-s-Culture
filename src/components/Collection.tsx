"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "./CartContext";
import { MarkerUnderline } from "./MarkerUnderline";

const SQUAD_PRODUCTS = [
  {
    id: "awaraa-classic-low",
    title: "Awaraa Classic Low",
    handle: "awaraa-classic-low",
    category: "daily-walkers",
    tag: "Daily Essential",
    spec: "Dual EVA Foam Sole",
    desc: "Lightweight daily walker built for all-day urban movement.",
    price: "2,999",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    badgeColor: "bg-bright-amber text-white",
  },
  {
    id: "awaraa-street-glide",
    title: "Awaraa Street Glide",
    handle: "awaraa-street-glide",
    category: "street-kicks",
    tag: "New Edition",
    spec: "Reinforced Sole Grip",
    desc: "Low-profile street silhouette crafted for NCR pavement.",
    price: "2,999",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    badgeColor: "bg-bright-lime text-white",
  },
  {
    id: "awaraa-terrain-pace",
    title: "Awaraa Pace High",
    handle: "awaraa-pace-high",
    category: "terrain-comfort",
    tag: "High-Top Support",
    spec: "Ergonomic Heel Cushion",
    desc: "High-top stability with breathable canvas upper.",
    price: "3,299",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    badgeColor: "bg-bright-coral text-white",
  },
];

export function Collection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const { addItem } = useCart();

  const handleQuickAdd = (id: string) => {
    addItem(id, 1);
    setAddedItem(id);
    setTimeout(() => setAddedItem(null), 1200);
  };

  const filteredProducts = activeFilter === "all" 
    ? SQUAD_PRODUCTS 
    : SQUAD_PRODUCTS.filter(p => p.category === activeFilter);

  return (
    <section id="squad" className="w-full bg-bright-canvas text-bright-ink py-24 px-6 relative overflow-hidden border-t border-bright-ink/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Section Header with MarkerUnderline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-bright-ink/10 pb-8">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold block mb-2">
              ✦ CPG Footwear Lineup
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-bright-ink">
              Meet The{" "}
              <MarkerUnderline
                text="SQUAD"
                annotation="Select Kicks"
                strokeColor="#88C057"
              />
            </h2>
          </div>
          <p className="font-sans text-base text-bright-muted max-w-md">
            Pick your pair. Built for daily hustle, zero hype markups, pure craft.
          </p>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          {[
            { id: "all", label: "All Squad" },
            { id: "daily-walkers", label: "Daily Walkers" },
            { id: "street-kicks", label: "Street Kicks" },
            { id: "terrain-comfort", label: "Terrain Comfort" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`font-sans text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full border transition-all duration-200 ${
                activeFilter === tab.id
                  ? "bg-bright-ink text-white border-bright-ink shadow-md scale-105"
                  : "bg-bright-card text-bright-ink border-bright-ink/15 hover:border-bright-ink/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Showcase Grid with Product Images & Spring Bounce Quick Add */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="cpg-card cpg-card-diecut relative flex flex-col justify-between group overflow-hidden border border-bright-ink/15 hover:border-bright-amber transition-all duration-300 bg-white"
            >
              {/* Card Header Tag (Bricolage Grotesque font-accent) */}
              <div className="flex items-center justify-between mb-4">
                <span className={`cpg-badge ${product.badgeColor} font-accent`}>
                  {product.tag}
                </span>
                <span className="font-sans text-xs font-semibold text-bright-muted tracking-wide">
                  {product.spec}
                </span>
              </div>

              {/* Product Visual Area with High-Quality Footwear Photo */}
              <div className="w-full aspect-[4/3] rounded-xl relative overflow-hidden border border-bright-ink/5 group-hover:shadow-md transition-shadow duration-300 my-2 bg-bright-card/50">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 font-accent text-[10px] bg-bright-ink/80 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {product.title}
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-col gap-2 mt-4">
                <h3 className="font-display font-bold text-2xl text-bright-ink group-hover:text-bright-amber transition-colors duration-200">
                  {product.title}
                </h3>
                <p className="font-sans text-sm text-bright-muted line-clamp-2">
                  {product.desc}
                </p>
              </div>

              {/* Price & Quick Add Button with Press/Bounce & Success Flash */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-bright-ink/10">
                <div>
                  <span className="font-sans text-xs text-bright-muted font-medium block">Price</span>
                  <span className="font-display font-extrabold text-xl text-bright-ink">
                    ₹ {product.price}
                  </span>
                </div>
                <button
                  onClick={() => handleQuickAdd(product.id)}
                  className={`font-sans text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition-all duration-200 shadow-sm active:scale-90 ${
                    addedItem === product.id
                      ? "bg-bright-lime text-white scale-105"
                      : "bg-bright-amber text-white hover:bg-bright-ink hover:scale-105"
                  }`}
                >
                  {addedItem === product.id ? "✓ Added!" : "+ Add to Cart"}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
