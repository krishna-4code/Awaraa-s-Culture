"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";
import type { User } from "@supabase/supabase-js";
import { logout } from "@/app/(main)/login/actions";
import { Menu, X, ShoppingBag, User as UserIcon, LogOut, ArrowRight } from "lucide-react";
import { BRAND_NAME } from "@/lib/constants";

export function Nav({ user }: { user: User | null }) {
  const pathname = usePathname();
  const { cart, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = cart?.lines ? cart.lines.reduce((acc, item) => acc + item.quantity, 0) : 0;

  // Close mobile menu whenever the route/hash changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-bright-canvas/90 backdrop-blur-md border-b border-bright-ink/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="font-display font-extrabold text-[clamp(1rem,4.8vw,1.5rem)] tracking-tight text-bright-ink hover:text-bright-amber transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bright-amber rounded-xl flex-shrink-0 whitespace-nowrap"
        >
          {BRAND_NAME}<span className="text-bright-amber">.</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 font-sans text-sm font-bold text-bright-ink">
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

          {/* Desktop Cart Trigger Button */}
          <button 
            type="button"
            onClick={() => openCart()}
            className="relative bg-bright-amber text-white px-4 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-wider hover:bg-bright-amber/90 hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-bright-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bright-canvas cursor-pointer"
            aria-label={`Shopping cart with ${totalItems} items`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Cart</span>
            <span className="bg-white text-bright-amber px-2 py-0.5 rounded-full text-xs font-extrabold">
              {totalItems}
            </span>
          </button>

          {/* Desktop User Section */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bright-ink/5 border border-bright-ink/10 text-xs font-semibold text-bright-ink">
                <span className="w-5 h-5 rounded-full bg-bright-amber text-white flex items-center justify-center text-[10px] font-black uppercase">
                  {user.email ? user.email.charAt(0) : "U"}
                </span>
                <span className="max-w-[120px] truncate">{user.email?.split("@")[0]}</span>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-bright-ink/70 hover:text-bright-ink transition-colors duration-200 uppercase text-xs font-bold tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
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

        {/* Mobile Navigation Actions */}
        <div className="flex items-center gap-2.5 md:hidden">
          {/* Mobile Cart Button */}
          <button 
            type="button"
            onClick={() => openCart()}
            className="relative bg-bright-amber text-white p-2.5 rounded-full font-sans text-xs font-bold hover:bg-bright-amber/90 transition-all duration-200 flex items-center justify-center shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-bright-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bright-canvas cursor-pointer"
            aria-label={`Shopping cart with ${totalItems} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-bright-ink text-white w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-sm border border-bright-canvas">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl text-bright-ink hover:bg-bright-ink/5 border border-bright-ink/15 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bright-amber"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown & Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 top-16 bg-black/40 backdrop-blur-sm z-30 md:hidden animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile Drawer / Dropdown */}
          <div className="fixed top-16 left-0 w-full bg-bright-canvas border-b border-bright-ink/10 shadow-2xl z-40 md:hidden animate-fadeIn overflow-hidden">
            <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col gap-4">
              {/* Navigation Links */}
              <nav className="flex flex-col gap-2 font-sans font-bold text-base text-bright-ink">
                <Link 
                  href="/#squad" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-bright-card/60 hover:bg-bright-card transition-colors"
                >
                  <span>The Squad</span>
                  <ArrowRight className="w-4 h-4 text-bright-amber" />
                </Link>
                <Link 
                  href="/#matrix" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-bright-card/60 hover:bg-bright-card transition-colors"
                >
                  <span>Craft Matrix</span>
                  <ArrowRight className="w-4 h-4 text-bright-amber" />
                </Link>
              </nav>

              <div className="h-px bg-bright-ink/10 my-1" />

              {/* Mobile User Auth Section */}
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-bright-card border border-bright-ink/10">
                    <div className="w-8 h-8 rounded-full bg-bright-amber text-white flex items-center justify-center text-xs font-black uppercase">
                      {user.email ? user.email.charAt(0) : "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-bright-muted uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-bright-ink truncate">{user.email}</p>
                    </div>
                  </div>
                  <form action={logout} className="w-full">
                    <button
                      type="submit"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 px-4 rounded-xl border border-bright-ink/20 hover:border-bright-coral hover:bg-bright-coral/10 hover:text-bright-coral text-bright-ink text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="cpg-button-primary w-full justify-center py-3 text-xs uppercase tracking-wider font-bold"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Sign In / Create Account</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

