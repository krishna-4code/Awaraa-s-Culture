"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Feather, Clock, ShieldCheck, ShoppingBag, ArrowRight, Check, Plus, Minus } from "lucide-react";
import { CommerceProduct, CommerceVariant } from "@/lib/commerce/types";
import { useCart } from "@/components/CartContext";
import { getProductGalleryImages } from "@/lib/commerce/productImages";

export function ProductDetail({ product }: { product: CommerceProduct }) {
  const { cart, addItem, updateItem, removeItem, openCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Extract distinct colors from variants
  const availableColors = useMemo(() => {
    const map = new Map<string, { color: string; colorHex?: string }>();
    product.variants.forEach((v) => {
      if (v.color && !map.has(v.color)) {
        map.set(v.color, { color: v.color, colorHex: v.colorHex });
      }
    });
    return Array.from(map.values());
  }, [product.variants]);

  // Initial color selection
  const [selectedColor, setSelectedColor] = useState<string | null>(
    availableColors.length > 0 ? availableColors[0].color : null
  );

  // Filter sizes based on selected color (or all sizes if no colors)
  const availableSizes = useMemo(() => {
    return product.variants
      .filter((v) => !selectedColor || !v.color || v.color === selectedColor)
      .map((v) => ({
        id: v.id,
        size: v.size || v.title,
        available: v.available,
        stock: v.stock,
      }));
  }, [product.variants, selectedColor]);

  // Selected size state
  const [selectedSize, setSelectedSize] = useState<string | null>(
    availableSizes.find((s) => s.available)?.size || (availableSizes.length > 0 ? availableSizes[0].size : null)
  );

  // Find exact active variant
  const activeVariant = useMemo(() => {
    return product.variants.find(
      (v) =>
        (!selectedColor || !v.color || v.color === selectedColor) &&
        (!selectedSize || (v.size || v.title) === selectedSize)
    ) || product.variants[0];
  }, [product.variants, selectedColor, selectedSize]);

  // Find if active variant is in cart
  const activeCartLine = useMemo(() => {
    if (!cart?.lines || !activeVariant) return null;
    return cart.lines.find((l) => l.merchandise.id === activeVariant.id) || null;
  }, [cart?.lines, activeVariant]);

  const inCartQty = activeCartLine ? activeCartLine.quantity : 0;

  const handleAddToCart = async () => {
    if (!activeVariant || !activeVariant.available) return;
    await addItem(activeVariant.id, 1, false, product, activeVariant);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  const handleIncrement = async () => {
    if (!activeVariant) return;
    if (activeCartLine) {
      await updateItem(activeCartLine.id, activeCartLine.quantity + 1);
    } else {
      await addItem(activeVariant.id, 1, false, product, activeVariant);
    }
  };

  const handleDecrement = async () => {
    if (!activeCartLine) return;
    if (activeCartLine.quantity <= 1) {
      await removeItem(activeCartLine.id);
    } else {
      await updateItem(activeCartLine.id, activeCartLine.quantity - 1);
    }
  };

  const images = getProductGalleryImages(product);

  const activeImage = images[selectedImageIndex] || images[0];

  return (
    <main className="min-h-screen bg-bright-canvas text-bright-ink flex flex-col font-sans pt-16">

      {/* Product Content */}
      <div className="flex-grow flex flex-col md:flex-row w-full max-w-screen-2xl mx-auto">

        {/* LEFT — Product Imagery */}
        <div className="w-full md:w-3/5 p-6 md:p-16 flex flex-col gap-6 border-r border-bright-ink/10">
          {/* Main image */}
          <div className="w-full aspect-square bg-bright-card relative group overflow-hidden rounded-2xl border border-bright-ink/10 shadow-sm">
            <Image
              src={activeImage.url}
              alt={activeImage.altText || product.name}
              fill
              unoptimized
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* CPG sticker badge overlay */}
            <div className="absolute top-4 left-4">
              <span className="cpg-badge bg-bright-amber text-white font-accent text-[11px]">
                Featured Kick
              </span>
            </div>
          </div>

          {/* Thumbnail Grid */}
          {images.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-full aspect-square bg-bright-card relative overflow-hidden rounded-xl border transition-all duration-200 ${
                    selectedImageIndex === idx 
                      ? 'border-bright-amber ring-2 ring-bright-amber/30 scale-[1.02]' 
                      : 'border-bright-ink/10 hover:border-bright-ink/30 opacity-75 hover:opacity-100'
                  }`}
                  aria-label={`View product image ${idx + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `Detail ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Product Details */}
        <div className="w-full md:w-2/5 p-6 md:p-16 flex flex-col sticky top-16 h-fit">

          {/* Breadcrumb */}
          <Link
            href="/#squad"
            className="font-sans text-xs font-semibold uppercase tracking-widest text-bright-muted hover:text-bright-amber transition-colors duration-200 mb-6 inline-flex items-center gap-1"
          >
            ← Back to The Squad
          </Link>

          {/* Product Name & Price */}
          <div className="flex flex-col gap-2 mb-6">
            <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold">
              ✦ Awaraa&apos;s Culture
            </span>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl uppercase tracking-tight text-bright-ink leading-tight">
              {product.name}
            </h1>
            <p className="font-display font-extrabold text-3xl text-bright-amber mt-1">
              {product.price}
            </p>
          </div>

          {/* Quick-Glance Spec Row */}
          <div className="grid grid-cols-3 gap-3 p-4 mb-8 bg-bright-card border border-bright-ink/10 rounded-xl">
            <div className="flex flex-col gap-1.5 items-center text-center p-2 border-r border-bright-ink/10">
              <Feather className="w-4 h-4 text-bright-amber opacity-80" />
              <span className="text-[10px] font-sans uppercase tracking-[0.15em] text-bright-muted font-semibold">
                Weight
              </span>
              <span className="text-xs font-sans font-bold text-bright-ink">
                320g
              </span>
            </div>
            <div className="flex flex-col gap-1.5 items-center text-center p-2 border-r border-bright-ink/10">
              <Clock className="w-4 h-4 text-bright-amber opacity-80" />
              <span className="text-[10px] font-sans uppercase tracking-[0.15em] text-bright-muted font-semibold">
                Break-in
              </span>
              <span className="text-xs font-sans font-bold text-bright-ink">
                0 Days
              </span>
            </div>
            <div className="flex flex-col gap-1.5 items-center text-center p-2">
              <ShieldCheck className="w-4 h-4 text-bright-amber opacity-80" />
              <span className="text-[10px] font-sans uppercase tracking-[0.15em] text-bright-muted font-semibold">
                Sole
              </span>
              <span className="text-xs font-sans font-bold text-bright-ink">
                Dual EVA
              </span>
            </div>
          </div>

          {/* Description & Materials */}
          <div className="flex flex-col gap-5 mb-8 pb-8 border-b border-bright-ink/10">
            <p className="font-sans text-sm text-bright-muted leading-relaxed">
              {product.description}
            </p>
            {product.materials && product.materials.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-bright-ink">
                  Honest Materials
                </h3>
                <ul className="list-disc pl-5 text-bright-muted text-sm space-y-1 font-sans">
                  {product.materials.map((m, i) => (
                    <li key={i}>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Color Selection (if multiple colors exist) */}
          {availableColors.length > 0 && (
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between items-center">
                <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-bright-ink">
                  Color: <span className="text-bright-amber font-normal">{selectedColor}</span>
                </h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {availableColors.map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => {
                      setSelectedColor(c.color);
                      // Auto-select first available size in new color
                      const matchingSize = product.variants.find(
                        (v) => v.color === c.color && v.available
                      );
                      if (matchingSize) setSelectedSize(matchingSize.size || matchingSize.title);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
                      selectedColor === c.color
                        ? "bg-bright-ink text-white border-bright-ink shadow-sm"
                        : "bg-bright-card text-bright-ink border-bright-ink/15 hover:border-bright-amber"
                    }`}
                  >
                    {c.colorHex && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c.colorHex }}
                      />
                    )}
                    <span>{c.color}</span>
                    {selectedColor === c.color && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-end">
              <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-bright-ink">
                Select Size (UK/India)
              </h3>
              <span className="font-sans text-[11px] uppercase tracking-wider text-bright-muted">
                True to size fit
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {availableSizes.map((variant) => (
                <button
                  key={variant.id}
                  disabled={!variant.available}
                  onClick={() => setSelectedSize(variant.size)}
                  className={`py-3 rounded-xl border font-sans text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bright-amber ${
                    selectedSize === variant.size
                      ? "bg-bright-ink text-white border-bright-ink scale-105 shadow-md"
                      : !variant.available
                        ? "bg-transparent text-bright-muted/30 border-bright-ink/10 cursor-not-allowed line-through"
                        : "bg-transparent text-bright-ink border-bright-ink/20 hover:border-bright-amber hover:bg-bright-card"
                  }`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart CTA & In-Cart Controls */}
          <div className="flex flex-col gap-3">
            {inCartQty > 0 ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3.5 bg-bright-card border border-bright-ink/15 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="font-sans text-[11px] uppercase tracking-wider text-bright-muted font-semibold">
                      In Your Cart
                    </span>
                    <span className="font-display font-bold text-base text-bright-ink">
                      {selectedSize} {selectedColor ? `• ${selectedColor}` : ''}
                    </span>
                  </div>

                  {/* Stepper */}
                  <div className="flex items-center gap-1.5 bg-white border border-bright-ink/15 rounded-full p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      className="w-8 h-8 rounded-full bg-bright-card hover:bg-bright-ink hover:text-white text-bright-ink flex items-center justify-center text-xs font-bold transition-all active:scale-90"
                      aria-label="Decrease quantity in cart"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-sans font-extrabold text-sm px-2 text-bright-ink min-w-[2rem] text-center">
                      {inCartQty}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      className="w-8 h-8 rounded-full bg-bright-amber hover:bg-bright-ink text-white flex items-center justify-center text-xs font-bold transition-all active:scale-90"
                      aria-label="Increase quantity in cart"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="py-3.5 px-4 font-sans font-bold uppercase tracking-wider text-xs rounded-full border border-bright-ink/20 hover:border-bright-ink hover:bg-bright-ink hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openCart()}
                    className="py-3.5 px-4 font-sans font-bold uppercase tracking-wider text-xs rounded-full bg-bright-amber hover:bg-bright-ink text-white transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>View Cart ({inCartQty})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || !activeVariant?.available}
                className={`w-full py-4 font-sans font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 shadow-md active:scale-95 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bright-amber cursor-pointer ${
                  addedToCart
                    ? "bg-bright-lime text-white scale-[1.02] shadow-[0_4px_14px_rgba(136,192,87,0.4)]"
                    : selectedSize && activeVariant?.available
                      ? "bg-bright-amber text-white hover:bg-bright-ink hover:scale-[1.02] shadow-[0_4px_14px_rgba(255,94,30,0.3)]"
                      : "bg-bright-card text-bright-muted cursor-not-allowed border border-bright-ink/10"
                }`}
              >
                {addedToCart ? (
                  <span>✓ Added to Cart!</span>
                ) : selectedSize && activeVariant?.available ? (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart ({selectedSize}{selectedColor ? ` — ${selectedColor}` : ''})</span>
                  </>
                ) : (
                  <span>Select a Size First</span>
                )}
              </button>
            )}

            {/* Quick Cart Link when added */}
            {addedToCart && inCartQty === 0 && (
              <button
                type="button"
                onClick={() => openCart()}
                className="mt-1 text-center text-xs font-sans font-bold text-bright-amber hover:underline uppercase tracking-wider flex items-center justify-center gap-1 animate-fadeIn cursor-pointer"
              >
                <span>Open Cart & Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Trust Signals */}
          <div className="mt-6 cpg-card bg-white flex flex-col gap-3 text-sm border border-bright-ink/10">
            <div className="flex items-start gap-2 text-bright-muted font-sans">
              <span className="text-bright-lime font-bold mt-0.5">✓</span>
              <span>
                <strong className="text-bright-ink">Delivery:</strong>{" "}
                {product.shippingPolicy}
              </span>
            </div>
            <div className="flex items-start gap-2 text-bright-muted font-sans">
              <span className="text-bright-lime font-bold mt-0.5">✓</span>
              <span>
                <strong className="text-bright-ink">Honest Returns:</strong>{" "}
                {product.returnPolicy}
              </span>
            </div>
            <div className="flex items-start gap-2 text-bright-muted font-sans">
              <span className="text-bright-lime font-bold mt-0.5">✓</span>
              <span>
                <strong className="text-bright-ink">Care:</strong>{" "}
                {product.careInstructions}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD Schema */}
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
                    "item": process.env.NEXT_PUBLIC_SITE_URL || "https://awaraas.culture"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": product.name,
                    "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://awaraas.culture"}/products/${product.handle}`
                  }
                ]
              },
              {
                "@type": "Product",
                "name": product.name,
                "description": product.description,
                "image": images[0]?.url,
                "offers": {
                  "@type": "Offer",
                  "price": product.price.replace(/[^0-9.]/g, ''),
                  "priceCurrency": "INR",
                  "availability": activeVariant?.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                  "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://awaraas.culture"}/products/${product.handle}`
                }
              }
            ]
          })
        }}
      />
    </main>
  );
}
