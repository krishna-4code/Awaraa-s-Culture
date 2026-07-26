"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Placeholder } from "@/components/Placeholder";
import { CommerceProduct } from "@/lib/commerce/types";

export function ProductDetail({ product }: { product: CommerceProduct }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    // Note: Lighter background context as requested. bg-dust with text-charcoal for high contrast.
    <main className="min-h-screen bg-dust text-charcoal flex flex-col font-sans">
      
      {/* Simple Navigation */}
      <nav className="w-full py-8 px-8 md:px-24 border-b border-umber/20 flex justify-between items-center">
        <Link href="/" className="font-display font-bold uppercase tracking-widest text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 focus-visible:ring-offset-dust">
          Awaraa&apos;s Culture
        </Link>
        <Link href="/" className="text-sm uppercase tracking-widest border-b border-charcoal/50 hover:border-charcoal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 focus-visible:ring-offset-dust">
          Back to Archive
        </Link>
      </nav>

      {/* Product Content */}
      <div className="flex-grow flex flex-col md:flex-row w-full max-w-screen-2xl mx-auto">
        
        {/* Product Imagery - Functional & Clear */}
        <div className="w-full md:w-3/5 p-8 md:p-24 flex flex-col gap-8 border-r border-umber/20">
          <div className="w-full aspect-square bg-umber relative group overflow-hidden rounded-2xl">
            <Image src={product.images[0]?.url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80"} alt={product.images[0]?.altText || "Main product placeholder"} fill sizes="(max-width: 768px) 100vw, 60vw" priority className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-charcoal/10 pointer-events-none" />
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="w-full aspect-square bg-umber relative overflow-hidden group rounded-2xl">
              <Image src={product.images[1]?.url || "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80"} alt={product.images[1]?.altText || "Detail shot 1"} fill sizes="(max-width: 768px) 50vw, 30vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-charcoal/10 pointer-events-none" />
            </div>
            <div className="w-full aspect-square bg-umber relative overflow-hidden group rounded-2xl">
              <Image src={product.images[2]?.url || "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80"} alt={product.images[2]?.altText || "Detail shot 2"} fill sizes="(max-width: 768px) 50vw, 30vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-charcoal/10 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Details - Honest & Transparent */}
        <div className="w-full md:w-2/5 p-8 md:p-24 flex flex-col sticky top-0 h-fit">
          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wide mb-4">
            <Placeholder text={product.name} />
          </h1>
          <p className="font-sans text-xl mb-12">
            <Placeholder text={product.price} />
          </p>

          <div className="flex flex-col gap-6 mb-12">
            <p className="leading-relaxed opacity-90">
              {product.description}
            </p>
            
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Honest Materials</h3>
              <ul className="list-disc pl-5 opacity-80 space-y-1">
                {product.materials.map((m, i) => (
                  <li key={i}><Placeholder text={m} /></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Size Selection */}
          <div className="flex flex-col gap-4 mb-12">
            <div className="flex justify-between items-end">
              <h3 className="text-sm font-bold uppercase tracking-widest">Select Size (UK/India)</h3>
              <button className="text-xs uppercase tracking-widest opacity-60 underline hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 focus-visible:ring-offset-dust">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {product.variants.map((variant) => (
                <button 
                  key={variant.id}
                  disabled={!variant.available}
                  onClick={() => setSelectedSize(variant.title)}
                  className={`py-3 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 focus-visible:ring-offset-dust ${
                    selectedSize === variant.title 
                      ? "bg-charcoal text-dust border-charcoal" 
                      : !variant.available
                        ? "bg-transparent text-charcoal/40 border-charcoal/10 cursor-not-allowed line-through"
                        : "bg-transparent text-charcoal border-charcoal/30 hover:border-charcoal"
                  }`}
                >
                  {variant.title}
                </button>
              ))}
            </div>
          </div>

          {/* Low friction Add to Cart. No fake scarcity. */}
          <button 
            className="w-full py-5 bg-clay text-dust font-display uppercase tracking-widest text-lg hover:scale-[1.02] transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-dust shadow-lg shadow-clay/20 rounded-xl"
          >
            {selectedSize ? `Add to Cart` : "Select a Size"}
          </button>

          {/* Trust Signals */}
          <div className="mt-8 p-6 bg-umber/10 backdrop-blur-md border border-umber/20 flex flex-col gap-4 text-sm rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">✓ <strong className="text-charcoal/80">Free Shipping:</strong> <span className="opacity-75"><Placeholder text={product.shippingPolicy} /></span></div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">✓ <strong className="text-charcoal/80">Honest Returns:</strong> <span className="opacity-75"><Placeholder text={product.returnPolicy} /></span></div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">✓ <strong className="text-charcoal/80">Care:</strong> <span className="opacity-75"><Placeholder text={product.careInstructions} /></span></div>
          </div>
        </div>
      </div>
      
      {/* JSON-LD Schema (Safe in dev due to global noindex) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://awaraa.com" // Will use process.env in prod
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Products",
                    "item": "https://awaraa.com/products"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": `PRODUCT NAME FOR ${product.handle.toUpperCase()}`
                  }
                ]
              },
              {
                "@type": "Product",
                "name": `PRODUCT NAME FOR ${product.handle.toUpperCase()}`,
                "description": product.description,
                "image": product.images[0]?.url,
                "offers": {
                  "@type": "Offer",
                  "price": "4500.00",
                  "priceCurrency": "INR",
                  "availability": "https://schema.org/InStock",
                  "url": `https://awaraa.com/products/${product.handle}`
                }
              }
            ]
          })
        }}
      />
    </main>
  );
}
