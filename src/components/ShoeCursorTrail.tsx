"use client";

import { useEffect, useRef } from "react";

interface ShoeTrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number; // 0.4 (subtle small) to 1.1 (foreground)
  size: number;
  maxSize: number;
  rotation: number; // current angle in radians
  rotSpeed: number; // angular velocity
  opacity: number;
  maxOpacity: number;
  life: number;
  maxLife: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  wobblePhase: number;
  imageIndex: number; // 0 to 4 (shoe-1 to shoe-5)
  driftX: number;
  driftY: number;
}

const SHOE_SVG_SRCS = [
  "/bg-shoes/shoe-1.svg",
  "/bg-shoes/shoe-2.svg",
  "/bg-shoes/shoe-3.svg",
  "/bg-shoes/shoe-4.svg",
  "/bg-shoes/shoe-5.svg",
];

export function ShoeCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only run on desktop pointer devices with fine precision
    const isDesktopPointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isDesktopPointer || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Preload the 5 uploaded SVG shoes
    const shoeImages: HTMLImageElement[] = [];
    SHOE_SVG_SRCS.forEach((src) => {
      const img = new Image();
      img.src = src;
      shoeImages.push(img);
    });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse coordinates
    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;

    const particles: ShoeTrailParticle[] = [];

    const spawnShoeParticle = (originX: number, originY: number, count = 1, isBurst = false) => {
      for (let i = 0; i < count; i++) {
        if (particles.length > 50) particles.shift();

        const imageIndex = Math.floor(Math.random() * shoeImages.length);
        const depth = 0.45 + Math.random() * 0.65; // 0.45 to 1.1

        const baseSize = isBurst ? (26 + Math.random() * 22) * depth : (20 + Math.random() * 18) * depth;
        const maxLife = isBurst ? 45 + Math.random() * 25 : 36 + Math.random() * 24;
        const maxOpacity = isBurst ? 0.75 : 0.55;

        let vx = 0;
        let vy = 0;
        let driftX = 0;
        let driftY = 0;

        if (isBurst) {
          const burstAngle = Math.random() * Math.PI * 2;
          const burstSpeed = (1.2 + Math.random() * 2.8) * depth;
          vx = Math.cos(burstAngle) * burstSpeed;
          vy = Math.sin(burstAngle) * burstSpeed - 0.4;
          driftY = 0.02;
        } else {
          // Gentle floating dispersion
          const angle = Math.random() * Math.PI * 2;
          const speed = (0.4 + Math.random() * 1.0) * depth;
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed - 0.35; // slight buoyant upward drift
          driftY = -0.015 - Math.random() * 0.02;
          driftX = (Math.random() - 0.5) * 0.02;
        }

        const initialRotation = (Math.random() - 0.5) * 0.6; // initial angle ±17 deg
        const rotSpeed = (Math.random() - 0.5) * 0.035; // gentle spin

        particles.push({
          x: originX + (Math.random() - 0.5) * 10,
          y: originY + (Math.random() - 0.5) * 10,
          vx,
          vy,
          depth,
          size: baseSize * 0.3,
          maxSize: baseSize,
          rotation: initialRotation,
          rotSpeed,
          opacity: maxOpacity,
          maxOpacity,
          life: maxLife,
          maxLife,
          wobbleSpeed: 0.04 + Math.random() * 0.05,
          wobbleAmp: (0.3 + Math.random() * 0.7) * depth,
          wobblePhase: Math.random() * Math.PI * 2,
          imageIndex,
          driftX,
          driftY,
        });
      }
    };

    let distSinceLastParticle = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const dx = mouseX - prevMouseX;
      const dy = mouseY - prevMouseY;
      const dist = Math.hypot(dx, dy);

      if (dist > 1.5) {
        distSinceLastParticle += dist;
        // Spawn gentle shoe particle every ~24px of mouse movement
        if (distSinceLastParticle > 24) {
          distSinceLastParticle = 0;
          spawnShoeParticle(mouseX, mouseY, 1, false);
        }

        prevMouseX = mouseX;
        prevMouseY = mouseY;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      spawnShoeParticle(e.clientX, e.clientY, 5, true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);

    // Animation Loop (60 FPS)
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Sort by depth so distant particles render behind foreground ones
      particles.sort((a, b) => a.depth - b.depth);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life--;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Particle physics
        p.wobblePhase += p.wobbleSpeed;
        p.rotation += p.rotSpeed;
        p.vx += p.driftX;
        p.vy += p.driftY;
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx + Math.sin(p.wobblePhase) * p.wobbleAmp;
        p.y += p.vy + Math.cos(p.wobblePhase * 0.7) * (p.wobbleAmp * 0.5);

        // Smooth pop-in and fade-out envelope
        const lifeRatio = p.life / p.maxLife;
        // Scale rises quickly to 1, then holds, then scales slightly down
        p.size = p.maxSize * Math.sin(lifeRatio * Math.PI);
        p.opacity = lifeRatio * p.maxOpacity;

        if (p.size <= 1) continue;

        const img = shoeImages[p.imageIndex];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.opacity;

          const aspect = img.naturalHeight / img.naturalWidth || 0.65;
          const w = p.size;
          const h = w * aspect;

          // Draw the SVG shoe centered at particle position
          ctx.drawImage(img, -w / 2, -h / 2, w, h);
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden select-none"
      aria-hidden="true"
    />
  );
}
