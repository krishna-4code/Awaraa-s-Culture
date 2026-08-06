"use client";

import { useEffect, useState } from "react";

export function FloatingShoeMotif() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Sparse instances strategically routed into side margins & negative space gaps
  const shoeInstances = [
    { id: 1, top: "8%", left: "4%", size: 140, rotate: -15, opacity: 0.05, duration: 24 },
    { id: 2, top: "22%", right: "3%", size: 160, rotate: 22, opacity: 0.06, duration: 28 },
    { id: 3, top: "45%", left: "3%", size: 120, rotate: -25, opacity: 0.05, duration: 22 },
    { id: 4, top: "68%", right: "4%", size: 150, rotate: 18, opacity: 0.06, duration: 26 },
    { id: 5, top: "88%", left: "5%", size: 170, rotate: -10, opacity: 0.08, duration: 30 }, // Slightly higher opacity for dark footer area
  ];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {shoeInstances.map((shoe) => (
        <div
          key={shoe.id}
          className={`absolute transition-transform ${
            prefersReducedMotion ? "" : "animate-sticker-float"
          }`}
          style={{
            top: shoe.top,
            left: shoe.left,
            right: shoe.right,
            width: `${shoe.size}px`,
            height: `${shoe.size * 1.6}px`,
            transform: `rotate(${shoe.rotate}deg)`,
            opacity: shoe.opacity,
            animationDuration: `${shoe.duration}s`,
          }}
        >
          {/* Transparent SVG Shoe Outline / Line-Art Only */}
          <svg
            className="w-full h-full text-bright-ink stroke-current fill-none"
            viewBox="0 0 100 160"
          >
            <path
              d="M50,10 C30,10 15,30 15,60 C15,90 25,115 30,140 C35,152 65,152 70,140 C75,115 85,90 85,60 C85,30 70,10 50,10 Z"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
            <path
              d="M30,55 C45,45 55,45 70,55"
              strokeWidth="2"
            />
            <path
              d="M25,85 C45,75 55,75 75,85"
              strokeWidth="2"
            />
            <path
              d="M35,120 C45,115 55,115 65,120"
              strokeWidth="2"
            />
            <circle cx="50" cy="30" r="6" strokeWidth="2" />
          </svg>
        </div>
      ))}
    </div>
  );
}
