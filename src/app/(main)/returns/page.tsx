import { Metadata } from 'next';
import Link from 'next/link';
import { BRAND_NAME } from '@/lib/constants';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: "Returns & Exchange Policy | Awaraa's Culture",
  description:
    "14-Day Returns and Exchange Policy for Awaraa's Culture footwear. Learn about size exchanges, unworn condition requirements, and return procedures.",
  alternates: {
    canonical: `${SITE_URL}/returns`,
  },
  openGraph: {
    title: "Returns & Exchange Policy | Awaraa's Culture",
    description:
      "14-Day Returns and Exchange Policy for Awaraa's Culture footwear. Learn about size exchanges, unworn condition requirements, and return procedures.",
    url: `${SITE_URL}/returns`,
    siteName: BRAND_NAME,
    locale: 'en_IN',
    type: 'website',
  },
};

export default function ReturnsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/returns#webpage`,
        url: `${SITE_URL}/returns`,
        name: "Returns & Exchange Policy | Awaraa's Culture",
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/returns#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Returns Policy', item: `${SITE_URL}/returns` },
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
            ✦ Customer Care & Confidence
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-bright-ink">
            Returns & Exchange Policy
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
            Statutory return windows, refund turnaround timelines, and consumer rights under the Consumer Protection (E-Commerce) Rules, 2020 are subject to formal counsel verification.
          </p>
        </div>

        {/* Policy Details */}
        <div className="flex flex-col gap-8 text-sm text-bright-muted leading-relaxed">
          <section className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
              1. 14-Day Exchange Window
            </h2>
            <p>
              We want you to love how your pair feels on feet. If the size doesn&apos;t fit perfectly, we offer a <strong className="text-bright-ink">14-day exchange window</strong> from the date of delivery.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
              2. Condition Requirements
            </h2>
            <p>
              To qualify for an exchange or return:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The footwear must be brand new, completely unworn outdoors, with zero scuffs or creasing.</li>
              <li>Original tags, shoe box, and packaging materials must be intact.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-bright-ink">
              3. How to Initiate
            </h2>
            <p>
              Direct message our team on Instagram (<strong className="text-bright-ink">@awaraasculture</strong>) with your order details and requested exchange size. Our team will guide you through the process.
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
