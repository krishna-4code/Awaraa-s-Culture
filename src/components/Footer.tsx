import Link from "next/link";
import { INSTAGRAM_CONFIG } from "@/lib/config/instagram";

export function Footer() {
  return (
    <footer className="w-full bg-bright-ink text-white py-16 px-6 font-sans border-t-4 border-bright-amber">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        
        <div className="flex flex-col gap-3">
          <h2 className="font-display font-extrabold text-3xl tracking-tight">
            Awaraa&apos;s Culture<span className="text-bright-amber">.</span>
          </h2>
          <p className="font-sans text-sm text-gray-300 max-w-sm">
            Purposeful movement, honest comfort. Delhi NCR&apos;s price-conscious CPG footwear brand.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 font-sans text-xs uppercase font-bold tracking-wider text-gray-300">
          <Link href="/#squad" className="hover:text-bright-sun transition-colors">
            The Squad
          </Link>
          <Link href="/#matrix" className="hover:text-bright-sun transition-colors">
            Craft Matrix
          </Link>
          <Link href="/cart" className="hover:text-bright-sun transition-colors">
            Cart
          </Link>
          <a
            href={INSTAGRAM_CONFIG.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-bright-sun transition-colors"
          >
            Instagram ({INSTAGRAM_CONFIG.handle})
          </a>
          <Link href="/privacy" className="hover:text-bright-sun transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-bright-sun transition-colors">
            Terms & Returns
          </Link>
          <Link href="/contact" className="hover:text-bright-sun transition-colors">
            Contact
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 font-sans text-xs text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span>© {new Date().getFullYear()} Awaraa&apos;s Culture. All rights reserved.</span>
        <span className="bg-bright-amber/20 text-bright-sun px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase">
          ✦ Movement With Purpose
        </span>
      </div>
    </footer>
  );
}
