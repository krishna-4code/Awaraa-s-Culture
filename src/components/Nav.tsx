"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";
import type { User } from "@supabase/supabase-js";
import { logout } from "@/app/(main)/login/actions";

export function Nav({ user }: { user: User | null }) {
  const pathname = usePathname();
  const { cart, openCart } = useCart();
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
          <button 
            type="button"
            onClick={() => openCart()}
            className="relative bg-bright-amber text-white px-4 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-wider hover:bg-bright-amber/90 hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-sm focus:outline-none cursor-pointer"
            aria-label={`Shopping cart with ${totalItems} items`}
          >
            <span>Cart</span>
            <span className="bg-white text-bright-amber px-2 py-0.5 rounded-full text-xs font-extrabold">
              {totalItems}
            </span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-bright-ink/5 border border-bright-ink/10 text-xs font-semibold text-bright-ink">
                <span className="w-5 h-5 rounded-full bg-bright-amber text-white flex items-center justify-center text-[10px] font-black uppercase">
                  {user.email ? user.email.charAt(0) : "U"}
                </span>
                <span className="max-w-[120px] truncate">{user.email?.split("@")[0]}</span>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-bright-ink/70 hover:text-bright-ink transition-colors duration-200 uppercase text-xs font-bold tracking-wider hover:underline"
                >
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-full border border-bright-ink/20 hover:border-bright-ink hover:bg-bright-ink hover:text-bright-canvas transition-all duration-200 uppercase text-xs font-bold tracking-wider"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
