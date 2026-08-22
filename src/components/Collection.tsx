"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import { MarkerUnderline } from "./MarkerUnderline";
import { Plus, Minus, Check, ShoppingBag } from "lucide-react";
import type { CommerceProduct, CommerceCollection } from "@/lib/commerce/types";
import { findMockProduct } from "@/lib/commerce/mockData";

const FALLBACK_PRODUCTS = [
  {
    id: "nb-sports",
    title: "NB Sports",
    handle: "nb-sports",
    category: "daily-walkers",
    tag: "Featured Kick",
    spec: "High-Rebound Molded EVA",
    desc: "Athletic lifestyle runner engineered with lightweight breathable mesh and grip.",
    price: "1,199",
    image: "/shoes/nb_sports/Gemini_Generated_Image_1h2b5y1h2b5y1h2b.png",
    badgeColor: "bg-bright-amber text-white",
  },
  {
    id: "sb-dunks",
    title: "SB Dunks",
    handle: "sb-dunks",
    category: "street-kicks",
    tag: "Top Choice",
    spec: "Dual EVA Foam Sole",
    desc: "Iconic streetwear silhouette engineered for all-day urban movement.",
    price: "1,399",
    image: "/shoes/dunks/Gemini_Generated_Image_upq1p1upq1p1upq1.png",
    badgeColor: "bg-bright-lime text-white",
  },
  {
    id: "nb-sneakers",
    title: "NB Sneakers",
    handle: "nb-sneakers",
    category: "street-kicks",
    tag: "New Edition",
    spec: "Dual-Density EVA Midsole",
    desc: "Street-forward retro athletic runner with dual-tone paneled leather.",
    price: "1,249",
    image: "/shoes/nb_sneakers/Gemini_Generated_Image_ytxwfkytxwfkytxw.png",
    badgeColor: "bg-bright-coral text-white",
  },
  {
    id: "waffle-brown",
    title: "Waffle Brown",
    handle: "waffle-brown",
    category: "street-kicks",
    tag: "Daily Essential",
    spec: "Waffle Lug Traction Sole",
    desc: "Heritage runner styling reimagined in rich earthy tones with breathable mesh.",
    price: "1,599",
    image: "/shoes/waffel_brown/Gemini_Generated_Image_wosh4ywosh4ywosh.png",
    badgeColor: "bg-bright-amber text-white",
  },
  {
    id: "lv-sneakers",
    title: "LV Sneakers",
    handle: "lv-sneakers",
    category: "street-kicks",
    tag: "Premium Finish",
    spec: "Microfiber Leather Cupsole",
    desc: "High-end urban fashion sneaker blending runway aesthetics with robust comfort.",
    price: "1,099",
    image: "/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.46 PM.jpeg",
    badgeColor: "bg-bright-coral text-white",
  },
  {
    id: "sports",
    title: "Sports",
    handle: "sports",
    category: "daily-walkers",
    tag: "Comfort Series",
    spec: "Ultra-Light Flexible EVA",
    desc: "Ultra-lightweight everyday runner designed for daily commute and zero fatigue.",
    price: "999",
    image: "/shoes/sports/WhatsApp Image 2026-08-20 at 1.42.50 PM.jpeg",
    badgeColor: "bg-bright-lime text-white",
  },
  {
    id: "sketchers-sports",
    title: "Sketchers Sports",
    handle: "sketchers-sports",
    category: "daily-walkers",
    tag: "Plush Cushion",
    spec: "Segmented EVA Midsole",
    desc: "Plush all-day walking shoe featuring high-rebound cushioning and responsive arch support.",
    price: "1,579",
    image: "/shoes/sketchers/Gemini_Generated_Image_iptr9iptr9iptr9i.png",
    badgeColor: "bg-bright-amber text-white",
  },
  {
    id: "brooks",
    title: "Brooks",
    handle: "brooks",
    category: "daily-walkers",
    tag: "Endurance Series",
    spec: "Bio-Cushioned Road Sole",
    desc: "High-performance endurance walking shoe with structured heel stabilizer.",
    price: "1,399",
    image: "/shoes/brooks/Gemini_Generated_Image_7ol72i7ol72i7ol7.png",
    badgeColor: "bg-bright-coral text-white",
  },
];

const FALLBACK_TABS = [
  { id: "all", label: "All Squad" },
  { id: "daily-walkers", label: "Daily Walkers" },
  { id: "street-kicks", label: "Street Kicks" },
  { id: "terrain-comfort", label: "Terrain Comfort" },
];

export function Collection({
  initialProducts,
  initialCollections,
}: {
  initialProducts?: CommerceProduct[];
  initialCollections?: CommerceCollection[];
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const { cart, addItem, updateItem, removeItem } = useCart();

  // Map products from CMS or use fallback
  const displayProducts = initialProducts && initialProducts.length > 0
    ? initialProducts.map((p, idx) => {
        const badgeColors = [
          "bg-bright-amber text-white",
          "bg-bright-lime text-white",
          "bg-bright-coral text-white",
        ];
        const tags = ["Daily Essential", "New Edition", "Comfort Series"];
        return {
          id: p.id,
          title: p.name,
          handle: p.handle,
          category: p.collectionSlug || "daily-walkers",
          tag: tags[idx % tags.length],
          spec: p.materials?.[0] || "Dual EVA Foam Sole",
          desc: p.description || "Built for daily hustle, zero hype markups, pure craft.",
          price: p.price.replace(/[^0-9,]/g, ""),
          image: p.images?.[0]?.url || "/shoes/nb_sports/Gemini_Generated_Image_1h2b5y1h2b5y1h2b.png",
          badgeColor: badgeColors[idx % badgeColors.length],
          rawProduct: p,
        };
      })
    : FALLBACK_PRODUCTS.map((p) => ({ ...p, rawProduct: undefined }));

  // Build filter tabs from CMS collections or fallback
  const tabs = initialCollections && initialCollections.length > 0
    ? [{ id: "all", label: "All Squad" }, ...initialCollections.map(c => ({ id: c.handle, label: c.title }))]
    : FALLBACK_TABS;

  const getProductCartLine = (productId: string, handle?: string) => {
    if (!cart?.lines) return null;
    return (
      cart.lines.find(
        (l) =>
          l.merchandise.product.id === productId ||
          l.merchandise.product.id === handle ||
          l.merchandise.product.handle === handle ||
          l.merchandise.product.handle === productId
      ) || null
    );
  };

  const getProductQuantity = (productId: string, handle?: string) => {
    if (!cart?.lines) return 0;
    return cart.lines
      .filter(
        (l) =>
          l.merchandise.product.id === productId ||
          l.merchandise.product.id === handle ||
          l.merchandise.product.handle === handle ||
          l.merchandise.product.handle === productId
      )
      .reduce((sum, line) => sum + line.quantity, 0);
  };

  const buildCommerceProduct = (product: (typeof displayProducts)[0]): CommerceProduct => {
    // rawProduct (from CMS) has the most accurate data — use it directly
    if (product.rawProduct) {
      return product.rawProduct;
    }
    // Try mock catalog to get consistent IDs and full variant list
    const mockProduct = findMockProduct(product.id) || findMockProduct(product.handle);
    if (mockProduct) {
      return mockProduct;
    }
    // Fallback: build a minimal product representation
    return {
      id: product.id,
      handle: product.handle,
      name: product.title,
      price: `₹${product.price}`,
      description: product.desc,
      materials: [product.spec],
      variants: [
        { id: `${product.id}__default`, title: "Standard", available: true, size: "8" }
      ],
      images: [{ url: product.image, altText: product.title }],
      shippingPolicy: "Free express shipping across India on all orders. Dispatched within 24 hours.",
      returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
      careInstructions: "Wipe clean with a damp cloth."
    };
  };

  const handleQuickAdd = async (product: (typeof displayProducts)[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productObj = buildCommerceProduct(product);
    const variantObj = productObj.variants[0] || { id: `${product.id}__default`, title: "Standard", available: true };
    
    await addItem(variantObj.id, 1, false, productObj, variantObj);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1200);
  };

  const handleIncrement = async (product: (typeof displayProducts)[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const line = getProductCartLine(product.id, product.handle);
    if (line) {
      await updateItem(line.id, line.quantity + 1);
    } else {
      const productObj = buildCommerceProduct(product);
      const variantObj = productObj.variants[0] || { id: `${product.id}__default`, title: "Standard", available: true };
      await addItem(variantObj.id, 1, false, productObj, variantObj);
    }
  };

  const handleDecrement = async (productId: string, handle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const line = getProductCartLine(productId, handle);
    if (!line) return;
    if (line.quantity <= 1) {
      await removeItem(line.id);
    } else {
      await updateItem(line.id, line.quantity - 1);
    }
  };

  const filteredProducts = activeFilter === "all" 
    ? displayProducts 
    : displayProducts.filter(p => p.category === activeFilter);

  return (
    <section id="squad" className="w-full bg-transparent text-bright-ink py-24 px-6 relative overflow-hidden border-t border-bright-ink/10">
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
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`font-sans text-xs uppercase tracking-wider font-bold px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-bright-ink text-white shadow-sm"
                  : "bg-white/80 text-bright-muted hover:text-bright-ink hover:bg-white border border-bright-ink/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Shoe Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const inCartQty = getProductQuantity(product.id, product.handle);

            return (
              <div
                key={product.id}
                className="cpg-card flex flex-col justify-between group relative overflow-hidden bg-white/90 border border-bright-ink/10 hover:border-bright-amber/50 hover:shadow-lg transition-all duration-300"
              >
                {/* Header Tag / In-Cart Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`cpg-badge text-[11px] font-accent font-bold px-3 py-1 rounded-full ${product.badgeColor}`}>
                    {product.tag}
                  </span>
                  {inCartQty > 0 ? (
                    <span className="font-sans text-xs font-bold text-bright-ink bg-bright-lime/20 border border-bright-lime/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-fadeIn">
                      <ShoppingBag className="w-3 h-3 text-bright-lime" />
                      {inCartQty} in cart
                    </span>
                  ) : (
                    <span className="font-sans text-xs font-semibold text-bright-muted">
                      {product.spec}
                    </span>
                  )}
                </div>

                {/* Product Image Link */}
                <Link
                  href={`/products/${product.handle}`}
                  className="relative w-full h-64 bg-bright-card rounded-2xl overflow-hidden flex items-center justify-center p-4 block"
                >
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
                </Link>

                {/* Product Details */}
                <div className="flex flex-col gap-2 mt-4">
                  <Link
                    href={`/products/${product.handle}`}
                    className="font-display font-bold text-2xl text-bright-ink group-hover:text-bright-amber transition-colors duration-200"
                  >
                    {product.title}
                  </Link>
                  <p className="font-sans text-sm text-bright-muted line-clamp-2">
                    {product.desc}
                  </p>
                </div>

                {/* Price & Quick Add / Quantity Controls */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-bright-ink/10">
                  <div>
                    <span className="font-sans text-xs text-bright-muted font-medium block">Price</span>
                    <span className="font-display font-extrabold text-xl text-bright-ink">
                      ₹ {product.price}
                    </span>
                  </div>

                  {inCartQty > 0 ? (
                    <div className="flex items-center gap-1 bg-bright-card border border-bright-ink/20 rounded-full p-1 shadow-sm">
                      <button
                        type="button"
                        onClick={(e) => handleDecrement(product.id, product.handle, e)}
                        className="w-7 h-7 rounded-full bg-white hover:bg-bright-ink hover:text-white text-bright-ink flex items-center justify-center text-xs font-bold shadow-sm transition-all active:scale-90"
                        aria-label={`Decrease quantity of ${product.title}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-sans font-bold text-xs px-2 text-bright-ink min-w-[2.2rem] text-center">
                        {inCartQty}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleIncrement(product, e)}
                        className="w-7 h-7 rounded-full bg-bright-amber hover:bg-bright-ink text-white flex items-center justify-center text-xs font-bold shadow-sm transition-all active:scale-90"
                        aria-label={`Increase quantity of ${product.title}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`font-sans text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition-all duration-200 shadow-sm active:scale-90 cursor-pointer ${
                        addedItem === product.id
                          ? "bg-bright-lime text-white scale-105"
                          : "bg-bright-amber text-white hover:bg-bright-ink hover:scale-105"
                      }`}
                    >
                      {addedItem === product.id ? "✓ Added!" : "+ Add to Cart"}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
