export default function Loading() {
  return (
    <main className="min-h-screen bg-charcoal text-dust flex flex-col items-center justify-center p-8 text-center font-sans">
      <div className="w-8 h-8 border-2 border-dust/20 border-t-dust rounded-full animate-spin"></div>
      <p className="mt-8 font-sans uppercase tracking-widest text-sm opacity-80">Loading...</p>
    </main>
  );
}
