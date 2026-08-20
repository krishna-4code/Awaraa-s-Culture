'use client'; // Error components must be Client Components
 
import { useEffect } from 'react';
 
import Link from 'next/link';

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
    <main className="min-h-screen bg-bright-canvas text-bright-ink flex flex-col items-center justify-center p-8 text-center font-sans">
      <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold block mb-4">✦ Error</span>
      <h2 className="font-display font-extrabold text-4xl uppercase tracking-tight text-bright-ink mb-4">
        Something went wrong
      </h2>
      <p className="font-sans text-bright-muted mb-8 max-w-md leading-relaxed">
        We encountered an unexpected error. Please try again or return to the homepage.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => reset()}
          className="cpg-button-primary"
        >
          Try again
        </button>
        <Link
          href="/"
          className="cpg-button-secondary"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
