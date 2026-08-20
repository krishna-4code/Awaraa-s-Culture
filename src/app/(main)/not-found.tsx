import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bright-canvas text-bright-ink flex flex-col items-center justify-center p-8 text-center font-sans">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-bright-sun/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-bright-coral/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold">
          ✦ Lost your way?
        </span>
        <h1 className="font-display font-extrabold text-8xl md:text-[12rem] uppercase tracking-tight text-bright-ink leading-none">
          404
        </h1>
        <p className="font-sans text-lg text-bright-muted max-w-sm leading-relaxed mb-4">
          This path doesn&apos;t exist — but the streets of Delhi NCR are still yours to wander.
        </p>
        <Link
          href="/"
          className="cpg-button-primary"
        >
          <span>Back to the Squad</span>
          <span className="text-lg">➔</span>
        </Link>
      </div>
    </main>
  );
}
