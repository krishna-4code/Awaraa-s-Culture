"use client";

import { useEffect, useRef } from "react";

type BubbleMovementType = "up" | "down" | "sideways" | "stationary";

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number; // 0.35 (deep background) to 1.2 (foreground)
  size: number;
  maxSize: number;
  color: string;
  borderColor: string;
  opacity: number;
  life: number;
  maxLife: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  wobblePhase: number;
  movementType: BubbleMovementType;
  driftX: number;
  driftY: number;
}

const BUBBLE_COLORS = [
  { fill: "rgba(255, 94, 30, 0.42)", border: "rgba(255, 94, 30, 0.9)" },    // Vibrant Amber
  { fill: "rgba(136, 192, 87, 0.45)", border: "rgba(136, 192, 87, 0.9)" }, // Energetic Lime
  { fill: "rgba(56, 189, 248, 0.40)", border: "rgba(56, 189, 248, 0.88)" },// Crisp Sky Blue
  { fill: "rgba(255, 170, 50, 0.42)", border: "rgba(255, 170, 50, 0.9)" },  // Warm Gold
  { fill: "rgba(255, 255, 255, 0.70)", border: "rgba(255, 255, 255, 0.95)" }, // Glass White
  { fill: "rgba(236, 72, 153, 0.38)", border: "rgba(236, 72, 153, 0.85)" }, // Vivid Magenta
];

export function ShoeCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shoeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only run on desktop pointer devices with fine precision
    const isDesktopPointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isDesktopPointer || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    const shoe = shoeRef.current;
    if (!canvas || !shoe) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse coordinates
    let mouseX = -100;
    let mouseY = -100;
    let shoeX = -100;
    let shoeY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;

    let targetTiltZ = 0;
    let currentTiltZ = 0;
    let targetTiltX = 0;
    let currentTiltX = 0;
    let targetTiltY = 0;
    let currentTiltY = 0;

    let isHovering = false;
    let isClicking = false;
    let isVisible = false;
    let walkPhase = 0;

    const bubbles: Bubble[] = [];

    const spawnBubble = (originX: number, originY: number, count = 1, isBurst = false) => {
      for (let i = 0; i < count; i++) {
        if (bubbles.length > 70) bubbles.shift();

        const colorScheme = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
        
        // Depth simulation (0.35 = far background / small, 1.2 = close foreground / big)
        const depth = 0.35 + Math.random() * 0.85;

        // Choose motion behavior: up, down, sideways, or almost stationary
        const randType = Math.random();
        let movementType: BubbleMovementType;
        let vx = 0;
        let vy = 0;
        let driftX = 0;
        let driftY = 0;

        if (isBurst) {
          movementType = randType < 0.35 ? "up" : randType < 0.6 ? "sideways" : randType < 0.85 ? "down" : "stationary";
          const burstAngle = Math.random() * Math.PI * 2;
          const burstSpeed = (1.5 + Math.random() * 3.5) * depth;
          vx = Math.cos(burstAngle) * burstSpeed;
          vy = Math.sin(burstAngle) * burstSpeed;
        } else if (randType < 0.38) {
          // 1. Moving UP (buoyant float)
          movementType = "up";
          const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 0.9;
          const speed = (0.8 + Math.random() * 1.6) * depth;
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed - 0.7;
          driftY = -0.02 - Math.random() * 0.03;
        } else if (randType < 0.65) {
          // 2. Moving DOWN (gentle settling particles)
          movementType = "down";
          const angle = Math.PI * 0.5 + (Math.random() - 0.5) * 0.8;
          const speed = (0.5 + Math.random() * 1.2) * depth;
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed + 0.4;
          driftY = 0.015 + Math.random() * 0.02;
        } else if (randType < 0.86) {
          // 3. Moving SIDEWAYS (cross-breeze drift)
          movementType = "sideways";
          const dir = Math.random() < 0.5 ? -1 : 1;
          const sideSpeed = (1.0 + Math.random() * 2.0) * depth * dir;
          vx = sideSpeed;
          vy = (Math.random() - 0.5) * 0.5;
          driftX = (Math.random() - 0.5) * 0.04;
        } else {
          // 4. Almost STATIONARY (gentle ambient hover)
          movementType = "stationary";
          vx = (Math.random() - 0.5) * 0.25;
          vy = (Math.random() - 0.5) * 0.25;
        }

        const rawBaseSize = isBurst ? 4 + Math.random() * 9 : 3.5 + Math.random() * 7.5;
        const baseSize = rawBaseSize * depth;
        const maxLife = isBurst ? 50 + Math.random() * 30 : 42 + Math.random() * 28;

        bubbles.push({
          x: originX + (Math.random() - 0.5) * 12,
          y: originY + (Math.random() - 0.5) * 12,
          vx,
          vy,
          depth,
          size: baseSize * 0.25,
          maxSize: baseSize,
          color: colorScheme.fill,
          borderColor: colorScheme.border,
          opacity: 0.9,
          life: maxLife,
          maxLife,
          wobbleSpeed: (0.05 + Math.random() * 0.07) * (depth > 0.8 ? 1.2 : 0.8),
          wobbleAmp: (0.4 + Math.random() * 0.9) * depth,
          wobblePhase: Math.random() * Math.PI * 2,
          movementType,
          driftX,
          driftY,
        });
      }
    };

    let distSinceLastBubble = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        isVisible = true;
        shoe.style.opacity = "1";
      }

      mouseX = e.clientX;
      mouseY = e.clientY;

      // Check if hovering clickable elements
      const target = e.target as HTMLElement | null;
      isHovering = !!target?.closest("a, button, input, [role='button'], .cpg-card, .cpg-badge");

      const dx = mouseX - prevMouseX;
      const dy = mouseY - prevMouseY;
      const dist = Math.hypot(dx, dy);

      if (dist > 1.5) {
        // Natural 3D Banking & Pitch
        targetTiltZ = Math.max(-18, Math.min(18, dx * 0.8));
        targetTiltX = Math.max(-16, Math.min(16, -dy * 0.8));
        targetTiltY = Math.max(-16, Math.min(16, dx * 0.6));

        // Stepping / walking rhythm
        walkPhase += dist * 0.12;

        // Spawn bubbles along the trail strictly behind the 3D heel
        distSinceLastBubble += dist;
        if (distSinceLastBubble > 14) {
          distSinceLastBubble = 0;
          const heelOffsetX = -18;
          const heelOffsetY = 12;
          spawnBubble(shoeX + heelOffsetX, shoeY + heelOffsetY, Math.min(3, Math.max(1, Math.floor(dist / 12))));
        }

        prevMouseX = mouseX;
        prevMouseY = mouseY;
      }
    };

    const handleMouseDown = () => {
      isClicking = true;
      spawnBubble(shoeX - 12, shoeY + 8, 8, true);
    };

    const handleMouseUp = () => {
      isClicking = false;
    };

    const handleMouseLeave = () => {
      isVisible = false;
      shoe.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      isVisible = true;
      shoe.style.opacity = "1";
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Animation Loop (60 FPS)
    const animate = () => {
      // Smooth Shoe Lerp
      const lerpFactor = 0.24;
      shoeX += (mouseX - shoeX) * lerpFactor;
      shoeY += (mouseY - shoeY) * lerpFactor;
      
      currentTiltZ += (targetTiltZ - currentTiltZ) * 0.12;
      currentTiltX += (targetTiltX - currentTiltX) * 0.12;
      currentTiltY += (targetTiltY - currentTiltY) * 0.12;

      // Slowly ease tilts back to neutral rest position
      targetTiltZ *= 0.94;
      targetTiltX *= 0.94;
      targetTiltY *= 0.94;

      // Natural 3D stepping vertical oscillation
      const walkBob = Math.sin(walkPhase) * 2.2;
      const hoverScale = isHovering ? 1.15 : 1;
      const clickScale = isClicking ? 0.9 : 1;
      const finalScale = hoverScale * clickScale;

      // Update 3D Shoe Transform (Strictly NO mirror flipping, pure 3D isometric pitch & roll)
      shoe.style.transform = `translate3d(${shoeX}px, ${shoeY + walkBob}px, 0) translate(-40%, -50%) perspective(700px) rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg) rotateZ(${currentTiltZ}deg) scale(${finalScale})`;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Sort bubbles by depth so distant (low depth) bubbles render behind foreground ones (depth sorting)
      bubbles.sort((a, b) => a.depth - b.depth);

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.life--;
        if (b.life <= 0) {
          bubbles.splice(i, 1);
          continue;
        }

        // Multi-directional physics behavior
        b.wobblePhase += b.wobbleSpeed;
        
        switch (b.movementType) {
          case "up":
            b.vy += b.driftY; // Buoyant upward acceleration
            b.vx *= 0.97;
            break;
          case "down":
            b.vy += b.driftY; // Gentle sinking
            b.vx *= 0.97;
            break;
          case "sideways":
            b.vx += b.driftX;
            b.vy *= 0.96;
            break;
          case "stationary":
            b.vx *= 0.94;
            b.vy *= 0.94;
            break;
        }

        b.x += b.vx + Math.sin(b.wobblePhase) * b.wobbleAmp;
        b.y += b.vy + Math.cos(b.wobblePhase * 0.8) * (b.wobbleAmp * 0.5);

        // Smooth size easing curve (inflate then pop/fade)
        const lifeRatio = b.life / b.maxLife;
        b.size = b.maxSize * Math.sin(lifeRatio * Math.PI);
        b.opacity = lifeRatio * (0.45 + b.depth * 0.5);

        if (b.size <= 0.4) continue;

        // Depth-based rendering: foreground is crisp with sharp highlights, background is softer with ambient glow
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.globalAlpha = b.opacity;
        ctx.fill();

        ctx.lineWidth = Math.max(0.6, 1.3 * b.depth);
        ctx.strokeStyle = b.borderColor;
        ctx.stroke();

        // 3D Glass Specular Highlights (scales with depth)
        if (b.size > 2.0 && b.depth > 0.55) {
          // Primary curved light reflection
          ctx.beginPath();
          ctx.arc(
            b.x - b.size * 0.35,
            b.y - b.size * 0.35,
            b.size * 0.28,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(255, 255, 255, ${0.75 * b.depth})`;
          ctx.fill();

          // Secondary bottom reflection for depth
          if (b.depth > 0.75) {
            ctx.beginPath();
            ctx.arc(
              b.x + b.size * 0.25,
              b.y + b.size * 0.25,
              b.size * 0.15,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = `rgba(255, 255, 255, ${0.45 * b.depth})`;
            ctx.fill();
          }
      }

        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <>
      {/* Canvas for trailing floating bubbles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden"
        aria-hidden="true"
      />

      {/* Floating Realistic 3D Sneaker Pointer */}
      <div
        ref={shoeRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 transition-opacity duration-300 will-change-transform"
        aria-hidden="true"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative w-12 h-8 filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.22)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]">
          {/* Detailed Realistic 3D Isometric Sneaker SVG */}
          <svg
            viewBox="0 0 120 75"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* 3D Volumetric Gradients for Realistic Lighting */}
              <linearGradient id="outsoleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="60%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              <linearGradient id="midsoleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#F1F5F9" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>

              <linearGradient id="upperMainGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF7A3D" />
                <stop offset="45%" stopColor="#FF5E1E" />
                <stop offset="100%" stopColor="#D94308" />
              </linearGradient>

              <linearGradient id="upperShadeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5E1E" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#7C2D12" stopOpacity="0.55" />
              </linearGradient>

              <linearGradient id="toeCapGrad" x1="0" y1="0" x2="1" y2="0.8">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="80%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>

              <linearGradient id="limeStripeGrad" x1="0" y1="0" x2="1" y2="0.5">
                <stop offset="0%" stopColor="#A3E635" />
                <stop offset="100%" stopColor="#65A30D" />
              </linearGradient>

              <linearGradient id="collarInnerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>

              <radialGradient id="laceHoleGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#64748B" />
              </radialGradient>
            </defs>

            {/* 1. Cast Contact Shadow under Sole */}
            <ellipse cx="60" cy="68" rx="46" ry="6" fill="#000000" fillOpacity="0.25" filter="blur(2px)" />

            {/* 2. Textured Outsole Base Tread with 3D Lug Grooves */}
            <path
              d="M12 56 C25 58, 88 59, 106 55 C110 55, 113 58, 109 62 C100 66, 26 66, 12 63 C8 62, 7 57, 12 56 Z"
              fill="url(#outsoleGrad)"
            />
            {/* Outsole Gripping Teeth */}
            <path d="M22 62 L26 58 M36 63 L40 59 M50 63.5 L54 59.5 M64 63.5 L68 59.5 M78 63 L82 59 M92 61 L96 57" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />

            {/* 3. Layered 3D Dual-EVA Midsole */}
            <path
              d="M14 47 C32 47, 86 46, 105 44 C110 44, 112 51, 107 55 C90 58, 26 58, 12 56 C8 53, 9 47, 14 47 Z"
              fill="url(#midsoleGrad)"
            />
            {/* Midsole Sculpted Bevel & Lime Cushioned Pod */}
            <path
              d="M34 52 C52 52, 78 51, 88 49.5"
              stroke="url(#limeStripeGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Midsole Top Edge Highlight */}
            <path
              d="M14 47.5 C36 47.5, 88 46.5, 105 44.5"
              stroke="#FFFFFF"
              strokeWidth="1.2"
            />

            {/* 4. Main 3D Upper Body (Vibrant Sculpted Amber Suede/Leather) */}
            <path
              d="M18 47 C22 36, 32 30, 42 28 C50 20, 58 14, 68 14 C78 14, 84 22, 88 28 C98 32, 106 37, 108 45 C92 46, 32 47, 18 47 Z"
              fill="url(#upperMainGrad)"
            />
            {/* 3D Ambient Occlusion Shadow on Lower Quarter Panel */}
            <path
              d="M18 47 C34 46, 92 45, 108 45 C106 41, 98 36, 88 32 C70 38, 38 42, 18 47 Z"
              fill="url(#upperShadeGrad)"
            />

            {/* 5. 3D Padded Ankle Collar & Deep Inner Cavity */}
            <path
              d="M42 28 C39 21, 44 15, 50 14 C54 13, 56 16, 54 21 C62 17, 65 14, 68 14 C66 21, 60 27, 52 28 Z"
              fill="url(#collarInnerGrad)"
            />
            {/* Collar Foam Padding Rim (Bright Crisp Highlight) */}
            <path
              d="M44 18 C47 15, 52 14, 56 16 C60 17, 66 16, 68 14"
              stroke="#F8FAFC"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Heel Pull-Tab Badge with Lime Accent */}
            <path d="M46 14 C44 10, 46 7, 49 7 C52 7, 53 10, 52 13" stroke="#88C057" strokeWidth="2.5" strokeLinecap="round" />

            {/* 6. Molded Suede Heel Counter Overlay */}
            <path
              d="M18 47 C20 38, 27 32, 36 30 C34 38, 32 44, 28 47 Z"
              fill="#D94308"
            />
            <path d="M19 46 C22 39, 28 34, 35 32" stroke="#FF8C42" strokeWidth="1" strokeDasharray="2 1.5" />

            {/* 7. 3D Toe Cap with Curved Volumetric Highlight */}
            <path
              d="M90 35 C98 37, 106 40, 108 45 C98 46, 86 45, 82 39 C85 37, 88 36, 90 35 Z"
              fill="url(#toeCapGrad)"
            />
            {/* Toe Box Perforation Texture */}
            <circle cx="94" cy="40" r="0.9" fill="#64748B" />
            <circle cx="98" cy="41" r="0.9" fill="#64748B" />
            <circle cx="102" cy="43" r="0.9" fill="#64748B" />

            {/* 8. Dynamic 3D Velocity Swoop Line (Chrome White & Lime Edge) */}
            <path
              d="M34 42 C52 34, 76 35, 96 42"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M36 43.5 C52 36, 74 37, 92 43.5"
              stroke="#88C057"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* 9. 3D Eyelet Stay & Lacing System */}
            {/* Eyelet Grommets */}
            <circle cx="62" cy="20" r="1.6" fill="url(#laceHoleGlow)" />
            <circle cx="68" cy="24" r="1.6" fill="url(#laceHoleGlow)" />
            <circle cx="74" cy="28" r="1.6" fill="url(#laceHoleGlow)" />
            <circle cx="80" cy="33" r="1.6" fill="url(#laceHoleGlow)" />

            {/* Crossed 3D Woven Laces with Depth & Shadows */}
            <path d="M62 20 L72 25" stroke="#000000" strokeWidth="2.2" strokeOpacity="0.3" />
            <path d="M62 19.5 L72 24.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />

            <path d="M68 24 L78 30" stroke="#000000" strokeWidth="2.2" strokeOpacity="0.3" />
            <path d="M68 23.5 L78 29.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />

            <path d="M74 28 L84 34.5" stroke="#000000" strokeWidth="2.2" strokeOpacity="0.3" />
            <path d="M74 27.5 L84 34" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </>
  );
}
