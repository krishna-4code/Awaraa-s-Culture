import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service, Order, and Returns Policies for Awaraa\'s Culture.',
};

export default function TermsPage() {
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
            ✦ Store Policies
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-bright-ink">
            Terms of Service & Returns
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
            Mandatory disclosures under Consumer Protection (E-Commerce) Rules, 2020: Return windows, pickup policies, warranty terms, and dispute resolution jurisdiction. Review required by legal counsel before public commerce activation.
          </p>
        </div>

        {/* Content Sections */}
        <div className="flex flex-col gap-8 text-sm text-bright-muted leading-relaxed">
          <section className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
              1. Orders & Pricing
            </h2>
            <p>
              All prices listed on Awaraa&apos;s Culture are in Indian Rupees (INR) and include applicable Goods and Services Tax (GST). Orders are confirmed upon successful payment verification.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
              2. 14-Day Honest Returns & Exchange Policy
            </h2>
            <p>
              We offer a 14-day hassle-free return and exchange window for unworn footwear in original condition with tags intact. Reverse pickup is arranged free of charge across supported Delhi NCR and national pin codes.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
              3. Shipping & Delivery Timelines
            </h2>
            <p>
              Standard orders are dispatched within 24–48 business hours. Average delivery takes 2–4 business days across Delhi NCR and metro cities, and 4–7 business days for rest of India.
            </p>
          </section>
        </div>

      </div>
    </main>
  );
}
