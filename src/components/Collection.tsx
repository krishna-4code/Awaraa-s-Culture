"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import { MarkerUnderline } from "./MarkerUnderline";
import { Plus, Minus, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import type { CommerceProduct, CommerceCollection } from "@/lib/commerce/types";
import { findMockProduct } from "@/lib/commerce/mockData";

export interface ShoeCardProduct {
  id: string;
  title: string;
  handle: string;
  category: string;
  tag: string;
  spec: string;
  desc: string;
  price: string;
  image: string;
  images: { url: string; altText: string }[];
  badgeColor: string;
  rawProduct?: CommerceProduct;
}

const FALLBACK_PRODUCTS: ShoeCardProduct[] = [
  {
    id: "nb-sports",
    title: "NB Sports",
    handle: "nb-sports",
    category: "daily-walkers",
    tag: "Featured Kick",
    spec: "High-Rebound Molded EVA",
    desc: "Athletic lifestyle runner engineered with lightweight breathable mesh and grip.",
    price: "1,199",
    image: "/shoes/nb_sports/1.png",
    images: [
      {
        url: "/shoes/nb_sports/1.png",
        altText: "NB Sports - Angle 1"
      },
      {
        url: "/shoes/nb_sports/2.jpeg",
        altText: "NB Sports - Angle 2"
      },
      {
        url: "/shoes/nb_sports/3.jpeg",
        altText: "NB Sports - Angle 3"
      },
      {
        url: "/shoes/nb_sports/4.jpeg",
        altText: "NB Sports - Angle 4"
      }
    ],
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
    images: [
      {
        url: "/shoes/dunks/Gemini_Generated_Image_upq1p1upq1p1upq1.png",
        altText: "SB Dunks - Front Hero View"
      },
      {
        url: "/shoes/dunks/WhatsApp Image 2026-08-18 at 6.51.46 PM.jpeg",
        altText: "SB Dunks - Studio Angle"
      },
      {
        url: "/shoes/dunks/WhatsApp Image 2026-08-18 at 6.51.46 PM (1).jpeg",
        altText: "SB Dunks - Side Profile"
      }
    ],
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
    image: "/shoes/nb_sneakers/1.png",
    images: [
      {
        url: "/shoes/nb_sneakers/1.png",
        altText: "NB Sneakers - Hero Angle"
      }
    ],
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
    images: [
      {
        url: "/shoes/waffel_brown/Gemini_Generated_Image_wosh4ywosh4ywosh.png",
        altText: "Waffle Brown - Hero Profile"
      }
    ],
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
    images: [
      {
        url: "/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.46 PM.jpeg",
        altText: "LV Sneakers - Studio View"
      },
      {
        url: "/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.47 PM.jpeg",
        altText: "LV Sneakers - Side Profile"
      },
      {
        url: "/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.47 PM (1).jpeg",
        altText: "LV Sneakers - Detail Angle"
      }
    ],
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
    image: "/shoes/sports/1.jpeg",
    images: [
      {
        url: "/shoes/sports/1.jpeg",
        altText: "Sports - Angle 1"
      },
      {
        url: "/shoes/sports/2.jpeg",
        altText: "Sports - Angle 2"
      },
      {
        url: "/shoes/sports/3.jpeg",
        altText: "Sports - Angle 3"
      },
      {
        url: "/shoes/sports/4.jpeg",
        altText: "Sports - Angle 4"
      }
    ],
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
    images: [
      {
        url: "/shoes/sketchers/Gemini_Generated_Image_iptr9iptr9iptr9i.png",
        altText: "Sketchers Sports - Hero View"
      }
    ],
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
    images: [
      {
        url: "/shoes/brooks/Gemini_Generated_Image_7ol72i7ol72i7ol7.png",
        altText: "Brooks - Hero Studio Angle"
      }
    ],
    badgeColor: "bg-bright-coral text-white",
  },
];

const FALLBACK_TABS = [
  { id: "all", label: "All Squad" },
  { id: "daily-walkers", label: "Daily Walkers" },
  { id: "street-kicks", label: "Street Kicks" },
  { id: "terrain-comfort", label: "Terrain Comfort" },
];

function ShoeCardItem({
  product,
  inCartQty,
  addedItem,
  onQuickAdd,
  onIncrement,
  onDecrement,
}: {
  product: ShoeCardProduct;
  inCartQty: number;
  addedItem: string | null;
  onQuickAdd: (product: ShoeCardProduct, e: React.MouseEvent) => void;
  onIncrement: (product: ShoeCardProduct, e: React.MouseEvent) => void;
  onDecrement: (productId: string, handle: string, e: React.MouseEvent) => void;
}) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: product.image, altText: product.title }];

  const currentImg = images[activeImgIndex] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSelectDot = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex(idx);
  };

  return (
    <div className="cpg-card flex flex-col justify-between group relative overflow-hidden bg-white/90 border border-bright-ink/10 hover:border-bright-amber/50 hover:shadow-lg transition-all duration-300">
      
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

      {/* Product Image Area with Multi-Image Carousel */}
      <div className="relative w-full h-64 bg-bright-card rounded-2xl overflow-hidden flex items-center justify-center group/img">
        <Link
          href={`/products/${product.handle}`}
          className="relative w-full h-full block"
          title={`View ${product.title}`}
        >
          <Image
            src={currentImg.url}
            alt={currentImg.altText || product.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover/img:scale-105"
          />
        </Link>

        {/* Top-right shoe label sticker */}
        <div className="absolute top-2.5 right-2.5 font-accent text-[10px] bg-bright-ink/80 text-white px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none z-10 shadow-sm">
          {product.title}
        </div>

        {/* Top-left image counter pill when multiple images exist */}
        {images.length > 1 && (
          <div className="absolute top-2.5 left-2.5 font-sans font-bold text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm pointer-events-none z-10 tracking-wider">
            {activeImgIndex + 1} / {images.length}
          </div>
        )}

        {/* Previous Image Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label={`Previous image of ${product.title}`}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-bright-ink shadow-md flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-200 z-20 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Next Image Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label={`Next image of ${product.title}`}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-bright-ink shadow-md flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-200 z-20 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Bottom Pagination Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full z-20 shadow-sm">
            {images.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={(e) => handleSelectDot(dotIdx, e)}
                aria-label={`Select photo ${dotIdx + 1} for ${product.title}`}
                className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  activeImgIndex === dotIdx
                    ? "w-4 bg-bright-amber"
                    : "w-1.5 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>

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
              onClick={(e) => onDecrement(product.id, product.handle, e)}
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
              onClick={(e) => onIncrement(product, e)}
              className="w-7 h-7 rounded-full bg-bright-amber hover:bg-bright-ink text-white flex items-center justify-center text-xs font-bold shadow-sm transition-all active:scale-90"
              aria-label={`Increase quantity of ${product.title}`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => onQuickAdd(product, e)}
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
}

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
  const displayProducts: ShoeCardProduct[] = initialProducts && initialProducts.length > 0
    ? initialProducts.map((p, idx) => {
        const badgeColors = [
          "bg-bright-amber text-white",
          "bg-bright-lime text-white",
          "bg-bright-coral text-white",
        ];
        const tags = ["Daily Essential", "New Edition", "Comfort Series"];
        const fallbackMatch = FALLBACK_PRODUCTS.find(
          (fb) => fb.id === p.id || fb.handle === p.handle || fb.title.toLowerCase() === p.name.toLowerCase()
        );
        const resolvedImages: { url: string; altText: string }[] = p.images && p.images.length > 0
          ? p.images.map((img) => ({ url: img.url, altText: img.altText || p.name }))
          : (fallbackMatch?.images || [{ url: "/shoes/nb_sports/1.png", altText: p.name }]);

        return {
          id: p.id,
          title: p.name,
          handle: p.handle,
          category: p.collectionSlug || "daily-walkers",
          tag: tags[idx % tags.length],
          spec: p.materials?.[0] || "Dual EVA Foam Sole",
          desc: p.description || "Built for daily hustle, zero hype markups, pure craft.",
          price: p.price.replace(/[^0-9,]/g, ""),
          image: resolvedImages[0]?.url || "/shoes/nb_sports/1.png",
          images: resolvedImages,
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

  const buildCommerceProduct = (product: ShoeCardProduct): CommerceProduct => {
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
      images: product.images && product.images.length > 0 
        ? product.images.map(img => ({ url: img.url, altText: img.altText || product.title }))
        : [{ url: product.image, altText: product.title }],
      shippingPolicy: "Free express shipping across India on all orders. Dispatched within 24 hours.",
      returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
      careInstructions: "Wipe clean with a damp cloth."
    };
  };

  const handleQuickAdd = async (product: ShoeCardProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productObj = buildCommerceProduct(product);
    const variantObj = productObj.variants[0] || { id: `${product.id}__default`, title: "Standard", available: true };
    
    await addItem(variantObj.id, 1, false, productObj, variantObj);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1200);
  };

  const handleIncrement = async (product: ShoeCardProduct, e: React.MouseEvent) => {
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
              <ShoeCardItem
                key={product.id}
                product={product}
                inCartQty={inCartQty}
                addedItem={addedItem}
                onQuickAdd={handleQuickAdd}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}
