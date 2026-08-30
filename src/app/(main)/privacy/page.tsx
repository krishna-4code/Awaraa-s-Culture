import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: "Awaraa's Culture Privacy Policy — how we collect, use, and protect your personal data for order fulfilment under India's DPDPA. No data sold to third parties.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bright-canvas text-bright-ink pt-28 pb-32 px-6 font-sans">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Breadcrumb */}
        <Link
          href="/"
          className="font-sans text-xs font-semibold uppercase tracking-widest text-bright-muted hover:text-bright-amber transition-colors inline-flex items-center gap-1"
        >
          ← Back to Home
        </Link>

        {/* Header */}
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold block mb-2">
            ✦ Compliance & Trust
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-bright-ink">
            Privacy Policy
          </h1>
          <p className="font-sans text-sm text-bright-muted mt-2">
            Last Updated: August 2026
          </p>
        </div>

        {/* Mandatory Legal Review Banner */}
        <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 flex flex-col gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-900 px-2.5 py-1 rounded-md self-start">
            [[LEGAL REVIEW REQUIRED — MANDATORY STATUTORY DISCLOSURE]]
          </span>
          <p className="text-xs font-sans leading-relaxed">
            This document outlines data collection policies for order fulfillment, payments, and account creation under the Information Technology Act, 2000 and the Digital Personal Data Protection Act (DPDPA). Official legal counsel review is required prior to final production launch.
          </p>
        </div>

        {/* Content Sections */}
        <div className="flex flex-col gap-8 text-sm text-bright-muted leading-relaxed">
          <section className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
              1. Information We Collect
            </h2>
            <p>
              When you purchase footwear or view stock with Awaraa&apos;s Culture, we collect necessary personal details including your name, shipping address, and telephone number to process and deliver your order.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
              2. Payment Information
            </h2>
            <p>
              All payment transactions are processed securely through PCI-DSS compliant third-party payment gateways (Razorpay). Awaraa&apos;s Culture does not store your debit card, credit card, or UPI credentials on our servers.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
              3. Customer Support & Grievance Mechanism
            </h2>
            <div className="bg-bright-card p-5 rounded-xl border border-bright-ink/10 text-bright-ink">
              <p className="font-bold text-xs uppercase tracking-wider mb-2">Customer Support Desk</p>
              <p className="text-xs text-bright-muted">
                Channel: Instagram Direct Messages (@awaraasculture)<br />
                Entity: Awaraa&apos;s Culture Footwear LLP<br />
                Address: Delhi NCR, India
              </p>
            </div>
          </section>
        </div>

      </div>
    </main>
  );
}
