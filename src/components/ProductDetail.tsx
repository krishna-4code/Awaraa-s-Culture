"use client";

import Link from "next/link";
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
          Awaraa's Culture
        </Link>
        <Link href="/" className="text-sm uppercase tracking-widest border-b border-charcoal/50 hover:border-charcoal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 focus-visible:ring-offset-dust">
          Back to Archive
        </Link>
      </nav>

      {/* Product Content */}
      <div className="flex-grow flex flex-col md:flex-row w-full max-w-screen-2xl mx-auto">
        
        {/* Product Imagery - Functional & Clear */}
        <div className="w-full md:w-3/5 p-8 md:p-24 flex flex-col gap-8 border-r border-umber/20">
          <div className="w-full aspect-square bg-[#D8CFB5] relative group overflow-hidden">
            <img src={product.images[0]?.url || "https://picsum.photos/seed/main/1000/1000"} alt={product.images[0]?.altText || "Main product placeholder"} className="absolute inset-0 w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="absolute inset-0 bg-charcoal/10 pointer-events-none" />
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="w-full aspect-square bg-[#D8CFB5] relative overflow-hidden group">
              <img src={product.images[1]?.url || "https://picsum.photos/seed/detail1/800/800"} alt={product.images[1]?.altText || "Detail shot 1"} className="absolute inset-0 w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="absolute inset-0 bg-charcoal/10 pointer-events-none" />
            </div>
            <div className="w-full aspect-square bg-[#D8CFB5] relative overflow-hidden group">
              <img src={product.images[2]?.url || "https://picsum.photos/seed/detail2/800/800"} alt={product.images[2]?.altText || "Detail shot 2"} className="absolute inset-0 w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
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
            className="w-full py-5 bg-charcoal text-dust font-display uppercase tracking-widest text-lg hover:bg-[#2C2622] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 focus-visible:ring-offset-dust"
          >
            {selectedSize ? `Add to Cart` : "Select a Size"}
          </button>

          {/* Trust Signals */}
          <div className="mt-8 pt-8 border-t border-umber/20 flex flex-col gap-4 opacity-75 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">✓ <strong>Free Shipping:</strong> <Placeholder text={product.shippingPolicy} /></div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">✓ <strong>Honest Returns:</strong> <Placeholder text={product.returnPolicy} /></div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">✓ <strong>Care:</strong> <Placeholder text={product.careInstructions} /></div>
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
