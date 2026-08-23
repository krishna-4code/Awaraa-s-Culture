"use client";

import React from "react";
import Link from "next/link";
import {
  Send,
  Check,
  MessageCircle,
  Clock,
  AlertCircle,
  Copy,
  ExternalLink,
  FileText
} from "lucide-react";
import { INSTAGRAM_CONFIG } from "@/lib/config/instagram";
import { InstagramOrder, formatCurrencyINR } from "@/lib/order/generateInstagramOrderMessage";
import { analytics } from "@/lib/analytics";

interface OrderReadyModalProps {
  orderRequest: {
    order: InstagramOrder;
    message: string;
    instagramUrl: string;
    submittedAt: string;
  };
  copiedMessage: boolean;
  popupBlocked: boolean;
  onCopy: (text: string, orderRef: string) => void;
}

export function OrderReadyModal({
  orderRequest,
  copiedMessage,
  popupBlocked,
  onCopy,
}: OrderReadyModalProps) {
  return (
    <main className="min-h-screen bg-bright-canvas text-bright-ink flex flex-col font-sans pt-28 pb-32">
      <div className="max-w-3xl mx-auto w-full px-6 flex flex-col gap-8">
        
        {/* Header Banner */}
        <div className="bg-bright-amber/10 border-2 border-bright-amber/30 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 text-left shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-bright-amber text-white flex items-center justify-center shadow-md">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold block">
                ✦ Step 1 of 4 Completed
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-bright-ink">
                Order Request Ready!
              </h1>
            </div>
          </div>

          <p className="font-sans text-sm text-bright-ink/80 leading-relaxed">
            Your order message has been prepared with reference{" "}
            <strong className="font-mono text-bright-ink font-extrabold text-base bg-white/80 px-2 py-0.5 rounded-md border border-bright-ink/15">
              {orderRequest.order.orderRef}
            </strong>
            . To complete your purchase, send the copied message to{" "}
            <strong className="text-bright-ink font-bold">{INSTAGRAM_CONFIG.handle}</strong> on Instagram.
          </p>
        </div>

        {/* Popup Blocked Warning & Direct Action */}
        {popupBlocked && (
          <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/30 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Your browser prevented the Instagram tab from opening automatically.</span>
            </div>
            <a
              href={orderRequest.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.trackInstagramOpened(orderRequest.order.orderRef)}
              className="bg-amber-600 text-white font-bold px-3.5 py-1.5 rounded-xl uppercase tracking-wider text-[11px] hover:bg-amber-700 transition-colors whitespace-nowrap"
            >
              Open Instagram DM
            </a>
          </div>
        )}

        {/* 4-Stage Ordering Progress Tracker */}
        <div className="cpg-card bg-white border border-bright-ink/15 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
          <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-bright-muted border-b border-bright-ink/10 pb-3">
            Order Status & Next Steps
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-bright-lime/10 border border-bright-lime/30">
              <div className="flex items-center gap-2 text-bright-lime font-bold text-xs">
                <Check className="w-4 h-4" />
                <span>1. Request Ready</span>
              </div>
              <p className="text-[11px] text-bright-muted leading-snug">
                Order summary & reference created.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-bright-lime/10 border border-bright-lime/30">
              <div className="flex items-center gap-2 text-bright-lime font-bold text-xs">
                <Check className="w-4 h-4" />
                <span>2. Instagram Opened</span>
              </div>
              <p className="text-[11px] text-bright-muted leading-snug">
                DM tab launched in your browser.
              </p>
            </div>

            {/* Step 3 - Current Action */}
            <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-bright-amber/15 border-2 border-bright-amber shadow-sm animate-pulse">
              <div className="flex items-center gap-2 text-bright-amber font-extrabold text-xs uppercase">
                <MessageCircle className="w-4 h-4" />
                <span>3. Send Message</span>
              </div>
              <p className="text-[11px] text-bright-ink font-semibold leading-snug">
                Paste the order text in Instagram DM and send!
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-bright-card/50 border border-bright-ink/10 opacity-70">
              <div className="flex items-center gap-2 text-bright-muted font-bold text-xs">
                <Clock className="w-4 h-4" />
                <span>4. Confirmation</span>
              </div>
              <p className="text-[11px] text-bright-muted leading-snug">
                Awaraa&apos;s Culture team verifies & confirms your order.
              </p>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
            <span>
              <strong>Important:</strong> Your order is <em>not yet confirmed</em>. Our squad team confirms each pair individually in Instagram DMs after checking live stock and dispatch timing.
            </span>
          </div>
        </div>

        {/* Direct Actions: Copy Message & Open Instagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onCopy(orderRequest.message, orderRequest.order.orderRef)}
            className="cpg-button-primary justify-center py-4 text-sm font-bold shadow-md bg-bright-ink hover:bg-bright-amber text-white cursor-pointer"
          >
            {copiedMessage ? (
              <>
                <Check className="w-4 h-4 text-bright-lime" />
                <span>Copied to Clipboard! ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Order Message</span>
              </>
            )}
          </button>

          <a
            href={orderRequest.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analytics.trackInstagramOpened(orderRequest.order.orderRef)}
            className="cpg-button-primary justify-center py-4 text-sm font-bold shadow-md bg-[#E1306C] hover:bg-[#C13584] text-white border-transparent"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Open Instagram DM ({INSTAGRAM_CONFIG.handle})</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Generated Message Preview Card */}
        <div className="cpg-card bg-white border border-bright-ink/15 rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-bright-ink/10 pb-3">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-bright-ink flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-bright-amber" />
              Generated Order Message
            </span>
            <button
              type="button"
              onClick={() => onCopy(orderRequest.message, orderRequest.order.orderRef)}
              className="text-xs font-sans font-bold text-bright-amber hover:text-bright-ink uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedMessage ? "Copied ✓" : "Copy Text"}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-bright-canvas border border-bright-ink/10 font-mono text-xs text-bright-ink whitespace-pre-wrap leading-relaxed overflow-x-auto select-all">
            {orderRequest.message}
          </pre>
        </div>

        {/* Order Summary Snapshot */}
        <div className="cpg-card bg-white border border-bright-ink/15 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
          <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-bright-muted border-b border-bright-ink/10 pb-3">
            Order Details Snapshot
          </h3>

          <div className="divide-y divide-bright-ink/10 text-xs font-sans">
            {orderRequest.order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex justify-between items-start gap-4">
                <div>
                  <p className="font-bold text-bright-ink">{item.productName}</p>
                  <p className="text-bright-muted text-[11px] mt-0.5">
                    Size: {item.size} {item.color ? `• Color: ${item.color}` : ""} • Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-bright-ink font-mono">
                  {formatCurrencyINR(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-bright-ink/10 pt-3 flex flex-col gap-1.5 text-xs font-sans">
            <div className="flex justify-between text-bright-muted">
              <span>Subtotal</span>
              <span className="font-semibold text-bright-ink">
                {formatCurrencyINR(orderRequest.order.subtotal)}
              </span>
            </div>
            {orderRequest.order.discount && (
              <div className="flex justify-between text-bright-lime font-semibold">
                <span>Discount</span>
                <span>-{formatCurrencyINR(orderRequest.order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-bright-muted">
              <span>Delivery</span>
              <span className="font-semibold text-bright-ink">To be confirmed</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-bright-ink/10 pt-2 text-bright-ink">
              <span>Total Amount</span>
              <span className="font-display font-extrabold text-xl text-bright-amber">
                {formatCurrencyINR(orderRequest.order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Back */}
        <div className="flex justify-center pt-4">
          <Link
            href="/#squad"
            className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-bright-muted hover:text-bright-amber font-bold transition-colors"
          >
            <span>← Return to Home & Explore The Squad</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
