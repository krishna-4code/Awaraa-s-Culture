"use client";

import { useEffect, useState } from "react";

export interface FloatingShoe {
  id: number;
  x: number; // Viewport X percentage (0 to 100)
  y: number; // Viewport Y percentage (0 to 100)
  size: number; // Width in px (40px to 135px)
  opacity: number; // Layer-based subtle opacity (0.05 to 0.16)
  duration: number; // Animation duration in seconds (16s to 38s)
  delay: number; // Negative animation delay for desynchronized start
  rot0: number; // Base initial rotation (-30 to 30 deg)
  rot1: number; // Waypoint 1 rotation variation
  rot2: number; // Waypoint 2 rotation variation
  rot3: number; // Waypoint 3 rotation variation
  dx1: number; // Drift X waypoint 1 (±30 to 100px)
  dy1: number; // Drift Y waypoint 1 (±20 to 80px)
  dx2: number; // Drift X waypoint 2 (±30 to 100px)
  dy2: number; // Drift Y waypoint 2 (±20 to 80px)
  dx3: number; // Drift X waypoint 3 (±30 to 100px)
  dy3: number; // Drift Y waypoint 3 (±20 to 80px)
  scale1: number; // Scale variation 1 (0.93 to 1.07)
  scale2: number; // Scale variation 2 (0.93 to 1.07)
  scale3: number; // Scale variation 3 (0.93 to 1.07)
  variant: 1 | 2 | 3 | 4 | 5; // 5 uploaded vector shoe styles
  blur?: number; // Depth blur for background shoes (0.3px to 0.6px)
}

function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// Generate session-stable shoe particles with 3-tier depth hierarchy & pseudo-random spatial distribution
function generateShoeParticles(isMobile: boolean): FloatingShoe[] {
  const count = isMobile ? 12 : 26; // 24-28 on desktop, 10-14 on mobile
  const shoes: FloatingShoe[] = [];

  const cols = isMobile ? 3 : 6;
  const rows = isMobile ? 4 : 5;
  const totalCells = cols * rows;

  for (let i = 0; i < count; i++) {
    // 3-Tier Depth Hierarchy:
    // Background (~35%): smaller (45-65px), soft faint opacity (0.05-0.08), slower (30-38s), subtle blur
    // Midground (~40%): medium (65-95px), balanced opacity (0.08-0.12), medium speed (22-30s), crisp
    // Foreground (~25%): larger (95-130px), clearer opacity (0.12-0.16), slightly faster (16-22s), crisp
    let size: number;
    let opacity: number;
    let duration: number;
    let blur: number | undefined;

    const tierRatio = i / count;
    if (tierRatio < 0.35) {
      size = isMobile ? Math.round(randRange(32, 48)) : Math.round(randRange(45, 65));
      opacity = Number(randRange(0.05, 0.08).toFixed(3));
      duration = Math.round(randRange(30, 38));
      blur = Math.random() < 0.4 ? (Math.random() < 0.5 ? 0.3 : 0.5) : undefined;
    } else if (tierRatio < 0.75) {
      size = isMobile ? Math.round(randRange(48, 68)) : Math.round(randRange(65, 95));
      opacity = Number(randRange(0.08, 0.12).toFixed(3));
      duration = Math.round(randRange(22, 30));
    } else {
      size = isMobile ? Math.round(randRange(68, 88)) : Math.round(randRange(95, 130));
      opacity = Number(randRange(0.12, 0.16).toFixed(3));
      duration = Math.round(randRange(16, 22));
    }

    // Stratified cell distribution with randomized offset
    const cellIdx = i % totalCells;
    const cellX = (cellIdx % cols) * (100 / cols);
    const cellY = Math.floor(cellIdx / cols) * (100 / rows);

    const x = Math.max(2, Math.min(94, Number((cellX + randRange(2, (100 / cols) - 2)).toFixed(1))));
    const y = Math.max(3, Math.min(93, Number((cellY + randRange(2, (100 / rows) - 2)).toFixed(1))));

    // Rotations & 4-way multi-directional drifts
    const baseRot = Math.round(randRange(-25, 25));
    const rotDelta1 = Math.round(randRange(6, 16) * (Math.random() > 0.5 ? 1 : -1));
    const rotDelta2 = Math.round(randRange(6, 16) * (Math.random() > 0.5 ? 1 : -1));
    const rotDelta3 = Math.round(randRange(5, 14) * (Math.random() > 0.5 ? 1 : -1));

    const signX = Math.random() > 0.5 ? 1 : -1;
    const signY = Math.random() > 0.5 ? 1 : -1;
    const dx1 = Math.round(randRange(35, 95) * signX);
    const dy1 = Math.round(randRange(25, 75) * -signY);
    const dx2 = Math.round(randRange(30, 85) * -signX);
    const dy2 = Math.round(randRange(25, 80) * signY);
    const dx3 = Math.round(randRange(20, 65) * (signX * -0.6));
    const dy3 = Math.round(randRange(20, 55) * (-signY * 0.7));

    const scale1 = Number(randRange(0.93, 1.07).toFixed(3));
    const scale2 = Number(randRange(0.94, 1.07).toFixed(3));
    const scale3 = Number(randRange(0.92, 1.06).toFixed(3));

    const delay = Number(randRange(2, duration).toFixed(1));
    const variant = ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5;

    shoes.push({
      id: i + 1,
      x,
      y,
      size,
      opacity,
      duration,
      delay,
      rot0: baseRot,
      rot1: baseRot + rotDelta1,
      rot2: baseRot - rotDelta2,
      rot3: baseRot + rotDelta3,
      dx1,
      dy1,
      dx2,
      dy2,
      dx3,
      dy3,
      scale1,
      scale2,
      scale3,
      variant,
      blur,
    });
  }

  return shoes;
}

export function FloatingShoeParticles() {
  const [shoes, setShoes] = useState<FloatingShoe[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isMobile = window.innerWidth < 768;
    const initialShoes = generateShoeParticles(isMobile);
    setShoes(initialShoes);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (!mounted || shoes.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden select-none"
    >
      {shoes.map((shoe) => {
        return (
          <div
            key={shoe.id}
            className={`absolute pointer-events-none select-none ${
              reducedMotion ? "ambient-sneaker-stationary" : "ambient-sneaker-animated"
            }`}
            style={
              {
                left: `${shoe.x}%`,
                top: `${shoe.y}%`,
                width: `${shoe.size}px`,
                height: `${Math.round(shoe.size * 0.8)}px`,
                opacity: reducedMotion ? 0.05 : shoe.opacity,
                filter: shoe.blur
                  ? `blur(${shoe.blur}px) drop-shadow(0 4px 12px rgba(17, 24, 39, 0.06))`
                  : "drop-shadow(0 4px 12px rgba(17, 24, 39, 0.06))",
                "--anim-dur": `${shoe.duration}s`,
                "--anim-del": `-${shoe.delay}s`,
                "--r0": `${shoe.rot0}deg`,
                "--r1": `${shoe.rot1}deg`,
                "--r2": `${shoe.rot2}deg`,
                "--r3": `${shoe.rot3}deg`,
                "--dx1": `${shoe.dx1}px`,
                "--dy1": `${shoe.dy1}px`,
                "--dx2": `${shoe.dx2}px`,
                "--dy2": `${shoe.dy2}px`,
                "--dx3": `${shoe.dx3}px`,
                "--dy3": `${shoe.dy3}px`,
                "--s1": shoe.scale1,
                "--s2": shoe.scale2,
                "--s3": shoe.scale3,
              } as React.CSSProperties
            }
          >
            {/* Custom Uploaded Vector Shoe Silhouette */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/bg-shoes/shoe-${shoe.variant}.svg`}
              alt=""
              loading="lazy"
              draggable="false"
              className="w-full h-full object-contain pointer-events-none select-none transition-transform"
            />
          </div>
        );
      })}
    </div>
  );
}
