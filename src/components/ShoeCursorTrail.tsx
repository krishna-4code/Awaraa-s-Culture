"use client";

import { useEffect, useState } from "react";

interface ShoePrint {
  id: number;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
}

export function ShoeCursorTrail() {
  const [prints, setPrints] = useState<ShoePrint[]>([]);

  useEffect(() => {
    // Only enable on desktop mouse devices
    const isDesktopPointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isDesktopPointer || prefersReducedMotion) return;

    let lastX = 0;
    let lastY = 0;
    let count = 0;
    let side = false;

    const handleMouseMove = (e: MouseEvent) => {
      const distance = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (distance < 45) return; // Only drop print after significant movement

      lastX = e.clientX;
      lastY = e.clientY;
      count++;
      side = !side;

      const angle = Math.atan2(e.clientY - lastY, e.clientX - lastX) * (180 / Math.PI) + 90;
      const newPrint: ShoePrint = {
        id: Date.now() + count,
        x: e.clientX + (side ? 12 : -12),
        y: e.clientY,
        rotation: angle || (side ? 10 : -10),
        opacity: 0.2,
      };

      setPrints((prev) => [...prev.slice(-2), newPrint]); // Max 2-3 visible at once

      setTimeout(() => {
        setPrints((prev) => prev.filter((p) => p.id !== newPrint.id));
      }, 700);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (prints.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {prints.map((p) => (
        <div
          key={p.id}
          className="absolute transition-opacity duration-700 ease-out"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
            opacity: p.opacity,
          }}
        >
          {/* Subtle Footwear Sole Outline SVG */}
          <svg className="w-5 h-8 text-bright-amber fill-current" viewBox="0 0 24 40">
            <path d="M12 2C7 2 4 6 4 12C4 17 6 22 6 28C6 34 8 38 12 38C16 38 18 34 18 28C18 22 20 17 20 12C20 6 17 2 12 2ZM12 6C14.5 6 17 9 17 12C17 14.5 15.5 18 14 22H10C8.5 18 7 14.5 7 12C7 9 9.5 6 12 6Z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
