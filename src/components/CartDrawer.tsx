"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartContext";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, ShieldCheck, Truck } from "lucide-react";

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateItem, removeItem, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const totalItems = cart?.lines ? cart.lines.reduce((acc, item) => acc + item.quantity, 0) : 0;
  
  const rawSubtotal = cart?.cost?.subtotalAmount?.amount 
    ? parseFloat(cart.cost.subtotalAmount.amount.replace(/,/g, '')) 
    : 0;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!promoCode.trim()) return;

    if (promoCode.toUpperCase() === "AWARAA10" || promoCode.toUpperCase() === "SQUAD10") {
      setAppliedPromo(promoCode.toUpperCase());
    } else {
      setPromoError("Invalid code. Try 'AWARAA10'");
    }
  };

  const discountAmount = appliedPromo ? Math.round(rawSubtotal * 0.1) : 0;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div 
        ref={drawerRef}
        className="relative w-full max-w-md bg-bright-canvas text-bright-ink h-full shadow-2xl z-10 flex flex-col border-l border-bright-ink/10 transition-transform duration-300 ease-out animate-slideInRight overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Drawer"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-bright-ink/10 flex items-center justify-between bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-bright-amber/10 flex items-center justify-center text-bright-amber">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg uppercase tracking-tight text-bright-ink">
                Your Squad Cart
              </h2>
              <span className="font-sans text-xs text-bright-muted font-medium">
                {totalItems} {totalItems === 1 ? "pair" : "pairs"} selected
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="w-8 h-8 rounded-full border border-bright-ink/15 flex items-center justify-center text-bright-ink hover:bg-bright-ink hover:text-white transition-all duration-200"
            aria-label="Close Cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Banner */}
        <div className="bg-bright-card px-5 py-2.5 border-b border-bright-ink/10 flex items-center gap-2 text-xs font-sans font-semibold text-bright-ink">
          <Truck className="w-3.5 h-3.5 text-bright-amber flex-shrink-0" />
          <span>Free Express Shipping across India on all orders</span>
        </div>

        {/* Cart Line Items List */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col divide-y divide-bright-ink/10">
          {(!cart || cart.lines.length === 0) ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-4 my-auto">
              <div className="w-16 h-16 rounded-full bg-bright-card border border-bright-ink/10 flex items-center justify-center text-3xl mb-1">
                👟
              </div>
              <h3 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
                Your Cart is Empty
              </h3>
              <p className="font-sans text-xs text-bright-muted max-w-xs leading-relaxed">
                You haven&apos;t added any kicks yet. Explore our street-tested squad lineup and grab your pair!
              </p>
              <Link
                href="/#squad"
                onClick={closeCart}
                className="cpg-button-primary mt-3 text-xs"
              >
                <span>Explore The Squad</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            cart.lines.map((line) => {
              const productImg = line.merchandise.product.images?.[0]?.url || 
                "/shoes/nb_sports/1.png";
              const productHandle = line.merchandise.product.handle || line.merchandise.product.id;

              return (
                <div key={line.id} className="py-4 flex gap-4 items-start group">
                  {/* Thumbnail */}
                  <Link
                    href={`/products/${productHandle}`}
                    onClick={closeCart}
                    className="w-20 h-20 bg-bright-card flex-shrink-0 relative rounded-xl overflow-hidden border border-bright-ink/10 shadow-sm"
                  >
                    <Image
                      src={productImg}
                      alt={line.merchandise.product.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-h-[5rem]">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/products/${productHandle}`}
                          onClick={closeCart}
                          className="font-display font-bold text-sm uppercase tracking-tight text-bright-ink hover:text-bright-amber transition-colors line-clamp-1"
                        >
                          {line.merchandise.product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(line.id)}
                          className="text-bright-muted/60 hover:text-bright-coral p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-sans text-[11px] text-bright-muted uppercase tracking-wider font-semibold mt-0.5">
                        Size: <span className="text-bright-ink">{line.merchandise.title}</span>
                      </p>
                    </div>

                    {/* Quantity Stepper & Price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-bright-ink/20 rounded-full bg-white px-1 py-0.5 shadow-sm">
                        <button
                          type="button"
                          onClick={() => updateItem(line.id, line.quantity - 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-bright-muted hover:text-bright-ink hover:bg-bright-card transition-all text-xs font-bold"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-sans font-bold text-xs text-bright-ink">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateItem(line.id, line.quantity + 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-bright-muted hover:text-bright-ink hover:bg-bright-card transition-all text-xs font-bold"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-display font-extrabold text-sm text-bright-ink">
                        {line.merchandise.product.price}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer / Checkout Actions */}
        {cart && cart.lines.length > 0 && (
          <div className="p-5 bg-white border-t border-bright-ink/10 flex flex-col gap-4 shadow-lg">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="Discount code (e.g. AWARAA10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-bright-card border border-bright-ink/15 rounded-xl px-3 py-1.5 text-xs font-sans placeholder:text-bright-muted/60 uppercase tracking-wider focus:outline-none focus:border-bright-amber"
              />
              <button
                type="submit"
                className="bg-bright-ink text-white px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider hover:bg-bright-amber transition-colors"
              >
                Apply
              </button>
            </form>

            {appliedPromo && (
              <div className="flex items-center justify-between bg-bright-lime/10 border border-bright-lime/20 px-3 py-1.5 rounded-xl text-xs font-sans text-bright-lime font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Promo {appliedPromo} applied (10% OFF)
                </span>
                <button
                  type="button"
                  onClick={() => setAppliedPromo(null)}
                  className="text-bright-muted hover:text-bright-coral text-[11px] underline"
                >
                  Remove
                </button>
              </div>
            )}

            {promoError && (
              <p className="text-xs text-bright-coral font-sans">{promoError}</p>
            )}

            {/* Price Calculations */}
            <div className="flex flex-col gap-1.5 text-xs font-sans">
              <div className="flex justify-between items-center text-bright-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-bright-ink">₹{rawSubtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between items-center text-bright-lime font-semibold">
                  <span>Discount (10%)</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-bright-muted">
                <span>Shipping</span>
                <span className="text-bright-lime font-bold uppercase tracking-wider">Free (₹0)</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold border-t border-bright-ink/10 pt-2 text-bright-ink">
                <span>Total Amount</span>
                <span className="font-display font-extrabold text-xl text-bright-amber">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/cart"
                onClick={closeCart}
                className="cpg-button-primary w-full justify-center py-3.5 text-xs shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <div className="flex items-center justify-between text-[11px] font-sans text-bright-muted px-1">
                <button
                  type="button"
                  onClick={() => clearCart()}
                  className="hover:text-bright-coral underline transition-colors"
                >
                  Clear Cart
                </button>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-bright-amber" />
                  <span>Secure 256-bit Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
