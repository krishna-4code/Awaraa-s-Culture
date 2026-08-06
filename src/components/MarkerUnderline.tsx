"use client";

interface MarkerUnderlineProps {
  text: string;
  annotation?: string;
  strokeColor?: string;
  className?: string;
}

export function MarkerUnderline({
  text,
  annotation,
  strokeColor = "#FF5E1E",
  className = "",
}: MarkerUnderlineProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      
      {/* Hand-drawn SVG Marker Underline */}
      <svg
        className="absolute left-0 -bottom-2 w-full h-3 overflow-visible pointer-events-none z-0"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
      >
        <path
          d="M2,7 C20,3 40,11 60,6 C80,2 95,9 98,6"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-90"
        />
      </svg>

      {/* Optional Hand Annotation Text in Bricolage Grotesque (font-accent) */}
      {annotation && (
        <span className="absolute -top-5 right-0 font-accent text-xs font-bold text-bright-amber rotate-[3deg] tracking-wide pointer-events-none whitespace-nowrap bg-bright-sun/40 px-1.5 py-0.5 rounded shadow-sm">
          {annotation}
        </span>
      )}
    </span>
  );
}
