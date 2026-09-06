"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function StickyStack({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
      const contents = panels.map((panel) =>
        panel.querySelector<HTMLElement>("[data-panel-content]")
      );

      // Each panel is wrapped in a 100svh track: the panel only becomes sticky
      // once its own bottom reaches the bottom of the screen, and it releases
      // when the next track begins to scroll over it.
      panels.forEach((panel, i) => {
        const inner = contents[i];
        if (!inner) return;

        // First panel animates in on load
        if (i === 0) {
          gsap.from(inner, {
            autoAlpha: 0,
            y: 48,
            scale: 0.97,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.15,
            clearProps: "all",
          });
          return;
        }

        // Each "coming" section rises over the previous one — scrub its content
        // into place as its track scrolls it over the previous pinned panel
        gsap.from(inner, {
          autoAlpha: 0.45,
          y: 80,
          scale: 0.96,
          ease: "power2.out",
          scrollTrigger: {
            trigger: panel,
            start: "top bottom",
            end: "top center",
            scrub: 1,
          },
        });
      });
    }, rootRef);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      {children}
    </div>
  );
}