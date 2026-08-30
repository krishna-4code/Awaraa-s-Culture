"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { createClient } from "@/lib/supabase/client";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  AlertCircle,
  MessageCircle,
  User,
  Phone,
  MapPin,
  FileText,
  RefreshCw,
  Lock,
  LogIn,
  CheckCircle2
} from "lucide-react";
import {
  generateOrderRef,
  generateInstagramOrderMessage,
  formatCurrencyINR,
  INSTAGRAM_CONFIG,
  getInstagramDmUrl,
  InstagramOrder,
  InstagramOrderItem
} from "@/lib/commerce/instagram";
import {
  recordInstagramOrderRequest,
  validateCartBeforeCheckout
} from "@/lib/commerce/checkout";
import { validatePromoCode } from "@/lib/commerce/promo";
import { analytics } from "@/lib/analytics";
import { InstagramOrderButton } from "@/components/checkout/InstagramOrderButton";
import { OrderReadyModal } from "@/components/checkout/OrderReadyModal";
import { getProductPrimaryImage } from "@/lib/commerce/productImages";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    isLoading,
    updateItem,
    removeItem,
    clearCart,
    appliedPromo,
    applyPromo,
    removePromo,
    rawSubtotal,
    discountAmount,
    finalTotal
  } = useCart();
  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [cartValidationAlert, setCartValidationAlert] = useState<{
    message: string;
    issues?: Array<{ description: string }>;
  } | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Customer Details Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    phone?: string;
    address?: string;
  }>({});

  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);

  // Check Supabase authentication status
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }: any) => {
      const currentUser = data?.user || null;
      setUser(currentUser);
      if (currentUser?.user_metadata?.full_name) {
        setCustomerName((prev) => prev || currentUser.user_metadata.full_name);
      }
      setIsAuthChecking(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser?.user_metadata?.full_name) {
        setCustomerName((prev) => prev || currentUser.user_metadata.full_name);
      }
      setIsAuthChecking(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Concurrency & Double-click guard
  const isSubmittingRef = useRef(false);
  const lastSubmittedRef = useRef<number>(0);
  const idempotencyKeyRef = useRef<string>("");
  const hasTrackedStartRef = useRef(false);

  // Initialize unique session idempotency key
  useEffect(() => {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = `idemp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }
  }, []);

  // Track checkout_started event once when cart is loaded
  useEffect(() => {
    if (cart && cart.lines.length > 0 && !hasTrackedStartRef.current) {
      hasTrackedStartRef.current = true;
      analytics.trackCheckoutStarted(
        cart.lines.reduce((acc, item) => acc + item.quantity, 0),
        finalTotal
      );
    }
  }, [cart, finalTotal]);

  // Order Request State after submission
  const [orderRequest, setOrderRequest] = useState<{
    order: InstagramOrder;
    message: string;
    instagramUrl: string;
    submittedAt: string;
  } | null>(null);

  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!promoInput.trim()) return;

    setIsApplyingPromo(true);
    try {
      const result = await applyPromo(promoInput, user?.email);
      if (!result.success) {
        setPromoError(result.error || "Invalid discount code. Try 'AWARAA10'");
      } else {
        setPromoInput("");
      }
    } finally {
      setIsApplyingPromo(false);
    }
  };

  // Strict Validation for Customer Details
  const validateForm = () => {
    const errors: { name?: string; phone?: string; address?: string } = {};

    const trimmedName = customerName.trim();
    if (!trimmedName) {
      errors.name = "Full name is required.";
    } else if (trimmedName.length < 2) {
      errors.name = "Please enter your full name (at least 2 characters).";
    }

    const cleanPhone = customerPhone.replace(/[^0-9]/g, "");
    if (!cleanPhone) {
      errors.phone = "Mobile / WhatsApp number is required.";
    } else if (cleanPhone.length < 10 || cleanPhone.length > 13) {
      errors.phone = "Please enter a valid 10-digit mobile number (e.g. 9876543210).";
    }

    const trimmedAddress = customerAddress.trim();
    if (!trimmedAddress) {
      errors.address = "Complete delivery address is required.";
    } else if (trimmedAddress.length < 12) {
      errors.address = "Please provide your full street address, area, city, and PIN code.";
    }

    setFormErrors(errors);

    // Auto-scroll to first invalid element if any
    if (Object.keys(errors).length > 0) {
      if (errors.name) {
        document.getElementById("input-customer-name")?.focus();
      } else if (errors.phone) {
        document.getElementById("input-customer-phone")?.focus();
      } else if (errors.address) {
        document.getElementById("input-customer-address")?.focus();
      }
      return false;
    }

    return true;
  };

  // Robust Clipboard Copy with legacy fallback
  const handleCopyMessage = async (text: string, orderRef?: string) => {
    let copySuccessful = false;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        copySuccessful = true;
      }
    } catch {
      copySuccessful = false;
    }

    // Fallback: execCommand copy using a hidden textarea
    if (!copySuccessful && typeof document !== "undefined") {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        copySuccessful = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch {
        copySuccessful = false;
      }
    }

    if (copySuccessful) {
      setCopiedMessage(true);
      if (orderRef) {
        analytics.trackOrderMessageCopied(orderRef);
      }
      setTimeout(() => setCopiedMessage(false), 2500);
    }
  };

  const handleInstagramCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    // ── Concurrency & Double-Click Guard ──
    const now = Date.now();
    if (isSubmittingRef.current || isProcessing) {
      console.warn("[Checkout] Prevented concurrent double-click.");
      return;
    }

    // Cooldown protection: minimum 1.5s between checkout attempts
    if (now - lastSubmittedRef.current < 1500) {
      console.warn("[Checkout] Rapid repeated click throttled.");
      return;
    }

    if (!cart || cart.lines.length === 0) {
      alert("Your cart is empty. Please add items before ordering.");
      analytics.trackInstagramOrderFailed("empty_cart");
      return;
    }

    if (!user) {
      router.push('/login?next=/cart');
      return;
    }

    if (!validateForm()) {
      analytics.trackInstagramOrderFailed("invalid_customer_form");
      return;
    }

    // Lock submission immediately
    isSubmittingRef.current = true;
    lastSubmittedRef.current = now;
    setIsProcessing(true);
    setCartValidationAlert(null);
    setNetworkError(null);

    try {
      // 1. Authoritative Pre-flight Validation against source of truth
      const validationLines = cart.lines.map((l) => ({
        handle: l.merchandise.product.handle || l.merchandise.product.id,
        variantId: l.merchandise.id,
        size: l.merchandise.title,
        color: (l.merchandise.product.variants || []).find((v: any) => v.id === l.merchandise.id)?.color || "",
        quantity: l.quantity,
        expectedUnitPrice: parseFloat(l.merchandise.product.price.replace(/[^0-9.]/g, "")) || 2999,
      }));

      const validationResult = await validateCartBeforeCheckout(validationLines);

      if (!validationResult.valid) {
        setCartValidationAlert({
          message:
            validationResult.message ||
            "Some items in your cart have changed. Please review your cart before continuing.",
          issues: validationResult.issues || [],
        });
        analytics.trackInstagramOrderFailed("cart_validation_mismatch");
        setIsProcessing(false);
        isSubmittingRef.current = false;
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      analytics.trackCheckoutValidated(
        cart.lines.reduce((acc, item) => acc + item.quantity, 0),
        finalTotal
      );

      // Pre-flight validation of applied single-use promo code (AWARAA10)
      if (appliedPromo === 'AWARAA10') {
        const promoValidation = await validatePromoCode('AWARAA10', user.email);
        if (!promoValidation.valid) {
          setPromoError(promoValidation.error || "The code 'AWARAA10' has already been redeemed for your account.");
          removePromo();
          setIsProcessing(false);
          isSubmittingRef.current = false;
          return;
        }
      }

      // 2. Generate unique order reference
      const orderRef = generateOrderRef();

      // 3. Build structured items list from validated cart lines
      const orderItems: InstagramOrderItem[] = (validationResult.validatedItems || []).map((item) => ({
        productName: item.productName,
        size: item.size,
        color: item.color || "",
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));

      const validatedSubtotal = orderItems.reduce(
        (acc, item) => acc + item.unitPrice * item.quantity,
        0
      );
      const validatedDiscount = appliedPromo ? Math.round(validatedSubtotal * 0.1) : 0;
      const validatedTotal = Math.max(0, validatedSubtotal - validatedDiscount);

      // 4. Structured immutable order snapshot
      const orderData: InstagramOrder = {
        orderRef,
        items: orderItems,
        subtotal: validatedSubtotal,
        discount: validatedDiscount > 0 ? validatedDiscount : undefined,
        promoCode: appliedPromo || undefined,
        delivery: "₹100 (Delhi) / Porter (Outside Delhi)",
        total: validatedTotal,
        customer: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          address: customerAddress.trim(),
          notes: customerNotes.trim() || undefined,
        },
      };

      // 5. Generate structured Instagram message from the validated snapshot
      const generatedMessage = generateInstagramOrderMessage(orderData);

      // 6. Record inquiry in backend (non-blocking, zero stock decrement)
      const lineItems = (validationResult.validatedItems || []).map((item) => ({
        productId: item.productId,
        variantKey: item.variantKey,
        productName: item.productName,
        size: item.size,
        color: item.color || "",
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));

      await recordInstagramOrderRequest({
        orderRef,
        lineItems,
        subtotal: validatedSubtotal,
        discount: validatedDiscount,
        promoCode: appliedPromo || "",
        totalAmount: validatedTotal,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: user.email || undefined,
        shippingAddress: customerAddress.trim(),
        notes: customerNotes.trim() || "",
      });

      analytics.trackInstagramOrderClicked(
        orderRef,
        orderItems.reduce((acc, item) => acc + item.quantity, 0),
        finalTotal
      );

      // 7. Auto-copy generated message to clipboard
      await handleCopyMessage(generatedMessage, orderRef);

      // 8. Open Awaraa's Culture Instagram DM in a new tab
      const instagramDmLink = getInstagramDmUrl();
      if (typeof window !== "undefined") {
        const openedWindow = window.open(instagramDmLink, "_blank", "noopener,noreferrer");
        if (!openedWindow || openedWindow.closed || typeof openedWindow.closed === "undefined") {
          // Popup was blocked by browser
          setPopupBlocked(true);
        } else {
          analytics.trackInstagramOpened(orderRef);
        }
      }

      // 9. Transition UI to "Order Request Ready" state
      setOrderRequest({
        order: orderData,
        message: generatedMessage,
        instagramUrl: instagramDmLink,
        submittedAt: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      // Clear the local cart now that the order request is locked
      await clearCart();
    } catch (err: any) {
      console.error("Error during Instagram order preparation:", err);
      setNetworkError("A network error occurred while preparing your order. Please try again.");
      analytics.trackInstagramOrderFailed("network_error");
    } finally {
      setIsProcessing(false);
      isSubmittingRef.current = false;
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

  // ── ORDER REQUEST READY VIEW (Modular Presentation) ──
  if (orderRequest) {
    return (
      <OrderReadyModal
        orderRequest={orderRequest}
        copiedMessage={copiedMessage}
        popupBlocked={popupBlocked}
        onCopy={handleCopyMessage}
      />
    );
  }

  // ── CART & CHECKOUT FORM VIEW ──
  return (
    <main className="min-h-screen bg-bright-canvas text-bright-ink flex flex-col font-sans pt-28 pb-32">
      <div className="max-w-5xl mx-auto w-full px-6 flex flex-col gap-10">

        {/* Page Header */}
        <div className="border-b border-bright-ink/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold block mb-2">
              ✦ Checkout
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

        {/* Authoritative Cart/Price/Inventory Validation Alert */}
        {cartValidationAlert && (
          <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 flex flex-col gap-2.5 animate-fadeIn">
            <div className="flex items-center gap-2.5 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>{cartValidationAlert.message}</span>
            </div>
            {cartValidationAlert.issues && cartValidationAlert.issues.length > 0 && (
              <ul className="list-disc list-inside text-xs text-amber-800/90 pl-1 flex flex-col gap-1">
                {cartValidationAlert.issues.map((issue, i) => (
                  <li key={i}>{issue.description}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Network Error Banner */}
        {networkError && (
          <div className="p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/30 text-red-900 flex items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{networkError}</span>
            </div>
            <button
              type="button"
              onClick={handleInstagramCheckout}
              className="bg-red-600 text-white font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider text-[11px] hover:bg-red-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
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
            
            {/* Cart Lines & Customer Form (Left 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              {/* Product Lines List */}
              <div className="flex flex-col divide-y divide-bright-ink/10">
                {cart.lines.map((line) => {
                  const productImg = getProductPrimaryImage(line.merchandise.product);
                  const productHandle =
                    line.merchandise.product.handle || line.merchandise.product.id;

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
              </div>

              {/* Customer Details Form */}
              <div className="cpg-card bg-white border border-bright-ink/15 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-bright-ink/10 pb-4">
                  <div>
                    <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold block mb-1">
                      ✦ Delivery Details
                    </span>
                    <h2 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
                      Customer Information
                    </h2>
                  </div>
                  <span className="text-[11px] text-bright-muted font-sans bg-bright-card px-2.5 py-1 rounded-full border border-bright-ink/10">
                    Required for Instagram DM
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label 
                      htmlFor="input-customer-name"
                      className="font-sans text-xs font-bold uppercase tracking-wider text-bright-ink flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5 text-bright-amber" />
                      Full Name *
                    </label>
                    <input
                      id="input-customer-name"
                      type="text"
                      placeholder="e.g. Krishna Sharma"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                      }}
                      className={`bg-bright-canvas border ${
                        formErrors.name ? "border-bright-coral bg-red-50/20" : "border-bright-ink/15"
                      } rounded-xl px-3.5 py-2.5 text-sm font-sans placeholder:text-bright-muted/60 focus:outline-none focus:border-bright-amber focus-visible:ring-2 focus-visible:ring-bright-amber/40 transition-colors`}
                    />
                    {formErrors.name && (
                      <span className="text-[11px] text-bright-coral font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.name}
                      </span>
                    )}
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="flex flex-col gap-1.5">
                    <label 
                      htmlFor="input-customer-phone"
                      className="font-sans text-xs font-bold uppercase tracking-wider text-bright-ink flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-bright-amber" />
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      id="input-customer-phone"
                      type="tel"
                      placeholder="e.g. 9876543210 or +91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                      }}
                      className={`bg-bright-canvas border ${
                        formErrors.phone ? "border-bright-coral bg-red-50/20" : "border-bright-ink/15"
                      } rounded-xl px-3.5 py-2.5 text-sm font-sans placeholder:text-bright-muted/60 focus:outline-none focus:border-bright-amber focus-visible:ring-2 focus-visible:ring-bright-amber/40 transition-colors`}
                    />
                    {formErrors.phone && (
                      <span className="text-[11px] text-bright-coral font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.phone}
                      </span>
                    )}
                  </div>

                  {/* Complete Address */}
                  <div className="flex flex-col gap-1.5">
                    <label 
                      htmlFor="input-customer-address"
                      className="font-sans text-xs font-bold uppercase tracking-wider text-bright-ink flex items-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-bright-amber" />
                      Delivery Address & Pincode *
                    </label>
                    <textarea
                      id="input-customer-address"
                      rows={3}
                      placeholder="Flat/House No., Street, Area, City, State, PIN Code"
                      value={customerAddress}
                      onChange={(e) => {
                        setCustomerAddress(e.target.value);
                        if (formErrors.address) setFormErrors({ ...formErrors, address: undefined });
                      }}
                      className={`bg-bright-canvas border ${
                        formErrors.address ? "border-bright-coral bg-red-50/20" : "border-bright-ink/15"
                      } rounded-xl px-3.5 py-2.5 text-sm font-sans placeholder:text-bright-muted/60 focus:outline-none focus:border-bright-amber focus-visible:ring-2 focus-visible:ring-bright-amber/40 transition-colors resize-none`}
                    />
                    {formErrors.address && (
                      <span className="text-[11px] text-bright-coral font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.address}
                      </span>
                    )}
                  </div>

                  {/* Optional Order Notes */}
                  <div className="flex flex-col gap-1.5">
                    <label 
                      htmlFor="input-customer-notes"
                      className="font-sans text-xs font-bold uppercase tracking-wider text-bright-muted flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Special Instructions / Sizing Notes (Optional)
                    </label>
                    <input
                      id="input-customer-notes"
                      type="text"
                      placeholder="e.g. Call before delivery / prefer wider fit"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="bg-bright-canvas border border-bright-ink/15 rounded-xl px-3.5 py-2 text-sm font-sans placeholder:text-bright-muted/60 focus:outline-none focus:border-bright-amber focus-visible:ring-2 focus-visible:ring-bright-amber/40 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href="/#squad"
                  className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-bright-muted hover:text-bright-amber font-bold transition-colors"
                >
                  <span>← Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Order Summary & Instagram Order CTA Card (Right 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
              <div className="cpg-card bg-white border border-bright-ink/15 rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
                <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-bright-muted border-b border-bright-ink/10 pb-3 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-[10px] bg-bright-ink/5 px-2.5 py-0.5 rounded-full text-bright-ink font-mono">
                    {cart.lines.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    {cart.lines.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "item" : "items"}
                  </span>
                </h3>

                {/* Promo Code Form */}
                {!appliedPromo ? (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code (e.g. AWARAA10)"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        if (promoError) setPromoError(null);
                      }}
                      className="flex-grow bg-bright-card border border-bright-ink/15 rounded-xl px-3 py-2 text-xs font-sans placeholder:text-bright-muted/60 uppercase tracking-wider focus:outline-none focus:border-bright-amber focus-visible:ring-2 focus-visible:ring-bright-amber/40"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingPromo}
                      className="bg-bright-ink text-white px-4 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider hover:bg-bright-amber transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isApplyingPromo ? "..." : "Apply"}
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between bg-bright-lime/10 border border-bright-lime/20 px-3.5 py-2.5 rounded-xl text-xs font-sans text-bright-lime font-bold animate-fadeIn">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Promo {appliedPromo} applied (10% OFF)
                    </span>
                    <button
                      type="button"
                      onClick={removePromo}
                      className="text-bright-muted hover:text-bright-coral text-[11px] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoError && (
                  <p className="text-xs text-bright-coral font-sans">{promoError}</p>
                )}

                {/* Financial Summary */}
                <div className="flex flex-col gap-2.5 pt-2 text-xs font-sans">
                  <div className="flex justify-between items-center text-bright-muted">
                    <span className="uppercase tracking-wider">Subtotal</span>
                    <span className="font-semibold text-bright-ink">
                      {formatCurrencyINR(rawSubtotal)}
                    </span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between items-center text-bright-lime font-semibold">
                      <span className="uppercase tracking-wider">Discount (10%)</span>
                      <span>-{formatCurrencyINR(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-bright-muted">
                    <span className="uppercase tracking-wider">Delivery</span>
                    <span className="font-semibold text-bright-ink">₹100 (Delhi) / Porter</span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold border-t border-bright-ink/10 pt-4 text-bright-ink">
                    <span className="uppercase tracking-wider">Estimated Total</span>
                    <span className="font-display font-extrabold text-2xl text-bright-amber">
                      {formatCurrencyINR(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Direct Instagram Ordering Banner */}
                <div className="p-4 rounded-xl bg-bright-canvas border border-bright-ink/10 flex flex-col gap-2 text-xs text-bright-muted">
                  <div className="flex items-center gap-2 text-bright-ink font-bold">
                    <MessageCircle className="w-4 h-4 text-bright-amber" />
                    <span>Instagram Ordering & Delivery</span>
                  </div>
                  <p className="leading-relaxed">
                    Awaraa&apos;s Culture processes all orders via Instagram DMs ({INSTAGRAM_CONFIG.handle}). Delivery is ₹100 within Delhi; customers outside Delhi can book Porter at their own charges.
                  </p>
                </div>

                {/* Auth Check & Order CTA */}
                {!isAuthChecking && !user ? (
                  <div className="flex flex-col gap-3 p-4 rounded-xl bg-bright-amber/10 border border-bright-amber/30 text-xs text-bright-ink animate-fadeIn">
                    <div className="flex items-center gap-2 font-bold text-bright-ink">
                      <Lock className="w-4 h-4 text-bright-amber flex-shrink-0" />
                      <span>Sign in to complete order</span>
                    </div>
                    <p className="text-[11px] text-bright-muted leading-relaxed">
                      Please sign in or create an account before checkout. All your items in the cart will stay saved!
                    </p>
                    <Link
                      href="/login?next=/cart"
                      className="cpg-button-primary justify-center py-3.5 text-xs uppercase tracking-wider font-bold bg-bright-ink hover:bg-bright-amber text-white shadow-sm flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Checkout</span>
                    </Link>
                  </div>
                ) : (
                  <>
                    {user && (
                      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-bright-lime/10 border border-bright-lime/25 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2 className="w-4 h-4 text-bright-lime flex-shrink-0" />
                          <span className="font-semibold text-bright-ink truncate max-w-[170px]">
                            {user.email}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-bright-lime uppercase tracking-wider flex-shrink-0">
                          Ready ✓
                        </span>
                      </div>
                    )}
                    <InstagramOrderButton
                      onClick={handleInstagramCheckout}
                      isProcessing={isProcessing}
                    />
                  </>
                )}

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-bright-ink/10 text-center">
                  <div className="flex flex-col items-center gap-1 text-[10px] text-bright-muted">
                    <Truck className="w-3.5 h-3.5 text-bright-amber" />
                    <span>Direct DM Support</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-[10px] text-bright-muted">
                    <RotateCcw className="w-3.5 h-3.5 text-bright-amber" />
                    <span>14-Day Returns</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-[10px] text-bright-muted">
                    <ShieldCheck className="w-3.5 h-3.5 text-bright-amber" />
                    <span>Authentic Craft</span>
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
