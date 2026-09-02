import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCollection, getCollectionByHandle } from '@/lib/commerce/collections';
import { getProducts } from '@/lib/commerce/products';
import { BRAND_NAME } from '@/lib/constants';
import { SITE_URL } from '@/lib/site';
import { generateCollectionMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ category: string }>;
};

// Static params for pre-rendering known categories
export async function generateStaticParams() {
  const collections = await getCollection();
  return collections.map((c) => ({
    category: c.handle,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const collection = await getCollectionByHandle(category);

  if (!collection) {
    return {
      title: `Collection Not Found — ${BRAND_NAME}`,
      description: `Explore footwear collections from ${BRAND_NAME}.`,
    };
  }

  return generateCollectionMetadata({
    title: collection.title,
    description: collection.description,
    handle: collection.handle,
    imageUrl: collection.imageUrl ? `${SITE_URL}${collection.imageUrl}` : undefined,
  });
}

export default async function CollectionPage({ params }: Props) {
  const { category } = await params;
  const [collection, allProducts] = await Promise.all([
    getCollectionByHandle(category),
    getProducts(),
  ]);

  if (!collection) {
    notFound();
  }

  // Filter products belonging to this category
  const matchingProducts = allProducts.filter((p) => {
    const collSlug = p.collectionSlug?.toLowerCase();
    const target = category.toLowerCase();
    if (collSlug === target) return true;

    // Fallback category heuristics
    if (target === 'daily-walkers') {
      return ['aero-tide', 'moss-velocity', 'sand-drift', 'midnight-flow', 'nb-sports', 'sports', 'sketchers-sports', 'brooks'].includes(p.handle);
    }
    if (target === 'street-kicks') {
      return ['cocoa-drift', 'dune-runner', 'earthline', 'shadow-crest', 'sb-dunks', 'nb-sneakers', 'waffle-brown', 'lv-sneakers'].includes(p.handle);
    }
    if (target === 'terrain-comfort') {
      return ['earthline', 'midnight-flow', 'waffle-brown', 'brooks'].includes(p.handle);
    }
    return false;
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/collections/${collection.handle}#webpage`,
        url: `${SITE_URL}/collections/${collection.handle}`,
        name: `${collection.title} — ${BRAND_NAME}`,
        description: collection.description,
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/collections/${collection.handle}#breadcrumb`,
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
            name: collection.title,
            item: `${SITE_URL}/collections/${collection.handle}`,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/collections/${collection.handle}#itemlist`,
        name: collection.title,
        itemListElement: matchingProducts.map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: p.name,
          url: `${SITE_URL}/products/${p.handle}`,
          image: p.images?.[0]?.url ? (p.images[0].url.startsWith('http') ? p.images[0].url : `${SITE_URL}${p.images[0].url}`) : undefined,
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-bright-canvas text-bright-ink pt-28 pb-32 px-6 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bright-muted">
            <Link href="/" className="hover:text-bright-amber transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/#squad" className="hover:text-bright-amber transition-colors">
              Collections
            </Link>
            <span>/</span>
            <span className="text-bright-ink font-bold">{collection.title}</span>
          </div>
        </nav>

        {/* Category Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-bright-ink/10 pb-8">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold block mb-2">
              ✦ Curated Collection
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-bright-ink">
              {collection.title}
            </h1>
          </div>
          <p className="font-sans text-base text-bright-muted max-w-lg">
            {collection.description}
          </p>
        </div>

        {/* Products Grid */}
        {matchingProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matchingProducts.map((product) => {
              const mainImg = product.images?.[0]?.url || '/shoes/nb_sports/1.png';
              return (
                <div
                  key={product.id}
                  className="cpg-card flex flex-col justify-between group relative overflow-hidden bg-white/90 border border-bright-ink/10 hover:border-bright-amber/50 hover:shadow-lg transition-all duration-300"
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative w-full h-64 bg-bright-card rounded-2xl overflow-hidden mb-4">
                      <Link
                        href={`/products/${product.handle}`}
                        className="relative w-full h-full block"
                      >
                        <Image
                          src={mainImg}
                          alt={`${product.name} - ${collection.title} Footwear`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                    </div>

                    {/* Info */}
                    <Link
                      href={`/products/${product.handle}`}
                      className="font-display font-bold text-2xl text-bright-ink group-hover:text-bright-amber transition-colors duration-200 block"
                    >
                      {product.name}
                    </Link>
                    <p className="font-sans text-sm text-bright-muted line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>

                  {/* Footer Price & View */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-bright-ink/10">
                    <div>
                      <span className="font-sans text-xs text-bright-muted block">Price</span>
                      <span className="font-display font-extrabold text-xl text-bright-ink">
                        {product.price}
                      </span>
                    </div>
                    <Link
                      href={`/products/${product.handle}`}
                      className="font-sans text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-bright-amber text-white hover:bg-bright-ink transition-all shadow-sm"
                    >
                      View Pair →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-bright-card border border-bright-ink/10 flex flex-col items-center gap-4">
            <p className="font-sans text-base text-bright-muted">
              New pairs are currently in craft production for {collection.title}.
            </p>
            <Link
              href="/#squad"
              className="cpg-button-primary bg-bright-amber text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase"
            >
              Explore All Squad Pairs
            </Link>
          </div>
        )}

      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
