"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";

export function Nav() {
  const pathname = usePathname();
  const { cart } = useCart();
  const totalItems = cart?.lines ? cart.lines.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-bright-canvas/90 backdrop-blur-md border-b border-bright-ink/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-display font-extrabold text-2xl tracking-tight text-bright-ink hover:text-bright-amber transition-colors duration-200 focus-visible:outline-none"
        >
          Awaraa&apos;s Culture<span className="text-bright-amber">.</span>
        </Link>

        <div className="flex items-center gap-6 font-sans text-sm font-bold text-bright-ink">
          <Link 
            href="/#squad" 
            className="hover:text-bright-amber transition-colors duration-200"
          >
            The Squad
          </Link>
          <Link 
            href="/#matrix" 
            className="hover:text-bright-amber transition-colors duration-200"
          >
            Craft Matrix
          </Link>
          <Link 
            href="/cart" 
            className="relative bg-bright-amber text-white px-4 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-wider hover:bg-bright-amber/90 hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-sm"
          >
            <span>Cart</span>
            <span className="bg-white text-bright-amber px-2 py-0.5 rounded-full text-xs font-extrabold">
              {totalItems}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
