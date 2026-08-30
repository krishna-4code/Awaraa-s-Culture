import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, Space_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { ShoeCursorTrail } from "@/components/ShoeCursorTrail";
import { FloatingShoeParticles } from "@/components/FloatingShoeParticles";
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
    default: "Awaraa's Culture",
    template: "%s — Awaraa's Culture"
  },
  description: "Awaraa's Culture crafts honest, street-tested footwear for Delhi NCR — real comfort, zero hype markups, built for daily movement. Wander without limits.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Awaraa's Culture — Street-Tested Footwear, Zero Hype Markups",
    description: "Awaraa's Culture crafts honest, street-tested footwear for Delhi NCR — real comfort, zero hype markups, built for daily movement. Wander without limits.",
    url: SITE_URL,
    siteName: "Awaraa's Culture",
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Awaraa's Culture — Street-Tested Footwear, Zero Hype Markups",
    description: "Awaraa's Culture crafts honest, street-tested footwear for Delhi NCR — real comfort, zero hype markups, built for daily movement. Wander without limits.",
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

          {/* Layer 9998 & 9999: Interactive Bubble Canvas & 3D Shoe Cursor Trail */}
          <ShoeCursorTrail />

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
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  "name": "Awaraa's Culture",
                  "url": SITE_URL,
                  "logo": {
                    "@type": "ImageObject",
                    "url": `${SITE_URL}/logo.jpeg`
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  "url": SITE_URL,
                  "name": "Awaraa's Culture",
                  "publisher": {
                    "@id": `${SITE_URL}/#organization`
                  }
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
