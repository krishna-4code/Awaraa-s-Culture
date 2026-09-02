import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, Space_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingShoeParticles } from "@/components/FloatingShoeParticles";
import { BRAND_NAME, BRAND_NAME_ALT, BRAND_TAGLINE, BRAND_DESCRIPTION } from "@/lib/constants";
import { SITE_URL } from "@/lib/site";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],   // display/headlines only — bold + extrabold
  variable: "--font-syne",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],  // body, medium, semibold, bold — all used
  variable: "--font-jakarta",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  // Small spec labels only — no need to preload this face above the fold.
  preload: false,
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700"],   // accent/badge labels — semibold + bold
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} — ${BRAND_TAGLINE}`,
    template: `%s — ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${BRAND_NAME} — ${BRAND_TAGLINE}`,
    description: BRAND_DESCRIPTION,
    url: SITE_URL,
    siteName: BRAND_NAME,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_NAME} — ${BRAND_TAGLINE}`,
    description: BRAND_DESCRIPTION,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${jakarta.variable} ${spaceMono.variable} ${bricolage.variable} font-sans antialiased bg-bright-canvas text-bright-ink selection:bg-bright-amber selection:text-white`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[10000] focus:bg-bright-ink focus:text-white focus:px-4 focus:py-2 focus:rounded-full focus:text-xs focus:font-bold focus:uppercase focus:tracking-wider focus:shadow-lg"
        >
          Skip to main content
        </a>
        <CartProvider>
          {/* Global Cart Slide-Over Drawer */}
          <CartDrawer />

          {/* Layer 1: Ambient Floating Sneaker Silhouette Particles (z-1, non-interactive, fixed) */}
          <FloatingShoeParticles />

          {/* Layer 10+: Main Website Content */}
          <div id="main-content" className="relative z-10 min-h-screen" tabIndex={-1}>
            {children}
          </div>
        </CartProvider>
        
        {/* Global Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  "name": BRAND_NAME,
                  "alternateName": BRAND_NAME_ALT,
                  "url": `${SITE_URL}/`,
                  "publisher": {
                    "@id": `${SITE_URL}/#organization`
                  }
                },
                {
                  "@type": "OnlineStore",
                  "@id": `${SITE_URL}/#organization`,
                  "name": BRAND_NAME,
                  "alternateName": BRAND_NAME_ALT,
                  "url": `${SITE_URL}/`,
                  "logo": `${SITE_URL}/logo.png`,
                  "sameAs": ["[[INSTAGRAM_URL_ONCE_CREATED]]"]
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
