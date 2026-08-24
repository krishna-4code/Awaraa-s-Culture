import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Delivery Policy',
  description: 'Terms of Service, Delivery, and Return Policies for Awaraa\'s Culture.',
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
            ✦ Store & Delivery Policies
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-bright-ink">
            Terms & Delivery Policy
          </h1>
          <p className="font-sans text-sm text-bright-muted mt-2">
            Last Updated: August 2026
          </p>
        </div>

        {/* Stock & Ordering Notice */}
        <div className="p-6 rounded-2xl bg-bright-amber/10 border-2 border-bright-amber/30 text-bright-ink flex flex-col gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider bg-bright-amber/20 text-bright-ink px-2.5 py-1 rounded-md self-start">
            ✦ Live Stock Catalog & Instagram Ordering
          </span>
          <p className="text-xs font-sans leading-relaxed text-bright-muted">
            The website serves as a live catalog to check current stock availability. All inquiries, size verifications, and order confirmations take place directly via Instagram DMs.
          </p>
        </div>

        {/* Content Sections */}
        <div className="flex flex-col gap-8 text-sm text-bright-muted leading-relaxed">
          <section className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
              1. Orders & Pricing
            </h2>
            <p>
              All prices listed on Awaraa&apos;s Culture are in Indian Rupees (INR). Orders are verified and confirmed individually with our team in Instagram DMs after checking live stock.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
              2. Shipping & Delivery Policy
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-bright-ink">Delhi Orders:</strong> We deliver directly in Delhi with a flat delivery fee of <strong className="text-bright-ink">₹100</strong> per order. Standard dispatch happens within 24–48 business hours.
              </li>
              <li>
                <strong className="text-bright-ink">Outside Delhi Orders:</strong> For customers outside Delhi, you can arrange and book <strong className="text-bright-ink">Porter</strong> (or your preferred courier/logistics service) on your own charges once our team notifies you that your pair is packed and ready for pickup from our Delhi fulfillment hub.
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
              3. 14-Day Returns & Exchanges
            </h2>
            <p>
              We offer a 14-day exchange window for unworn footwear in original condition with tags intact. Reach out to our team on Instagram to coordinate an exchange for supported Delhi orders.
            </p>
          </section>
        </div>

      </div>
    </main>
  );
}
