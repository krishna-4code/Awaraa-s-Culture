'use client';
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-charcoal text-dust font-sans antialiased min-h-screen flex flex-col items-center justify-center">
        <h2 className="font-display text-2xl uppercase tracking-widest mb-4 text-clay">Critical Error</h2>
        <button 
          onClick={() => reset()}
          className="font-sans uppercase tracking-widest text-sm border-b border-dust pb-1 hover:text-clay hover:border-clay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
