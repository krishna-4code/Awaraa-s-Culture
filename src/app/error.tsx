'use client'; // Error components must be Client Components
 
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In the future, log the error to an error reporting service (e.g., Sentry)
    console.error(error);
  }, [error]);
 
  return (
    <main className="min-h-screen bg-charcoal text-dust flex flex-col items-center justify-center p-8 text-center font-sans">
      <h2 className="font-display text-2xl uppercase tracking-widest mb-4 text-clay">Something went wrong</h2>
      <p className="opacity-80 mb-8 max-w-md">We encountered an unexpected error. Please try again or return to the homepage.</p>
      <div className="flex gap-6">
        <button
          onClick={() => reset()}
          className="font-sans uppercase tracking-widest text-sm border-b border-dust pb-1 hover:text-clay hover:border-clay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
        >
          Try again
        </button>
        <a 
          href="/"
          className="font-sans uppercase tracking-widest text-sm border-b border-dust pb-1 hover:text-clay hover:border-clay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
        >
          Return Home
        </a>
      </div>
    </main>
  );
}
