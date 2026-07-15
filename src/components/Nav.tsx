"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-umber/80 backdrop-blur-md border-b border-umber/20 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-display font-bold text-xl tracking-widest uppercase text-dust hover:text-clay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
        >
          Awaraa's Culture
        </Link>

        <div className="flex items-center gap-8 font-sans text-sm uppercase tracking-widest text-dust">
          <Link 
            href="/products/everyday" 
            className="relative group hover:text-clay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
          >
            Collection
            {pathname.includes("/products") && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-clay" />
            )}
          </Link>
          <Link 
            href="/cart" 
            className="relative group hover:text-clay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
          >
            Cart
            {pathname === "/cart" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-clay" />
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
