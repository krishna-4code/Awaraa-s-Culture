export function Placeholder({ text }: { text: string }) {
  return (
    <span className="inline-block bg-red-900/30 text-red-400 border border-red-500/50 px-2 py-0.5 font-mono text-sm uppercase tracking-normal font-bold">
      {text}
    </span>
  );
}
