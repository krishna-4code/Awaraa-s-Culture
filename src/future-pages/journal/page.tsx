import { Metadata } from 'next';
import Link from 'next/link';
import { BRAND_NAME } from '@/lib/constants';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: "Journal | Awaraa's Culture",
  description:
    "Stories, craft notes, Delhi street culture, and footwear design insights from Awaraa's Culture. Honest commentary for everyday movement.",
  alternates: {
    canonical: `${SITE_URL}/journal`,
  },
  openGraph: {
    title: "Journal | Awaraa's Culture",
    description:
      "Stories, craft notes, Delhi street culture, and footwear design insights from Awaraa's Culture.",
    url: `${SITE_URL}/journal`,
    siteName: BRAND_NAME,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Journal | Awaraa's Culture",
    description:
      "Stories, craft notes, Delhi street culture, and footwear design insights from Awaraa's Culture.",
  },
};

export default function JournalPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${SITE_URL}/journal#blog`,
        url: `${SITE_URL}/journal`,
        name: `${BRAND_NAME} Journal`,
        description:
          "Stories, craft notes, and footwear design insights from Awaraa's Culture.",
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/journal#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/journal` },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-bright-canvas text-bright-ink pt-28 pb-32 px-6 font-sans">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb">
          <Link
            href="/"
            className="font-sans text-xs font-semibold uppercase tracking-widest text-bright-muted hover:text-bright-amber transition-colors inline-flex items-center gap-1"
          >
            ← Back to Home
          </Link>
        </nav>

        {/* Header */}
        <div className="flex flex-col gap-3">
          <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold block">
            ✦ Field Notes & Perspective
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-bright-ink leading-[0.95]">
            The Awaraa Journal
          </h1>
          <p className="font-sans text-lg text-bright-muted font-medium mt-2">
            Dispatches on purposeful movement, material integrity, and Delhi street culture.
          </p>
        </div>

        {/* Editorial Architecture Foundation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-bright-card border border-bright-ink/10 flex flex-col gap-2">
            <span className="font-mono text-xs font-bold text-bright-amber uppercase">01 / Craft</span>
            <h2 className="font-display font-bold text-lg text-bright-ink uppercase">Materials & Soles</h2>
            <p className="text-xs text-bright-muted leading-relaxed">
              Deconstructing EVA densities, mesh breathability, and why zero break-in matters for everyday wear.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-bright-card border border-bright-ink/10 flex flex-col gap-2">
            <span className="font-mono text-xs font-bold text-bright-lime uppercase">02 / Culture</span>
            <h2 className="font-display font-bold text-lg text-bright-ink uppercase">Delhi Pavement</h2>
            <p className="text-xs text-bright-muted leading-relaxed">
              Real-world mileage from Connaught Place to Cyber Hub. Footwear tested where the city actually walks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-bright-card border border-bright-ink/10 flex flex-col gap-2">
            <span className="font-mono text-xs font-bold text-bright-coral uppercase">03 / Value</span>
            <h2 className="font-display font-bold text-lg text-bright-ink uppercase">Honest Pricing</h2>
            <p className="text-xs text-bright-muted leading-relaxed">
              Unpacking why quality sneakers shouldn&apos;t cost a month&apos;s rent and how direct craft cuts out middlemen.
            </p>
          </div>
        </div>

        {/* Brand Owner Content Pipeline Notice */}
        <div className="p-8 rounded-3xl bg-bright-card/80 border-2 border-dashed border-bright-ink/20 text-bright-ink flex flex-col gap-3">
          <span className="font-mono text-xs font-bold uppercase tracking-wider bg-bright-amber/15 text-bright-ink px-2.5 py-1 rounded-md self-start">
            [[EDITORIAL PIPELINE READY — ARTICLES PUBLISHED VIA CMS/BRAND EDITORIAL]]
          </span>
          <p className="text-xs text-bright-muted leading-relaxed">
            The Journal infrastructure is established with complete OpenGraph metadata, RSS/sitemap discovery, and Article structured data. Content releases will be published directly as editorial pieces are authored.
          </p>
        </div>

      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
