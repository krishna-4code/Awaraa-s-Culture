"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);
  const pathname = usePathname();

  const scrollToElement = useCallback((element: HTMLElement) => {
    const lenis = lenisRef.current?.lenis;
    if (lenis) {
      lenis.scrollTo(element, { offset: -80, duration: 1.0 });
    } else {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  // Handle hash scrolling on page mount and route/pathname changes (e.g. navigating from /cart to /#squad)
  useEffect(() => {
    const handleHashScroll = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        // Allow DOM to settle before scrolling
        const timer = setTimeout(() => {
          try {
            const target = document.querySelector(hash) as HTMLElement;
            if (target) {
              scrollToElement(target);
            }
          } catch (err) {
            // Silently ignore invalid selectors
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, [pathname, scrollToElement]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = lenisRef.current?.lenis;
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
    }

    // Intercept in-page and cross-page anchor link clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Handle pure hash links like #squad or root hash links like /#squad
      const isPureHash = href.startsWith("#") && href.length > 1;
      const isRootHash = href.startsWith("/#") && href.length > 2;

      if (isPureHash || (isRootHash && pathname === "/")) {
        const targetId = isPureHash ? href.slice(1) : href.slice(2);
        const element = document.getElementById(targetId);
        if (element) {
          e.preventDefault();
          scrollToElement(element);
          window.history.pushState(null, "", `#${targetId}`);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, true);

    return () => {
      if (lenis) {
        lenis.off("scroll", ScrollTrigger.update);
      }
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, [pathname, scrollToElement]);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.08, // Gold standard linear interpolation for ultra-smooth 60/120fps physics
        duration: 1.0,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.8,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
