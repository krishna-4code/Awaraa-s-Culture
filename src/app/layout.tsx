import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Awaraa's Culture",
    template: "%s — Awaraa's Culture"
  },
  description: "Movement with purpose, not aimless wandering.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Awaraa's Culture",
    description: "Movement with purpose, not aimless wandering.",
    url: SITE_URL,
    siteName: "Awaraa's Culture",
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Awaraa's Culture",
    description: "Movement with purpose, not aimless wandering.",
  }
};

import { CartProvider } from "@/components/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${jakarta.variable} font-sans antialiased bg-charcoal text-dust`}
      >
        <CartProvider>
          <Nav />
          <SmoothScroll>
            <div className="flex flex-col min-h-screen">
              {children}
            </div>
            <Footer />
          </SmoothScroll>
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
                    "url": `${SITE_URL}/icon.png`
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
