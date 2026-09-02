import { Metadata } from 'next';
import Link from 'next/link';
import { BRAND_NAME, BRAND_NAME_ALT } from '@/lib/constants';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: "About Awaraa's Culture | Our Story",
  description:
    "Awaraa's Culture is an Indian footwear brand built around comfort, quality and honest value. Discover the wanderer philosophy and our locked brand principles.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About Awaraa's Culture | Our Story",
    description:
      "Awaraa's Culture is an Indian footwear brand built around comfort, quality and honest value. Discover the wanderer philosophy and our locked brand principles.",
    url: `${SITE_URL}/about`,
    siteName: BRAND_NAME,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "About Awaraa's Culture | Our Story",
    description:
      "Awaraa's Culture is an Indian footwear brand built around comfort, quality and honest value. Discover the wanderer philosophy and our locked brand principles.",
  },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${SITE_URL}/about#webpage`,
        url: `${SITE_URL}/about`,
        name: "About Awaraa's Culture | Our Story",
        description:
          "Awaraa's Culture is an Indian footwear brand built around comfort, quality and honest value.",
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/about#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'About',
            item: `${SITE_URL}/about`,
          },
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
            ✦ Purpose & Heritage
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-bright-ink leading-[0.95]">
            About Awaraa&apos;s Culture
          </h1>
          <p className="font-sans text-lg text-bright-muted font-medium mt-2">
            Purposeful movement, honest comfort, and footwear made for the journey.
          </p>
        </div>

        {/* Section 1: Meaning & Wanderer Philosophy */}
        <section className="flex flex-col gap-5 border-t border-bright-ink/10 pt-8">
          <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-bright-ink">
            The Meaning of Awaraa
          </h2>
          <p className="text-base text-bright-muted leading-relaxed">
            <strong className="text-bright-ink font-bold">Awaraa (आवारा)</strong> means wanderer—someone always in motion, geographically, culturally, and socially. In a world saturated with synthetic hype cycles and inflated price tags, we craft footwear for people who move with genuine intention.
          </p>
          <p className="text-base text-bright-muted leading-relaxed">
            Our mission is simple: provide street-tested footwear engineered for Delhi NCR pavement and beyond, pairing high-rebound cushioning, honest materials, and clean silhouettes without predatory markups.
          </p>
        </section>

        {/* Section 2: Locked Brand Principles */}
        <section className="flex flex-col gap-6 border-t border-bright-ink/10 pt-8">
          <div className="flex flex-col gap-1">
            <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold">
              Our Standard
            </span>
            <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-bright-ink">
              Locked Brand Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { num: '01', title: 'Quality before profit', desc: 'We never compromise on material durability or sole construction to cut corners.' },
              { num: '02', title: 'Customer before transaction', desc: 'Every pair is verified and delivered with direct human attention and honest service.' },
              { num: '03', title: 'Comfort before trends', desc: 'Ergonomic footbeds and multi-density soles come before transient aesthetic fads.' },
              { num: '04', title: 'Honesty before marketing', desc: 'Transparent pricing with no artificial scarcity gimmicks or exaggerated claims.' },
              { num: '05', title: 'Long-term loyalty', desc: 'Built to earn your trust day in and day out across every kilometer you walk.' },
            ].map((p) => (
              <div key={p.num} className="p-5 rounded-2xl bg-bright-card border border-bright-ink/10 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-bright-amber text-white">
                    {p.num}
                  </span>
                  <h3 className="font-sans font-bold text-sm text-bright-ink uppercase tracking-wide">
                    {p.title}
                  </h3>
                </div>
                <p className="text-xs text-bright-muted leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Founder & Origin Story */}
        <section className="flex flex-col gap-5 border-t border-bright-ink/10 pt-8">
          <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-bright-ink">
            Founder Journey & Heritage
          </h2>
          <div className="p-6 rounded-2xl bg-bright-card/80 border-2 border-dashed border-bright-ink/20 text-bright-ink flex flex-col gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider bg-bright-amber/15 text-bright-ink px-2.5 py-1 rounded-md self-start">
              [[BRAND OWNER TO PROVIDE: founder story details]]
            </span>
            <p className="text-xs text-bright-muted leading-relaxed">
              Specific founder background, timeline milestones, and founding narrative will be updated directly by the brand owner. The commitment to honest craftsmanship across Delhi NCR remains the foundational anchor of all Awaraa&apos;s Culture releases.
            </p>
          </div>
        </section>

        {/* Section 4: Explore The Squad */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-bright-ink text-white mt-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-display font-extrabold text-2xl uppercase tracking-tight">
              Ready to Wander?
            </h3>
            <p className="text-xs text-gray-300">
              Explore our current lineup of street-tested sneakers and runners.
            </p>
          </div>
          <Link
            href="/#squad"
            className="cpg-button-primary bg-bright-amber text-white hover:bg-white hover:text-bright-ink px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all"
          >
            Explore The Squad →
          </Link>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
