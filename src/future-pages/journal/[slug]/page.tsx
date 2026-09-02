import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BRAND_NAME } from '@/lib/constants';
import { SITE_URL } from '@/lib/site';

type Props = {
  params: Promise<{ slug: string }>;
};

// Dynamic metadata generator for journal posts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // Normalized title fallback from slug
  const title = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${title} — ${BRAND_NAME} Journal`,
    description: `Read "${title}" in the ${BRAND_NAME} Journal. Insights on footwear craft, movement, and Delhi street culture.`,
    alternates: {
      canonical: `${SITE_URL}/journal/${slug}`,
    },
    openGraph: {
      title: `${title} — ${BRAND_NAME} Journal`,
      description: `Read "${title}" in the ${BRAND_NAME} Journal.`,
      url: `${SITE_URL}/journal/${slug}`,
      siteName: BRAND_NAME,
      locale: 'en_IN',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${BRAND_NAME} Journal`,
      description: `Read "${title}" in the ${BRAND_NAME} Journal.`,
    },
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;

  // In production, fetch post from CMS. If not found or draft, 404 cleanly.
  if (!slug) {
    notFound();
  }

  const title = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${SITE_URL}/journal/${slug}#article`,
        headline: title,
        description: `Read ${title} on the Awaraa's Culture Journal.`,
        url: `${SITE_URL}/journal/${slug}`,
        author: {
          '@type': 'Organization',
          name: BRAND_NAME,
          url: SITE_URL,
        },
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/journal/${slug}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/journal/${slug}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/journal` },
          { '@type': 'ListItem', position: 3, name: title, item: `${SITE_URL}/journal/${slug}` },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-bright-canvas text-bright-ink pt-28 pb-32 px-6 font-sans">
      <article className="max-w-3xl mx-auto flex flex-col gap-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bright-muted">
            <Link href="/" className="hover:text-bright-amber transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/journal" className="hover:text-bright-amber transition-colors">
              Journal
            </Link>
            <span>/</span>
            <span className="text-bright-ink font-bold truncate">{title}</span>
          </div>
        </nav>

        {/* Article Header */}
        <header className="flex flex-col gap-4">
          <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold">
            ✦ Editorial Dispatch
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-bright-ink leading-[1.05]">
            {title}
          </h1>
          <div className="flex items-center gap-4 text-xs font-sans text-bright-muted pt-2 border-t border-bright-ink/10">
            <span>By {BRAND_NAME} Team</span>
            <span>•</span>
            <span>Delhi NCR</span>
          </div>
        </header>

        {/* Content Placeholder for Authoring */}
        <div className="p-8 rounded-3xl bg-bright-card/80 border-2 border-dashed border-bright-ink/20 text-bright-ink flex flex-col gap-3">
          <span className="font-mono text-xs font-bold uppercase tracking-wider bg-bright-amber/15 text-bright-ink px-2.5 py-1 rounded-md self-start">
            [[BRAND EDITORIAL: Content publishing pipeline active]]
          </span>
          <p className="text-xs text-bright-muted leading-relaxed">
            This article page is structured with compliant Schema.org BlogPosting data, OpenGraph cards, and Next.js static metadata. Full text will render when authored in Sanity CMS.
          </p>
        </div>

        {/* Back Link */}
        <div className="pt-8 border-t border-bright-ink/10">
          <Link
            href="/journal"
            className="font-sans text-xs font-bold uppercase tracking-wider text-bright-amber hover:underline"
          >
            ← Back to All Journal Entries
          </Link>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
