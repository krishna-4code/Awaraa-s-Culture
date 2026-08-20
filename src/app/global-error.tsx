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
      <body className="bg-bright-canvas text-bright-ink font-sans antialiased min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold mb-3">
          ✦ System Notice
        </span>
        <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-bright-ink mb-4">
          Critical Error Encountered
        </h2>
        <p className="font-sans text-sm text-bright-muted max-w-sm mb-6">
          An unexpected application issue occurred. Please try reloading.
        </p>
        <button 
          onClick={() => reset()}
          className="bg-bright-amber text-white font-sans font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:bg-bright-ink transition-colors shadow-sm"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
