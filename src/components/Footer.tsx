import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-charcoal text-sand py-20 px-8 border-t border-umber/20 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-2xl uppercase tracking-widest text-dust">Awaraa&apos;s Culture</h2>
          <p className="text-sm max-w-xs opacity-80">Movement with purpose, not aimless wandering.</p>
        </div>

        <div className="flex flex-wrap gap-8 text-sm uppercase tracking-widest">
          <Link 
            href="/about" 
            className="hover:text-clay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
          >
            Story
          </Link>
          <Link 
            href="/faq" 
            className="hover:text-clay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
          >
            FAQ
          </Link>
          <Link 
            href="/contact" 
            className="hover:text-clay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
          >
            Contact
          </Link>
          <Link 
            href="/privacy" 
            className="hover:text-clay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
          >
            Privacy
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-umber/10 text-xs opacity-60 flex justify-between items-center">
        <span>© {new Date().getFullYear()} Awaraa&apos;s Culture. All rights reserved.</span>
      </div>
    </footer>
  );
}
