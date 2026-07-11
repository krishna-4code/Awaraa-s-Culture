import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-charcoal text-dust flex flex-col items-center justify-center p-8 text-center font-sans">
      <h2 className="font-display text-4xl uppercase tracking-widest mb-4">404</h2>
      <p className="text-xl mb-8 opacity-80">This path does not exist.</p>
      <Link 
        href="/"
        className="font-sans uppercase tracking-widest text-sm border-b border-dust pb-1 hover:text-clay hover:border-clay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
      >
        Return Home
      </Link>
    </main>
  );
}
