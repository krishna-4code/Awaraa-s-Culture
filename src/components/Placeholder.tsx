export function Placeholder({ text }: { text: string }) {
  // Strip any accidental brackets
  const cleanText = text.replace(/\[\[|\]\]/g, "");

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold bg-bright-amber/10 text-bright-amber border border-bright-amber/20 tracking-wide">
      {cleanText}
    </span>
  );
}
