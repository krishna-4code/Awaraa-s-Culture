"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, RotateCcw, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { createCheckoutOrder, verifyServerPayment } from "@/lib/commerce/razorpay";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CartPage() {
  const { cart, isLoading, updateItem, removeItem, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [orderReceipt, setOrderReceipt] = useState<{
    orderNumber: string;
    paymentId: string;
    total: number;
  } | null>(null);

  // Dynamically load Razorpay Checkout Script
  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("razorpay-sdk")) {
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!promoCode.trim()) return;

    if (promoCode.toUpperCase() === "AWARAA10" || promoCode.toUpperCase() === "SQUAD10") {
      setAppliedPromo(promoCode.toUpperCase());
    } else {
      setPromoError("Invalid discount code. Try 'AWARAA10'");
    }
  };

  const rawSubtotal = cart?.cost?.subtotalAmount?.amount 
    ? parseFloat(cart.cost.subtotalAmount.amount.replace(/,/g, '')) 
    : 0;

  const discountAmount = appliedPromo ? Math.round(rawSubtotal * 0.1) : 0;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const handleCheckout = async () => {
    if (!cart || cart.lines.length === 0) return;
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      // 1. Create Order via Server Action
      const lineItems = cart.lines.map((l) => ({
        id: l.merchandise.id,
        name: l.merchandise.product.name,
        quantity: l.quantity,
        price: parseFloat(l.merchandise.product.price.replace(/[^0-9.]/g, '')) || 2999,
        size: l.merchandise.title,
      }));

      const orderRes = await createCheckoutOrder({
        amount: finalTotal,
        lineItems,
      });

      if (!orderRes.success || !orderRes.orderId) {
        throw new Error(orderRes.error || "Failed to initialize payment gateway order.");
      }

      // 2. Open Razorpay Modal or Sandbox Handler
      if (window.Razorpay && orderRes.keyId && !orderRes.keyId.includes("placeholder")) {
        const options = {
          key: orderRes.keyId,
          amount: orderRes.amount,
          currency: orderRes.currency || "INR",
          name: "Awaraa's Culture",
          description: "Footwear order checkout",
          order_id: orderRes.orderId,
          theme: {
            color: "#FF5E1E",
          },
          handler: async function (response: any) {
            try {
              // 3. Cryptographic Signature Verification on Server
              const verifyRes = await verifyServerPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                lineItems,
                totalAmount: finalTotal,
              });

              if (verifyRes.success) {
                setOrderReceipt({
                  orderNumber: verifyRes.orderNumber || `AWARAA-${Date.now().toString().slice(-6)}`,
                  paymentId: verifyRes.paymentId || response.razorpay_payment_id,
                  total: finalTotal,
                });
                await clearCart();
              } else {
                setCheckoutError(verifyRes.error || "Payment verification failed on server.");
              }
            } catch (err: any) {
              setCheckoutError("Payment verification error: " + err.message);
            } finally {
              setIsCheckingOut(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsCheckingOut(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setCheckoutError(response.error?.description || "Payment failed at gateway.");
          setIsCheckingOut(false);
        });
        rzp.open();
      } else {
        // Sandbox Simulation Mode (Runs server-side verification with mock signature)
        const mockPaymentId = `pay_sim_${Date.now()}`;
        const verifyRes = await verifyServerPayment({
          razorpay_order_id: orderRes.orderId,
          razorpay_payment_id: mockPaymentId,
          razorpay_signature: "sandbox_valid_signature",
          lineItems,
          totalAmount: finalTotal,
        });

        if (verifyRes.success) {
          setOrderReceipt({
            orderNumber: verifyRes.orderNumber || `AWARAA-${Date.now().toString().slice(-6)}`,
            paymentId: mockPaymentId,
            total: finalTotal,
          });
          await clearCart();
        } else {
          setCheckoutError(verifyRes.error || "Sandbox payment verification failed.");
        }
        setIsCheckingOut(false);
      }
    } catch (err: any) {
      setCheckoutError(err.message || "An unexpected error occurred during checkout.");
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-bright-canvas text-bright-ink flex flex-col font-sans pt-28 pb-32">
        <div className="max-w-4xl mx-auto w-full px-6 flex flex-col gap-12">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-6 w-32 bg-bright-ink/10 rounded-full"></div>
            <div className="h-12 w-64 bg-bright-ink/10 rounded-xl"></div>
          </div>
          <div className="w-full text-center text-bright-muted py-24 font-sans text-sm uppercase tracking-widest flex items-center justify-center gap-3">
            <span className="w-4 h-4 border-2 border-bright-amber border-t-transparent rounded-full animate-spin"></span>
            Loading your cart...
          </div>
        </div>
      </main>
    );
  }

  if (orderReceipt) {
    return (
      <main className="min-h-screen bg-bright-canvas text-bright-ink flex flex-col font-sans pt-28 pb-32">
        <div className="max-w-2xl mx-auto w-full px-6 text-center flex flex-col items-center gap-6 py-12">
          <div className="w-20 h-20 bg-bright-lime/10 border border-bright-lime/30 rounded-full flex items-center justify-center text-bright-lime mb-2">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold">
            ✦ Payment Verified & Order Confirmed
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl uppercase tracking-tight text-bright-ink">
            Welcome to the Squad!
          </h1>
          <p className="font-sans text-bright-muted text-base max-w-md leading-relaxed">
            Your order has been recorded with verified payment. We are prepping your pair with honest craft and will send tracking updates straight to your phone.
          </p>

          <div className="w-full bg-bright-card border border-bright-ink/10 rounded-2xl p-6 flex flex-col gap-3 my-4 text-left">
            <div className="flex justify-between text-xs text-bright-muted uppercase tracking-wider font-semibold">
              <span>Order Number</span>
              <span className="text-bright-ink font-mono font-bold">{orderReceipt.orderNumber}</span>
            </div>
            <div className="flex justify-between text-xs text-bright-muted uppercase tracking-wider font-semibold">
              <span>Payment ID</span>
              <span className="text-bright-ink font-mono text-[11px] font-semibold">{orderReceipt.paymentId}</span>
            </div>
            <div className="flex justify-between text-xs text-bright-muted uppercase tracking-wider font-semibold border-t border-bright-ink/10 pt-2">
              <span>Total Paid</span>
              <span className="text-bright-amber font-bold font-display text-base">₹{orderReceipt.total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs text-bright-muted uppercase tracking-wider font-semibold">
              <span>Estimated Delivery</span>
              <span className="text-bright-ink font-bold">2-4 Business Days</span>
            </div>
          </div>

          <Link
            href="/#squad"
            className="cpg-button-primary mt-2"
          >
            <span>Continue Exploring</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bright-canvas text-bright-ink flex flex-col font-sans pt-28 pb-32">
      <div className="max-w-5xl mx-auto w-full px-6 flex flex-col gap-10">

        {/* Page Header */}
        <div className="border-b border-bright-ink/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold block mb-2">
              ✦ Your Cart
            </span>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl uppercase tracking-tight text-bright-ink">
              Selected Kicks
            </h1>
          </div>
          {cart && cart.lines.length > 0 && (
            <button
              onClick={() => clearCart()}
              className="text-xs font-sans text-bright-muted hover:text-bright-coral underline uppercase tracking-wider font-semibold self-start sm:self-auto transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {checkoutError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-sans font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{checkoutError}</span>
          </div>
        )}

        {(!cart || cart.lines.length === 0) ? (
          <div className="w-full pt-16 pb-24 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-full bg-bright-card border border-bright-ink/10 flex items-center justify-center text-bright-muted mb-2">
              <span className="text-2xl">👟</span>
            </div>
            <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-bright-ink">
              Your cart is empty
            </h2>
            <p className="text-bright-muted text-sm font-sans max-w-sm">
              Looks like you haven&apos;t added any pairs yet. Explore the squad lineup and pick your daily walker.
            </p>
            <Link
              href="/#squad"
              className="cpg-button-primary mt-4"
            >
              <span>Explore The Squad</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Cart Lines (Left 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col divide-y divide-bright-ink/10">
              {cart.lines.map((line) => {
                const productImg = line.merchandise.product.images?.[0]?.url || 
                  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80";
                const productHandle = line.merchandise.product.handle || line.merchandise.product.id;

                return (
                  <div
                    key={line.id}
                    className="flex gap-4 sm:gap-6 items-start py-6 group"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/products/${productHandle}`}
                      className="w-24 h-24 sm:w-28 sm:h-28 bg-bright-card flex-shrink-0 relative rounded-2xl overflow-hidden border border-bright-ink/10 shadow-sm hover:border-bright-amber transition-colors"
                    >
                      <Image
                        src={productImg}
                        alt={line.merchandise.product.name}
                        fill
                        sizes="112px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-grow flex flex-col justify-between min-h-[6rem]">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link 
                            href={`/products/${productHandle}`}
                            className="font-display font-bold text-lg sm:text-xl uppercase tracking-tight text-bright-ink hover:text-bright-amber transition-colors"
                          >
                            {line.merchandise.product.name}
                          </Link>
                          <button
                            onClick={() => removeItem(line.id)}
                            className="text-bright-muted/60 hover:text-bright-coral p-1 rounded-md transition-colors"
                            aria-label="Remove item"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-sans text-xs text-bright-muted uppercase tracking-wider font-semibold mt-1">
                          Size: <span className="text-bright-ink">{line.merchandise.title}</span>
                        </p>
                      </div>

                      {/* Price & Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-bright-ink/20 rounded-full bg-bright-card/50 p-0.5">
                          <button
                            onClick={() => updateItem(line.id, line.quantity - 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-bright-muted hover:text-bright-ink hover:bg-white transition-all text-xs font-bold"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-sans font-bold text-xs text-bright-ink">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => updateItem(line.id, line.quantity + 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-bright-muted hover:text-bright-ink hover:bg-white transition-all text-xs font-bold"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-display font-extrabold text-base sm:text-lg text-bright-ink">
                            {line.merchandise.product.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pt-6">
                <Link
                  href="/#squad"
                  className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-bright-muted hover:text-bright-amber font-bold transition-colors"
                >
                  <span>← Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Order Summary & Checkout Card (Right 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
              <div className="cpg-card bg-white border border-bright-ink/15 rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
                <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-bright-muted border-b border-bright-ink/10 pb-3 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-[10px] bg-bright-ink/5 px-2.5 py-0.5 rounded-full text-bright-ink font-mono">
                    {cart.lines.reduce((sum, item) => sum + item.quantity, 0)} {cart.lines.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'}
                  </span>
                </h3>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Discount code (e.g. AWARAA10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-grow bg-bright-card border border-bright-ink/15 rounded-xl px-3 py-2 text-xs font-sans placeholder:text-bright-muted/60 uppercase tracking-wider focus:outline-none focus:border-bright-amber"
                  />
                  <button
                    type="submit"
                    className="bg-bright-ink text-white px-4 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider hover:bg-bright-amber transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {appliedPromo && (
                  <div className="flex items-center justify-between bg-bright-lime/10 border border-bright-lime/20 px-3 py-2 rounded-xl text-xs font-sans text-bright-lime font-bold">
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

                <div className="flex flex-col gap-2.5 pt-2 text-xs font-sans">
                  <div className="flex justify-between items-center text-bright-muted">
                    <span className="uppercase tracking-wider">Subtotal</span>
                    <span className="font-semibold text-bright-ink">
                      ₹{rawSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between items-center text-bright-lime font-semibold">
                      <span className="uppercase tracking-wider">Discount (10%)</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-bright-muted">
                    <span className="uppercase tracking-wider">Standard Shipping</span>
                    <span className="text-bright-lime font-bold uppercase tracking-wider">Free (₹0)</span>
                  </div>

                  <div className="flex justify-between items-center text-bright-muted">
                    <span className="uppercase tracking-wider">Taxes</span>
                    <span>Included in price</span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold border-t border-bright-ink/10 pt-4 text-bright-ink">
                    <span className="uppercase tracking-wider">Total</span>
                    <span className="font-display font-extrabold text-2xl text-bright-amber">
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="cpg-button-primary w-full justify-center py-4 text-sm mt-2 shadow-md hover:shadow-lg disabled:opacity-75"
                >
                  {isCheckingOut ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Processing with Gateway...
                    </span>
                  ) : (
                    <>
                      <span>Pay Securely with Razorpay</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-bright-ink/10 text-center">
                  <div className="flex flex-col items-center gap-1 text-[10px] text-bright-muted">
                    <Truck className="w-3.5 h-3.5 text-bright-amber" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-[10px] text-bright-muted">
                    <RotateCcw className="w-3.5 h-3.5 text-bright-amber" />
                    <span>14-Day Returns</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-[10px] text-bright-muted">
                    <ShieldCheck className="w-3.5 h-3.5 text-bright-amber" />
                    <span>256-bit Secure</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
