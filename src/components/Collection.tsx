"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import { MarkerUnderline } from "./MarkerUnderline";
import { Plus, Minus, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import type { CommerceProduct, CommerceCollection } from "@/lib/commerce/types";
import { findMockProduct } from "@/lib/commerce/mockData";
import { getProductGalleryImages, getProductPrimaryImage } from "@/lib/commerce/productImages";

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
    id: "aero-tide",
    title: "Aero Tide",
    handle: "aero-tide",
    category: "daily-walkers",
    tag: "Featured Kick",
    spec: "High-Rebound Molded EVA",
    desc: "White performance runner with aqua sculpted sole, lightweight breathable mesh, and multi-surface grip.",
    price: "1,099",
    image: "/shoes/nb_sports/1.png",
    images: [
      {
        url: "/shoes/nb_sports/1.png",
        altText: "Aero Tide - Angle 1"
      },
      {
        url: "/shoes/nb_sports/2.jpeg",
        altText: "Aero Tide - Angle 2"
      },
      {
        url: "/shoes/nb_sports/3.jpeg",
        altText: "Aero Tide - Angle 3"
      },
      {
        url: "/shoes/nb_sports/4.jpeg",
        altText: "Aero Tide - Angle 4"
      }
    ],
    badgeColor: "bg-bright-amber text-white",
  },
  {
    id: "cocoa-drift",
    title: "Cocoa Drift",
    handle: "cocoa-drift",
    category: "street-kicks",
    tag: "Top Choice",
    spec: "Dual EVA Foam Sole",
    desc: "Cream/off-white retro sneaker with dark brown side accent engineered for all-day urban movement.",
    price: "1,199",
    image: "/shoes/dunks/Gemini_Generated_Image_upq1p1upq1p1upq1.png",
    images: [
      {
        url: "/shoes/dunks/Gemini_Generated_Image_upq1p1upq1p1upq1.png",
        altText: "Cocoa Drift - Front Hero View"
      },
      {
        url: "/shoes/dunks/WhatsApp Image 2026-08-18 at 6.51.46 PM.jpeg",
        altText: "Cocoa Drift - Studio Angle"
      },
      {
        url: "/shoes/dunks/WhatsApp Image 2026-08-18 at 6.51.46 PM (1).jpeg",
        altText: "Cocoa Drift - Side Profile"
      }
    ],
    badgeColor: "bg-bright-lime text-white",
  },
  {
    id: "dune-runner",
    title: "Dune Runner",
    handle: "dune-runner",
    category: "street-kicks",
    tag: "New Edition",
    spec: "Dual-Density EVA Midsole",
    desc: "Cream/white retro low-top with grey suede overlays, gum sole, and dual-tone paneled leather.",
    price: "1,149",
    image: "/shoes/nb_sneakers/1.png",
    images: [
      {
        url: "/shoes/nb_sneakers/1.png",
        altText: "Dune Runner - Hero Angle"
      }
    ],
    badgeColor: "bg-bright-coral text-white",
  },
  {
    id: "earthline",
    title: "Earthline",
    handle: "earthline",
    category: "street-kicks",
    tag: "Daily Essential",
    spec: "Waffle Lug Traction Sole",
    desc: "Tan/brown retro sneaker with dark swoosh-like side accent, rich earthy suede, and gum sole.",
    price: "1,399",
    image: "/shoes/waffel_brown/Gemini_Generated_Image_wosh4ywosh4ywosh.png",
    images: [
      {
        url: "/shoes/waffel_brown/Gemini_Generated_Image_wosh4ywosh4ywosh.png",
        altText: "Earthline - Hero Profile"
      }
    ],
    badgeColor: "bg-bright-amber text-white",
  },
  {
    id: "shadow-crest",
    title: "Shadow Crest",
    handle: "shadow-crest",
    category: "street-kicks",
    tag: "Premium Finish",
    spec: "Microfiber Leather Cupsole",
    desc: "Black/grey low-top with suede overlays and chunky classic sole blending runway aesthetics with street comfort.",
    price: "1,099",
    image: "/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.46 PM.jpeg",
    images: [
      {
        url: "/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.46 PM.jpeg",
        altText: "Shadow Crest - Studio View"
      },
      {
        url: "/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.47 PM.jpeg",
        altText: "Shadow Crest - Side Profile"
      },
      {
        url: "/shoes/lv/WhatsApp Image 2026-08-22 at 7.50.47 PM (1).jpeg",
        altText: "Shadow Crest - Detail Angle"
      }
    ],
    badgeColor: "bg-bright-coral text-white",
  },
  {
    id: "moss-velocity",
    title: "Moss Velocity",
    handle: "moss-velocity",
    category: "daily-walkers",
    tag: "Comfort Series",
    spec: "Ultra-Light Flexible EVA",
    desc: "Sage/olive green performance runner with futuristic sole designed for daily commute and zero fatigue wear.",
    price: "999",
    image: "/shoes/sports/1.jpeg",
    images: [
      {
        url: "/shoes/sports/1.jpeg",
        altText: "Moss Velocity - Angle 1"
      },
      {
        url: "/shoes/sports/2.jpeg",
        altText: "Moss Velocity - Angle 2"
      },
      {
        url: "/shoes/sports/3.jpeg",
        altText: "Moss Velocity - Angle 3"
      },
      {
        url: "/shoes/sports/4.jpeg",
        altText: "Moss Velocity - Angle 4"
      }
    ],
    badgeColor: "bg-bright-lime text-white",
  },
  {
    id: "sand-drift",
    title: "Sand Drift",
    handle: "sand-drift",
    category: "daily-walkers",
    tag: "Plush Cushion",
    spec: "Segmented EVA Midsole",
    desc: "Beige/cream lightweight running shoe with white cushioned sole, high-rebound cushioning, and arch support.",
    price: "1,479",
    image: "/shoes/sketchers/Gemini_Generated_Image_iptr9iptr9iptr9i.png",
    images: [
      {
        url: "/shoes/sketchers/Gemini_Generated_Image_iptr9iptr9iptr9i.png",
        altText: "Sand Drift - Hero View"
      }
    ],
    badgeColor: "bg-bright-amber text-white",
  },
  {
    id: "midnight-flow",
    title: "Midnight Flow",
    handle: "midnight-flow",
    category: "daily-walkers",
    tag: "Endurance Series",
    spec: "Bio-Cushioned Road Sole",
    desc: "Black performance runner with blue accent, chunky white cushioning, and structured heel stabilizer.",
    price: "1,349",
    image: "/shoes/brooks/Gemini_Generated_Image_7ol72i7ol72i7ol7.png",
    images: [
      {
        url: "/shoes/brooks/Gemini_Generated_Image_7ol72i7ol72i7ol7.png",
        altText: "Midnight Flow - Hero Studio Angle"
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
  isLoading,
  onQuickAdd,
  onIncrement,
  onDecrement,
}: {
  product: ShoeCardProduct;
  inCartQty: number;
  addedItem: string | null;
  isLoading: boolean;
  onQuickAdd: (product: ShoeCardProduct, e: React.MouseEvent) => void;
  onIncrement: (product: ShoeCardProduct, e: React.MouseEvent) => void;
  onDecrement: (productId: string, handle: string, e: React.MouseEvent) => void;
}) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const images = getProductGalleryImages(product);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const scrollToSlide = (targetIdx: number) => {
    const clamped = Math.max(0, Math.min(images.length - 1, targetIdx));
    const slider = sliderRef.current;
    if (!slider) {
      setActiveImgIndex(clamped);
      return;
    }
    slider.scrollTo({
      left: clamped * slider.clientWidth,
      behavior: "smooth",
    });
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    scrollToSlide(activeImgIndex - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    scrollToSlide(activeImgIndex + 1);
  };

  const handleSelectDot = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    scrollToSlide(idx);
  };

  // Keep arrows, dots and counter in sync as the native swipe scrolls
  const handleSliderScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    const slideWidth = slider.clientWidth;
    if (slideWidth <= 0) return;
    const idx = Math.round(slider.scrollLeft / slideWidth);
    setActiveImgIndex(Math.max(0, Math.min(images.length - 1, idx)));
  };

  return (
    <div className="cpg-card flex flex-col justify-between group relative overflow-hidden bg-white/90 border border-bright-ink/10 hover:border-bright-amber/50 hover:shadow-lg transition-all duration-300">
      
      {/* Header Tag / In-Cart Status Badge */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className={`cpg-badge cpg-badge-pill text-[11px] font-accent font-bold px-3 py-1 rounded-full ${product.badgeColor}`}>
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

      {/* Product Image Area with Multi-Image Swipe Carousel */}
      <div className="relative w-full h-64 bg-bright-card rounded-2xl overflow-hidden group/img">
        <Link
          href={`/products/${product.handle}`}
          className="relative w-full h-full block"
          title={`View ${product.title}`}
        >
          <div
            ref={sliderRef}
            onScroll={handleSliderScroll}
            className="relative w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar overscroll-x-contain"
          >
            {images.map((img, idx) => (
              <div
                key={`${img.url}-${idx}`}
                className="relative w-full h-full shrink-0 snap-start"
              >
                <Image
                  src={img.url}
                  alt={img.altText || product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover/img:scale-105"
                />
              </div>
            ))}
          </div>
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

        {/* Previous Image Arrow — always visible on mobile, hover-only on desktop */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label={`Previous image of ${product.title}`}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-bright-ink shadow-md flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover/img:opacity-100 transition-all duration-200 z-20 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Next Image Arrow — always visible on mobile, hover-only on desktop */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label={`Next image of ${product.title}`}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-bright-ink shadow-md flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover/img:opacity-100 transition-all duration-200 z-20 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm"
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
              disabled={isLoading}
              onClick={(e) => onDecrement(product.id, product.handle, e)}
              className={`w-7 h-7 rounded-full bg-white hover:bg-bright-ink hover:text-white text-bright-ink flex items-center justify-center text-xs font-bold shadow-sm transition-all active:scale-90 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-label={`Decrease quantity of ${product.title}`}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-sans font-bold text-xs px-2 text-bright-ink min-w-[2.2rem] text-center">
              {inCartQty}
            </span>
            <button
              type="button"
              disabled={isLoading}
              onClick={(e) => onIncrement(product, e)}
              className={`w-7 h-7 rounded-full bg-bright-amber hover:bg-bright-ink text-white flex items-center justify-center text-xs font-bold shadow-sm transition-all active:scale-90 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-label={`Increase quantity of ${product.title}`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={isLoading}
            onClick={(e) => onQuickAdd(product, e)}
            className={`font-sans text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition-all duration-200 shadow-sm active:scale-90 cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""} ${
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
  const [hydrated, setHydrated] = useState(false);
  const { cart, isLoading, addItem, updateItem, removeItem } = useCart();

  // Only reflect live cart loading state after hydration so the SSR output
  // (disabled/className on add-to-cart buttons) matches the first client render.
  useEffect(() => {
    setHydrated(true);
  }, []);
  const displayLoading = isLoading && hydrated;

  // Map products from CMS or use fallback
  const displayProducts: ShoeCardProduct[] = initialProducts && initialProducts.length > 0
    ? initialProducts.map((p, idx) => {
        const badgeColors = [
          "bg-bright-amber text-white",
          "bg-bright-lime text-white",
          "bg-bright-coral text-white",
        ];
        const tags = ["Daily Essential", "New Edition", "Comfort Series"];
        const resolvedImages = getProductGalleryImages(p);

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
    : FALLBACK_PRODUCTS.map((p) => {
        const resolvedImages = getProductGalleryImages(p);
        return {
          ...p,
          image: resolvedImages[0]?.url || p.image,
          images: resolvedImages,
          rawProduct: undefined
        };
      });

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
          l.merchandise.product.handle === productId ||
          (l.merchandise.product as any)._sanityId === productId ||
          l.merchandise.id.startsWith(productId) ||
          (handle && l.merchandise.id.startsWith(handle))
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
          l.merchandise.product.handle === productId ||
          (l.merchandise.product as any)._sanityId === productId ||
          l.merchandise.id.startsWith(productId) ||
          (handle && l.merchandise.id.startsWith(handle))
      )
      .reduce((sum, line) => sum + line.quantity, 0);
  };

  const buildCommerceProduct = (product: ShoeCardProduct): CommerceProduct => {
    const directImages = getProductGalleryImages(product);

    // rawProduct (from CMS) has the most accurate data — use it directly
    if (product.rawProduct) {
      return {
        ...product.rawProduct,
        images: directImages,
      };
    }
    // Try mock catalog to get consistent IDs and full variant list
    const mockProduct = findMockProduct(product.id) || findMockProduct(product.handle);
    if (mockProduct) {
      return {
        ...mockProduct,
        images: directImages,
      };
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
      images: directImages,
      shippingPolicy: "Delhi: ₹100 delivery • Outside Delhi: Book Porter (own charges)",
      returnPolicy: "14-day hassle-free returns & exchanges for unworn pairs.",
      careInstructions: "Wipe clean with a damp cloth."
    };
  };

  const handleQuickAdd = async (product: ShoeCardProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    const productObj = buildCommerceProduct(product);
    const variantObj = productObj.variants[0] || { id: `${product.id}__default`, title: "Standard", available: true };
    
    await addItem(variantObj.id, 1, false, productObj, variantObj);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1200);
  };

  const handleIncrement = async (product: ShoeCardProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
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
    if (isLoading) return;
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
    <section id="squad" data-panel className="sticky bottom-0 z-[4] relative w-full overflow-hidden bg-bright-canvas text-bright-ink px-6 py-24">
      <div data-panel-content className="max-w-7xl mx-auto flex flex-col gap-12">
        
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
                isLoading={displayLoading}
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
