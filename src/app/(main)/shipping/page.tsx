import { Metadata } from 'next';
import Link from 'next/link';
import { BRAND_NAME } from '@/lib/constants';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Awaraa's Culture",
  description:
    "Learn about Awaraa's Culture delivery terms. Flat ₹100 delivery within Delhi NCR, and courier/Porter self-booking for orders outside Delhi.",
  alternates: {
    canonical: `${SITE_URL}/shipping`,
  },
  openGraph: {
    title: "Shipping & Delivery Policy | Awaraa's Culture",
    description:
      "Learn about Awaraa's Culture delivery terms. Flat ₹100 delivery within Delhi NCR, and courier/Porter self-booking for orders outside Delhi.",
    url: `${SITE_URL}/shipping`,
    siteName: BRAND_NAME,
    locale: 'en_IN',
    type: 'website',
  },
};

export default function ShippingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/shipping#webpage`,
        url: `${SITE_URL}/shipping`,
        name: "Shipping & Delivery Policy | Awaraa's Culture",
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/shipping#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Shipping Policy', item: `${SITE_URL}/shipping` },
        ],
      },
    ],
  };

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
            ✦ Delivery Guidelines
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-bright-ink">
            Shipping & Delivery Policy
          </h1>
          <p className="font-sans text-sm text-bright-muted mt-2">
            Last Updated: August 2026
          </p>
        </div>

        {/* Mandatory Statutory Notice */}
        <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 flex flex-col gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-900 px-2.5 py-1 rounded-md self-start">
            [[LEGAL REVIEW REQUIRED — MANDATORY STATUTORY DISCLOSURE PENDING BRAND OWNER/LEGAL COUNSEL]]
          </span>
          <p className="text-xs font-sans leading-relaxed">
            Statutory shipping timelines, carrier limitations, and logistics dispute mechanisms are subject to formal legal review before final execution.
          </p>
        </div>

        {/* Operational Shipping Content */}
        <div className="flex flex-col gap-8 text-sm text-bright-muted leading-relaxed">
          <section className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
              1. Delhi NCR Delivery (Flat ₹100)
            </h2>
            <p>
              For addresses located inside Delhi NCR, all footwear is delivered directly via dedicated local couriers. A flat delivery fee of <strong className="text-bright-ink">₹100</strong> applies per order. Standard delivery timeline is 24 to 48 business hours after confirmation in Instagram DM.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
              2. Outside Delhi Orders (Porter / Self-Arranged Logistics)
            </h2>
            <p>
              For customers located outside Delhi, orders are packed at our Delhi fulfillment hub. Customers arrange and book <strong className="text-bright-ink">Porter</strong> (or their preferred inter-city logistics provider) on their own charges once our team notifies that the parcel is ready.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
              3. Order Confirmation & Tracking
            </h2>
            <p>
              Every pair is verified for correct sizing and inspected for quality before dispatch. Live tracking updates or dispatch slips are shared directly with the customer via Instagram DM or WhatsApp.
            </p>
          </section>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
